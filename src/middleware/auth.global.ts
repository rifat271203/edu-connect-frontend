import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client side
  if (process.server) {
    return
  }
  
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }
  
  // Initialize user store to load user data from localStorage
  const userStore = useUserStore()
  userStore.initAuth()
  
  // Check if user is authenticated
  const token = localStorage.getItem('educonnect_token')
  const isAuth = localStorage.getItem('educonnect_auth')
  
  // If not authenticated, redirect to login
  if (!token || isAuth !== 'true') {
    return navigateTo('/login')
  }

  await userStore.syncCurrentUser()

  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
