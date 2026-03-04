<template>
  <div class="max-w-2xl mx-auto p-4 pb-24 lg:pb-4">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--text)]">Settings</h1>
      <p class="text-[var(--text-2)]">Manage your account preferences</p>
    </header>
    
    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Account -->
      <UiCard class="p-4">
        <h2 class="text-lg font-semibold text-[var(--text)] mb-4">Account</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Email</p>
              <p class="text-sm text-[var(--text-3)]">john.doe@example.com</p>
            </div>
            <UiButton variant="ghost" size="sm">Change</UiButton>
          </div>
          
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Password</p>
              <p class="text-sm text-[var(--text-3)]">••••••••••••</p>
            </div>
            <UiButton variant="ghost" size="sm">Change</UiButton>
          </div>
          
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Two-Factor Authentication</p>
              <p class="text-sm text-[var(--text-3)]">Add an extra layer of security</p>
            </div>
            <UiButton variant="secondary" size="sm">Enable</UiButton>
          </div>
        </div>
      </UiCard>
      
      <!-- Appearance -->
      <UiCard class="p-4">
        <h2 class="text-lg font-semibold text-[var(--text)] mb-4">Appearance</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Quick Theme Toggle</p>
              <p class="text-sm text-[var(--text-3)]">Switch instantly between light and dark</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="isDarkMode"
              :aria-label="isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'"
              class="relative h-6 w-11 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              :class="isDarkMode ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)] bg-[var(--secondary)]'"
              @click="toggleTheme"
            >
              <span
                class="absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-200"
                :class="isDarkMode ? 'translate-x-5 bg-[var(--on-primary)]' : 'translate-x-0 bg-[var(--on-secondary)]'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Theme</p>
              <p class="text-sm text-[var(--text-3)]">Choose your preferred theme (system, dark, or light)</p>
            </div>
            <select
              v-model="selectedTheme"
              class="select-field !w-auto !px-3"
            >
              <option
                v-for="option in themeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-3)]">
            Active display mode:
            <span class="font-semibold text-[var(--text)] capitalize">{{ resolvedTheme }}</span>
          </div>
          
          <div class="py-2">
            <p class="font-medium text-[var(--text)]">Brand Accent</p>
            <p class="text-sm text-[var(--text-3)] mb-3">Choose between the new premium preset and the classic green accent</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="option in accentOptions"
                :key="option.value"
                type="button"
                class="rounded-xl border px-3 py-2 text-left transition-all duration-150"
                :class="selectedAccent === option.value
                  ? 'border-[var(--primary)] bg-[var(--sidebar-item-active-bg)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--card-hover)]'"
                @click="selectedAccent = option.value"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-[var(--text)]">{{ option.label }}</p>
                    <p class="text-xs text-[var(--text-3)]">{{ option.description }}</p>
                  </div>
                  <div class="flex items-center gap-1">
                    <span
                      v-for="swatch in option.swatches"
                      :key="swatch"
                      class="h-4 w-4 rounded-full border border-black/10"
                      :style="{ background: swatch }"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </UiCard>
      
      <!-- Notifications -->
      <UiCard class="p-4">
        <h2 class="text-lg font-semibold text-[var(--text)] mb-4">Notifications</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Push Notifications</p>
              <p class="text-sm text-[var(--text-3)]">Receive notifications on your device</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--border)]" style="background: var(--primary);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
          
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Email Notifications</p>
              <p class="text-sm text-[var(--text-3)]">Receive updates via email</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--border)]" style="background: var(--secondary);">
              <span class="absolute left-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-secondary);" />
            </button>
          </div>
          
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Friend Requests</p>
              <p class="text-sm text-[var(--text-3)]">Get notified for new friend requests</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--border)]" style="background: var(--primary);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
        </div>
      </UiCard>
      
      <!-- Privacy -->
      <UiCard class="p-4">
        <h2 class="text-lg font-semibold text-[var(--text)] mb-4">Privacy</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Profile Visibility</p>
              <p class="text-sm text-[var(--text-3)]">Who can see your profile</p>
            </div>
            <select class="select-field !w-auto !px-3">
              <option>Everyone</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>
          
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-[var(--text)]">Show Online Status</p>
              <p class="text-sm text-[var(--text-3)]">Let others see when you're online</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--border)]" style="background: var(--primary);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
        </div>
      </UiCard>
      
      <!-- Danger Zone -->
      <UiCard class="p-4" style="border-color: color-mix(in srgb, var(--danger) 30%, var(--border));">
        <h2 class="text-lg font-semibold text-[var(--danger)] mb-4">Danger Zone</h2>
        
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="font-medium text-[var(--text)]">Delete Account</p>
            <p class="text-sm text-[var(--text-3)]">Permanently delete your account and data</p>
          </div>
          <UiButton variant="danger" size="sm">Delete</UiButton>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const { themePreference, accentPreference, resolvedTheme, setThemePreference, setAccentPreference, toggleTheme } = useTheme()

const isDarkMode = computed(() => resolvedTheme.value === 'dark')

const selectedTheme = computed({
  get: () => themePreference.value,
  set: (value: string) => {
    if (value === 'system' || value === 'dark' || value === 'light') {
      setThemePreference(value)
    }
  },
})

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
] as const

const selectedAccent = computed({
  get: () => accentPreference.value,
  set: (value: string) => {
    if (value === 'indigo' || value === 'green') {
      setAccentPreference(value)
    }
  },
})

const accentOptions = [
  {
    label: 'Premium Indigo (New)',
    value: 'indigo',
    description: 'Clean, modern and professional',
    swatches: ['#6366F1', '#4F46E5', '#4338CA'],
  },
  {
    label: 'Classic Green',
    value: 'green',
    description: 'Original EduConnect accent',
    swatches: ['#3E7B63', '#2F6651', '#244F3F'],
  },
] as const
</script>
