import { useUserStore } from '~/stores/user'

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

  await userStore.syncCurrentUser()

  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
