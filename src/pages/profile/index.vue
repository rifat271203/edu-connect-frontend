<template>
  <div class="max-w-4xl mx-auto p-4 pb-24 lg:pb-6">
    <!-- Profile Header -->
    <div class="mb-6 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-6">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-20 h-20 md:w-20 md:h-20 rounded-full overflow-hidden border border-[var(--line2)] bg-[var(--surface2)]">
            <img 
              :src="userStore.user?.avatar" 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--gold)] text-[#07090f] flex items-center justify-center"
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
          <h1 class="text-[22px] font-bold tracking-[-0.02em] text-[var(--t1)]">{{ userStore.user?.name || 'User' }}</h1>
          <p class="text-[13px] text-[rgba(244,241,235,0.4)] mt-1">@{{ userStore.user?.username || 'user' }}</p>
          <p class="text-[13px] text-[rgba(244,241,235,0.5)] mt-1">
            {{ myProfile?.department || 'Department' }} · {{ myProfile?.institution || 'Institution' }}
          </p>
          <label class="mt-3 inline-flex items-center gap-2 text-xs text-[var(--t2)] rounded-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-1.5">
            <input
              type="checkbox"
              class="h-4 w-4 accent-[var(--gold)]"
              :checked="isProfilePublic"
              :disabled="visibilityLoading || visibilitySaving"
              @change="handleVisibilityToggle"
            >
            <span>
              {{ isProfilePublic ? 'Public profile' : 'Private profile' }}
              <span v-if="visibilitySaving">(updating...)</span>
            </span>
          </label>
          <p v-if="visibilityError" class="mt-1 text-xs text-[rgba(239,68,68,0.9)]">{{ visibilityError }}</p>
        </div>
        
        <UiButton variant="ghost" class="w-full md:w-auto" @click="openProfilePicPicker">
          {{ updatingProfilePic ? 'Updating...' : 'Update Photo' }}
        </UiButton>
      </div>
    </div>

    <p v-if="errorMessage" class="mb-4 text-sm text-[rgba(239,68,68,0.9)]">{{ errorMessage }}</p>
    <p v-if="successMessage" class="mb-4 text-sm text-green-400">{{ successMessage }}</p>
    
    <!-- Bio -->
    <UiCard class="mb-6 !p-4 rounded-[12px]">
      <p class="text-[15px] leading-relaxed text-[rgba(244,241,235,0.7)] italic">
        {{ userStore.user?.bio || 'Learning enthusiast | Building the future 🚀' }}
      </p>
    </UiCard>
    
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      <div class="text-center rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-3">
        <div class="text-[20px] leading-6 font-bold text-[var(--t1)]">{{ myStats.postCount }}</div>
        <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Posts</div>
      </div>
      <div class="text-center rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-3">
        <div class="text-[20px] leading-6 font-bold text-[var(--t1)]">{{ myStats.shareCount }}</div>
        <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Shares</div>
      </div>
      <div class="text-center rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-3">
        <div class="text-[20px] leading-6 font-bold text-[var(--t1)]">{{ myStats.likeGivenCount }}</div>
        <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Likes Given</div>
      </div>
      <div class="text-center rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-3">
        <div class="text-[20px] leading-6 font-bold text-[var(--t1)]">{{ myStats.commentCount }}</div>
        <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Comments</div>
      </div>
      <div class="text-center rounded-[12px] bg-[var(--surface)] border border-[var(--line)] p-3">
        <div class="text-[20px] leading-6 font-bold text-[var(--t1)]">{{ myStats.friendCount }}</div>
        <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Friends</div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="flex gap-4 border-b border-[var(--line)] mb-6">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-2 text-[14px] font-semibold transition-colors"
        :class="activeTab === tab ? 'text-[var(--t1)] border-b-2 border-[var(--gold)]' : 'text-[rgba(244,241,235,0.45)] hover:text-[var(--t2)] border-b-2 border-transparent'"
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
        <p class="text-sm text-[var(--t2)]">No posts yet.</p>
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
        <p class="text-[20px] font-bold text-[var(--t1)]">{{ myActivitySummary.likes }}</p>
        <p class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Liked Posts</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-[20px] font-bold text-[var(--t1)]">{{ myActivitySummary.comments }}</p>
        <p class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Comments Made</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-[20px] font-bold text-[var(--t1)]">{{ myActivitySummary.shares }}</p>
        <p class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Shares</p>
      </UiCard>
      <UiCard class="p-4 text-center">
        <p class="text-[20px] font-bold text-[var(--t1)]">{{ myPosts.length }}</p>
        <p class="text-[11px] uppercase tracking-[0.1em] text-[rgba(244,241,235,0.4)]">Own Posts</p>
      </UiCard>
    </div>

    <!-- Friends -->
    <div v-if="activeTab === 'Friends'" class="space-y-4">
      <UiCard class="p-4">
        <div class="mb-4 flex items-center justify-between gap-2">
          <h3 class="font-semibold text-[var(--t1)]">Friends</h3>
          <UiButton
            v-if="myFriends.length > 8"
            variant="ghost"
            size="sm"
            @click="showAllFriends = !showAllFriends"
          >
            {{ showAllFriends ? 'Show less' : 'See all friends' }}
          </UiButton>
        </div>

        <p v-if="friendsError" class="text-sm text-[rgba(239,68,68,0.9)]">{{ friendsError }}</p>

        <div v-else-if="friendsLoading" class="space-y-3">
          <div
            v-for="index in 4"
            :key="`friend-skeleton-${index}`"
            class="rounded-xl border border-surface-glass-border p-3"
          >
            <UiSkeleton variant="text" class="w-40 mb-2" />
            <UiSkeleton variant="text" class="w-24" />
          </div>
        </div>

        <p v-else-if="myFriends.length === 0" class="text-sm text-[var(--t2)]">No friends yet.</p>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <NuxtLink
            v-for="friend in visibleFriends"
            :key="`friend-${friend.id}`"
            :to="`/profile/${friend.id}`"
            class="rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-3 hover:border-[var(--line2)] hover:bg-[var(--surface3)] transition-colors"
          >
            <div class="flex items-start gap-3">
              <UiAvatar
                :src="friend.profilePicUrl || friend.avatar"
                :name="friend.name || friend.displayName"
                size="md"
              />

              <div class="min-w-0">
                <p class="text-sm font-medium text-[var(--t1)] truncate">{{ friend.name || friend.displayName }}</p>
                <p class="text-xs text-[var(--t2)] truncate">{{ friend.email || `@${friend.username}` }}</p>
                <p class="mt-1 text-[11px] mono-label text-[var(--t3)] truncate">
                  {{ friend.role || 'member' }} · {{ friend.department || 'Department' }}
                </p>
                <p class="text-[11px] mono-label text-[var(--t3)] truncate">{{ friend.institution || 'Institution' }}</p>
                <p v-if="friend.friendsSince" class="mt-1 text-[11px] mono-label text-[var(--t3)]">
                  Friends since {{ new Date(friend.friendsSince).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UiCard>
    </div>

    <!-- About -->
    <div v-if="activeTab === 'About'" class="space-y-4">
      <UiCard class="p-4">
        <h3 class="font-semibold text-[var(--t1)] mb-3">Account</h3>
        <div class="space-y-2 text-sm text-[var(--t2)]">
          <p><span class="text-[var(--t3)]">Email:</span> {{ myProfile?.email || userStore.user?.email }}</p>
          <p><span class="text-[var(--t3)]">Role:</span> {{ myProfile?.role || userStore.user?.role || 'student' }}</p>
          <p><span class="text-[var(--t3)]">Department:</span> {{ myProfile?.department || userStore.user?.department || 'N/A' }}</p>
          <p><span class="text-[var(--t3)]">Institution:</span> {{ myProfile?.institution || userStore.user?.institution || 'N/A' }}</p>
        </div>
      </UiCard>

      <UiCard class="p-4">
        <h3 class="font-semibold text-[var(--t1)] mb-3">Skills</h3>
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
import {
  getFriends,
  getMyActivity,
  getMyProfile,
  getMyProfileVisibility,
  updateMyProfileVisibility,
  type SocialFriend,
} from '~/services/api/social'

const userStore = useUserStore()

const activeTab = ref('Posts')
const tabs = ['Posts', 'Activity', 'Friends', 'About']

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

const myFriends = ref<SocialFriend[]>([])
const friendsLoading = ref(false)
const friendsError = ref('')
const showAllFriends = ref(false)

const visibleFriends = computed(() =>
  showAllFriends.value ? myFriends.value : myFriends.value.slice(0, 8)
)

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

const loadMyFriends = async () => {
  friendsLoading.value = true
  friendsError.value = ''

  const result = await getFriends()
  friendsLoading.value = false

  if (!result.success || !result.data) {
    myFriends.value = []
    friendsError.value = result.error || 'Failed to load friends'
    return
  }

  myFriends.value = result.data
  myStats.value = {
    ...myStats.value,
    friendCount: result.data.length,
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
    loadMyFriends(),
    loadMyVisibility(),
  ])
})

const skills = ['JavaScript', 'Python', 'Vue.js', 'Machine Learning', 'Data Structures', 'React', 'Node.js']
</script>
