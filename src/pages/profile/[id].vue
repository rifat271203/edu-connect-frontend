<template>
  <div class="max-w-4xl mx-auto p-4 pb-24 lg:pb-12 animate-fadeInUp">
    <!-- Header Navigation -->
    <div class="mb-8 flex items-center justify-between">
      <UiButton variant="ghost" class="group flex items-center gap-2 hover:bg-[var(--secondary)] transition-all" @click="goBackToHome">
        <span class="material-symbols-rounded text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span class="font-bold text-sm">Back to Home</span>
      </UiButton>
      
      <div v-if="publicProfile && !isOwnProfile" class="flex gap-3">
        <UiButton
          variant="primary"
          class="rounded-xl font-bold text-xs"
          :loading="sendingRequest"
          :disabled="sendingRequest || friendRequestSent || isAlreadyFriend"
          @click="handleAddBro"
        >
          <span class="material-symbols-rounded text-sm mr-1.5">{{ isAlreadyFriend ? 'verified' : (friendRequestSent ? 'pending' : 'person_add') }}</span>
          {{ friendActionLabel }}
        </UiButton>
        <UiButton variant="secondary" size="sm" class="h-10 w-10 p-0 rounded-xl">
          <span class="material-symbols-rounded text-lg">more_horiz</span>
        </UiButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)]">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="h-32 w-32 md:h-40 md:w-40 rounded-[2.2rem] skeleton shrink-0 mx-auto md:mx-0"></div>
          <div class="flex-1 space-y-4 py-2">
            <div class="w-1/3 h-10 rounded-lg skeleton"></div>
            <div class="w-1/4 h-4 rounded-md skeleton"></div>
            <div class="w-full h-24 rounded-2xl skeleton mt-6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="publicProfile">
      <div class="space-y-8">
        <!-- Error/Success Messages -->
        <transition name="fade">
          <div v-if="errorMessage || successMessage" class="mb-4">
            <div v-if="errorMessage" class="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs font-bold">
              <span class="material-symbols-rounded text-sm">error</span>
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="flex items-center gap-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] p-3 text-[var(--accent)] text-xs font-bold">
              <span class="material-symbols-rounded text-sm">check_circle</span>
              {{ successMessage }}
            </div>
          </div>
        </transition>

        <!-- Profile Hero Section -->
        <div class="relative overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 md:p-10 shadow-[var(--shadow-lg)]">
          <!-- Subtle Background Decoration -->
          <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)] opacity-[0.03] blur-[100px]"></div>
          <div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--accent)] opacity-[0.02] blur-[100px]"></div>

          <div class="relative flex flex-col md:flex-row gap-10 lg:gap-14">
            <!-- Left: Profile Picture -->
            <div class="flex flex-col items-center shrink-0">
              <div class="relative group">
                <div class="absolute -inset-1.5 rounded-[2.8rem] bg-gradient-to-tr from-[var(--accent)] to-transparent blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <UiAvatar
                  :src="publicProfile.profile.profilePicUrl"
                  :name="publicProfile.profile.name"
                  rounded="rounded-[2.2rem]"
                  class="h-32 w-32 md:h-44 md:w-44 border-4 border-[var(--surface2)] shadow-[var(--shadow-md)]"
                />
                <div v-if="isAlreadyFriend" class="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[var(--shadow-md)] border-4 border-[var(--surface)]">
                  <span class="material-symbols-rounded text-base font-black">verified</span>
                </div>
              </div>
              
              <div class="mt-8 flex flex-col items-center md:items-start w-full gap-2">
                <div class="flex gap-3 w-full">
                  <div class="flex-1 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] p-4 text-center">
                    <p class="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest mb-1">Posts</p>
                    <p class="text-2xl font-black text-[var(--t1)]">{{ publicProfile.stats.postCount }}</p>
                  </div>
                  <div class="flex-1 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] p-4 text-center">
                    <p class="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest mb-1">Bros</p>
                    <p class="text-2xl font-black text-[var(--t1)]">{{ publicProfile.stats.friendCount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Details & Bio -->
            <div class="flex-1 min-w-0 flex flex-col pt-2">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 class="text-3xl md:text-5xl font-black tracking-tight text-[var(--t1)] mb-2">
                    {{ publicProfile.profile.name }}
                  </h1>
                  <div class="flex items-center gap-3">
                    <span class="text-base font-bold text-[var(--accent)]">@{{ publicHandle }}</span>
                    <span class="badge badge-accent">
                      {{ publicProfile.profile.role || 'Scholar' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Professional Meta Details -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div class="flex items-center gap-4 group">
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-[var(--accent)] group-hover:border-[var(--accent-border)] group-hover:bg-[var(--accent-subtle)] transition-all">
                    <span class="material-symbols-rounded text-xl">apartment</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.15em]">Institution</p>
                    <p class="text-base font-bold text-[var(--t1)] truncate">{{ publicProfile.profile.institution || 'EduConnect' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 group">
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-[var(--accent)] group-hover:border-[var(--accent-border)] group-hover:bg-[var(--accent-subtle)] transition-all">
                    <span class="material-symbols-rounded text-xl">school</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.15em]">Department</p>
                    <p class="text-base font-bold text-[var(--t1)] truncate">{{ publicProfile.profile.department || 'General Science' }}</p>
                  </div>
                </div>
              </div>

              <!-- Bio Section -->
              <div class="mt-auto pt-8 border-t border-[var(--line)]">
                <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.25em] mb-4">Professional Bio</h3>
                <p class="text-[15px] leading-relaxed text-[var(--t2)] font-medium italic">
                  "{{ publicProfile.profile.role === 'teacher' ? 'Experienced mentor' : 'Dedicated scholar' }} 
                  specializing in {{ publicProfile.profile.department || 'their field' }}. 
                  Passionate about collaborative learning and research within the {{ publicProfile.profile.institution || 'EduConnect' }} community."
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="mt-12 flex items-center justify-between border-b border-[var(--line)] px-4">
          <div class="flex gap-10">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="relative pb-5 text-sm font-bold transition-all"
              :class="activeTab === tab ? 'text-[var(--accent)]' : 'text-[var(--t3)] hover:text-[var(--t1)]'"
              @click="activeTab = tab"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-rounded text-[20px]">{{ tab === 'Posts' ? 'grid_view' : 'info' }}</span>
                {{ tab }}
              </div>
              <transition name="scale-in">
                <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--accent)] shadow-[0_-4px_12px_var(--accent-ring)]"></div>
              </transition>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="py-8">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeTab === 'Posts'" :key="'posts'" class="grid grid-cols-1 gap-8">
              <FeedPostCard
                v-for="post in publicProfile.recentPosts"
                :key="`public-${post.id}`"
                :post="post"
              />

              <div v-if="publicProfile.recentPosts.length === 0" class="flex flex-col items-center justify-center py-24 rounded-[2rem] border-2 border-dashed border-[var(--line)] bg-[var(--surface2)]">
                <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--surface)] text-[var(--t4)] mb-6 shadow-[var(--shadow-sm)]">
                  <span class="material-symbols-rounded text-4xl">post_add</span>
                </div>
                <h3 class="text-base font-bold text-[var(--t2)]">No public posts yet</h3>
                <p class="text-sm text-[var(--t3)] mt-2">When this user shares updates, they will appear here.</p>
              </div>
            </div>

            <div v-else-if="activeTab === 'About'" :key="'about'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)]">
                <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-6">Account Information</h3>
                <div class="space-y-6">
                  <div v-for="(label, key) in { 'Email': publicProfile.profile.email || 'Hidden', 'Role': publicProfile.profile.role || 'Member', 'Joined': formatDate(publicProfile.profile.createdAt) }" :key="key">
                    <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-wider mb-2">{{ key }}</p>
                    <p class="text-[15px] font-bold text-[var(--t1)]">{{ label }}</p>
                  </div>
                </div>
              </div>
              
              <div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)]">
                <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-6">Connection Status</h3>
                <div class="flex flex-col items-center justify-center py-6">
                  <div class="h-24 w-24 rounded-full bg-[var(--accent-dim)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] mb-6 animate-pulse-glow">
                    <span class="material-symbols-rounded text-4xl">{{ isAlreadyFriend ? 'handshake' : (friendRequestSent ? 'schedule' : 'person_add') }}</span>
                  </div>
                  <p class="text-lg font-black text-[var(--t1)]">{{ connectionLabel }}</p>
                  <p class="text-sm text-[var(--t3)] text-center mt-3 max-w-[240px] leading-relaxed">
                    {{ isAlreadyFriend ? 'You are successfully connected as bros on EduConnect.' : (friendRequestSent ? 'A friend request is currently pending review.' : 'Connect with this user to engage in scholarly collaboration.') }}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
    
    <div v-else class="flex flex-col items-center justify-center py-40 animate-fadeInDown">
      <div class="h-24 w-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 shadow-lg">
        <span class="material-symbols-rounded text-5xl">person_off</span>
      </div>
      <h2 class="text-2xl font-black text-[var(--t1)] mb-3">Profile unreachable</h2>
      <p class="text-[var(--t3)] text-base mb-10 text-center max-w-md">The user profile you are looking for might be private, deleted, or the identifier is incorrect.</p>
      <UiButton variant="primary" size="lg" @click="goBackToHome">Return Home</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main',
})

import { useUserStore } from '~/stores/user'
import {
  getFriendRequests,
  getFriends,
  getPublicUserProfile,
  sendFriendRequest,
  type PublicUserProfileSummary,
} from '~/services/api/social'

const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('Posts')
const tabs = ['Posts', 'About']

const loading = ref(true)
const sendingRequest = ref(false)
const friendRequestSent = ref(false)
const isAlreadyFriend = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const publicProfile = ref<PublicUserProfileSummary | null>(null)

const routeUserId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '')
})

const isOwnProfile = computed(() => {
  const currentUserId = userStore.user?.id
  if (currentUserId === undefined || currentUserId === null) return false
  return String(currentUserId) === routeUserId.value
})

const publicHandle = computed(() => {
  const base = publicProfile.value?.profile.name || 'user'
  return base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '') || 'user'
})

const friendActionLabel = computed(() => {
  if (isAlreadyFriend.value) return 'Bro'
  if (friendRequestSent.value) return 'Sent'
  return 'Add Bro'
})

const connectionLabel = computed(() => {
  if (isOwnProfile.value) return 'You'
  if (isAlreadyFriend.value) return 'Bros'
  if (friendRequestSent.value) return 'Pending Request'
  return 'Not connected'
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

const loadPublicProfile = async () => {
  if (!routeUserId.value) {
    errorMessage.value = 'Invalid profile id'
    loading.value = false
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const result = await getPublicUserProfile(routeUserId.value, 20, 0)

  loading.value = false

  if (!result.success || !result.data) {
    publicProfile.value = null
    errorMessage.value = result.error || 'Failed to load profile'
    return
  }

  publicProfile.value = result.data
}

const loadRelationshipState = async () => {
  isAlreadyFriend.value = false
  friendRequestSent.value = false

  if (!routeUserId.value || isOwnProfile.value) {
    return
  }

  const [friendsResult, requestsResult] = await Promise.all([
    getFriends(),
    getFriendRequests(),
  ])

  if (friendsResult.success && friendsResult.data) {
    isAlreadyFriend.value = friendsResult.data.some((friend) => String(friend.id) === routeUserId.value)
  }

  if (isAlreadyFriend.value) {
    return
  }

  if (requestsResult.success && requestsResult.data) {
    const pendingRequests = [
      ...requestsResult.data.incoming,
      ...requestsResult.data.outgoing,
    ]

    friendRequestSent.value = pendingRequests.some((request) => {
      if (request.status !== 'pending') return false

      const fromId = String(request.fromUser.id)
      const toId = String(request.toUser?.id || '')

      return fromId === routeUserId.value || toId === routeUserId.value
    })
  }
}

const handleAddBro = async () => {
  if (
    !publicProfile.value ||
    sendingRequest.value ||
    friendRequestSent.value ||
    isOwnProfile.value ||
    isAlreadyFriend.value
  ) return

  errorMessage.value = ''
  successMessage.value = ''
  sendingRequest.value = true

  const targetId = publicProfile.value.profile.id || routeUserId.value
  const result = await sendFriendRequest(targetId)

  sendingRequest.value = false

  if (!result.success) {
    const failureMessage = result.error || 'Failed to send request'
    const normalizedFailure = failureMessage.toLowerCase()

    if (normalizedFailure.includes('already') && normalizedFailure.includes('friend')) {
      isAlreadyFriend.value = true
      friendRequestSent.value = false
      successMessage.value = 'You are already bros.'
      return
    }

    if (normalizedFailure.includes('already') && normalizedFailure.includes('request')) {
      friendRequestSent.value = true
      successMessage.value = 'Friend request already pending.'
      return
    }

    errorMessage.value = failureMessage
    return
  }

  friendRequestSent.value = true
  successMessage.value = 'Friend request sent.'
}

const goBackToHome = async () => {
  await navigateTo('/home')
}

watch(
  () => routeUserId.value,
  async () => {
    await Promise.all([
      loadPublicProfile(),
      loadRelationshipState(),
    ])
  },
  { immediate: true }
)
</script>

<style scoped>
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(15px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-15px); }

.scale-in-enter-active { transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.scale-in-enter-from { transform: scaleX(0); }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeInUp { animation: fadeInUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
.animate-fadeInDown { animation: fadeInDown 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface2) 25%,
    var(--surface3) 37%,
    var(--surface2) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.8s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.animate-pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}
</style>
