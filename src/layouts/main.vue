<template>
  <div class="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col">
    <!-- Desktop Header -->
    <LayoutHeader v-if="!isGuest" class="hidden md:flex" />

    <div class="flex flex-1 relative">
      <!-- Left Sidebar -->
      <LayoutSidebar v-if="showDesktopSidebar" class="hidden md:flex z-20" @logout="userStore.logout" />
      
      <!-- Main Content Area -->
      <main :class="['relative z-10 w-full min-w-0 flex flex-col min-h-screen flex-1 transition-all duration-300', showDesktopSidebar ? 'md:ml-72' : '', showDesktopRightSidebar ? 'lg:mr-80' : '']">
        <!-- Mobile Header (Existing) -->
        <header v-if="!isAiTutorRoute && !isGuest" class="sticky top-0 z-40 flex md:hidden justify-between items-center w-full px-6 py-3 border-b border-white/5 dark:bg-black/40 bg-white/60 backdrop-blur-xl">
          <NuxtLink to="/home" class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span class="material-symbols-rounded text-white font-bold text-lg">school</span>
            </div>
            <span class="text-lg font-extrabold tracking-tight dark:text-white text-slate-900">EduConnect</span>
          </NuxtLink>
          <button @click="toggleMobileMenu" class="w-9 h-9 flex items-center justify-center text-slate-500">
            <span class="material-symbols-rounded">menu</span>
          </button>
        </header>
        
        <!-- Page Content -->
        <div class="flex-1 p-4 md:p-8">
          <slot />
        </div>
      </main>

      <!-- Right Sidebar Hub -->
      <LayoutRightSidebar v-if="showDesktopRightSidebar" class="hidden lg:flex" />
    </div>
    
    <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="!isGuest && showMobileMenu"
        class="fixed inset-0 z-50 lg:hidden"
        @click="toggleMobileMenu"
      >
        <div class="absolute inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm" />
        <LayoutSidebar 
          class="absolute left-0 top-0 bottom-0 w-[240px] animate-slide-up" 
          @navigate="toggleMobileMenu"
          @logout="userStore.logout"
        />
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <LayoutMobileNav v-if="!isGuest && !isAiTutorRoute" class="lg:hidden" />

    <!-- First-login profile picture modal -->
      <div
        v-if="userStore.shouldShowProfilePicPrompt"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div class="relative w-full max-w-md card-theme p-6">
          <h2 class="text-[22px] font-bold tracking-[-0.02em] text-[var(--t1)]">Add a profile photo</h2>
          <p class="mt-2 text-sm text-[var(--t2)]">
            Upload a profile picture so classmates can recognize you.
          </p>

          <div class="mt-5 flex items-center gap-4">
            <div class="h-24 w-24 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface2)]">
              <img
                :src="profilePicPreviewUrl || userStore.user?.avatar"
                alt="Profile preview"
                class="h-full w-full object-cover"
              />
            </div>

          <div class="flex-1">
            <input
              ref="profilePicInputRef"
              type="file"
              class="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
              @change="onProfilePicSelected"
            />

            <UiButton variant="secondary" class="w-full" @click="openProfilePicPicker">
              Choose photo
            </UiButton>

            <button
              v-if="selectedProfilePicFile"
              type="button"
              class="mt-2 text-xs text-[var(--danger)] hover:opacity-80"
              @click="clearProfilePicSelection"
            >
              Remove selected photo
            </button>
          </div>
        </div>

        <p v-if="profilePicError" class="mt-3 text-sm text-[var(--danger)]">{{ profilePicError }}</p>

        <div class="mt-6 flex items-center justify-end gap-2">
          <UiButton variant="ghost" @click="skipProfilePicUpload">Skip</UiButton>
          <UiButton :disabled="!selectedProfilePicFile || uploadingProfilePic" @click="submitProfilePicture">
            {{ uploadingProfilePic ? 'Uploading...' : 'Save photo' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const showMobileMenu = ref(false)
const hasMounted = ref(false)
const userStore = useUserStore()

const profilePicInputRef = ref<HTMLInputElement | null>(null)
const selectedProfilePicFile = ref<File | null>(null)
const profilePicPreviewUrl = ref('')
const profilePicError = ref('')
const uploadingProfilePic = ref(false)

const revokeProfilePicPreview = () => {
  if (profilePicPreviewUrl.value) {
    URL.revokeObjectURL(profilePicPreviewUrl.value)
    profilePicPreviewUrl.value = ''
  }
}

const clearProfilePicSelection = () => {
  selectedProfilePicFile.value = null
  profilePicError.value = ''
  revokeProfilePicPreview()

  if (profilePicInputRef.value) {
    profilePicInputRef.value.value = ''
  }
}

const openProfilePicPicker = () => {
  profilePicInputRef.value?.click()
}

const onProfilePicSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  const maxBytes = 10 * 1024 * 1024

  if (!allowedTypes.has(file.type)) {
    profilePicError.value = 'Unsupported file type. Please upload JPG, PNG, WEBP, or GIF.'
    clearProfilePicSelection()
    return
  }

  if (file.size > maxBytes) {
    profilePicError.value = 'File is too large. Maximum size is 10MB.'
    clearProfilePicSelection()
    return
  }

  profilePicError.value = ''
  revokeProfilePicPreview()
  selectedProfilePicFile.value = file
  profilePicPreviewUrl.value = URL.createObjectURL(file)
}

const submitProfilePicture = async () => {
  if (!selectedProfilePicFile.value || uploadingProfilePic.value) return

  profilePicError.value = ''
  uploadingProfilePic.value = true

  const result = await userStore.uploadProfilePicture(selectedProfilePicFile.value)

  uploadingProfilePic.value = false

  if (!result.success) {
    profilePicError.value = result.error || 'Failed to upload profile picture'
    return
  }

  clearProfilePicSelection()
}

const skipProfilePicUpload = () => {
  userStore.skipProfilePicPrompt()
  clearProfilePicSelection()
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Close menu on route change
const route = useRoute()
const isAiTutorRoute = computed(() => route.path === '/ai-tutor')
const authCookie = useCookie<string | null>('educonnect_auth')
const tokenCookie = useCookie<string | null>('educonnect_token')
const hasCookieSession = computed(() => authCookie.value === 'true' && Boolean(tokenCookie.value))
const isGuest = computed(() => {
  const guest = !(userStore.isAuthenticated || hasCookieSession.value)
  console.log('MainLayout isGuest:', guest, 'isAuthenticated:', userStore.isAuthenticated, 'hasCookieSession:', hasCookieSession.value)
  return guest
})
const guestAllowedPaths = new Set(['/login', '/loginV2', '/signup', '/home', '/ai-tutor'])
const isProtectedRoute = computed(() => !guestAllowedPaths.has(route.path))
const showDesktopSidebar = computed(() => {
  if (isProtectedRoute.value) return true

  // Keep SSR/CSR first render consistent for guest-allowed routes (like /home)
  // unless we already have auth cookies available during SSR.
  if (!hasMounted.value && !hasCookieSession.value) {
    return false
  }

  return !isGuest.value
})
const showDesktopRightSidebar = computed(() =>
  showDesktopSidebar.value && route.path !== '/ai-tutor' && !route.path.startsWith('/messages')
)

watch(() => route.path, () => {
  showMobileMenu.value = false
})

watch(
  () => userStore.shouldShowProfilePicPrompt,
  (isOpen) => {
    if (!isOpen) {
      clearProfilePicSelection()
    }
  }
)

onBeforeUnmount(() => {
  revokeProfilePicPreview()
})

onMounted(() => {
  hasMounted.value = true
})
</script>
