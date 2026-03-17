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

      <UiCard v-if="publicProfile" class="mb-6 p-4">
        <div class="flex items-start gap-3">
          <UiAvatar
            :src="publicProfile.profile.profilePicUrl"
            :name="publicProfile.profile.name"
            size="lg"
          />

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h1 class="text-lg font-semibold text-dark-50 truncate">{{ publicProfile.profile.name }}</h1>

              <UiButton
                v-if="!isOwnProfile"
                :loading="sendingRequest"
                :disabled="sendingRequest || friendRequestSent"
                @click="handleAddBro"
              >
                {{ friendRequestSent ? 'Request Sent' : 'Add Bro' }}
              </UiButton>
            </div>

            <p class="text-sm text-dark-300 mt-1">
              {{ publicProfile.profile.role || 'member' }} ·
              {{ publicProfile.profile.department || 'Department' }} ·
              {{ publicProfile.profile.institution || 'Institution' }}
            </p>

            <p class="text-xs text-dark-400 mt-1">
              Visibility: {{ publicProfile.profile.isProfilePublic ? 'Public' : 'Private' }}
            </p>

            <div class="mt-3 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-lg bg-dark-800/40 p-2">
                <p class="text-lg font-semibold text-dark-50">{{ publicProfile.stats.postCount }}</p>
                <p class="text-xs text-dark-300">Posts</p>
              </div>
              <div class="rounded-lg bg-dark-800/40 p-2">
                <p class="text-lg font-semibold text-dark-50">{{ publicProfile.stats.shareCount }}</p>
                <p class="text-xs text-dark-300">Shares</p>
              </div>
              <div class="rounded-lg bg-dark-800/40 p-2">
                <p class="text-lg font-semibold text-dark-50">{{ publicProfile.stats.friendCount }}</p>
                <p class="text-xs text-dark-300">Friends</p>
              </div>
            </div>
          </div>
        </div>
      </UiCard>

      <UiCard v-if="publicProfile" class="p-4">
        <h2 class="text-sm font-medium text-dark-100 mb-2">Recent posts</h2>

        <div v-if="publicProfile.recentPosts.length" class="space-y-3">
          <FeedPostCard
            v-for="post in publicProfile.recentPosts"
            :key="`public-${post.id}`"
            :post="post"
          />
        </div>

        <p v-else class="text-sm text-dark-300">No public posts available.</p>
      </UiCard>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main',
})

import { useUserStore } from '~/stores/user'
import {
  getPublicUserProfile,
  sendFriendRequest,
  type PublicUserProfileSummary,
} from '~/services/api/social'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const sendingRequest = ref(false)
const friendRequestSent = ref(false)
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

const loadPublicProfile = async () => {
  if (!routeUserId.value) {
    errorMessage.value = 'Invalid profile id'
    loading.value = false
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  friendRequestSent.value = false

  const result = await getPublicUserProfile(routeUserId.value, 20, 0)

  loading.value = false

  if (!result.success || !result.data) {
    publicProfile.value = null
    errorMessage.value = result.error || 'Failed to load profile'
    return
  }

  publicProfile.value = result.data
}

const handleAddBro = async () => {
  if (!publicProfile.value || sendingRequest.value || friendRequestSent.value || isOwnProfile.value) return

  errorMessage.value = ''
  successMessage.value = ''
  sendingRequest.value = true

  const targetId = publicProfile.value.profile.id || routeUserId.value
  const result = await sendFriendRequest(targetId)

  sendingRequest.value = false

  if (!result.success) {
    errorMessage.value = result.error || 'Failed to send request'
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
    await loadPublicProfile()
  },
  { immediate: true }
)
</script>
