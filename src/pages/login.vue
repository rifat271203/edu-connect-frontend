<template>
  <div class="relative min-h-screen overflow-hidden bg-[var(--ec-page-bg)] text-[var(--ec-text-primary)]">
    <div class="pointer-events-none absolute inset-0" :style="{ backgroundImage: loginBackdropGradient }" />

    <div class="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1.04fr_0.96fr]">
      <section
        class="order-2 flex flex-col justify-center gap-6 border-t border-[rgba(255,255,255,0.06)] px-6 py-8 sm:px-8 lg:order-1 lg:gap-8 lg:border-r lg:border-t-0 lg:px-12"
      >
        <div class="max-w-[620px]">
          <p
            class="mb-4 inline-flex rounded-full border border-[color-mix(in_srgb,var(--ec-accent)_32%,transparent)] bg-[var(--ec-accent-soft-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ec-accent-hover)]"
          >
            EDUCONNECT PLATFORM
          </p>

          <h1 class="text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.85rem]">
            Powering smarter education at scale.
          </h1>

          <p class="mt-4 max-w-[54ch] text-sm leading-7 text-[rgba(234,242,255,0.68)] sm:text-base">
            A modern learning workspace for students and teachers.
            <br>
            Track progress, collaborate in real-time, and access classroom tools from one secure dashboard.
          </p>
        </div>

        <div class="grid max-w-[620px] gap-4">
          <NuxtLink
            v-for="card in quickAccessCards"
            :key="card.id"
            :to="card.to"
            :class="[
              ui.featureCard,
              'group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]'
            ]"
          >
            <div class="flex items-start gap-4">
              <div :class="[ui.featureIcon, 'transition-transform duration-200 group-hover:scale-105']" aria-hidden="true">
                <svg v-if="card.id === 'ai-tutor'" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <svg v-else-if="card.id === 'feed'" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path
                    d="M8 11a3 3 0 100-6 3 3 0 000 6zM16 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3.5 18.5c0-2.5 2.1-4.5 4.7-4.5h.6c2.6 0 4.7 2 4.7 4.5M13 18.5c.2-1.8 1.7-3.3 3.6-3.3h.3c2 0 3.6 1.5 3.6 3.3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>

                <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ec-accent-hover)]">
                  {{ card.badge }}
                </p>
                <h3 class="mt-1 text-base font-semibold tracking-[-0.01em]">{{ card.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-[rgba(234,242,255,0.68)]">
                  {{ card.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="order-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:order-2 lg:px-12">
        <div :class="[ui.glassCard, 'w-full max-w-[460px] p-6 sm:p-8']">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ec-accent-hover)]">
            {{ isRegisterMode ? 'CREATE ACCOUNT' : 'SECURE ACCESS' }}
          </p>

          <h2 class="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">
            {{ isRegisterMode ? 'Create your EduConnect account' : 'Log in to EduConnect' }}
          </h2>

          <p class="mt-2 text-sm leading-6 text-[var(--ec-text-secondary)]">
            {{ isRegisterMode ? 'Get started with your learning workspace.' : 'Continue to your dashboard' }}
          </p>

          <form v-if="!isRegisterMode" class="mt-6 space-y-4" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label for="authRole" class="text-xs font-medium text-[var(--ec-text-secondary)]">Role</label>
              <div class="relative">
                <select id="authRole" v-model="authRole" :class="[ui.fieldBase, 'appearance-none pr-11']">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ec-text-muted)]"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <div class="space-y-2">
              <label for="email" class="text-xs font-medium text-[var(--ec-text-secondary)]">Email</label>
              <div class="relative">
                <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ec-text-muted)]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
                    <path
                      d="M3 7l8.2 5.2a1.5 1.5 0 001.6 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@institution.edu"
                  :class="[
                    ui.fieldBase,
                    'pl-11',
                    errors.email
                      ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]'
                      : ''
                  ]"
                >
              </div>
              <p v-if="errors.email" class="text-xs text-red-200">{{ errors.email }}</p>
            </div>

            <div class="space-y-2">
              <label for="password" class="text-xs font-medium text-[var(--ec-text-secondary)]">Password</label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  :class="[
                    ui.fieldBase,
                    'pr-11',
                    errors.password
                      ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]'
                      : ''
                  ]"
                >
                <button
                  type="button"
                  class="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ec-text-muted)] transition hover:text-[var(--ec-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" class="h-[18px] w-[18px]">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M2.5 12C3.8 8 7.5 5.25 12 5.25S20.2 8 21.5 12c-1.3 4-5 6.75-9.5 6.75S3.8 16 2.5 12z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="h-[18px] w-[18px]">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.7 5.4A10.8 10.8 0 0112 5.25c4.5 0 8.2 2.75 9.5 6.75a11 11 0 01-3.3 4.8M6.5 8.3A10.7 10.7 0 002.5 12c1.3 4 5 6.75 9.5 6.75 1 0 2-.13 2.9-.4" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-xs text-red-200">{{ errors.password }}</p>
            </div>

            <div class="flex items-center justify-between gap-3 pt-0.5">
              <label class="inline-flex items-center gap-2 text-xs text-[var(--ec-text-secondary)]" for="remember-me">
                <input
                  id="remember-me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 rounded border border-[var(--ec-input-border)] bg-[var(--ec-input-bg)] text-[var(--ec-accent)] focus:ring-2 focus:ring-[rgba(87,198,166,0.3)]"
                >
                Remember me
              </label>

              <NuxtLink
                to="/forgot-password"
                class="text-xs text-[var(--ec-text-secondary)] transition-colors hover:text-[var(--ec-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <button type="submit" :disabled="loading" :class="[ui.primaryButton, 'w-full']">
              <span v-if="!loading" class="inline-flex items-center justify-center gap-2">
                Sign In
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span v-else class="inline-flex items-center justify-center gap-2">
                <svg class="h-4 w-4 animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z" />
                </svg>
                Signing in...
              </span>
            </button>

            <p class="pt-1 text-center text-sm text-[var(--ec-text-secondary)]">
              Don’t have an account?
              <button
                type="button"
                class="ml-1 font-semibold text-[var(--ec-accent)] transition-colors hover:text-[var(--ec-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]"
                @click="toggleMode"
              >
                Sign Up
              </button>
            </p>
          </form>

          <form v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="handleRegister">
            <div class="space-y-2 sm:col-span-2">
              <label for="registerRole" class="text-xs font-medium text-[var(--ec-text-secondary)]">Role</label>
              <div class="relative">
                <select id="registerRole" v-model="registerRole" :class="[ui.fieldBase, 'appearance-none pr-11']">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ec-text-muted)]"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label for="name" class="text-xs font-medium text-[var(--ec-text-secondary)]">Full Name</label>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Enter your full name"
                :class="[
                  ui.fieldBase,
                  errors.name ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]' : ''
                ]"
              >
              <p v-if="errors.name" class="text-xs text-red-200">{{ errors.name }}</p>
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label for="registerEmail" class="text-xs font-medium text-[var(--ec-text-secondary)]">Email</label>
              <input
                id="registerEmail"
                v-model="registerEmail"
                type="email"
                placeholder="you@institution.edu"
                :class="[
                  ui.fieldBase,
                  errors.registerEmail ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]' : ''
                ]"
              >
              <p v-if="errors.registerEmail" class="text-xs text-red-200">{{ errors.registerEmail }}</p>
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label for="registerPassword" class="text-xs font-medium text-[var(--ec-text-secondary)]">Password</label>
              <div class="relative">
                <input
                  id="registerPassword"
                  v-model="registerPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password"
                  :class="[
                    ui.fieldBase,
                    'pr-11',
                    errors.registerPassword
                      ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]'
                      : ''
                  ]"
                >
                <button
                  type="button"
                  class="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ec-text-muted)] transition hover:text-[var(--ec-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" class="h-[18px] w-[18px]">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M2.5 12C3.8 8 7.5 5.25 12 5.25S20.2 8 21.5 12c-1.3 4-5 6.75-9.5 6.75S3.8 16 2.5 12z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="h-[18px] w-[18px]">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.7 5.4A10.8 10.8 0 0112 5.25c4.5 0 8.2 2.75 9.5 6.75a11 11 0 01-3.3 4.8M6.5 8.3A10.7 10.7 0 002.5 12c1.3 4 5 6.75 9.5 6.75 1 0 2-.13 2.9-.4" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.registerPassword" class="text-xs text-red-200">{{ errors.registerPassword }}</p>
            </div>

            <div class="space-y-2">
              <label for="registerDepartment" class="text-xs font-medium text-[var(--ec-text-secondary)]">Department</label>
              <input
                id="registerDepartment"
                v-model="registerDepartment"
                type="text"
                placeholder="Computer Science"
                :class="[
                  ui.fieldBase,
                  errors.registerDepartment
                    ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]'
                    : ''
                ]"
              >
              <p v-if="errors.registerDepartment" class="text-xs text-red-200">{{ errors.registerDepartment }}</p>
            </div>

            <div class="space-y-2">
              <label for="registerInstitution" class="text-xs font-medium text-[var(--ec-text-secondary)]">Institution</label>
              <input
                id="registerInstitution"
                v-model="registerInstitution"
                type="text"
                placeholder="Dhaka College"
                :class="[
                  ui.fieldBase,
                  errors.registerInstitution
                    ? 'border-red-300/70 focus:border-red-300 focus:ring-[rgba(248,113,113,0.18)]'
                    : ''
                ]"
              >
              <p v-if="errors.registerInstitution" class="text-xs text-red-200">{{ errors.registerInstitution }}</p>
            </div>

            <button type="submit" :disabled="loading" :class="[ui.primaryButton, 'sm:col-span-2 w-full']">
              <span v-if="!loading" class="inline-flex items-center justify-center gap-2">
                Sign Up
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <span v-else class="inline-flex items-center justify-center gap-2">
                <svg class="h-4 w-4 animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z" />
                </svg>
                Creating account...
              </span>
            </button>

            <p class="sm:col-span-2 pt-1 text-center text-sm text-[var(--ec-text-secondary)]">
              Already have an account?
              <button
                type="button"
                class="ml-1 font-semibold text-[var(--ec-accent)] transition-colors hover:text-[var(--ec-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(87,198,166,0.35)]"
                @click="toggleMode"
              >
                Log In
              </button>
            </p>
          </form>

          <div
            v-if="apiError"
            class="mt-4 rounded-xl border border-red-300/30 bg-red-950/30 px-3 py-2 text-center text-sm text-red-200"
          >
            {{ apiError }}
          </div>

          <div
            v-if="apiSuccess"
            class="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-950/30 px-3 py-2 text-center text-sm text-emerald-200"
          >
            {{ apiSuccess }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { login, register, type UserRole } from '~/services/api/auth'

definePageMeta({
  layout: 'blank'
})

const router = useRouter()

const authCookieMaxAgeSeconds = 60 * 60 * 24 * 30

const setAuthCookies = (token: string) => {
  document.cookie = `educonnect_token=${encodeURIComponent(token)}; path=/; max-age=${authCookieMaxAgeSeconds}; samesite=lax`
  document.cookie = `educonnect_auth=true; path=/; max-age=${authCookieMaxAgeSeconds}; samesite=lax`
}

const checkAuth = () => {
  const token = localStorage.getItem('educonnect_token')
  if (token) {
    router.push('/home')
  }
}

onMounted(() => {
  checkAuth()
})

const email = ref('')
const password = ref('')
const authRole = ref<UserRole>('student')
const showPassword = ref(false)
const loading = ref(false)
const rememberMe = ref(false)

const isRegisterMode = ref(false)
const name = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerRole = ref<UserRole>('student')
const registerDepartment = ref('General')
const registerInstitution = ref('EduConnect')

const apiError = ref('')
const apiSuccess = ref('')

/**
 * Reusable UI token classes for Home/Login parity.
 * If reused elsewhere, move these into tailwind config/component utilities.
 */
const ui = {
  glassCard: 'rounded-[20px] border border-[var(--ec-card-border)] bg-[var(--ec-surface-card)] backdrop-blur-[12px] shadow-[var(--ec-card-shadow)]',
  featureCard: 'rounded-[20px] border border-[var(--ec-card-border)] bg-[var(--ec-surface-card)] p-5 backdrop-blur-[12px] shadow-[var(--ec-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ec-card-hover-border)]',
  featureIcon: 'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--ec-accent)_28%,transparent)] bg-[var(--ec-accent-soft-bg)] text-[var(--ec-accent)]',
  fieldBase: 'h-11 w-full rounded-[14px] border border-[var(--ec-input-border)] bg-[var(--ec-input-bg)] px-4 text-sm text-[var(--ec-text-primary)] placeholder:text-[var(--ec-placeholder)] transition focus:border-[var(--ec-input-focus-border)] focus:outline-none focus:ring-4 focus:ring-[var(--ec-input-focus-ring)]',
  primaryButton: 'h-12 rounded-[14px] bg-[var(--ec-accent)] px-4 text-sm font-semibold text-[var(--ec-accent-foreground)] transition duration-200 hover:bg-[var(--ec-accent-hover)] hover:shadow-[var(--ec-accent-hover-shadow)] disabled:cursor-not-allowed disabled:opacity-65',
}

type QuickAccessCard = {
  id: 'ai-tutor' | 'feed' | 'classroom'
  to: string
  badge: string
  title: string
  description: string
}

const quickAccessCards: QuickAccessCard[] = [
  {
    id: 'ai-tutor',
    to: '/ai-tutor',
    badge: ' AI Tutor',
    title: 'AI Tutor Assistance',
    description:
      'Get instant help with concepts, problem solving, and step-by-step explanations. Your personal AI tutor is available 24/7 to guide you through lessons and assignments.'
  },
  {
    id: 'feed',
    to: '/home',
    badge: ' Social Educational Feed',
    title: 'Educational Social Feed',
    description:
      'Discover learning posts, course updates, and trending academic discussions from teachers and students. Stay connected with a smart, education-focused community.'
  },
  {
    id: 'classroom',
    to: '/classroom',
    badge: ' Teacher’s Classroom',
    title: 'Interactive Classrooms',
    description:
      'Join private classrooms managed by teachers. Access notes, discussions, exams, and live classes in a structured digital learning environment.'
  }
]

const loginBackdropGradient = 'var(--ec-gradient-overlay)'

const errors = ref({
  email: '',
  password: '',
  name: '',
  registerEmail: '',
  registerPassword: '',
  registerDepartment: '',
  registerInstitution: ''
})

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  clearErrors()
  clearMessages()
}

const clearErrors = () => {
  errors.value = {
    email: '',
    password: '',
    name: '',
    registerEmail: '',
    registerPassword: '',
    registerDepartment: '',
    registerInstitution: ''
  }
}

const clearMessages = () => {
  apiError.value = ''
  apiSuccess.value = ''
}

const validateLoginForm = () => {
  clearErrors()
  let isValid = true

  if (!email.value) {
    errors.value.email = 'Email or username is required'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const validateRegisterForm = () => {
  clearErrors()
  let isValid = true

  if (!name.value) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!registerEmail.value) {
    errors.value.registerEmail = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value)) {
    errors.value.registerEmail = 'Please enter a valid email'
    isValid = false
  }

  if (!registerPassword.value) {
    errors.value.registerPassword = 'Password is required'
    isValid = false
  } else if (registerPassword.value.length < 6) {
    errors.value.registerPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!registerDepartment.value.trim()) {
    errors.value.registerDepartment = 'Department is required'
    isValid = false
  }

  if (!registerInstitution.value.trim()) {
    errors.value.registerInstitution = 'Institution is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLoginForm()) return

  loading.value = true
  clearMessages()

  const result = await login(email.value, password.value, authRole.value)

  if (result.success) {
    const token = result.token || result.data?.token

    if (token) {
      localStorage.setItem('educonnect_token', token)
      setAuthCookies(token)
    }

    const apiUser = result.data?.user
    const userData = {
      id: apiUser?.id ?? 0,
      role: apiUser?.role ?? authRole.value,
      email: apiUser?.email || email.value,
      name: apiUser?.name || email.value.split('@')[0] || 'User',
      displayName: apiUser?.name || email.value.split('@')[0] || 'User',
      username: apiUser?.username || (apiUser?.name || email.value).toLowerCase().replace(/\s+/g, ''),
      avatar: apiUser?.profilePicUrl || apiUser?.profile_pic_url || apiUser?.avatar,
      profilePicUrl: apiUser?.profilePicUrl || apiUser?.profile_pic_url,
      isProfilePublic:
        typeof apiUser?.isProfilePublic === 'boolean'
          ? apiUser.isProfilePublic
          : apiUser?.is_profile_public === true || apiUser?.is_profile_public === 'true' || apiUser?.is_profile_public === 1,
      department: apiUser?.department,
      institution: apiUser?.institution
    }

    localStorage.setItem('educonnect_user', JSON.stringify(userData))
    localStorage.setItem('educonnect_auth', 'true')

    loading.value = false
    router.push('/home')
  } else {
    loading.value = false
    apiError.value = result.error || 'Login failed. Please try again.'
  }
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return

  loading.value = true
  clearMessages()

  const result = await register(name.value, registerEmail.value, registerPassword.value, registerRole.value, {
    department: registerDepartment.value,
    institution: registerInstitution.value
  })

  if (result.success) {
    const token = result.token || result.data?.token

    if (token) {
      localStorage.setItem('educonnect_token', token)
      setAuthCookies(token)
    }

    const user = result.data?.user
    if (user) {
      localStorage.setItem('educonnect_user', JSON.stringify({
        ...user,
        displayName: user.name,
        avatar: user.profilePicUrl || user.avatar,
        profilePicUrl: user.profilePicUrl || user.avatar,
      }))
    }

    localStorage.setItem('educonnect_auth', 'true')

    loading.value = false
    apiSuccess.value = 'Account created successfully! Redirecting...'

    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } else {
    loading.value = false
    apiError.value = result.error || 'Registration failed. Please try again.'
  }
}
</script>
