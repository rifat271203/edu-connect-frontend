<template>
  <div class="space-y-10 bg-[var(--terra-background)] text-[var(--terra-on-background)]">
    <!-- Mentors Bar (Academic Network) -->
    <section>
      <div class="flex items-end justify-between mb-6">
        <div>
          <h2 class="text-xl font-extrabold tracking-tight text-[var(--terra-primary)]">Academic Network</h2>
          <p class="text-sm text-[var(--terra-tertiary)] font-medium">Connect with top-tier research mentors</p>
        </div>
        <button class="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--terra-cream)] text-[var(--terra-primary)] border border-[var(--terra-primary)] hover:bg-[var(--terra-primary)] hover:text-white transition-all shadow-terra">
          Discover More
        </button>
      </div>
      
      <div class="flex gap-8 overflow-x-auto no-scrollbar py-2">
        <div v-for="story in storyUsers" :key="story.id" class="flex-shrink-0 group cursor-pointer text-center">
          <div class="relative w-20 h-20 mx-auto mb-3">
            <UiAvatar 
              :src="story.avatar" 
              :name="story.name"
              size="xl"
              class="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 ring-transparent group-hover:ring-brand-primary/40 transform group-hover:scale-105"
            />
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full border-2 dark:border-[#09090b] border-white flex items-center justify-center">
              <span class="material-symbols-rounded text-[10px] text-white font-bold">check</span>
            </div>
          </div>
          <p class="text-xs font-bold text-[var(--terra-primary)] group-hover:text-[var(--terra-tertiary)] transition-colors truncate max-w-[80px]">{{ story.name }}</p>
          <p class="text-[10px] text-[var(--terra-tertiary)] font-medium">Scholar</p>
        </div>
      </div>
    </section>

    <!-- Publisher (Create Post) -->
    <div class="pro-card rounded-2xl p-6 bg-[var(--terra-cream)] shadow-terra border-none">
      <div class="flex gap-4">
        <UiAvatar 
          :src="userStore.user?.avatar" 
          :name="userStore.user?.name"
          size="lg"
          class="rounded-xl border-2 dark:border-white/5 border-slate-100"
        />
        <div class="flex-1">
          <textarea 
            v-model="newPostContent"
            class="w-full bg-transparent border-none focus:ring-0 text-[15px] text-[var(--terra-on-background)] placeholder:text-[var(--terra-tertiary)] resize-none py-2" 
            placeholder="Start a professional discussion or share a resource..." 
            rows="2"
          ></textarea>
        </div>
      </div>
      
      <div v-if="mediaPreviewUrl" class="mt-4 rounded-2xl overflow-hidden border border-[var(--terra-outline-variant)] bg-[var(--terra-background)] relative">
        <img v-if="selectedMediaType === 'image'" :src="mediaPreviewUrl" class="max-h-80 w-full object-cover" />
        <video v-else :src="mediaPreviewUrl" controls class="max-h-80 w-full" />
        <button @click="clearSelectedMedia" class="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all">
          <span class="material-symbols-rounded text-sm">close</span>
        </button>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--terra-outline-variant)]">
        <div class="flex gap-1">
          <button @click="openMediaPicker" class="p-2.5 rounded-xl hover:bg-[var(--terra-warm-gray)] text-[var(--terra-tertiary)] hover:text-[var(--terra-primary)] transition-all">
            <span class="material-symbols-rounded text-xl">image</span>
          </button>
          <button class="p-2.5 rounded-xl hover:bg-[var(--terra-warm-gray)] text-[var(--terra-tertiary)] hover:text-[var(--terra-primary)] transition-all">
            <span class="material-symbols-rounded text-xl">description</span>
          </button>
          <button class="p-2.5 rounded-xl hover:bg-[var(--terra-warm-gray)] text-[var(--terra-tertiary)] hover:text-[var(--terra-primary)] transition-all">
            <span class="material-symbols-rounded text-xl">poll</span>
          </button>
          <input ref="mediaInputRef" type="file" class="hidden" accept="image/*,video/*" @change="handleMediaSelected" />
        </div>
        <button 
          @click="handleCreatePost"
          :disabled="creatingPost || (!newPostContent.trim() && !selectedMediaFile)"
          class="px-8 py-2.5 btn btn-primary text-xs uppercase rounded-xl hover:shadow-lg hover:shadow-terra transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ creatingPost ? 'Publishing...' : 'Publish' }}
        </button>
      </div>
    </div>

    <!-- Feed -->
    <div class="space-y-6">
      <template v-if="loading && !posts.length">
        <div v-for="i in 3" :key="i" class="pro-card rounded-3xl p-7 animate-pulse bg-[var(--terra-cream)]">
          <div class="flex gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-[var(--terra-warm-gray)]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-[var(--terra-warm-gray)] rounded w-1/4"></div>
              <div class="h-3 bg-[var(--terra-warm-gray)] rounded w-1/6"></div>
            </div>
          </div>
          <div class="h-20 bg-[var(--terra-warm-gray)] rounded-xl"></div>
        </div>
      </template>

      <PostCard 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
        @like="handleLike"
        @comment="toggleCommentBox"
      />

      <div v-if="hasMore" class="flex justify-center pt-4">
        <button 
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-2 rounded-xl text-sm font-bold bg-[var(--terra-cream)] text-[var(--terra-primary)] border border-[var(--terra-primary)] hover:bg-[var(--terra-primary)] hover:text-white transition-all shadow-terra"
        >
          {{ loading ? 'Loading...' : 'Load More Research' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { usePostsStore } from '~/stores/posts'
import type { Post } from '~/types/post'
import PostCard from '~/components/feed/PostCard.vue'

const userStore = useUserStore()
const postsStore = usePostsStore()
const { posts, loading, hasMore, error } = storeToRefs(postsStore)

const newPostContent = ref('')
const creatingPost = ref(false)
const mediaInputRef = ref<HTMLInputElement | null>(null)
const selectedMediaFile = ref<File | null>(null)
const mediaPreviewUrl = ref('')
const selectedMediaType = ref<'image' | 'video'>('image')
const localError = ref('')

const fallbackStories = [
  { id: '1', name: 'Dr. Arisara', avatar: undefined },
  { id: '2', name: 'Prof. Haque', avatar: undefined },
]

const storyUsers = computed(() => {
  const users = posts.value.slice(0, 5).map(p => ({
    id: p.id,
    name: p.user.displayName,
    avatar: p.user.avatar || p.user.profilePicUrl
  }))
  return users.length ? users : fallbackStories
})

const revokePreviewUrl = () => {
  if (mediaPreviewUrl.value) {
    URL.revokeObjectURL(mediaPreviewUrl.value)
    mediaPreviewUrl.value = ''
  }
}

const clearSelectedMedia = () => {
  selectedMediaFile.value = null
  selectedMediaType.value = 'image'
  revokePreviewUrl()
  if (mediaInputRef.value) mediaInputRef.value.value = ''
}

const openMediaPicker = () => mediaInputRef.value?.click()

const handleMediaSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  revokePreviewUrl()
  selectedMediaFile.value = file
  selectedMediaType.value = file.type.startsWith('video/') ? 'video' : 'image'
  mediaPreviewUrl.value = URL.createObjectURL(file)
}

const handleLike = (postId: string) => postsStore.toggleLike(postId)
const toggleCommentBox = (postId: string) => { /* Logic to open comments */ }

const handleCreatePost = async () => {
  if (!newPostContent.value.trim() && !selectedMediaFile.value) return
  creatingPost.value = true
  const result = await postsStore.createNewPost(newPostContent.value.trim(), selectedMediaFile.value)
  creatingPost.value = false
  if (result.success) {
    newPostContent.value = ''
    clearSelectedMedia()
  }
}

const loadMore = () => postsStore.loadMore()

onMounted(() => {
  postsStore.fetchPosts(true)
})

onBeforeUnmount(() => revokePreviewUrl())
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
