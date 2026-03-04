<template>
  <div class="max-w-2xl mx-auto p-4 pb-24 lg:pb-4">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--text)]">Home</h1>
      <p class="text-[var(--text-2)]">See what your classmates are up to</p>
    </header>

    <!-- Create Post -->
    <UiCard class="feed-composer mb-6 p-4">
      <div class="flex items-start gap-3">
        <UiAvatar 
          :src="userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.name || 'user'}`"
          :name="userStore.user?.name || 'User'"
          size="md"
        />
        <div class="flex-1">
          <textarea
            v-model="newPostContent"
            rows="3"
            class="textarea-field px-4 resize-none"
            placeholder="What's on your mind?"
          />

          <div v-if="mediaPreviewUrl" class="mt-3 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
            <img
              v-if="selectedMediaType === 'image'"
              :src="mediaPreviewUrl"
              alt="Selected media preview"
              class="w-full max-h-80 object-cover"
            />
            <video
              v-else
              :src="mediaPreviewUrl"
              controls
              class="w-full max-h-80 bg-black/70"
              preload="metadata"
            />
          </div>

          <input
            ref="mediaInputRef"
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-matroska"
            @change="handleMediaSelected"
          />

          <div class="feed-composer__actions flex-wrap">
            <div class="flex items-center gap-2">
              <UiButton variant="secondary" @click="openMediaPicker">
                Add photo/video
              </UiButton>
              <span v-if="selectedMediaFile" class="text-xs text-[var(--text-3)] max-w-[200px] truncate" :title="selectedMediaFile.name">
                {{ selectedMediaFile.name }}
              </span>
              <button
                v-if="selectedMediaFile"
                type="button"
                class="text-xs text-[var(--danger)] hover:opacity-80 transition-colors"
                @click="clearSelectedMedia"
              >
                Remove
              </button>
            </div>

            <UiButton :disabled="creatingPost || (!newPostContent.trim() && !selectedMediaFile)" @click="handleCreatePost">
              {{ creatingPost ? 'Posting...' : 'Post' }}
            </UiButton>
          </div>
        </div>
      </div>
    </UiCard>

    <p v-if="displayError" class="mb-4 text-sm text-[var(--danger)]">{{ displayError }}</p>
    
    <!-- Posts Feed -->
    <div class="space-y-4">
      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="animate-fade-in scroll-optimized-item"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <FeedPostCard
          :post="post"
          @like="handleLike"
          @comment="toggleCommentBox"
        />

        <UiCard v-if="isCommentBoxOpen(post.id)" class="mt-2 p-3">
          <div class="flex items-start gap-3">
            <UiAvatar
              :src="userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.name || 'user'}`"
              :name="userStore.user?.name || 'User'"
              size="sm"
            />

            <div class="flex-1">
              <textarea
                v-model="commentDrafts[post.id]"
                rows="2"
                class="textarea-field !min-h-[84px] px-3 resize-none"
                placeholder="Write a comment..."
                @keydown.enter.exact.prevent="submitComment(post.id)"
              />

              <div class="mt-2 flex items-center justify-end gap-2">
                <UiButton variant="ghost" @click="closeCommentBox(post.id)">
                  Cancel
                </UiButton>
                <UiButton
                  :disabled="isCommentSubmitting(post.id) || !getCommentDraft(post.id).trim()"
                  @click="submitComment(post.id)"
                >
                  {{ isCommentSubmitting(post.id) ? 'Posting...' : 'Comment' }}
                </UiButton>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <UiCard v-for="i in 3" :key="i" class="p-4">
        <div class="flex items-center gap-3 mb-4">
          <UiSkeleton variant="circular" class="w-10 h-10" />
          <div class="flex-1">
            <UiSkeleton variant="text" class="w-32 mb-2" />
            <UiSkeleton variant="text" class="w-24" />
          </div>
        </div>
        <UiSkeleton variant="rectangular" class="h-48 mb-4" />
        <UiSkeleton variant="text" class="w-full mb-2" />
        <UiSkeleton variant="text" class="w-3/4" />
      </UiCard>
    </div>
    
    <!-- Load more -->
    <div v-if="hasMore && !loading" class="text-center mt-6">
      <UiButton variant="secondary" @click="loadMore">
        Load more
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { usePostsStore } from '~/stores/posts'

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
const openCommentPostIds = ref<string[]>([])
const commentDrafts = ref<Record<string, string>>({})
const commentSubmittingByPost = ref<Record<string, boolean>>({})

const allowedMediaTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
])

const maxMediaBytes = 50 * 1024 * 1024

const displayError = computed(() => localError.value || error.value)

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

  if (mediaInputRef.value) {
    mediaInputRef.value.value = ''
  }
}

const openMediaPicker = () => {
  mediaInputRef.value?.click()
}

const handleMediaSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  localError.value = ''

  if (!allowedMediaTypes.has(file.type)) {
    localError.value = 'Unsupported file type. Please upload a supported image or video.'
    clearSelectedMedia()
    return
  }

  if (file.size > maxMediaBytes) {
    localError.value = 'File is too large. Maximum allowed size is 50MB.'
    clearSelectedMedia()
    return
  }

  revokePreviewUrl()
  selectedMediaFile.value = file
  selectedMediaType.value = file.type.startsWith('video/') ? 'video' : 'image'
  mediaPreviewUrl.value = URL.createObjectURL(file)
}

const handleLike = async (postId: string) => {
  await postsStore.toggleLike(postId)
}

const isCommentBoxOpen = (postId: string) => openCommentPostIds.value.includes(postId)

const toggleCommentBox = (postId: string) => {
  if (isCommentBoxOpen(postId)) {
    openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
    return
  }

  openCommentPostIds.value.push(postId)
  if (commentDrafts.value[postId] === undefined) {
    commentDrafts.value[postId] = ''
  }
}

const closeCommentBox = (postId: string) => {
  openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
}

const getCommentDraft = (postId: string) => commentDrafts.value[postId] || ''

const isCommentSubmitting = (postId: string) => Boolean(commentSubmittingByPost.value[postId])

const submitComment = async (postId: string) => {
  const draft = getCommentDraft(postId).trim()
  if (!draft || isCommentSubmitting(postId)) return

  localError.value = ''
  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: true,
  }

  const result = await postsStore.addCommentToPost(postId, draft)

  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: false,
  }

  if (result.success) {
    commentDrafts.value = {
      ...commentDrafts.value,
      [postId]: '',
    }
    closeCommentBox(postId)
    return
  }

  localError.value = result.error || 'Failed to add comment'
}

const handleCreatePost = async () => {
  if (!newPostContent.value.trim() && !selectedMediaFile.value) return

  localError.value = ''
  creatingPost.value = true
  const result = await postsStore.createNewPost(newPostContent.value.trim(), selectedMediaFile.value)
  creatingPost.value = false

  if (result.success) {
    newPostContent.value = ''
    clearSelectedMedia()
  } else {
    localError.value = result.error || 'Failed to publish post'
  }
}

const loadMore = async () => {
  await postsStore.loadMore()
}

onMounted(async () => {
  await postsStore.fetchPosts(true)
})

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>
