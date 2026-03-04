<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
    <!-- Left Sidebar - Desktop -->
    <LayoutSidebar class="hidden lg:flex" />
    
    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col lg:ml-64">
      <!-- Mobile Header -->
      <header class="topbar lg:hidden sticky top-0 z-40 backdrop-blur-lg">
        <div class="flex items-center justify-between px-4 py-3">
          <NuxtLink to="/home" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center shadow-[var(--shadow-sm)] transition-all duration-150 group-hover:bg-[var(--primary-hover)]">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-lg font-semibold text-[var(--text)]">EduConnect</span>
          </NuxtLink>
          
          <div class="flex items-center gap-2">
            <button class="btn-ghost !h-10 !w-10 !p-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button @click="toggleMobileMenu" class="btn-ghost !h-10 !w-10 !p-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 flex">
        <!-- Middle Content (Feed) -->
        <div class="flex-1 min-w-0">
          <slot />
        </div>
        
        <!-- Right Sidebar - Desktop (hidden on ai-tutor/messages pages) -->
        <LayoutRightSidebar v-if="route.path !== '/ai-tutor' && !route.path.startsWith('/messages')" class="hidden xl:block" />
      </div>
    </main>
    
    <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="showMobileMenu"
        class="fixed inset-0 z-50 lg:hidden"
        @click="toggleMobileMenu"
      >
        <div class="absolute inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm" />
        <LayoutSidebar 
          class="absolute left-0 top-0 bottom-0 w-64 animate-slide-up" 
          @navigate="toggleMobileMenu"
        />
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <LayoutMobileNav class="lg:hidden" />

    <!-- First-login profile picture modal -->
    <div
      v-if="userStore.shouldShowProfilePicPrompt"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div class="relative w-full max-w-md card-theme p-6">
        <h2 class="text-xl font-semibold text-[var(--text)]">Add a profile photo</h2>
        <p class="mt-2 text-sm text-[var(--text-2)]">
          Upload a profile picture so classmates can recognize you.
        </p>

        <div class="mt-5 flex items-center gap-4">
          <div class="h-24 w-24 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <img
              :src="profilePicPreviewUrl || userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.name || 'user'}`"
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
</script>
