<template>
  <div class="max-w-[700px] mx-auto p-4 pb-24 lg:pb-6">
    <!-- Header -->
    <header class="mb-6 space-y-1">
      <h1 class="font-display text-4xl text-[var(--t1)]">Settings</h1>
      <p class="text-[var(--t2)] text-sm">Manage your account preferences</p>
    </header>
    
    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Account -->
      <UiCard class="!p-6">
        <h2 class="font-display text-3xl leading-8 text-[var(--t1)] mb-4">Account</h2>
        
        <div class="space-y-1 divide-y divide-[var(--line)]">
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Email</p>
              <p class="text-sm text-[var(--t2)]">{{ userStore.user?.email || 'Not available' }}</p>
            </div>
            <UiButton variant="ghost" size="sm" disabled class="mono-label">Managed</UiButton>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Password</p>
              <p class="mono-label text-sm text-[var(--t2)]">••••••••••••</p>
            </div>
            <UiButton variant="ghost" size="sm" @click="togglePasswordForm">
              {{ showPasswordForm ? 'Cancel' : 'Change' }}
            </UiButton>
          </div>

          <div v-if="showPasswordForm" class="rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-3 space-y-3 mt-3">
            <UiInput v-model="currentPassword" type="password" placeholder="Current password" />
            <UiInput v-model="newPassword" type="password" placeholder="New password" />
            <UiInput v-model="confirmNewPassword" type="password" placeholder="Confirm new password" />

            <p v-if="passwordError" class="text-sm text-[rgba(239,68,68,0.9)]">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="text-sm text-emerald-400">{{ passwordSuccess }}</p>

            <div class="flex justify-end">
              <UiButton :loading="passwordLoading" :disabled="passwordLoading" size="sm" @click="handleChangePassword">
                {{ passwordLoading ? 'Updating...' : 'Update Password' }}
              </UiButton>
            </div>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Two-Factor Authentication</p>
              <p class="text-sm text-[var(--t2)]">Add an extra layer of security</p>
            </div>
            <UiButton size="sm">Enable</UiButton>
          </div>
        </div>
      </UiCard>
      
      <!-- Appearance -->
      <UiCard class="!p-6">
        <h2 class="font-display text-3xl leading-8 text-[var(--t1)] mb-4">Appearance</h2>
        
        <div class="space-y-1 divide-y divide-[var(--line)]">
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Quick Theme Toggle</p>
              <p class="text-sm text-[var(--t2)]">Switch instantly between light and dark</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="isDarkMode"
              :aria-label="isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'"
              class="relative h-6 w-11 rounded-full border transition-colors duration-200 focus-visible:outline-none"
              :class="isDarkMode ? 'border-[var(--line-gold)] bg-[linear-gradient(135deg,#c4a464,#e8c882)]' : 'border-[var(--line)] bg-[var(--surface3)]'"
              @click="toggleTheme"
            >
              <span
                class="absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-200"
                :class="isDarkMode ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Theme</p>
              <p class="text-sm text-[var(--t2)]">Choose your preferred theme (system, dark, or light)</p>
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

          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--t3)]">
            Active display mode:
            <span class="font-semibold text-[var(--t1)] capitalize">{{ resolvedTheme }}</span>
          </div>
          
          <div class="py-4">
            <p class="font-semibold text-[14px] text-[var(--t1)]">Brand Accent</p>
            <p class="text-sm text-[var(--t2)] mb-3">Choose between the new premium preset and the classic green accent</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="option in accentOptions"
                :key="option.value"
                type="button"
                class="rounded-xl border px-3 py-2 text-left transition-all duration-150"
                :class="selectedAccent === option.value
                  ? 'border-[var(--gold)] bg-[var(--gold-dim)]'
                  : 'border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)]'"
                @click="selectedAccent = option.value"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-[var(--t1)]">{{ option.label }}</p>
                    <p class="text-xs text-[var(--t2)]">{{ option.description }}</p>
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
      <UiCard class="!p-6">
        <h2 class="font-display text-3xl leading-8 text-[var(--t1)] mb-4">Notifications</h2>
        
        <div class="space-y-1 divide-y divide-[var(--line)]">
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Push Notifications</p>
              <p class="text-sm text-[var(--t2)]">Receive notifications on your device</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--line-gold)]" style="background: linear-gradient(135deg,#c4a464,#e8c882);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Email Notifications</p>
              <p class="text-sm text-[var(--t2)]">Receive updates via email</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--line)]" style="background: var(--surface3);">
              <span class="absolute left-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-secondary);" />
            </button>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Friend Requests</p>
              <p class="text-sm text-[var(--t2)]">Get notified for new friend requests</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--line-gold)]" style="background: linear-gradient(135deg,#c4a464,#e8c882);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
        </div>
      </UiCard>
      
      <!-- Privacy -->
      <UiCard class="!p-6">
        <h2 class="font-display text-3xl leading-8 text-[var(--t1)] mb-4">Privacy</h2>
        
        <div class="space-y-1 divide-y divide-[var(--line)]">
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Profile Visibility</p>
              <p class="text-sm text-[var(--t2)]">Who can see your profile</p>
            </div>
            <div class="flex items-center gap-2">
              <select
                v-model="profileVisibilitySelection"
                class="select-field !w-auto !px-3"
                :disabled="profileVisibilityLoading || profileVisibilitySaving"
              >
                <option value="public">Everyone</option>
                <option value="private">Private</option>
              </select>
              <UiButton
                size="sm"
                :loading="profileVisibilitySaving"
                :disabled="profileVisibilityLoading || profileVisibilitySaving"
                @click="saveProfileVisibility"
              >
                Save
              </UiButton>
            </div>
          </div>

          <p v-if="profileVisibilityError" class="text-sm text-[rgba(239,68,68,0.9)]">{{ profileVisibilityError }}</p>
          <p v-if="profileVisibilitySuccess" class="text-sm text-emerald-400">{{ profileVisibilitySuccess }}</p>

          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--t3)]">
            Current visibility:
            <span class="font-semibold text-[var(--t1)]">
              {{ profileVisibilitySelection === 'public' ? 'Public' : 'Private' }}
            </span>
            <span v-if="profileVisibilityLoading" class="ml-2">(Loading...)</span>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-semibold text-[14px] text-[var(--t1)]">Show Online Status</p>
              <p class="text-sm text-[var(--t2)]">Let others see when you're online</p>
            </div>
            <button class="w-11 h-6 rounded-full relative border border-[var(--line-gold)]" style="background: linear-gradient(135deg,#c4a464,#e8c882);">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full" style="background: var(--on-primary);" />
            </button>
          </div>
        </div>
      </UiCard>
      
      <!-- Danger Zone -->
      <UiCard class="!p-6" style="border-color: rgba(239,68,68,0.35);">
        <h2 class="font-display text-3xl leading-8 text-[rgba(239,68,68,0.9)] mb-4">Danger Zone</h2>
        
        <div class="flex items-center justify-between py-4">
          <div>
            <p class="font-semibold text-[14px] text-[var(--t1)]">Delete Account</p>
            <p class="text-sm text-[var(--t2)]">Permanently delete your account and data</p>
          </div>
          <UiButton variant="danger" size="sm">Delete</UiButton>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changePassword } from '~/services/api/auth'
import { getMyProfileVisibility, updateMyProfileVisibility } from '~/services/api/social'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'main'
})

const { themePreference, accentPreference, resolvedTheme, setThemePreference, setAccentPreference, toggleTheme } = useTheme()
const userStore = useUserStore()

const showPasswordForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const profileVisibilitySelection = ref<'public' | 'private'>('public')
const profileVisibilityLoading = ref(false)
const profileVisibilitySaving = ref(false)
const profileVisibilityError = ref('')
const profileVisibilitySuccess = ref('')

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

const clearPasswordFeedback = () => {
  passwordError.value = ''
  passwordSuccess.value = ''
}

const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value
  clearPasswordFeedback()

  if (!showPasswordForm.value) {
    currentPassword.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''
  }
}

const handleChangePassword = async () => {
  clearPasswordFeedback()

  if (!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
    passwordError.value = 'All password fields are required.'
    return
  }

  if (currentPassword.value === newPassword.value) {
    passwordError.value = 'New password must be different from current password.'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    passwordError.value = 'New password and confirmation do not match.'
    return
  }

  passwordLoading.value = true
  const result = await changePassword({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })
  passwordLoading.value = false

  if (!result.success) {
    passwordError.value = result.error || 'Failed to change password.'
    return
  }

  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
  passwordSuccess.value = result.data?.message || 'Password changed successfully.'
}

const loadProfileVisibility = async () => {
  profileVisibilityLoading.value = true
  profileVisibilityError.value = ''
  profileVisibilitySuccess.value = ''

  const result = await getMyProfileVisibility()
  profileVisibilityLoading.value = false

  if (!result.success || !result.data) {
    profileVisibilitySelection.value = userStore.user?.isProfilePublic === false ? 'private' : 'public'
    profileVisibilityError.value = result.error || 'Failed to load profile visibility.'
    return
  }

  const isPublic = result.data.isPublic
  profileVisibilitySelection.value = isPublic ? 'public' : 'private'

  if (userStore.user) {
    userStore.user = {
      ...userStore.user,
      isProfilePublic: isPublic,
    }
    userStore.persistSession()
  }
}

const saveProfileVisibility = async () => {
  profileVisibilityError.value = ''
  profileVisibilitySuccess.value = ''
  profileVisibilitySaving.value = true

  const isPublic = profileVisibilitySelection.value === 'public'
  const result = await updateMyProfileVisibility(isPublic)

  profileVisibilitySaving.value = false

  if (!result.success || !result.data) {
    profileVisibilityError.value = result.error || 'Failed to update profile visibility.'
    return
  }

  if (userStore.user) {
    userStore.user = {
      ...userStore.user,
      isProfilePublic: result.data.isPublic,
    }
    userStore.persistSession()
  }

  profileVisibilitySelection.value = result.data.isPublic ? 'public' : 'private'
  profileVisibilitySuccess.value = result.data.message || 'Profile visibility updated.'
}

onMounted(async () => {
  await loadProfileVisibility()
})
</script>
