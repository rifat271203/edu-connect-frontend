<template>
  <div class="h-screen w-full flex items-center justify-center bg-[var(--bg)] text-[var(--text)]" data-theme="dark">
    <div class="max-w-md w-full p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center shadow-xl">
      <div v-if="loading" class="space-y-6">
        <div class="w-16 h-16 mx-auto rounded-full border-4 border-[var(--border)] border-t-[var(--accent)] animate-spin"></div>
        <div>
          <h2 class="text-2xl font-bold mb-2">Authenticating</h2>
          <p class="text-[var(--text2)]">Please wait while we verify your Google account...</p>
        </div>
      </div>
      
      <div v-else-if="error" class="space-y-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <span class="material-symbols-outlined text-3xl">error</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-2">Authentication Failed</h2>
          <p class="text-[var(--text2)] mb-6">{{ error }}</p>
          <NuxtLink to="/loginV2" class="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] font-medium transition-transform active:scale-95">
            Return to Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const authError = route.query.error as string

  if (authError) {
    loading.value = false
    error.value = `Google returned an error: ${authError}`
    return
  }

  if (!code) {
    loading.value = false
    error.value = 'No authorization code received from Google.'
    return
  }

  try {
    const result = await userStore.loginWithGoogle(code, state)
    
    if (result.success) {
      const u = userStore.user
      if (result.isNewUser || !u?.role || !u?.institution) {
        await router.replace('/auth/setup-profile')
      } else {
        await router.replace('/home')
      }
    } else {
      loading.value = false
      error.value = result.message || 'Failed to authenticate with Google.'
    }
  } catch (err: any) {
    loading.value = false
    error.value = err?.message || 'An unexpected error occurred during authentication.'
  }
})
</script>

<style scoped lang="scss">
div[data-theme='dark'] {
  --bg: #09090b;
  --surface: #18181b;
  --border: rgba(255, 255, 255, 0.05);
  --text: #f8fafc;
  --text2: #94a3b8;
  --accent: #10b981;
  --btn-bg: #10b981;
  --btn-text: #ffffff;
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
