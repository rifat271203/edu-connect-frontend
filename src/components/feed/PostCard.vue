<template>
  <UiCard class="p-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <NuxtLink :to="`/profile/${post.user.username}`" class="shrink-0">
        <UiAvatar 
          :src="post.user.avatar" 
          :name="post.user.displayName" 
          size="md"
        />
      </NuxtLink>
      <div class="flex-1 min-w-0">
        <NuxtLink 
          :to="`/profile/${post.user.username}`"
          class="font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors"
        >
          {{ post.user.displayName }}
        </NuxtLink>
        <p class="text-sm text-[var(--text-3)]">@{{ post.user.username }} · {{ formattedTimestamp }}</p>
      </div>
      <button class="btn-ghost !h-9 !w-9 !p-0">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="mb-4">
      <p class="text-[var(--text)] whitespace-pre-wrap">{{ post.content }}</p>
    </div>
    
    <!-- Media -->
    <div v-if="post.mediaUrl || post.image" class="mb-4 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
      <video
        v-if="resolvedMediaType === 'video'"
        :src="post.mediaUrl || post.image"
        class="w-full h-auto bg-black/70"
        controls
        preload="metadata"
      />
      <img
        v-else
        :src="post.mediaUrl || post.image"
        :alt="post.user.username + '\'s post'"
        class="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
    
    <!-- Tags -->
    <div v-if="post.tags" class="flex flex-wrap gap-2 mb-4">
      <span 
        v-for="tag in post.tags" 
        :key="tag"
        class="text-sm text-[var(--primary)] hover:opacity-80 cursor-pointer"
      >
        {{ tag }}
      </span>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center justify-between pt-3 border-t border-[var(--border)]">
      <!-- Like -->
      <button 
        @click="$emit('like', post.id)"
        :disabled="isGuest"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
        :class="[
          isGuest
            ? 'text-[var(--text-3)] opacity-60 cursor-not-allowed'
            : post.isLiked
              ? 'text-[var(--danger)]'
              : 'text-[var(--text-3)] hover:text-[var(--danger)] hover:bg-[var(--card-hover)]'
        ]"
      >
        <svg 
          class="w-5 h-5 transition-transform"
          :class="{ 'scale-110': post.isLiked }"
          :fill="post.isLiked ? 'currentColor' : 'none'" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-sm">{{ post.likes }}</span>
      </button>
      
      <!-- Comment -->
      <button
        @click="$emit('comment', post.id)"
        :disabled="isGuest"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
        :class="isGuest ? 'text-[var(--text-3)] opacity-60 cursor-not-allowed' : 'text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--card-hover)]'"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-sm">{{ post.comments }}</span>
      </button>
      
      <!-- Share -->
      <button class="flex items-center gap-2 px-3 py-1.5 text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--card-hover)] rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span class="text-sm">{{ post.shares }}</span>
      </button>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
interface User {
  id: string
  username: string
  displayName: string
  avatar: string
}

interface Post {
  id: string
  user: User
  content: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  image?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  timestamp: string
  tags?: string[]
}

interface Props {
  post: Post
  isGuest?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isGuest: false,
})

const isGuest = computed(() => props.isGuest)

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`

  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const formattedTimestamp = computed(() => formatTimestamp(props.post.timestamp))

const inferMediaTypeFromUrl = (url?: string): 'image' | 'video' => {
  if (!url) return 'image'
  return /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(url) ? 'video' : 'image'
}

const resolvedMediaType = computed<'image' | 'video'>(() => {
  if (props.post.mediaType === 'video' || props.post.mediaType === 'image') {
    return props.post.mediaType
  }

  return inferMediaTypeFromUrl(props.post.mediaUrl || props.post.image)
})

defineEmits<{
  like: [postId: string]
  comment: [postId: string]
}>()
</script>
