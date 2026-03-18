<template>
  <div class="max-w-2xl mx-auto p-4 pb-24 lg:pb-4">
    <div class="mb-4">
      <UiButton variant="ghost" @click="goBackToHome">← Back</UiButton>
    </div>

    <UiCard v-if="loading" class="p-4">
      <UiSkeleton variant="text" class="w-40 mb-2" />
      <UiSkeleton variant="rectangular" class="h-40" />
    </UiCard>

    <template v-else>
      <p v-if="errorMessage" class="mb-4 text-sm text-red-400">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mb-4 text-sm text-green-400">{{ successMessage }}</p>

      <template v-if="publicProfile">
        <div class="mb-6 rounded-2xl border border-surface-glass-border bg-dark-900/70 p-4 md:p-6">
          <div class="flex flex-col md:flex-row md:items-end gap-4">
            <div class="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-dark-800 bg-dark-800/70">
              <img
                :src="publicProfile.profile.profilePicUrl"
                :alt="publicProfile.profile.name"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-dark-50 truncate">{{ publicProfile.profile.name }}</h1>
              <p class="text-dark-200">@{{ publicHandle }}</p>
              <p class="text-xs text-dark-400 mt-1">{{ profileMetaLine }}</p>
              <p class="text-xs text-dark-300 mt-1">
                {{ publicProfile.profile.isProfilePublic ? 'Public profile' : 'Private profile' }}
              </p>
            </div>

            <UiButton
              v-if="!isOwnProfile"
              variant="secondary"
              class="w-full md:w-auto"
              :loading="sendingRequest"
              :disabled="sendingRequest || friendRequestSent || isAlreadyFriend"
              @click="handleAddBro"
            >
              {{ friendActionLabel }}
            </UiButton>
          </div>
        </div>

        <UiCard class="mb-6 p-4">
          <p class="text-dark-100 leading-relaxed">
            {{ publicProfile.profile.role || 'Member' }} at {{ publicProfile.profile.institution || 'EduConnect' }}
          </p>
        </UiCard>

        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="text-center rounded-xl bg-dark-900/50 border border-surface-glass-border p-3">
            <div class="text-xl font-bold text-dark-50">{{ publicProfile.stats.postCount }}</div>
            <div class="text-sm text-dark-300">Posts</div>
          </div>
          <div class="text-center rounded-xl bg-dark-900/50 border border-surface-glass-border p-3">
            <div class="text-xl font-bold text-dark-50">{{ publicProfile.stats.shareCount }}</div>
            <div class="text-sm text-dark-300">Shares</div>
          </div>
          <div class="text-center rounded-xl bg-dark-900/50 border border-surface-glass-border p-3">
            <div class="text-xl font-bold text-dark-50">{{ publicProfile.stats.friendCount }}</div>
            <div class="text-sm text-dark-300">Friends</div>
          </div>
        </div>

        <div class="flex gap-1 border-b border-surface-glass-border mb-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="tab-button"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div v-if="activeTab === 'Posts'" class="space-y-4">
          <FeedPostCard
            v-for="post in publicProfile.recentPosts"
            :key="`public-${post.id}`"
            :post="post"
          />

          <UiCard v-if="publicProfile.recentPosts.length === 0" class="p-4">
            <p class="text-sm text-dark-300">No public posts available.</p>
          </UiCard>
        </div>

        <div v-if="activeTab === 'About'" class="space-y-4">
          <UiCard class="p-4">
            <h3 class="font-semibold text-dark-50 mb-3">Account</h3>
            <div class="space-y-2 text-sm text-dark-200">
              <p><span class="text-dark-400">Email:</span> {{ publicProfile.profile.email || 'Hidden' }}</p>
              <p><span class="text-dark-400">Role:</span> {{ publicProfile.profile.role || 'member' }}</p>
              <p><span class="text-dark-400">Department:</span> {{ publicProfile.profile.department || 'N/A' }}</p>
              <p><span class="text-dark-400">Institution:</span> {{ publicProfile.profile.institution || 'N/A' }}</p>
              <p><span class="text-dark-400">Connection:</span> {{ connectionLabel }}</p>
            </div>
          </UiCard>
        </div>
      </template>
    </template>
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

const profileMetaLine = computed(() => {
  if (!publicProfile.value) return 'member · Department · Institution'

  return `${publicProfile.value.profile.role || 'member'} · ${publicProfile.value.profile.department || 'Department'} · ${publicProfile.value.profile.institution || 'Institution'}`
})

const friendActionLabel = computed(() => {
  if (isAlreadyFriend.value) return 'Bro'
  if (friendRequestSent.value) return 'Request Sent'
  return 'Add Bro'
})

const connectionLabel = computed(() => {
  if (isOwnProfile.value) return 'You'
  if (isAlreadyFriend.value) return 'Bro'
  if (friendRequestSent.value) return 'Pending'
  return 'Not connected'
})

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
