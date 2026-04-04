<template>
  <div class="login-v2-page">
    <div class="bg-mesh" aria-hidden="true"></div>

    <div class="page-wrap">
      <main class="login-shell">
        <section class="brand-panel" aria-label="EduConnect brand">
          <div class="brand-content">
            <div class="brand-row">
              <div class="brand-icon">EC</div>
              <span class="brand-name">EduConnect</span>
            </div>

            <span class="feature-pill">Academic Excellence</span>

            <h1>Ready to<br /><em>get started?</em></h1>

            <p>
              Join thousands of students and teachers unlocking their full potential through our world-class
              educational ecosystem.
            </p>

            <ul class="perks" role="list">
              <li><div class="perk-icon c1">✦</div>Free to join</li>
              <li><div class="perk-icon c2">🔒</div>End-to-end encrypted</li>
              <li><div class="perk-icon c3">⬡</div>Classroom ready</li>
              <li><div class="perk-icon c4">◎</div>AI Tutor</li>
              <li><div class="perk-icon c5">▣</div>Works on any device</li>
            </ul>
          </div>

          <div class="stats-row" role="list">
            <div class="stat-item" role="listitem">
              <strong>48K+</strong>
              <span>Active Students</span>
            </div>
            <div class="stat-item" role="listitem">
              <strong>3K+</strong>
              <span>Expert Tutors</span>
            </div>
            <div class="stat-item" role="listitem">
              <strong>99%</strong>
              <span>Satisfaction</span>
            </div>
          </div>
        </section>

        <section class="form-panel" aria-label="Sign in form">
          <div class="mobile-brand" aria-hidden="true">
            <div class="brand-icon">EC</div>
            <span class="brand-name">EduConnect</span>
          </div>

          <div class="auth-card" role="main">
            <div class="auth-head">
              <h2>Welcome back</h2>
              <p>Please enter your details to access your account.</p>
            </div>

            <form class="auth-form" @submit.prevent="handleLogin" novalidate>
              <div class="field-group">
                <label class="field-label" for="accountType">Account Type</label>
                <div class="select-wrap">
                  <select id="accountType" v-model="loginRole" name="role" aria-label="Account type">
                    <option value="student">Student</option>
                    <option value="teacher">Faculty / Teacher</option>
                  </select>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label" for="loginEmail">Email Address</label>
                <div class="input-wrap">
                  <input
                    id="loginEmail"
                    v-model.trim="loginEmail"
                    type="email"
                    name="email"
                    autocomplete="email"
                    placeholder="name@educonnect.com"
                    :class="{ 'is-error': Boolean(loginErrors.email) }"
                    aria-describedby="emailError"
                    required
                    @input="clearFieldError('email')"
                  />
                </div>
                <span v-if="loginErrors.email" id="emailError" class="field-error" role="alert">{{ loginErrors.email }}</span>
              </div>

              <div class="field-group">
                <div class="field-label">
                  <label for="loginPassword">Password</label>
                  <button type="button" class="inline" @click="void 0">Forgot password?</button>
                </div>
                <div class="input-wrap">
                  <input
                    id="loginPassword"
                    v-model="loginPassword"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    class="pw-input"
                    autocomplete="current-password"
                    placeholder="Enter your password"
                    :class="{ 'is-error': Boolean(loginErrors.password) }"
                    aria-describedby="passwordError"
                    required
                    @input="clearFieldError('password')"
                  />
                  <button type="button" class="pw-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <span
                  v-if="loginErrors.password"
                  id="passwordError"
                  class="field-error"
                  role="alert"
                >{{ loginErrors.password }}</span>
              </div>

              <label class="remember-row" for="rememberMe">
                <input id="rememberMe" v-model="rememberMe" type="checkbox" name="remember" />
                <div class="custom-check" aria-hidden="true"></div>
                <span class="remember-label">Stay signed in for 30 days</span>
              </label>

              <button type="submit" class="signin-btn" :disabled="isLoading">{{ isLoading ? 'Signing in...' : 'Sign In' }}</button>

              <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>

              <div class="divider">or continue with</div>

              <div class="social-row">
                <button type="button" class="social-btn" aria-label="Continue with Google">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" class="social-btn" aria-label="Continue with Microsoft">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 2h-9v9h9V2z" fill="#F25022"/>
                    <path d="M21.5 2h-9v9h9V2z" fill="#7FBA00"/>
                    <path d="M11.5 13h-9v9h9v-9z" fill="#00A4EF"/>
                    <path d="M21.5 13h-9v9h9v-9z" fill="#FFB900"/>
                  </svg>
                  Microsoft
                </button>
              </div>

              <p class="register-text">New here? <button type="button">Create account</button></p>
            </form>
          </div>
        </section>
      </main>

      <footer class="login-footer">
        <span>© 2026 EduConnect. Empowering the next generation of scholars.</span>
        <nav aria-label="Footer links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UserRole } from '~/services/api/auth'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'blank' })

type LoginField = 'email' | 'password'

const userStore = useUserStore()

const loginRole = ref<UserRole>('student')
const loginEmail = ref('')
const loginPassword = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const loginErrors = reactive<Record<LoginField, string>>({
  email: '',
  password: '',
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const clearFieldError = (field: LoginField): void => {
  loginErrors[field] = ''
  errorMessage.value = ''
}

const validate = (): boolean => {
  let valid = true

  if (!loginEmail.value.trim()) {
    loginErrors.email = 'Email is required.'
    valid = false
  } else if (!emailRegex.test(loginEmail.value.trim())) {
    loginErrors.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!loginPassword.value) {
    loginErrors.password = 'Password is required.'
    valid = false
  } else if (loginPassword.value.length < 6) {
    loginErrors.password = 'Password must be at least 6 characters.'
    valid = false
  }

  return valid
}

const handleLogin = async (): Promise<void> => {
  errorMessage.value = ''
  loginErrors.email = ''
  loginErrors.password = ''

  if (!validate()) return

  isLoading.value = true
  const response = await userStore.login(loginEmail.value.trim(), loginPassword.value, loginRole.value)
  isLoading.value = false

  if (!response.success) {
    errorMessage.value = response.message || 'Invalid credentials. Please check your email and password.'
    return
  }

  if (!rememberMe.value && process.client) {
    localStorage.removeItem('educonnect_token')
    localStorage.removeItem('educonnect_user')
    localStorage.removeItem('educonnect_auth')
    sessionStorage.setItem('educonnect_auth', 'true')
  }

  await navigateTo('/home')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Syne:wght@600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cyan: #81ecff;
  --cyan-dim: rgba(129,236,255,0.18);
  --cyan-glow: rgba(129,236,255,0.28);
  --purple: #9093ff;
  --bg: #0b0e14;
  --card-bg: rgba(17,25,40,0.82);
  --border: rgba(255,255,255,0.10);
  --text: #ecedf6;
  --muted: rgba(236,237,246,0.60);
  --error: #ff908d;
  --radius-pill: 999px;
  --radius-card: 20px;
  --transition: 0.22s cubic-bezier(.4,0,.2,1);
}

html, body { height: 100%; }

.login-v2-page {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.login-v2-page::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.35;
}

.bg-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 55% at 5% 8%, rgba(0,227,253,0.13) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 95% 5%, rgba(144,147,255,0.15) 0%, transparent 58%),
    radial-gradient(ellipse 50% 60% at 90% 95%, rgba(236,99,255,0.07) 0%, transparent 55%),
    radial-gradient(ellipse 40% 40% at 10% 90%, rgba(0,227,253,0.06) 0%, transparent 50%);
}

.page-wrap {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.login-shell {
  flex: 1;
  display: flex;
}

.brand-panel {
  width: 52%;
  padding: 52px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(129,236,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(129,236,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 40% 40%, black 40%, transparent 100%);
}

.brand-panel::after {
  content: '';
  position: absolute;
  width: 480px;
  height: 480px;
  top: -120px;
  right: -160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(144,147,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 11px;
  animation: fadeUp 0.6s both;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--cyan), var(--purple));
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  color: #003840;
  box-shadow: 0 0 20px var(--cyan-glow);
}

.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, var(--cyan) 20%, var(--purple));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.feature-pill {
  margin-top: 36px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: rgba(15,19,28,0.80);
  border: 1px solid rgba(0,212,236,0.25);
  color: #00d4ec;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  animation: fadeUp 0.6s 0.1s both;
}

.feature-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00d4ec;
  box-shadow: 0 0 8px #00d4ec;
}

.brand-content h1 {
  margin: 22px 0 18px;
  font-family: 'Syne', sans-serif;
  font-size: clamp(46px, 5.5vw, 82px);
  line-height: 0.92;
  letter-spacing: -0.055em;
  animation: fadeUp 0.6s 0.15s both;
}

.brand-content h1 em {
  font-style: normal;
  color: var(--cyan);
}

.brand-content p {
  max-width: 420px;
  color: var(--muted);
  line-height: 1.75;
  font-size: 15px;
  animation: fadeUp 0.6s 0.2s both;
}

.perks {
  list-style: none;
  margin-top: 32px;
  display: grid;
  gap: 13px;
  animation: fadeUp 0.6s 0.25s both;
}

.perks li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(236,237,246,0.85);
}

.perk-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 13px;
  flex-shrink: 0;
}

.perk-icon.c1 { background: rgba(0,212,236,0.12); color: #00d4ec; border: 1px solid rgba(0,212,236,0.2); }
.perk-icon.c2 { background: rgba(144,147,255,0.12); color: #9093ff; border: 1px solid rgba(144,147,255,0.2); }
.perk-icon.c3 { background: rgba(236,99,255,0.10); color: #ec63ff; border: 1px solid rgba(236,99,255,0.18); }
.perk-icon.c4 { background: rgba(129,236,255,0.12); color: var(--cyan); border: 1px solid var(--cyan-dim); }
.perk-icon.c5 { background: rgba(144,147,255,0.12); color: #a5a8ff; border: 1px solid rgba(144,147,255,0.2); }

.stats-row {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0;
  padding-top: 30px;
  border-top: 1px solid rgba(69,72,79,0.28);
  animation: fadeUp 0.6s 0.3s both;
}

.stat-item {
  flex: 1;
  padding-right: 24px;
  border-right: 1px solid rgba(69,72,79,0.22);
}

.stat-item:last-child {
  border-right: none;
  padding-right: 0;
  padding-left: 24px;
}

.stat-item:nth-child(2) {
  padding-left: 24px;
}

.stat-item strong {
  display: block;
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #fff;
}

.stat-item span {
  text-transform: uppercase;
  letter-spacing: 0.13em;
  font-size: 10px;
  color: var(--muted);
  margin-top: 2px;
  display: block;
}

.form-panel {
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 40px;
  position: relative;
}

.form-panel::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12%;
  bottom: 12%;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(129,236,255,0.2) 40%, rgba(129,236,255,0.2) 60%, transparent);
}

.auth-card {
  width: min(460px, 100%);
  border-radius: var(--radius-card);
  padding: 40px 38px;
  background: var(--card-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  box-shadow:
    0 24px 60px rgba(0,0,0,0.4),
    0 0 0 1px rgba(129,236,255,0.04) inset,
    0 1px 0 rgba(255,255,255,0.08) inset;
  animation: fadeUp 0.5s 0.05s both;
}

.auth-head {
  margin-bottom: 28px;
}

.auth-head h2 {
  font-family: 'Syne', sans-serif;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  line-height: 1.1;
}

.auth-head p {
  margin-top: 7px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.auth-form {
  display: grid;
  gap: 16px;
}

.field-group {
  display: grid;
  gap: 7px;
}

.field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(236,237,246,0.65);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
}

.field-label a,
.field-label button.inline {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cyan);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: none;
  font-weight: 500;
  transition: opacity var(--transition);
}

.field-label a:hover,
.field-label button.inline:hover {
  opacity: 0.75;
}

.input-wrap {
  position: relative;
}

.input-wrap input,
.auth-form select {
  width: 100%;
  height: 50px;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-pill);
  padding: 0 18px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  outline: none;
}

.input-wrap input::placeholder {
  color: rgba(236,237,246,0.30);
}

.input-wrap input:hover,
.auth-form select:hover {
  border-color: rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.55);
}

.input-wrap input:focus,
.auth-form select:focus {
  border-color: rgba(129,236,255,0.65);
  box-shadow: 0 0 0 3px rgba(129,236,255,0.12);
  background: rgba(0,0,0,0.60);
}

.input-wrap input.is-error {
  border-color: rgba(255,113,108,0.7);
}

.input-wrap input.is-error:focus {
  box-shadow: 0 0 0 3px rgba(255,113,108,0.14);
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  padding-right: 42px;
  cursor: pointer;
}

.select-wrap::after {
  content: '';
  position: absolute;
  right: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid var(--cyan);
  pointer-events: none;
}

.pw-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--cyan-dim);
  border: none;
  border-radius: var(--radius-pill);
  color: var(--cyan);
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  padding: 6px 14px;
  cursor: pointer;
  transition: background var(--transition);
  letter-spacing: 0.02em;
}

.pw-toggle:hover {
  background: rgba(129,236,255,0.28);
}

.pw-input {
  padding-right: 78px !important;
}

.field-error {
  color: var(--error);
  font-size: 11px;
  padding-left: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.field-error::before {
  content: '!';
  font-weight: 700;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.custom-check {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.4);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all var(--transition);
  position: relative;
}

.remember-row input[type=checkbox] {
  display: none;
}

.remember-row input[type=checkbox]:checked + .custom-check {
  background: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 10px var(--cyan-glow);
}

.remember-row input[type=checkbox]:checked + .custom-check::after {
  content: '';
  width: 5px;
  height: 9px;
  border-right: 2px solid #003840;
  border-bottom: 2px solid #003840;
  transform: rotate(45deg) translate(-1px, -1px);
}

.remember-label {
  color: var(--muted);
  font-size: 13px;
  user-select: none;
}

.signin-btn {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--cyan) 0%, #50d8ef 100%);
  color: #003840;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), opacity var(--transition);
  box-shadow: 0 0 28px rgba(129,236,255,0.28), 0 4px 14px rgba(0,0,0,0.3);
}

.signin-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
}

.signin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 38px rgba(129,236,255,0.42), 0 8px 20px rgba(0,0,0,0.35);
}

.signin-btn:active:not(:disabled) {
  transform: translateY(0);
}

.signin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  background: rgba(255,113,108,0.10);
  border: 1px solid rgba(255,113,108,0.25);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--error);
  font-size: 13px;
  line-height: 1.5;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(236,237,246,0.35);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.07);
}

.social-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.social-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,0.04);
  color: rgba(236,237,246,0.88);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), transform var(--transition);
}

.social-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.16);
  transform: translateY(-1px);
}

.social-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.register-text {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}

.register-text button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cyan);
  font-size: 13px;
  font-weight: 600;
  transition: opacity var(--transition);
}

.register-text button:hover {
  opacity: 0.75;
}

.login-footer {
  position: relative;
  z-index: 1;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(69,72,79,0.22);
  background: rgba(0,0,0,0.3);
  color: rgba(236,237,246,0.45);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-footer nav {
  display: flex;
  gap: 20px;
}

.login-footer a {
  color: rgba(236,237,246,0.5);
  text-decoration: none;
  transition: color var(--transition);
}

.login-footer a:hover {
  color: var(--cyan);
}

.mobile-brand {
  display: none;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1080px) {
  .login-shell {
    flex-direction: column;
  }

  .brand-panel,
  .form-panel {
    width: 100%;
  }

  .brand-panel {
    min-height: 44vh;
    padding: 36px 28px;
  }

  .form-panel {
    padding: 24px 20px;
  }

  .form-panel::before {
    display: none;
  }

  .auth-card {
    padding: 28px 24px;
  }

  .auth-head h2 {
    font-size: 28px;
  }
}

@media (max-width: 720px) {
  .brand-panel {
    display: none;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-bottom: 16px;
  }

  .form-panel {
    padding-top: 44px;
    align-items: flex-start;
  }

  .auth-card {
    width: 100%;
  }

  .login-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
