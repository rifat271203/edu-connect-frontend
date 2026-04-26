<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-4" :data-theme="theme">
    <div class="max-w-md w-full p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl relative overflow-hidden">
      <!-- Background elements for styling -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      
      <div class="relative z-10">
        <!-- Theme toggle -->
        <button
          class="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center theme-toggle"
          type="button"
          title="Toggle Theme"
          @click="toggleTheme"
        >
          <span class="material-symbols-outlined text-sm">{{ themeIcon }}</span>
        </button>

        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
            <span class="material-symbols-outlined text-2xl">person_add</span>
          </div>
          <h2 class="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p class="text-[var(--text2)] text-sm">Please provide a few more details to set up your account.</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleCompleteSetup">
          <div class="space-y-2">
            <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1">Account type</label>
            <div class="relative">
              <select v-model="form.role" class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all appearance-none">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text3)]">expand_more</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1" for="department">Department</label>
            <input
              id="department"
              v-model.trim="form.department"
              class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
              placeholder="e.g. Computer Science"
              type="text"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-medium uppercase tracking-widest text-[var(--label)] ml-1" for="institution">Institution</label>
            <input
              id="institution"
              v-model.trim="form.institution"
              class="w-full h-11 px-4 input-base rounded-lg text-sm font-medium ring-0 focus:ring-0 transition-all placeholder:text-[var(--text3)]"
              placeholder="e.g. Dhaka University"
              type="text"
              required
            />
          </div>

          <button class="w-full h-12 mt-4 btn-primary font-medium text-sm rounded-lg shadow-lg flex items-center justify-center gap-2" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            <span>{{ isLoading ? 'Saving...' : 'Complete Setup' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank',
})

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
  ],
})

const AUTH_THEME_STORAGE_KEY = 'educonnect_auth_page_theme'
const router = useRouter()
const userStore = useUserStore()

const theme = ref<'dark' | 'light'>('light')
const isLoading = ref(false)

const form = reactive({
  role: 'student' as 'student' | 'teacher',
  department: '',
  institution: ''
})

const themeIcon = computed(() => (theme.value === 'dark' ? 'dark_mode' : 'light_mode'))

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

  // Pre-fill if we have preference in sessionStorage from the login page click
  const prefRole = sessionStorage.getItem('educonnect_auth_role_preference')
  if (prefRole === 'student' || prefRole === 'teacher') {
    form.role = prefRole
  }
})

const handleCompleteSetup = async () => {
  if (!form.department || !form.institution) {
    return
  }

  isLoading.value = true

  try {
    // Save to user store and localStorage
    userStore.updateProfileSetup(form.role, form.department, form.institution)
    
    // In the future, you'd want to call the backend here:
    // await apiRequest('/api/auth/profile', 'PATCH', form)

    await router.replace('/home')
  } catch (error) {
    console.error('Failed to complete setup', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
div[data-theme='dark'] {
  --bg: #09090b;
  --surface: #18181b;
  --surface2: #27272a;
  --border: rgba(255, 255, 255, 0.05);
  --text: #f8fafc;
  --text2: #94a3b8;
  --text3: #64748b;
  --accent: #10b981;
  --label: rgba(255, 255, 255, 0.5);
  --input-bg: #09090b;
  --input-border: rgba(255, 255, 255, 0.1);
  --input-focus: rgba(16, 185, 129, 0.35);
  --btn-bg: #10b981;
  --btn-text: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

div[data-theme='light'] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface2: #f1f5f9;
  --border: rgba(0, 0, 0, 0.05);
  --text: #0f172a;
  --text2: #475569;
  --text3: #94a3b8;
  --accent: #10b981;
  --label: rgba(15, 23, 42, 0.72);
  --input-bg: #f8fafc;
  --input-border: rgba(0, 0, 0, 0.1);
  --input-focus: rgba(16, 185, 129, 0.2);
  --btn-bg: #10b981;
  --btn-text: #ffffff;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
  outline: none;
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

.theme-toggle {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text2);
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: var(--text);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
