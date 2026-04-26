<template>
  <div class="max-w-4xl mx-auto p-4 pb-24 lg:pb-12 animate-fadeInUp">
    <!-- Header Navigation -->
    <div class="mb-8 flex items-center justify-between">
      <UiButton variant="ghost" class="group flex items-center gap-2 hover:bg-[var(--secondary)] transition-all" @click="navigateTo('/home')">
        <span class="material-symbols-rounded text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span class="font-bold text-sm">Back to Home</span>
      </UiButton>
      
      <div class="flex gap-3">
        <UiButton
          variant="secondary"
          class="rounded-xl font-bold text-xs"
          @click="openProfilePicPicker"
          :loading="updatingProfilePic"
        >
          <span class="material-symbols-rounded text-sm mr-1.5">photo_camera</span>
          Update Photo
        </UiButton>
        
        <input
          ref="profilePicInputRef"
          type="file"
          class="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="handleProfilePicSelected"
        />

        <UiButton variant="secondary" size="sm" class="h-10 w-10 p-0 rounded-xl" @click="navigateTo('/settings')">
          <span class="material-symbols-rounded text-lg">settings</span>
        </UiButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="profileLoading" class="space-y-8">
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
    <template v-else>
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
                  :src="userStore.user?.avatar"
                  :name="userStore.user?.name"
                  class="h-32 w-32 md:h-44 md:w-44 rounded-[2.5rem] border-4 border-[var(--surface2)] shadow-[var(--shadow-md)]"
                />
                <button 
                  @click="openProfilePicPicker"
                  class="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[var(--shadow-md)] border-4 border-[var(--surface)] hover:scale-110 transition-transform"
                >
                  <span class="material-symbols-rounded text-sm">edit</span>
                </button>
              </div>
              
              <div class="mt-8 flex flex-col items-center md:items-start w-full gap-2">
                <div class="flex gap-3 w-full">
                  <div class="flex-1 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] p-4 text-center">
                    <p class="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest mb-1">Posts</p>
                    <p class="text-2xl font-black text-[var(--t1)]">{{ myStats.postCount }}</p>
                  </div>
                  <div class="flex-1 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] p-4 text-center">
                    <p class="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest mb-1">Bros</p>
                    <p class="text-2xl font-black text-[var(--t1)]">{{ myStats.friendCount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Details & Bio -->
            <div class="flex-1 min-w-0 flex flex-col pt-2">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 class="text-3xl md:text-5xl font-black tracking-tight text-[var(--t1)] mb-2">
                    {{ userStore.user?.name }}
                  </h1>
                  <div class="flex items-center gap-3">
                    <span class="text-base font-bold text-[var(--accent)]">@{{ userStore.user?.username }}</span>
                    <span class="badge badge-accent">
                      {{ userStore.user?.role || 'Scholar' }}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :checked="isProfilePublic"
                        :disabled="visibilityLoading || visibilitySaving"
                        @change="handleVisibilityToggle"
                      >
                      <div class="w-12 h-6 bg-[var(--surface3)] rounded-full peer peer-checked:bg-[var(--accent-dim)] transition-all"></div>
                      <div class="absolute left-1 top-1 w-4 h-4 bg-[var(--t3)] peer-checked:bg-[var(--accent)] rounded-full transition-all peer-checked:translate-x-6"></div>
                    </div>
                    <span class="text-xs font-bold text-[var(--t2)] group-hover:text-[var(--t1)] transition-colors">
                      {{ isProfilePublic ? 'Public' : 'Private' }}
                    </span>
                  </label>
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
                    <p class="text-base font-bold text-[var(--t1)] truncate">{{ myProfile?.institution || userStore.user?.institution || 'EduConnect' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 group">
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-[var(--accent)] group-hover:border-[var(--accent-border)] group-hover:bg-[var(--accent-subtle)] transition-all">
                    <span class="material-symbols-rounded text-xl">school</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.15em]">Department</p>
                    <p class="text-base font-bold text-[var(--t1)] truncate">{{ myProfile?.department || userStore.user?.department || 'General Science' }}</p>
                  </div>
                </div>
              </div>

              <!-- Bio Section -->
              <div class="mt-auto pt-8 border-t border-[var(--line)]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.25em]">Professional Bio</h3>
                </div>
                <p class="text-[15px] leading-relaxed text-[var(--t2)] font-medium italic">
                  "{{ userStore.user?.bio || (userStore.user?.role === 'teacher' ? 'Experienced mentor specializing in academic excellence.' : 'Dedicated scholar passionate about collaborative learning.') }}"
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
                <span class="material-symbols-rounded text-[20px]">{{ 
                  tab === 'Posts' ? 'grid_view' : 
                  tab === 'Activity' ? 'analytics' :
                  tab === 'Friends' ? 'group' : 'info' 
                }}</span>
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
            <!-- Posts Tab -->
            <div v-if="activeTab === 'Posts'" :key="'posts'" class="grid grid-cols-1 gap-8">
              <FeedPostCard
                v-for="post in myPosts"
                :key="post.id"
                :post="post"
              />

              <div v-if="myPosts.length === 0" class="flex flex-col items-center justify-center py-24 rounded-[2rem] border-2 border-dashed border-[var(--line)] bg-[var(--surface2)]">
                <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--surface)] text-[var(--t4)] mb-6 shadow-[var(--shadow-sm)]">
                  <span class="material-symbols-rounded text-4xl">post_add</span>
                </div>
                <h3 class="text-base font-bold text-[var(--t2)]">You haven't posted anything yet</h3>
                <p class="text-sm text-[var(--t3)] mt-2">Share your first update with your bros!</p>
                <UiButton variant="primary" class="mt-6" @click="navigateTo('/home')">Create Post</UiButton>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-else-if="activeTab === 'Activity'" :key="'activity'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(val, key) in myActivitySummary" :key="key" class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)] hover:border-[var(--accent-border)] transition-all group">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface2)] text-[var(--t3)] mb-6 group-hover:bg-[var(--accent-subtle)] group-hover:text-[var(--accent)] transition-all">
                  <span class="material-symbols-rounded text-2xl">{{ 
                    key === 'likes' ? 'favorite' : 
                    key === 'comments' ? 'chat_bubble' : 'share' 
                  }}</span>
                </div>
                <p class="text-3xl font-black text-[var(--t1)] mb-1">{{ val }}</p>
                <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em]">{{ key }}</p>
              </div>
            </div>

            <!-- Friends Tab -->
            <div v-else-if="activeTab === 'Friends'" :key="'friends'" class="space-y-6">
              <div v-if="friendsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="i in 4" :key="i" class="h-24 rounded-3xl skeleton"></div>
              </div>
              
              <div v-else-if="myFriends.length === 0" class="flex flex-col items-center justify-center py-24 rounded-[2rem] border-2 border-dashed border-[var(--line)] bg-[var(--surface2)]">
                <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--surface)] text-[var(--t4)] mb-6 shadow-[var(--shadow-sm)]">
                  <span class="material-symbols-rounded text-4xl">group_add</span>
                </div>
                <h3 class="text-base font-bold text-[var(--t2)]">No bros yet</h3>
                <p class="text-sm text-[var(--t3)] mt-2">Start connecting with other scholars and mentors.</p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NuxtLink
                  v-for="friend in visibleFriends"
                  :key="`friend-${friend.id}`"
                  :to="`/profile/${friend.id}`"
                  class="group rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[var(--accent-border)] hover:bg-[var(--surface2)] transition-all shadow-[var(--shadow-sm)]"
                >
                  <div class="flex items-center gap-4">
                    <UiAvatar
                      :src="friend.profilePicUrl || friend.avatar"
                      :name="friend.name || friend.displayName"
                      size="lg"
                      class="rounded-2xl border-2 border-transparent group-hover:border-[var(--accent-border)] transition-all"
                    />
                    <div class="min-w-0">
                      <p class="text-base font-bold text-[var(--t1)] truncate">{{ friend.name || friend.displayName }}</p>
                      <p class="text-xs text-[var(--t3)] truncate">{{ friend.role || 'Member' }} · {{ friend.institution || 'EduConnect' }}</p>
                      <div class="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                        <span class="material-symbols-rounded text-xs">verified</span>
                        Bros
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
              
              <div v-if="myFriends.length > 8" class="flex justify-center mt-8">
                <UiButton variant="secondary" @click="showAllFriends = !showAllFriends">
                  {{ showAllFriends ? 'Show Less' : `View All ${myFriends.length} Bros` }}
                </UiButton>
              </div>
            </div>

            <!-- About Tab -->
            <div v-else-if="activeTab === 'About'" :key="'about'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)]">
                <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-6">Account Information</h3>
                <div class="space-y-6">
                  <div v-for="(label, key) in { 
                    'Email Address': myProfile?.email || userStore.user?.email, 
                    'Professional Role': userStore.user?.role || 'Member', 
                    'Member Since': formatDate(userStore.user?.createdAt) 
                  }" :key="key">
                    <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-wider mb-2">{{ key }}</p>
                    <p class="text-[15px] font-bold text-[var(--t1)]">{{ label }}</p>
                  </div>
                </div>
              </div>
              
              <div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)]">
                <h3 class="text-[11px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-6">Specializations</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in skills" 
                    :key="skill"
                    class="badge badge-accent px-4 py-2 text-xs"
                  >
                    {{ skill }}
                  </span>
                </div>
                
                <div class="mt-8 pt-6 border-t border-[var(--line)]">
                  <p class="text-[10px] font-bold text-[var(--t4)] uppercase tracking-wider mb-3">Profile Visibility</p>
                  <p class="text-sm text-[var(--t3)] leading-relaxed">
                    Your profile is currently <strong>{{ isProfilePublic ? 'visible' : 'hidden' }}</strong> to the EduConnect community. 
                    You can change this in your account settings.
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

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
