<template>
  <article 
    class="post-card overflow-hidden transition-all duration-300"
    :class="[isSplitLayout ? 'flex min-h-[320px] flex-row' : 'flex flex-col']"
  >
    <div
      v-if="isSplitLayout"
      class="relative w-[60%] flex-shrink-0 overflow-hidden border-r border-[var(--line)] bg-black group/media"
    >
      <video
        v-if="resolvedMediaType === 'video'"
        ref="videoRef"
        :src="post.mediaUrl || post.image"
        class="h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline
        @click="togglePlay"
      />
      <img
        v-else
        :src="post.mediaUrl || post.image"
        class="h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-105"
        loading="lazy"
      />

      <template v-if="resolvedMediaType === 'video'">
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/media:opacity-100">
          <div class="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
            <span class="material-symbols-rounded text-3xl text-white">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </div>
        </div>

        <div class="absolute bottom-3 right-3 z-10 flex gap-2">
          <button 
            @click.stop="toggleMute"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white transition-all hover:bg-black/60"
          >
            <span class="material-symbols-rounded text-lg">{{ isMuted ? 'volume_off' : 'volume_up' }}</span>
          </button>
        </div>
      </template>
    </div>

    <div 
      class="flex flex-col p-4 bg-[var(--surface)]"
      :class="[
        isSplitLayout ? 'w-[40%] min-w-[280px]' : 'w-full',
        !post.content ? 'py-3' : ''
      ]"
    >
      <div v-if="post.content" class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <NuxtLink :to="`/profile/${post.user.username}`">
            <UiAvatar 
              :src="post.user.profilePicUrl || post.user.avatar" 
              :name="post.user.displayName"
              size="md"
              class="rounded-xl ring-2 ring-transparent hover:ring-brand-primary/30 transition-all"
            />
          </NuxtLink>
          <div class="flex flex-col">
            <NuxtLink 
              :to="`/profile/${post.user.username}`"
              class="text-[14px] font-bold text-[var(--t1)] hover:text-brand-primary transition-colors leading-none"
            >
              {{ post.user.displayName }}
            </NuxtLink>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="text-[9px] text-[var(--t2)] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface2)] border border-[var(--line)]">
                {{ post.user.role || 'Scholar' }}
              </span>
              <span class="text-[10px] text-[var(--t3)] font-medium">• {{ formattedTimestamp }}</span>
            </div>
          </div>
        </div>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface2)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors">
          <span class="material-symbols-rounded text-xl">more_horiz</span>
        </button>
      </div>

      <div v-if="post.content" class="flex-1 flex flex-col justify-center py-2 overflow-hidden">
        <div 
          class="post-content break-words transition-all duration-300"
          :class="[
            captionSizeClasses,
            hasHighlights ? 'text-[var(--t1)]' : 'text-[var(--t2)] font-medium',
            !isCaptionExpanded && shouldShowCaptionToggle ? 'caption-clamp' : ''
          ]"
          v-html="highlightedCaption"
        />
        <button
          v-if="shouldShowCaptionToggle"
          type="button"
          class="mt-2 w-fit text-[12px] font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          @click="isCaptionExpanded = !isCaptionExpanded"
        >
          {{ isCaptionExpanded ? 'See less' : 'See more' }}
        </button>
      </div>

      <div 
        class="flex items-center gap-4 mt-auto border-t border-[var(--line)] pt-3"
        :class="[post.content ? 'justify-end' : 'justify-between']"
      >
        <div class="flex items-center gap-4">
          <button 
            @click="$emit('like', post.id)"
            class="flex items-center gap-1.5 text-[var(--t2)] hover:text-brand-primary transition-colors font-bold text-[11px] group"
            :class="{ 'text-brand-primary': post.isLiked }"
          >
            <span class="material-symbols-rounded text-lg" :class="{ 'fill-1': post.isLiked }">favorite</span>
            <span>{{ post.likes }}</span>
          </button>
          
          <button 
            @click="$emit('comment', post.id)"
            class="flex items-center gap-1.5 text-[var(--t2)] hover:text-brand-primary transition-colors font-bold text-[11px]"
          >
            <span class="material-symbols-rounded text-lg">chat_bubble</span>
            <span>{{ post.comments }}</span>
          </button>
        </div>

        <button class="text-[var(--t3)] hover:text-brand-primary transition-colors">
          <span class="material-symbols-rounded text-lg">share</span>
        </button>
      </div>
    </div>

    <!-- Media Section -->
    <div 
      v-if="hasMedia && !isSplitLayout" 
      class="relative bg-black overflow-hidden group/media flex-shrink-0"
      :class="[post.content ? 'w-full border-t border-[var(--line)] aspect-[16/10] md:aspect-video' : 'w-full aspect-video']"
    >
      <video
        v-if="resolvedMediaType === 'video'"
        ref="videoRef"
        :src="post.mediaUrl || post.image"
        class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        @click="togglePlay"
      />
      <img
        v-else
        :src="post.mediaUrl || post.image"
        class="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
        loading="lazy"
      />

      <template v-if="resolvedMediaType === 'video'">
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
          <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
            <span class="material-symbols-rounded text-white text-3xl">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </div>
        </div>
        
        <div class="absolute bottom-3 right-3 z-10 flex gap-2">
          <button 
            @click.stop="toggleMute"
            class="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          >
            <span class="material-symbols-rounded text-lg">{{ isMuted ? 'volume_off' : 'volume_up' }}</span>
          </button>
        </div>
      </template>

      <div v-if="!post.content" class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div class="flex items-center gap-3 pointer-events-auto">
          <NuxtLink :to="`/profile/${post.user.username}`">
            <UiAvatar 
              :src="post.user.profilePicUrl || post.user.avatar" 
              :name="post.user.displayName"
              size="sm"
              class="rounded-lg ring-2 ring-white/20"
            />
          </NuxtLink>
          <div class="flex flex-col">
            <NuxtLink :to="`/profile/${post.user.username}`" class="text-sm font-bold text-white leading-none">
              {{ post.user.displayName }}
            </NuxtLink>
            <span class="text-[10px] text-white/70 font-medium mt-1 uppercase tracking-wider">{{ post.user.role || 'Scholar' }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.fill-1 {
  font-variation-settings: 'FILL' 1;
}

.post-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
}

.post-card:hover {
  border-color: var(--line2);
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
}

.post-content :deep(.highlight-primary) {
  color: var(--primary, #10b981);
  font-weight: 800;
  padding: 0 2px;
}

.post-content :deep(.mention-tag) {
  color: var(--primary, #10b981);
  font-weight: 700;
  text-decoration: none;
}

.post-content :deep(.mention-tag:hover) {
  text-decoration: underline;
}

.post-content {
  white-space: pre-line;
  line-height: 1.6;
}

.caption-clamp {
  overflow: hidden;
  max-height: calc(1.6em * 3);
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  profilePicUrl?: string
  isProfilePublic?: boolean
  role?: string
}

interface Post {
  id: string
  user: User
  content?: string
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
  currentUserId?: string
  allowDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isGuest: false,
  currentUserId: '',
  allowDelete: false,
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(true)
const isMuted = ref(true)
const isCaptionExpanded = ref(false)

const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const isGuest = computed(() => props.isGuest)
const isOwnPost = computed(() => !!props.currentUserId && String(props.post.user.id) === String(props.currentUserId))
const hasMedia = computed(() => !!(props.post.mediaUrl || props.post.image))
const hasContent = computed(() => !!props.post.content)
const isSplitLayout = computed(() => hasMedia.value && hasContent.value && !isCaptionExpanded.value)
const shouldShowCaptionToggle = computed(() => {
  const content = props.post.content || ''
  const normalizedLines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (normalizedLines.length > 3) return true
  return content.length > 180
})

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`
  
  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const formattedTimestamp = computed(() => formatTimestamp(props.post.timestamp))

const hasHighlights = computed(() => {
  const content = props.post.content || ''
  return /[#@]\w+/.test(content) || /^\d+\./m.test(content)
})

const captionSizeClasses = computed(() => {
  const content = props.post.content || ''
  const charCount = content.length
  const lineCount = content.split('\n').length

  if (charCount < 50 && lineCount <= 2) {
    return 'text-lg md:text-xl font-bold tracking-tight leading-tight'
  }
  
  if (charCount < 120 && lineCount <= 5) {
    return 'text-[16px] font-semibold leading-snug'
  }

  return 'text-[14px] leading-relaxed'
})

const highlightedCaption = computed(() => {
  if (!props.post.content) return ''
  
  return props.post.content.split(/\r?\n/).map(line => {
    let processed = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    processed = processed.replace(/(^|\s)([#@]\w+)/g, '$1<span class="mention-tag">$2</span>')

    if (/^\d+\./.test(line.trim())) {
      return `<span class="highlight-primary">${processed}</span>`
    }
    
    return processed
  }).join('\n')
})

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

watch(() => props.post.content, () => {
  isCaptionExpanded.value = false
}, { immediate: true })

defineEmits<{
  like: [postId: string]
  comment: [postId: string]
  delete: [postId: string]
}>()
</script>
