import { useUserStore } from '~/stores/user'

const LAST_SYNC_KEY = 'educonnect_last_user_sync'
const SYNC_INTERVAL_MS = 2 * 60 * 1000

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client side
  if (process.server) {
    return
  }

  const guestAllowedPaths = new Set(['/login', '/home', '/ai-tutor'])

  // Initialize user store to load user data from localStorage
  const userStore = useUserStore()
  userStore.initAuth()

  // Check if user is authenticated
  const token = localStorage.getItem('educonnect_token')
  const isAuth = localStorage.getItem('educonnect_auth')

  // Allow guest routes when unauthenticated
  if ((!token || isAuth !== 'true') && guestAllowedPaths.has(to.path)) {
    return
  }

  // If not authenticated, redirect to login
  if (!token || isAuth !== 'true') {
    return navigateTo('/login')
  }

  if (!userStore.user) {
    await userStore.syncCurrentUser()
  } else {
    const now = Date.now()
    const lastSync = Number(sessionStorage.getItem(LAST_SYNC_KEY) || '0')

    if (now - lastSync > SYNC_INTERVAL_MS) {
      sessionStorage.setItem(LAST_SYNC_KEY, String(now))
      void userStore.syncCurrentUser()
    }
  }

  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
