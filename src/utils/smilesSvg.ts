export type SmilesTheme = 'light' | 'dark'

export interface SmilesRenderOptions {
  width?: number
  height?: number
  theme?: SmilesTheme
  compactDrawing?: boolean
  padding?: number
}

type SmilesDrawerGlobal = {
  Drawer: new (options?: Record<string, unknown>) => {
    draw: (tree: unknown, target: SVGSVGElement | string, theme: SmilesTheme, infoOnly?: boolean) => void
  }
  SvgDrawer?: new (options?: Record<string, unknown>) => {
    draw: (
      tree: unknown,
      target: SVGSVGElement | string,
      theme: SmilesTheme,
      weights?: unknown,
      infoOnly?: boolean
    ) => void
  }
  parse: (
    smiles: string,
    success: (tree: unknown) => void,
    error?: (error: unknown) => void
  ) => void
}

declare global {
  interface Window {
    SmilesDrawer?: SmilesDrawerGlobal
  }
}

const DEFAULT_OPTIONS: Required<SmilesRenderOptions> = {
  width: 180,
  height: 120,
  theme: 'light',
  compactDrawing: true,
  padding: 16,
}

const SMILES_DRAWER_SCRIPT_ID = 'smiles-drawer-cdn'
const SMILES_DRAWER_CDN_URL = 'https://cdn.jsdelivr.net/npm/smiles-drawer@2.1.7/dist/smiles-drawer.min.js'

const svgCache = new Map<string, string>()
const pendingRenderCache = new Map<string, Promise<string>>()
let loaderPromise: Promise<SmilesDrawerGlobal> | null = null

const normalizeOptions = (options: SmilesRenderOptions): Required<SmilesRenderOptions> => ({
  width: options.width ?? DEFAULT_OPTIONS.width,
  height: options.height ?? DEFAULT_OPTIONS.height,
  theme: options.theme ?? DEFAULT_OPTIONS.theme,
  compactDrawing: options.compactDrawing ?? DEFAULT_OPTIONS.compactDrawing,
  padding: options.padding ?? DEFAULT_OPTIONS.padding,
})

const cacheKeyFor = (smiles: string, options: Required<SmilesRenderOptions>): string => {
  return `${smiles}::${options.width}x${options.height}::${options.theme}::${options.padding}::${options.compactDrawing}`
}

const parseSmiles = async (smilesDrawer: SmilesDrawerGlobal, smiles: string): Promise<unknown> => {
  return await new Promise((resolve, reject) => {
    smilesDrawer.parse(smiles, resolve, reject)
  })
}

const loadSmilesDrawerFromModule = async (): Promise<SmilesDrawerGlobal> => {
  const module = await import('smiles-drawer')
  const candidate = (module as unknown as { default?: unknown }).default ?? module

  if (
    candidate &&
    typeof candidate === 'object' &&
    typeof (candidate as SmilesDrawerGlobal).parse === 'function' &&
    typeof (candidate as SmilesDrawerGlobal).Drawer === 'function'
  ) {
    return candidate as SmilesDrawerGlobal
  }

  throw new Error('smiles-drawer module loaded but API is invalid')
}

const drawTreeToSvg = (
  smilesDrawer: SmilesDrawerGlobal,
  tree: unknown,
  svg: SVGSVGElement,
  options: Required<SmilesRenderOptions>
): void => {
  const attemptErrors: string[] = []

  if (smilesDrawer.SvgDrawer) {
    try {
      const svgDrawer = new smilesDrawer.SvgDrawer({
        width: options.width,
        height: options.height,
        compactDrawing: options.compactDrawing,
        padding: options.padding,
      })
      svgDrawer.draw(tree, svg, options.theme, null, false)
      return
    } catch (error) {
      attemptErrors.push(`SvgDrawer failed: ${String(error)}`)
    }
  }

  try {
    const drawer = new smilesDrawer.Drawer({
      width: options.width,
      height: options.height,
      compactDrawing: options.compactDrawing,
      padding: options.padding,
    })
    drawer.draw(tree, svg.id, options.theme, false)
    return
  } catch (error) {
    attemptErrors.push(`Drawer by id failed: ${String(error)}`)
  }

  try {
    const drawer = new smilesDrawer.Drawer({
      width: options.width,
      height: options.height,
      compactDrawing: options.compactDrawing,
      padding: options.padding,
    })
    drawer.draw(tree, svg, options.theme, false)
    return
  } catch (error) {
    attemptErrors.push(`Drawer by element failed: ${String(error)}`)
  }

  throw new Error(attemptErrors.join(' | '))
}

const ensureSmilesDrawer = async (): Promise<SmilesDrawerGlobal> => {
  if (!process.client) {
    throw new Error('SMILES rendering is only available on the client side')
  }

  if (window.SmilesDrawer) {
    return window.SmilesDrawer
  }

  if (!loaderPromise) {
    loaderPromise = (async () => {
      try {
        const smilesDrawer = await loadSmilesDrawerFromModule()
        window.SmilesDrawer = smilesDrawer
        return smilesDrawer
      } catch {
        return await new Promise<SmilesDrawerGlobal>((resolve, reject) => {
          const onReady = () => {
            if (window.SmilesDrawer) {
              resolve(window.SmilesDrawer)
            } else {
              reject(new Error('SmilesDrawer script loaded but global object is unavailable'))
            }
          }

          const existingScript = document.getElementById(SMILES_DRAWER_SCRIPT_ID) as HTMLScriptElement | null
          if (existingScript) {
            if (window.SmilesDrawer) {
              onReady()
              return
            }

            existingScript.addEventListener('load', onReady, { once: true })
            existingScript.addEventListener(
              'error',
              () => reject(new Error('Failed to load SmilesDrawer from CDN')),
              { once: true }
            )
            return
          }

          const script = document.createElement('script')
          script.id = SMILES_DRAWER_SCRIPT_ID
          script.src = SMILES_DRAWER_CDN_URL
          script.async = true
          script.onload = onReady
          script.onerror = () => reject(new Error('Failed to load SmilesDrawer from CDN'))
          document.head.appendChild(script)
        })
      }
    })()
  }

  return await loaderPromise
}

export const renderSmilesToSvg = async (smiles: string, options: SmilesRenderOptions = {}): Promise<string> => {
  const trimmed = smiles.trim()
  if (!trimmed) {
    throw new Error('SMILES string is empty')
  }

  const normalizedOptions = normalizeOptions(options)
  const cacheKey = cacheKeyFor(trimmed, normalizedOptions)

  const cachedSvg = svgCache.get(cacheKey)
  if (cachedSvg) {
    return cachedSvg
  }

  const inFlight = pendingRenderCache.get(cacheKey)
  if (inFlight) {
    return await inFlight
  }

  const renderingPromise = (async () => {
    const smilesDrawer = await ensureSmilesDrawer()
    const tree = await parseSmiles(smilesDrawer, trimmed)

    const host = document.createElement('div')
    host.style.position = 'fixed'
    host.style.left = '-99999px'
    host.style.top = '-99999px'
    host.style.opacity = '0'
    host.style.pointerEvents = 'none'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const svgId = `smiles-svg-${Math.random().toString(36).slice(2)}`
    svg.setAttribute('id', svgId)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', String(normalizedOptions.width))
    svg.setAttribute('height', String(normalizedOptions.height))
    svg.setAttribute('viewBox', `0 0 ${normalizedOptions.width} ${normalizedOptions.height}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    host.appendChild(svg)
    document.body.appendChild(host)

    try {
      drawTreeToSvg(smilesDrawer, tree, svg, normalizedOptions)

      if (!svg.innerHTML.trim()) {
        throw new Error('SmilesDrawer produced an empty SVG output')
      }

      return new XMLSerializer().serializeToString(svg)
    } finally {
      host.remove()
    }
  })()

  pendingRenderCache.set(cacheKey, renderingPromise)

  try {
    const svg = await renderingPromise
    svgCache.set(cacheKey, svg)
    return svg
  } finally {
    pendingRenderCache.delete(cacheKey)
  }
}

export const clearSmilesSvgCache = (): void => {
  svgCache.clear()
  pendingRenderCache.clear()
}

