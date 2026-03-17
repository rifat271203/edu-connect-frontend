<template>
  <div class="max-w-2xl mx-auto p-4 pb-24 lg:pb-4">
    <!-- Cover Image -->
    <div class="relative h-40 md:h-56 rounded-2xl overflow-hidden mb-16">
      <img 
        src="https://picsum.photos/seed/cover/1200/400" 
        alt="Cover" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
    </div>
    
    <!-- Profile Info -->
    <div class="relative px-4 -mt-20 mb-6">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-32 h-32 rounded-2xl overflow-hidden border-4 border-dark-950">
            <img 
              :src="userStore.user?.avatar" 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-glow"
            :disabled="updatingProfilePic"
            @click="openProfilePicPicker"
          >
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <input
            ref="profilePicInputRef"
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            @change="handleProfilePicSelected"
          />
        </div>
        
        <!-- Name & Edit -->
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-dark-50">{{ userStore.user?.name || 'User' }}</h1>
          <p class="text-dark-200">@{{ userStore.user?.username || 'user' }}</p>
          <p class="text-xs text-dark-400 mt-1">
            {{ myProfile?.department || 'Department' }} · {{ myProfile?.institution || 'Institution' }}
          </p>
          <label class="mt-2 inline-flex items-center gap-2 text-xs text-dark-300">
            <input
              type="checkbox"
              class="h-4 w-4"
              :checked="isProfilePublic"
              :disabled="visibilityLoading || visibilitySaving"
              @change="handleVisibilityToggle"
            >
            <span>
              {{ isProfilePublic ? 'Public profile' : 'Private profile' }}
              <span v-if="visibilitySaving">(updating...)</span>
            </span>
          </label>
          <p v-if="visibilityError" class="mt-1 text-xs text-red-400">{{ visibilityError }}</p>
        </div>
        
        <UiButton variant="secondary" @click="openProfilePicPicker">
          {{ updatingProfilePic ? 'Updating...' : 'Update Photo' }}
        </UiButton>
      </div>
    </div>

    <p v-if="errorMessage" class="mb-4 px-4 text-sm text-red-400">{{ errorMessage }}</p>
    <p v-if="successMessage" class="mb-4 px-4 text-sm text-green-400">{{ successMessage }}</p>
    
    <!-- Bio -->
    <p class="text-dark-100 mb-6 px-4">
      {{ userStore.user?.bio || 'Learning enthusiast | Building the future 🚀' }}
    </p>
    
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 px-4 mb-8">
      <div class="text-center">
        <div class="text-xl font-bold text-dark-50">{{ myStats.postCount }}</div>
        <div class="text-sm text-dark-300">Posts</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-dark-50">{{ myStats.shareCount }}</div>
        <div class="text-sm text-dark-300">Shares</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-dark-50">{{ myStats.likeGivenCount }}</div>
        <div class="text-sm text-dark-300">Likes Given</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-dark-50">{{ myStats.commentCount }}</div>
        <div class="text-sm text-dark-300">Comments</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-dark-50">{{ myStats.friendCount }}</div>
        <div class="text-sm text-dark-300">Friends</div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="flex gap-1 border-b border-surface-glass-border mb-6">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="tab-button"
        :class="{ 'active': activeTab === tab }"
      >
        {{ tab }}
      </button>
    </div>
    
    <!-- Posts -->
    <div v-if="activeTab === 'Posts'" class="space-y-4">
      <UiCard v-if="profileLoading" class="p-4">
        <UiSkeleton variant="text" class="w-40 mb-2" />
        <UiSkeleton variant="rectangular" class="h-40" />
      </UiCard>

      <UiCard v-else-if="myPosts.length === 0" class="p-4">
        <p class="text-sm text-dark-300">No posts yet.</p>
      </UiCard>

      <FeedPostCard
        v-for="post in myPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- Activity -->
    <div v-if="activeTab === 'Activity'" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <UiCard class="p-4 text-center">
        <p class="text-2xl font-bold text-dark-50">{{ myActivitySummary.likes }}</p>
        <p class="text-sm text-dark-300">Liked Posts</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-2xl font-bold text-dark-50">{{ myActivitySummary.comments }}</p>
        <p class="text-sm text-dark-300">Comments Made</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-2xl font-bold text-dark-50">{{ myActivitySummary.shares }}</p>
        <p class="text-sm text-dark-300">Shares</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-2xl font-bold text-dark-50">{{ myPosts.length }}</p>
        <p class="text-sm text-dark-300">Own Posts</p>
      </UiCard>
    </div>

    <!-- About -->
    <div v-if="activeTab === 'About'" class="space-y-4">
      <UiCard class="p-4">
        <h3 class="font-semibold text-dark-50 mb-3">Account</h3>
        <div class="space-y-2 text-sm text-dark-200">
          <p><span class="text-dark-400">Email:</span> {{ myProfile?.email || userStore.user?.email }}</p>
          <p><span class="text-dark-400">Role:</span> {{ myProfile?.role || userStore.user?.role || 'student' }}</p>
          <p><span class="text-dark-400">Department:</span> {{ myProfile?.department || userStore.user?.department || 'N/A' }}</p>
          <p><span class="text-dark-400">Institution:</span> {{ myProfile?.institution || userStore.user?.institution || 'N/A' }}</p>
        </div>
      </UiCard>

      <UiCard class="p-4">
        <h3 class="font-semibold text-dark-50 mb-3">Skills</h3>
        <div class="flex flex-wrap gap-2">
          <UiBadge v-for="skill in skills" :key="skill" variant="accent">{{ skill }}</UiBadge>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useUserStore } from '~/stores/user'
import { getMyActivity, getMyProfile, getMyProfileVisibility, updateMyProfileVisibility } from '~/services/api/social'

const userStore = useUserStore()

const activeTab = ref('Posts')
const tabs = ['Posts', 'Activity', 'About']

const profileLoading = ref(true)
const updatingProfilePic = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const profilePicInputRef = ref<HTMLInputElement | null>(null)

const visibilityLoading = ref(false)
const visibilitySaving = ref(false)
const visibilityError = ref('')

const myProfile = ref<Awaited<ReturnType<typeof getMyProfile>>['data'] extends infer T ? T extends { profile: infer P } ? P : null : null>(null)
const myStats = ref({
  postCount: 0,
  shareCount: 0,
  likeGivenCount: 0,
  commentCount: 0,
  friendCount: 0,
})

const myPosts = ref<import('~/types/post').Post[]>([])
const myActivitySummary = ref({
  likes: 0,
  comments: 0,
  shares: 0,
})

const isProfilePublic = ref(true)

const loadProfileData = async () => {
  profileLoading.value = true
  errorMessage.value = ''

  const [profileResult, activityResult] = await Promise.all([
    getMyProfile(),
    getMyActivity(20, 0),
  ])

  if (profileResult.success && profileResult.data) {
    myProfile.value = profileResult.data.profile
    myStats.value = profileResult.data.stats
    isProfilePublic.value = profileResult.data.profile.isProfilePublic ?? true

    if (userStore.user) {
      userStore.user = {
        ...userStore.user,
        name: profileResult.data.profile.name || userStore.user.name,
        displayName: profileResult.data.profile.name || userStore.user.displayName,
        email: profileResult.data.profile.email || userStore.user.email,
        department: profileResult.data.profile.department || userStore.user.department,
        institution: profileResult.data.profile.institution || userStore.user.institution,
        avatar: profileResult.data.profile.profilePicUrl || userStore.user.avatar,
        profilePicUrl: profileResult.data.profile.profilePicUrl || userStore.user.profilePicUrl,
        isProfilePublic: profileResult.data.profile.isProfilePublic ?? userStore.user.isProfilePublic,
      }

      userStore.persistSession()
    }
  } else {
    errorMessage.value = profileResult.error || 'Failed to load profile'
  }

  if (activityResult.success && activityResult.data) {
    myPosts.value = activityResult.data.posts
    myActivitySummary.value = {
      likes: activityResult.data.likes.length,
      comments: activityResult.data.comments.length,
      shares: activityResult.data.shares.length,
    }
  } else if (!errorMessage.value) {
    errorMessage.value = activityResult.error || 'Failed to load profile activity'
  }

  profileLoading.value = false
}

const loadMyVisibility = async () => {
  visibilityLoading.value = true
  visibilityError.value = ''

  const result = await getMyProfileVisibility()
  visibilityLoading.value = false

  if (!result.success || !result.data) {
    visibilityError.value = result.error || 'Failed to load profile visibility'
    return
  }

  isProfilePublic.value = result.data.isPublic

  if (userStore.user) {
    userStore.user = {
      ...userStore.user,
      isProfilePublic: result.data.isPublic,
    }
    userStore.persistSession()
  }
}

const handleVisibilityToggle = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const nextValue = Boolean(target.checked)
  const previous = isProfilePublic.value

  isProfilePublic.value = nextValue
  visibilityError.value = ''
  visibilitySaving.value = true

  const result = await updateMyProfileVisibility(nextValue)

  visibilitySaving.value = false

  if (!result.success || !result.data) {
    isProfilePublic.value = previous
    visibilityError.value = result.error || 'Failed to update profile visibility'
    return
  }

  isProfilePublic.value = result.data.isPublic

  if (userStore.user) {
    userStore.user = {
      ...userStore.user,
      isProfilePublic: result.data.isPublic,
    }
    userStore.persistSession()
  }
}

const openProfilePicPicker = () => {
  profilePicInputRef.value?.click()
}

const handleProfilePicSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || updatingProfilePic.value) return

  successMessage.value = ''
  errorMessage.value = ''
  updatingProfilePic.value = true

  const result = await userStore.uploadProfilePicture(file)
  updatingProfilePic.value = false

  if (!result.success) {
    errorMessage.value = result.error || 'Failed to update profile picture'
    return
  }

  successMessage.value = 'Profile picture updated successfully.'
  await loadProfileData()

  if (profilePicInputRef.value) {
    profilePicInputRef.value.value = ''
  }
}

onMounted(async () => {
  await Promise.all([
    loadProfileData(),
    loadMyVisibility(),
  ])
})

const skills = ['JavaScript', 'Python', 'Vue.js', 'Machine Learning', 'Data Structures', 'React', 'Node.js']
</script>
