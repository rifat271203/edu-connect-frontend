<template>
  <div class="reaction-diagram rounded-2xl border p-4 md:p-6" :class="surfaceClasses">
    <ClientOnly>
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)_minmax(0,1fr)] gap-6 items-center">
        <div class="flex flex-wrap items-start justify-center gap-3 md:gap-4">
          <template v-for="(reactant, index) in reactantsWithTargets" :key="reactant.renderId">
            <MoleculeCard
              :item="reactant"
              :theme="renderTheme"
              :svg="renderTargetMarkup(reactant.renderId)"
            />
            <div v-if="index < reactantsWithTargets.length - 1" class="self-center text-xl font-semibold" :class="mutedTextClasses">+</div>
          </template>
        </div>

        <div class="relative flex flex-col items-center justify-center min-h-[170px] px-2">
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-full max-w-[320px] flex flex-wrap justify-center gap-2">
            <span
              v-for="(reagent, index) in diagram.reagents"
              :key="`reagent-${index}-${reagent.smiles}`"
              class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
              :class="chipClasses"
            >
              {{ reagent.name }}
            </span>
          </div>

          <div class="w-full flex items-center justify-center pt-5">
            <div class="w-full max-w-[260px] border-t-2 relative" :class="arrowClasses">
              <div class="absolute right-0 -top-[7px] h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px]" :class="arrowHeadClasses"></div>
            </div>
          </div>

          <p v-if="conditionsText" class="mt-4 text-center text-xs leading-relaxed max-w-[280px]" :class="mutedTextClasses">
            {{ conditionsText }}
          </p>
        </div>

        <div class="flex flex-wrap items-start justify-center gap-3 md:gap-4">
          <template v-for="(product, index) in productsWithTargets" :key="product.renderId">
            <MoleculeCard
              :item="product"
              :theme="renderTheme"
              :svg="renderTargetMarkup(product.renderId)"
            >
              <span
                v-if="productBadge(product.type)"
                class="mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                :class="badgeClasses(productBadge(product.type)!)"
              >
                {{ productBadge(product.type) }}
              </span>
            </MoleculeCard>
            <div v-if="index < productsWithTargets.length - 1" class="self-center text-xl font-semibold" :class="mutedTextClasses">+</div>
          </template>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import MoleculeCard from './MoleculeCard.vue'
import type { MechanismStep, ReactionDiagramData, ReactionItem, ReactionRole } from '~/types/reactionDiagram'

type SmilesDrawerModule = {
  Drawer: new (options?: Record<string, unknown>) => {
    draw: (tree: unknown, target: SVGSVGElement | string, theme: 'light' | 'dark', infoOnly?: boolean) => void
  }
  SvgDrawer?: new (options?: Record<string, unknown>) => {
    draw: (
      tree: unknown,
      target: SVGSVGElement | string,
      theme: 'light' | 'dark',
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

type ReactionItemWithTarget = ReactionItem & {
  renderId: string
}

const props = withDefaults(defineProps<{
  diagram: ReactionDiagramData
  mechanismSteps?: MechanismStep[]
}>(), {
  mechanismSteps: () => [],
})

const { resolvedTheme } = useTheme()

const renderTheme = computed(() => (resolvedTheme.value === 'dark' ? 'dark' : 'light'))

let smilesDrawerInstance: SmilesDrawerModule | null = null

const createHash = (value: string): string => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

const createTargetId = (group: string, index: number, smiles: string, extra = ''): string => {
  return `smiles-${group}-${index}-${createHash(`${smiles}-${extra}`)}`
}

const reactantsWithTargets = computed<ReactionItemWithTarget[]>(() => {
  return props.diagram.reactants.map((item, index) => ({
    ...item,
    renderId: createTargetId('reactant', index, item.smiles),
  }))
})

const productsWithTargets = computed<ReactionItemWithTarget[]>(() => {
  return props.diagram.products.map((item, index) => ({
    ...item,
    renderId: createTargetId('product', index, item.smiles),
  }))
})

const reagentsWithTargets = computed<ReactionItemWithTarget[]>(() => {
  return props.diagram.reagents.map((item, index) => ({
    ...item,
    renderId: createTargetId('reagent', index, item.smiles),
  }))
})

const mechanismStructuresWithTargets = computed<ReactionItemWithTarget[]>(() => {
  return props.mechanismSteps.flatMap((step, stepIndex) =>
    (step.structures ?? []).map((item, index) => ({
      ...item,
      renderId: createTargetId(`mechanism-${stepIndex}`, index, item.smiles, `${step.step}`),
    }))
  )
})

const allMoleculesToRender = computed<ReactionItemWithTarget[]>(() => {
  return [
    ...reactantsWithTargets.value,
    ...reagentsWithTargets.value,
    ...productsWithTargets.value,
    ...mechanismStructuresWithTargets.value,
  ]
})

const renderTargetMarkup = (renderId: string): string => {
  return `<div id="${renderId}" class="molecule-render-target flex h-full w-full items-center justify-center"></div>`
}

const parseSmiles = async (smilesDrawer: SmilesDrawerModule, smiles: string): Promise<unknown> => {
  return await new Promise((resolve, reject) => {
    smilesDrawer.parse(smiles, resolve, reject)
  })
}

const getSmilesDrawer = async (): Promise<SmilesDrawerModule | null> => {
  if (!process.client) return null
  if (smilesDrawerInstance) return smilesDrawerInstance

  const SmilesDrawer = (await import("smiles-drawer")).default as unknown as SmilesDrawerModule
  smilesDrawerInstance = SmilesDrawer
  return smilesDrawerInstance
}

const renderSmiles = async (smiles: string, targetEl: HTMLElement): Promise<void> => {
  const trimmed = smiles?.trim()
  if (!trimmed) {
    targetEl.textContent = 'Invalid SMILES'
    return
  }

  try {
    const SmilesDrawer = await getSmilesDrawer()
    if (!SmilesDrawer) return

    const tree = await parseSmiles(SmilesDrawer, trimmed)

    targetEl.innerHTML = ''
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', '170')
    svg.setAttribute('height', '110')
    svg.setAttribute('viewBox', '0 0 170 110')
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    targetEl.appendChild(svg)

    if (typeof SmilesDrawer.SvgDrawer !== 'function') {
      throw new Error('SvgDrawer is unavailable')
    }

    const svgDrawer = new SmilesDrawer.SvgDrawer({
      width: 170,
      height: 110,
      compactDrawing: true,
      padding: 16,
    })
    svgDrawer.draw(tree, svg, renderTheme.value, null, false)

    if (!svg.innerHTML.trim()) {
      throw new Error('Empty SMILES render output')
    }
  } catch {
    targetEl.innerHTML = ''
    const fallback = document.createElement('span')
    fallback.textContent = 'Invalid SMILES'
    fallback.style.fontSize = '12px'
    fallback.style.color = resolvedTheme.value === 'dark' ? '#8a93a6' : '#64748b'
    targetEl.appendChild(fallback)
  }
}

const renderAllSmiles = async (): Promise<void> => {
  if (!process.client) return
  await nextTick()

  const tasks = allMoleculesToRender.value.map(async (item) => {
    const targetEl = document.getElementById(item.renderId)
    if (!targetEl) return
    await renderSmiles(item.smiles, targetEl)
  })

  await Promise.all(tasks)
}

watch(
  () => [props.diagram, props.mechanismSteps, renderTheme.value],
  async () => {
    if (!process.client) return
    await renderAllSmiles()
  },
  { deep: true, immediate: true }
)

onMounted(async () => {
  await renderAllSmiles()
})

const conditionsText = computed(() => {
  if (!props.diagram.conditions) return ''
  return Array.isArray(props.diagram.conditions)
    ? props.diagram.conditions.filter(Boolean).join(' • ')
    : props.diagram.conditions
})

const productBadge = (rawType?: string): ReactionRole | null => {
  if (!rawType) return null
  const normalized = rawType.toLowerCase()
  if (normalized === 'possible' || normalized === 'major' || normalized === 'minor') {
    return normalized
  }
  return null
}

const surfaceClasses = computed(() =>
  resolvedTheme.value === 'dark'
    ? 'bg-dark-900/55 border-dark-700/70'
    : 'bg-white border-slate-200'
)

const mutedTextClasses = computed(() =>
  resolvedTheme.value === 'dark' ? 'text-dark-400' : 'text-slate-500'
)

const chipClasses = computed(() =>
  resolvedTheme.value === 'dark'
    ? 'border-dark-600 bg-dark-800/80 text-dark-200'
    : 'border-slate-300 bg-slate-100 text-slate-700'
)

const arrowClasses = computed(() =>
  resolvedTheme.value === 'dark' ? 'border-accent/80' : 'border-slate-500'
)

const arrowHeadClasses = computed(() =>
  resolvedTheme.value === 'dark' ? 'border-l-accent/80' : 'border-l-slate-500'
)

const badgeClasses = (kind: ReactionRole) => {
  const dark = {
    major: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    minor: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
    possible: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
  }
  const light = {
    major: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    minor: 'border-amber-300 bg-amber-50 text-amber-700',
    possible: 'border-sky-300 bg-sky-50 text-sky-700',
  }

  return resolvedTheme.value === 'dark' ? dark[kind] : light[kind]
}
</script>

<style scoped>
.reaction-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>

