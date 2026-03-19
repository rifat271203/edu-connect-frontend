<template>
  <div class="relative min-h-screen bg-[var(--ink)] text-[var(--t1)] flex overflow-x-hidden">
    <!-- Left Sidebar - Desktop -->
    <LayoutSidebar v-if="showDesktopSidebar" class="hidden lg:flex z-20" />
    
    <!-- Main Content Area -->
    <main :class="['relative z-10 w-full min-w-0 flex flex-col min-h-screen', showDesktopSidebar ? 'lg:pl-[220px]' : '']">
      <!-- Mobile Header -->
      <header v-if="!isAiTutorRoute" class="topbar lg:hidden sticky top-0 z-40">
        <div class="flex h-[60px] items-center justify-between px-4">
          <NuxtLink to="/home" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg border border-[rgba(196,164,100,0.38)] bg-[var(--surface2)] text-[var(--gold)] flex items-center justify-center transition-all duration-150 group-hover:border-[var(--gold)]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M4.5 6.5h7v4.5h-7zM12.5 8h7v4.5h-7zM7 13.5h7v4h-7z" />
              </svg>
            </div>
            <span class="font-semibold text-[18px] tracking-[-0.02em] text-[var(--t1)]">EduConnect</span>
          </NuxtLink>
          
          <div class="flex items-center gap-2">
            <button class="btn-ghost !h-9 !w-9 !p-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button v-if="!isGuest" @click="toggleMobileMenu" class="btn-ghost !h-9 !w-9 !p-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 flex min-h-0">
        <!-- Middle Content (Feed) -->
        <div class="flex-1 min-w-0 min-h-0 bg-[var(--ink)]">
          <slot />
        </div>
        
        <!-- Right Sidebar - Desktop (hidden on ai-tutor/messages pages) -->
        <LayoutRightSidebar v-if="showDesktopRightSidebar" class="hidden 2xl:block" />
      </div>
    </main>
    
    <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="!isGuest && showMobileMenu"
        class="fixed inset-0 z-50 lg:hidden"
        @click="toggleMobileMenu"
      >
        <div class="absolute inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm" />
        <LayoutSidebar 
          class="absolute left-0 top-0 bottom-0 w-[220px] animate-slide-up" 
          @navigate="toggleMobileMenu"
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
const isGuest = computed(() => !(userStore.isAuthenticated || hasCookieSession.value))
const guestAllowedPaths = new Set(['/login', '/home', '/ai-tutor'])
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
