<template>
  <div class="login-v2" :data-theme="theme">
    <div class="layout-split">
      <section class="left-column hero-gradient left-panel-grid">
        <div class="z-10 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-[var(--btn-text)]">
            <span class="material-symbols-outlined text-xl">school</span>
          </div>
          <span class="font-headline font-bold text-xl tracking-tight text-[var(--text)] uppercase">edu-connect bd</span>
        </div>

        <div class="z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--chip-bg)] text-[var(--chip-text)] text-[10px] font-bold uppercase tracking-widest mb-8">
            <div class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
            Academic Excellence
          </div>
          <h1 class="font-display text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[var(--text)] leading-[1.05] mb-6">
            Ready to<br /><span class="text-[var(--accent)]">get started?</span>
          </h1>
          <p class="text-[var(--text2)] text-lg font-light leading-relaxed mb-10 max-w-md">
            Join thousands of students and educators unlocking their full potential through our world-class learning ecosystem.
          </p>
          <div class="space-y-4">
            <div class="flex items-center gap-4 text-[var(--text2)]">
              <div class="w-8 h-8 rounded-lg bg-[var(--surface2)] flex items-center justify-center border border-[var(--border)] text-[var(--accent)]">
                <span class="material-symbols-outlined text-sm">shield</span>
              </div>
              <span class="text-sm font-medium">End-to-end encrypted protocol</span>
            </div>
            <div class="flex items-center gap-4 text-[var(--text2)]">
              <div class="w-8 h-8 rounded-lg bg-[var(--surface2)] flex items-center justify-center border border-[var(--border)] text-[var(--accent)]">
                <span class="material-symbols-outlined text-sm">psychology</span>
              </div>
              <span class="text-sm font-medium">AI-powered predictive tutoring</span>
            </div>
            <div class="flex items-center gap-4 text-[var(--text2)]">
              <div class="w-8 h-8 rounded-lg bg-[var(--surface2)] flex items-center justify-center border border-[var(--border)] text-[var(--accent)]">
                <span class="material-symbols-outlined text-sm">devices</span>
              </div>
              <span class="text-sm font-medium">Seamless cross-device architect</span>
            </div>
          </div>
        </div>

        <div class="z-10 stats-inline" role="list" aria-label="Platform stats">
          <div class="stats-inline-item" role="listitem">
            <div class="font-headline text-2xl font-bold text-[var(--text)]">48K+</div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-[var(--text3)] mt-1">Active Students</div>
          </div>
          <div class="stats-inline-item" role="listitem">
            <div class="font-headline text-2xl font-bold text-[var(--text)]">3K+</div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-[var(--text3)] mt-1">Expert Tutors</div>
          </div>
          <div class="stats-inline-item" role="listitem">
            <div class="font-headline text-2xl font-bold text-[var(--text)]">99%</div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-[var(--text3)] mt-1">Satisfaction</div>
          </div>
        </div>
      </section>

      <main class="relative flex items-center justify-center bg-[var(--surface)] p-8 border-l border-[var(--border)]">
        <button
          class="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center theme-toggle"
          type="button"
          title="Toggle Theme"
          @click="toggleTheme"
        >
          <span class="material-symbols-outlined">{{ themeIcon }}</span>
        </button>

        <div class="w-full max-w-sm">
          <div class="mb-10 text-center lg:text-left">
            <h2 class="text-3xl font-extrabold tracking-tight text-[var(--text)] mb-2">Create account</h2>
            <p class="text-[var(--text2)] text-sm font-light">Set up your profile to start learning and teaching.</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleSignup">
            <div class="space-y-2">
              <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1">Account type</label>
              <div class="relative">
                <select v-model="accountType" class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all appearance-none">
                  <option value="student">Student Portal</option>
                  <option value="teacher">Teacher Portal</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text3)]">expand_more</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1" for="signupName">Full name</label>
              <input
                id="signupName"
                v-model.trim="signupName"
                class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
                placeholder="Jane Doe"
                type="text"
                autocomplete="name"
                :class="{ 'is-error': Boolean(signupErrors.name) }"
                @input="clearFieldError('name')"
              />
              <span v-if="signupErrors.name" class="field-error">{{ signupErrors.name }}</span>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1" for="signupEmail">Email address</label>
              <input
                id="signupEmail"
                v-model.trim="signupEmail"
                class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
                placeholder="name@academia.elite"
                type="email"
                autocomplete="email"
                :class="{ 'is-error': Boolean(signupErrors.email) }"
                @input="clearFieldError('email')"
              />
              <span v-if="signupErrors.email" class="field-error">{{ signupErrors.email }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-medium uppercase tracking-widest text-[var(--label)] px-1" for="signupPassword">Password</label>
              <div class="relative">
                <input
                  id="signupPassword"
                  v-model="signupPassword"
                  class="w-full h-11 pl-4 pr-12 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  :class="{ 'is-error': Boolean(signupErrors.password) }"
                  @input="clearFieldError('password')"
                />
                <button class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]" type="button" @click="showPassword = !showPassword">
                  <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
              <span v-if="signupErrors.password" class="field-error">{{ signupErrors.password }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-medium uppercase tracking-widest text-[var(--label)] px-1" for="signupConfirmPassword">Confirm password</label>
              <input
                id="signupConfirmPassword"
                v-model="confirmPassword"
                class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="new-password"
                :class="{ 'is-error': Boolean(signupErrors.confirmPassword) }"
                @input="clearFieldError('confirmPassword')"
              />
              <span v-if="signupErrors.confirmPassword" class="field-error">{{ signupErrors.confirmPassword }}</span>
            </div>

            <label class="flex items-center gap-3 cursor-pointer group w-fit">
              <input
                v-model="acceptTerms"
                class="w-4 h-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-[var(--bg)] transition-all"
                type="checkbox"
                @change="clearFieldError('terms')"
              />
              <span class="text-sm font-light text-[var(--text2)] group-hover:text-[var(--text)]">I agree to the terms and privacy policy</span>
            </label>
            <span v-if="signupErrors.terms" class="field-error">{{ signupErrors.terms }}</span>

            <button class="w-full h-12 mt-2 btn-primary font-medium text-sm rounded-lg shadow-lg" type="submit" :disabled="isLoading">
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>

            <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
          </form>

          <div class="mt-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="h-px flex-1 bg-[var(--border)]"></div>
              <span class="text-[11px] font-medium uppercase tracking-widest text-[var(--divider-text)]">Or continue with</span>
              <div class="h-px flex-1 bg-[var(--border)]"></div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button class="flex items-center justify-center gap-3 h-11 px-4 social-btn rounded-lg text-sm font-medium" type="button" @click="handleGoogleLogin" :disabled="isGoogleLoading">
                <span v-if="isGoogleLoading" class="w-4 h-4 rounded-full border-2 border-[var(--text)]/30 border-t-[var(--text)] animate-spin"></span>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285f4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fbbc05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"></path>
                </svg>
                <span v-if="!isGoogleLoading">Google</span>
              </button>
              <button class="flex items-center justify-center gap-3 h-11 px-4 social-btn rounded-lg text-sm font-medium" type="button">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6L11.4 24z" fill="#f25022"></path>
                  <path d="M24 24H12.6L24 12.6V24z" fill="#00a4ef"></path>
                  <path d="M0 11.4V0h11.4L0 11.4z" fill="#7fba00"></path>
                  <path d="M12.6 0H24v11.4L12.6 0z" fill="#ffb900"></path>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-sm font-light text-[var(--text2)]">
              Already have an account?
              <NuxtLink class="text-[var(--accent)] font-medium hover:underline ml-1" to="/loginV2">Sign in</NuxtLink>
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { UserRole } from '~/services/api/auth'
import { getGoogleAuthUrl } from '~/services/api/auth'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank',
  pageTransition: {
    name: 'auth',
    mode: 'out-in',
  },
})

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
  ],
})

type SignupField = 'name' | 'email' | 'password' | 'confirmPassword' | 'terms'
type AccountType = 'student' | 'teacher'
const AUTH_THEME_STORAGE_KEY = 'educonnect_auth_page_theme'

const userStore = useUserStore()

const theme = ref<'dark' | 'light'>('light')
const accountType = ref<AccountType>('student')
const signupName = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const errorMessage = ref('')

const signupErrors = reactive<Record<SignupField, string>>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const themeIcon = computed(() => (theme.value === 'dark' ? 'dark_mode' : 'light_mode'))
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const toggleTheme = (): void => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'

  if (process.client) {
    localStorage.setItem(AUTH_THEME_STORAGE_KEY, theme.value)
  }
}

onMounted(() => {
  if (!process.client) return

  const storedTheme = localStorage.getItem(AUTH_THEME_STORAGE_KEY)
  if (storedTheme === 'dark' || storedTheme === 'light') {
    theme.value = storedTheme
  }
})

const clearFieldError = (field: SignupField): void => {
  signupErrors[field] = ''
  errorMessage.value = ''
}

const validate = (): boolean => {
  let valid = true

  if (!signupName.value.trim()) {
    signupErrors.name = 'Full name is required.'
    valid = false
  } else if (signupName.value.trim().length < 2) {
    signupErrors.name = 'Full name must be at least 2 characters.'
    valid = false
  }

  if (!signupEmail.value.trim()) {
    signupErrors.email = 'Email is required.'
    valid = false
  } else if (!emailRegex.test(signupEmail.value.trim())) {
    signupErrors.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!signupPassword.value) {
    signupErrors.password = 'Password is required.'
    valid = false
  } else if (signupPassword.value.length < 6) {
    signupErrors.password = 'Password must be at least 6 characters.'
    valid = false
  }

  if (!confirmPassword.value) {
    signupErrors.confirmPassword = 'Please confirm your password.'
    valid = false
  } else if (confirmPassword.value !== signupPassword.value) {
    signupErrors.confirmPassword = 'Passwords do not match.'
    valid = false
  }

  if (!acceptTerms.value) {
    signupErrors.terms = 'You need to accept terms to continue.'
    valid = false
  }

  return valid
}

const mapAccountTypeToRole = (value: AccountType): UserRole => {
  return value === 'student' ? 'student' : 'teacher'
}

const handleSignup = async (): Promise<void> => {
  errorMessage.value = ''
  signupErrors.name = ''
  signupErrors.email = ''
  signupErrors.password = ''
  signupErrors.confirmPassword = ''
  signupErrors.terms = ''

  if (!validate()) return

  isLoading.value = true
  const response = await userStore.registerUser(
    signupName.value.trim(),
    signupEmail.value.trim(),
    signupPassword.value,
    mapAccountTypeToRole(accountType.value)
  )
  isLoading.value = false

  if (!response.success) {
    errorMessage.value = response.message || 'Registration failed. Please check your details and try again.'
    return
  }

  await navigateTo('/home')
}

const handleGoogleLogin = async (): Promise<void> => {
  errorMessage.value = ''
  isGoogleLoading.value = true

  const response = await getGoogleAuthUrl(mapAccountTypeToRole(accountType.value))
  
  if (response.success && response.data?.url) {
    if (process.client) {
      sessionStorage.setItem('educonnect_auth_role_preference', accountType.value)
    }
    window.location.href = response.data.url
  } else {
    isGoogleLoading.value = false
    errorMessage.value = response.error || 'Failed to initiate Google login.'
  }
}
</script>

<style scoped lang="scss">
.login-v2 {
  --bg: #09090b;
  --bg2: #121214;
  --hero-base: linear-gradient(160deg, #09090b 0%, #121214 62%, #18181b 100%);
  --hero-glow-1: rgba(16, 185, 129, 0.06);
  --hero-glow-2: rgba(16, 185, 129, 0.04);
  --surface: #18181b;
  --surface2: #27272a;
  --border: rgba(255, 255, 255, 0.05);
  --border2: rgba(255, 255, 255, 0.1);
  --text: #f8fafc;
  --text2: #94a3b8;
  --text3: #64748b;
  --accent: #10b981;
  --accent2: #059669;
  --label: rgba(255, 255, 255, 0.5);
  --input-bg: #09090b;
  --input-border: rgba(255, 255, 255, 0.1);
  --input-focus: rgba(16, 185, 129, 0.35);
  --btn-bg: #10b981;
  --btn-text: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --stat-bg: rgba(255, 255, 255, 0.03);
  --chip-bg: rgba(16, 185, 129, 0.1);
  --chip-text: #10b981;
  --divider-text: rgba(255, 255, 255, 0.3);
  --social-bg: #27272a;
  --social-border: rgba(255, 255, 255, 0.08);
  --social-hover: #3f3f46;
  --right-grid-line: rgba(16, 185, 129, 0.15);
  --right-grid-soft: rgba(16, 185, 129, 0.05);
  --right-grid-glow: rgba(16, 185, 129, 0.1);
  --right-grid-fade: rgba(9, 9, 11, 0.88);
}

.login-v2[data-theme='light'] {
  --bg: #f8fafc;
  --bg2: #f1f5f9;
  --hero-base: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%);
  --hero-glow-1: rgba(16, 185, 129, 0.1);
  --hero-glow-2: rgba(16, 185, 129, 0.05);
  --surface: #ffffff;
  --surface2: #f1f5f9;
  --border: rgba(0, 0, 0, 0.05);
  --border2: rgba(0, 0, 0, 0.1);
  --text: #0f172a;
  --text2: #475569;
  --text3: #94a3b8;
  --accent: #10b981;
  --accent2: #059669;
  --label: rgba(15, 23, 42, 0.72);
  --input-bg: #f8fafc;
  --input-border: rgba(0, 0, 0, 0.1);
  --input-focus: rgba(16, 185, 129, 0.2);
  --btn-bg: #10b981;
  --btn-text: #ffffff;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --stat-bg: rgba(15, 23, 42, 0.05);
  --chip-bg: rgba(16, 185, 129, 0.1);
  --chip-text: #059669;
  --divider-text: rgba(15, 23, 42, 0.5);
  --social-bg: #f1f5f9;
  --social-border: rgba(0, 0, 0, 0.08);
  --social-hover: #e2e8f0;
  --right-grid-line: rgba(16, 185, 129, 0.1);
  --right-grid-soft: rgba(16, 185, 129, 0.05);
  --right-grid-glow: rgba(16, 185, 129, 0.1);
  --right-grid-fade: rgba(255, 255, 255, 0.8);
}

.login-v2 {
  min-height: 100vh;
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  will-change: opacity, transform;
  transition: background 0.35s, color 0.35s;
}

.layout-split {
  display: grid;
  grid-template-columns: 60% 40%;
  min-height: 100vh;
}

.left-panel-grid {
  overflow: hidden;
  isolation: isolate;
}

.left-panel-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 82% 18%, var(--right-grid-glow) 0%, transparent 52%),
    linear-gradient(130deg, transparent 0%, var(--right-grid-soft) 60%, transparent 100%),
    repeating-linear-gradient(45deg, var(--right-grid-line) 0 2px, transparent 2px 34px),
    repeating-linear-gradient(-45deg, var(--right-grid-soft) 0 1px, transparent 1px 34px),
    linear-gradient(0deg, var(--right-grid-fade), transparent 35%, transparent 72%, var(--right-grid-fade));
  background-size: 100% 100%, 140% 140%, 160px 160px, 160px 160px, 100% 100%;
  background-position: center, center, 0 0, 0 0, center;
  transition: background 0.45s ease, opacity 0.35s ease;
  animation: left-grid-shift 14s linear infinite;
  opacity: 0.98;
}

.left-panel-grid > * {
  position: relative;
  z-index: 1;
}

@keyframes left-grid-shift {
  0% {
    background-position: center, center, 0 0, 0 0, center;
  }
  100% {
    background-position: center, center, 160px 160px, -160px 160px, center;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  border-right: 1px solid var(--border);
  overflow: hidden;
}

.hero-gradient {
  background:
    radial-gradient(circle at 20% 30%, var(--hero-glow-1) 0%, transparent 54%),
    radial-gradient(circle at 82% 72%, var(--hero-glow-2) 0%, transparent 52%),
    var(--hero-base);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

h1,
h2,
.font-headline {
  font-family: 'Syne', sans-serif;
}

.font-display {
  font-family: 'Manrope', sans-serif;
}

.stat-card {
  background: var(--stat-bg);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
  backdrop-filter: blur(8px);
}

.stats-inline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border));
  padding-top: 1rem;
}

.stats-inline-item {
  padding-left: 0.25rem;
}

.stats-inline-item + .stats-inline-item {
  border-left: 1px solid var(--border);
  padding-left: 1.25rem;
}

.input-base {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-base:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px var(--input-focus) !important;
}

.input-base.is-error {
  border-color: #e95f5f;
}

.btn-primary {
  background: var(--btn-bg);
  color: var(--btn-text);
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:active {
  transform: scale(0.985);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.social-btn {
  background: var(--social-bg);
  border: 1px solid var(--social-border);
  color: var(--text);
  transition: background 0.2s, border-color 0.2s;
}

.social-btn:hover {
  background: var(--social-hover);
  border-color: var(--border2);
}

.theme-toggle {
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text2);
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--border);
  color: var(--text);
  transform: scale(1.05);
}

.field-error {
  display: block;
  color: #e95f5f;
  font-size: 12px;
  margin-top: 6px;
}

.error-banner {
  margin-top: 8px;
  background: rgba(233, 95, 95, 0.12);
  border: 1px solid rgba(233, 95, 95, 0.35);
  color: #e95f5f;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
}

.z-10 {
  z-index: 10;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

.inline-flex {
  display: inline-flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-col {
  flex-direction: column;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.w-full {
  width: 100%;
}

.h-11 {
  height: 2.75rem;
}

.h-12 {
  height: 3rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.pl-4 {
  padding-left: 1rem;
}

.pr-12 {
  padding-right: 3rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mb-10 {
  margin-bottom: 2.5rem;
}

.max-w-sm {
  max-width: 24rem;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-xl {
  max-width: 36rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
  border-style: solid;
}

.border-l {
  border-left-width: 1px;
}

.text-center {
  text-align: center;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-5xl {
  font-size: 3rem;
  line-height: 1;
}

.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
}

.font-light {
  font-weight: 300;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.uppercase {
  text-transform: uppercase;
}

.leading-\[1\.05\] {
  line-height: 1.05;
}

.leading-relaxed {
  line-height: 1.625;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.tracking-\[-0\.03em\] {
  letter-spacing: -0.03em;
}

.text-\[10px\] {
  font-size: 10px;
}

.text-\[11px\] {
  font-size: 11px;
}

.text-\[12px\] {
  font-size: 12px;
}

.text-\[var\(--text\)\] {
  color: var(--text);
}

.text-\[var\(--text2\)\] {
  color: var(--text2);
}

.text-\[var\(--text3\)\] {
  color: var(--text3);
}

.text-\[var\(--accent\)\] {
  color: var(--accent);
}

.text-\[var\(--chip-text\)\] {
  color: var(--chip-text);
}

.text-\[var\(--divider-text\)\] {
  color: var(--divider-text);
}

.text-\[var\(--label\)\] {
  color: var(--label);
}

.text-\[var\(--btn-text\)\] {
  color: var(--btn-text);
}

.bg-\[var\(--surface\)\] {
  background-color: var(--surface);
}

.bg-\[var\(--surface2\)\] {
  background-color: var(--surface2);
}

.bg-\[var\(--accent\)\] {
  background-color: var(--accent);
}

.bg-\[var\(--chip-bg\)\] {
  background-color: var(--chip-bg);
}

.bg-\[var\(--border\)\] {
  background-color: var(--border);
}

.border-\[var\(--border\)\] {
  border-color: var(--border);
}

.border-\[var\(--input-border\)\] {
  border-color: var(--input-border);
}

.overflow-hidden {
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

.group:hover .group-hover\:text-\[var\(--text\)\] {
  color: var(--text);
}

.opacity-80 {
  opacity: 0.8;
}

.hover\:opacity-100:hover {
  opacity: 1;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.h-px {
  height: 1px;
}

.flex-1 {
  flex: 1 1 0%;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.right-3 {
  right: 0.75rem;
}

.right-8 {
  right: 2rem;
}

.top-1\/2 {
  top: 50%;
}

.top-8 {
  top: 2rem;
}

.-translate-y-1\/2 {
  transform: translateY(-50%);
}

.pointer-events-none {
  pointer-events: none;
}

.selection\:bg-accent\/30 ::selection {
  background: rgba(0, 201, 167, 0.3);
}

.selection\:text-accent ::selection {
  color: var(--accent);
}

@media (max-width: 1024px) {
  .layout-split {
    grid-template-columns: 1fr;
  }

  .left-column {
    display: none;
  }

  .border-l {
    border-left-width: 0;
  }

  main {
    min-height: 100vh;
  }
}

@media (max-width: 640px) {
  .stats-inline {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stats-inline-item,
  .stats-inline-item + .stats-inline-item {
    border-left: none;
    padding-left: 0;
  }

  .p-8 {
    padding: 1.5rem;
  }

  .right-8 {
    right: 1rem;
  }

  .top-8 {
    top: 1rem;
  }
}
</style>
