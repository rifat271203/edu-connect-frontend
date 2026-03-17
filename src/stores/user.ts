import { defineStore } from 'pinia'
import { getCurrentUser, login, register, logout, type UserRole } from '~/services/api/auth'
import { uploadProfilePicture as uploadProfilePictureApi } from '~/services/api/social'

const getProfilePicSkipStorageKey = (userId: string | number) => `educonnect_profile_pic_prompt_skipped_${String(userId)}`

interface User {
  id: string | number
  role?: UserRole
  username?: string
  displayName?: string
  name?: string
  email: string
  avatar?: string
  profilePicUrl?: string
  isProfilePublic?: boolean
  department?: string
  institution?: string
  coverImage?: string
  bio?: string
  followers?: number
  following?: number
  isOnline?: boolean
  createdAt?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  token: string | null
  showProfilePicModal: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    token: null,
    showProfilePicModal: false,
  }),
  
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    shouldShowProfilePicPrompt: (state) => state.showProfilePicModal,
  },
  
  actions: {
    persistSession() {
      if (this.token) {
        localStorage.setItem('educonnect_token', this.token)
      }

      if (this.user) {
        localStorage.setItem('educonnect_user', JSON.stringify(this.user))
      }

      localStorage.setItem('educonnect_auth', this.isAuthenticated ? 'true' : 'false')
    },

    clearSession() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.showProfilePicModal = false

      localStorage.removeItem('educonnect_token')
      localStorage.removeItem('educonnect_user')
      localStorage.removeItem('educonnect_auth')
    },

    // Initialize auth state from localStorage
    initAuth() {
      const token = localStorage.getItem('educonnect_token')
      const userStr = localStorage.getItem('educonnect_user')
      const isAuth = localStorage.getItem('educonnect_auth')
      
      if (token && isAuth) {
        this.token = token
        this.isAuthenticated = true
        if (userStr) {
          try {
            this.user = JSON.parse(userStr)
          } catch (e) {
            console.error('Failed to parse user data', e)
            this.clearSession()
          }
        }
      }
    },

    async syncCurrentUser() {
      if (!this.token) return

      const result = await getCurrentUser()
      if (!result.success || !result.data) {
        if (result.status === 401) {
          this.clearSession()
        }
        return
      }

      this.user = {
        ...this.user,
        ...result.data,
        displayName: result.data.name,
        avatar: result.data.profilePicUrl || result.data.avatar || this.user?.avatar,
        profilePicUrl: result.data.profilePicUrl || this.user?.profilePicUrl,
        isProfilePublic:
          result.data.isProfilePublic ??
          this.user?.isProfilePublic,
      }
      this.isAuthenticated = true
      this.persistSession()
      this.evaluateProfilePicPrompt()
    },

    evaluateProfilePicPrompt() {
      if (!process.client || !this.user) {
        this.showProfilePicModal = false
        return
      }

      if (this.user.profilePicUrl) {
        this.showProfilePicModal = false
        return
      }

      const skipKey = getProfilePicSkipStorageKey(this.user.id)
      this.showProfilePicModal = localStorage.getItem(skipKey) !== 'true'
    },

    skipProfilePicPrompt() {
      if (process.client && this.user) {
        localStorage.setItem(getProfilePicSkipStorageKey(this.user.id), 'true')
      }

      this.showProfilePicModal = false
    },

    async uploadProfilePicture(file: File) {
      const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
      const maxBytes = 10 * 1024 * 1024

      if (!allowedTypes.has(file.type)) {
        return { success: false, error: 'Unsupported file type. Please upload JPG, PNG, WEBP, or GIF.' }
      }

      if (file.size > maxBytes) {
        return { success: false, error: 'File is too large. Maximum size is 10MB.' }
      }

      const result = await uploadProfilePictureApi(file)
      if (!result.success || !result.data?.profilePicUrl) {
        return { success: false, error: result.error || 'Failed to upload profile picture' }
      }

      if (this.user) {
        this.user = {
          ...this.user,
          avatar: result.data.profilePicUrl,
          profilePicUrl: result.data.profilePicUrl,
        }

        if (process.client) {
          localStorage.removeItem(getProfilePicSkipStorageKey(this.user.id))
        }
      }

      this.showProfilePicModal = false
      this.persistSession()

      return { success: true }
    },
    
    // Login function - uses auth service
    async login(email: string, password: string, role: UserRole = 'student') {
      this.loading = true
      
      const result = await login(email, password, role)
      
      if (result.success && result.data) {
        const userData: User = {
          id: result.data.user.id,
          role: result.data.user.role,
          email: result.data.user.email,
          name: result.data.user.name,
          displayName: result.data.user.name,
          username: result.data.user.username,
          avatar: result.data.user.profilePicUrl || result.data.user.avatar,
          profilePicUrl: result.data.user.profilePicUrl,
          isProfilePublic: result.data.user.isProfilePublic,
          department: result.data.user.department,
          institution: result.data.user.institution,
        }

        this.token = result.data.token
        this.user = userData
        this.isAuthenticated = true
        this.persistSession()
        this.evaluateProfilePicPrompt()
        
        this.loading = false
        return { success: true }
      } else {
        this.loading = false
        return { success: false, message: result.error || 'Login failed' }
      }
    },
    
    // Register function - uses auth service
    async registerUser(
      name: string,
      email: string,
      password: string,
      role: UserRole = 'student',
      department?: string,
      institution?: string,
    ) {
      this.loading = true
      
      const result = await register(name, email, password, role, {
        department,
        institution,
      })
      
      if (result.success && result.data) {
        this.token = result.data.token

        this.user = {
          id: result.data.user.id,
          role: result.data.user.role,
          email: result.data.user.email,
          name: result.data.user.name,
          displayName: result.data.user.name,
          username: result.data.user.username,
          avatar: result.data.user.profilePicUrl || result.data.user.avatar,
          profilePicUrl: result.data.user.profilePicUrl,
          isProfilePublic: result.data.user.isProfilePublic,
          department: result.data.user.department,
          institution: result.data.user.institution,
        }

        this.isAuthenticated = true
        this.persistSession()
        this.evaluateProfilePicPrompt()
        
        this.loading = false
        return { success: true }
      } else {
        this.loading = false
        return { success: false, message: result.error || 'Registration failed' }
      }
    },
    
    // Logout function
    logout() {
      this.clearSession()
      
      logout().catch(console.error)
      
      navigateTo('/login')
    },
    
    // Check for persisted session
    checkAuth() {
      this.initAuth()
    }
  }
})
