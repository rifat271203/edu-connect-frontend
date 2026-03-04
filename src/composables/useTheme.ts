export type ThemePreference = 'system' | 'dark' | 'light'
export type AccentPreference = 'indigo' | 'green'
type ResolvedTheme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'educonnect_theme_preference'
const ACCENT_STORAGE_KEY = 'educonnect_accent_preference'

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === 'system' || value === 'dark' || value === 'light'
}

const isAccentPreference = (value: string | null): value is AccentPreference => {
  return value === 'indigo' || value === 'green'
}

const getSystemTheme = (): ResolvedTheme => {
  if (!process.client) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resolveTheme = (preference: ThemePreference): ResolvedTheme => {
  if (preference === 'system') {
    return getSystemTheme()
  }

  return preference
}

const applyThemeToDocument = (theme: ResolvedTheme) => {
  if (!process.client) return

  const html = document.documentElement
  html.setAttribute('data-theme', theme)
  html.classList.toggle('dark', theme === 'dark')
  html.style.colorScheme = theme
}

const applyAccentToDocument = (accent: AccentPreference) => {
  if (!process.client) return

  const html = document.documentElement
  html.setAttribute('data-accent', accent)
}

export const useTheme = () => {
  const themePreference = useState<ThemePreference>('theme-preference', () => 'system')
  const accentPreference = useState<AccentPreference>('accent-preference', () => 'indigo')
  const resolvedTheme = useState<ResolvedTheme>('resolved-theme', () => 'dark')
  const watcherAttached = useState<boolean>('theme-system-watcher-attached', () => false)
  const initialized = useState<boolean>('theme-initialized', () => false)

  const syncResolvedTheme = () => {
    const nextTheme = resolveTheme(themePreference.value)
    resolvedTheme.value = nextTheme
    applyThemeToDocument(nextTheme)
  }

  const setThemePreference = (preference: ThemePreference) => {
    themePreference.value = preference

    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    }

    syncResolvedTheme()
  }

  const setAccentPreference = (preference: AccentPreference) => {
    accentPreference.value = preference

    if (process.client) {
      localStorage.setItem(ACCENT_STORAGE_KEY, preference)
    }

    applyAccentToDocument(preference)
  }

  const toggleTheme = () => {
    const nextTheme: ThemePreference = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    setThemePreference(nextTheme)
  }

  const initTheme = () => {
    if (!process.client) return

    if (!initialized.value) {
      const storedPreference = localStorage.getItem(THEME_STORAGE_KEY)
      if (isThemePreference(storedPreference)) {
        themePreference.value = storedPreference
      }

      const storedAccentPreference = localStorage.getItem(ACCENT_STORAGE_KEY)
      if (isAccentPreference(storedAccentPreference)) {
        accentPreference.value = storedAccentPreference
      }

      if (!watcherAttached.value) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = () => {
          if (themePreference.value === 'system') {
            syncResolvedTheme()
          }
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)

        watcherAttached.value = true
      }

      initialized.value = true
    }

    syncResolvedTheme()
    applyAccentToDocument(accentPreference.value)
  }

  if (process.client) {
    initTheme()
  }

  return {
    themePreference,
    accentPreference,
    resolvedTheme,
    setThemePreference,
    setAccentPreference,
    toggleTheme,
    initTheme,
  }
}

