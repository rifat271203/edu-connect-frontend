<template>
  <div class="space-y-10 bg-[var(--terra-background)] text-[var(--terra-on-background)]">
    <!-- Publisher (Create Post) -->
    <div class="pro-card rounded-2xl p-6 bg-[var(--terra-cream)] shadow-terra border-none">
      <div class="flex gap-4">
        <UiAvatar 
          :src="userStore.user?.avatar" 
          :name="userStore.user?.name"
          size="lg"
          class="rounded-xl"
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

    <!-- Top Teachers -->
    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold tracking-tight text-[var(--terra-primary)]">Top Teacher In Your Area</h2>
          <p class="text-sm font-medium text-[var(--terra-tertiary)]">Popular teachers based on student requests and activity</p>
        </div>
        <button class="rounded-xl border border-[var(--terra-outline-variant)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--terra-primary)] transition-all hover:border-[var(--terra-primary)] hover:bg-[var(--terra-cream)]">
          Discover More
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div
          v-for="(teacher, index) in topTeachersToShow"
          :key="`top-${teacher.id}`"
          class="group rounded-[22px] border border-[var(--terra-outline-variant)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--terra-primary)] hover:shadow-terra"
        >
          <div class="mb-4 flex items-start gap-3">
            <UiAvatar 
              :src="teacher.profilePicUrl" 
              :name="teacher.name"
              size="xl"
              class="h-14 w-14 rounded-2xl object-cover"
            />
            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-center justify-between gap-2">
                <p class="truncate text-sm font-black tracking-tight text-[var(--terra-primary)]">{{ teacher.name }}</p>
                <span class="rounded-full bg-[var(--terra-cream)] px-2 py-1 text-[10px] font-black text-[var(--terra-primary)]">#{{ index + 1 }}</span>
              </div>
              <p class="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-tertiary)]">
                {{ teacher.department || 'Teacher' }}
              </p>
              <p class="mt-1 truncate text-xs text-[var(--terra-tertiary)]">
                {{ teacher.institution || 'EduConnect' }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 border-t border-[var(--terra-outline-variant)] pt-3">
            <div class="rounded-2xl bg-[var(--terra-background)] px-3 py-2.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--terra-tertiary)]">Requests</p>
              <p class="mt-1 text-base font-black text-[var(--terra-primary)]">{{ teacher.totalRequests }}</p>
            </div>
            <div class="rounded-2xl bg-[var(--terra-background)] px-3 py-2.5">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--terra-tertiary)]">Posts</p>
              <p class="mt-1 text-base font-black text-[var(--terra-primary)]">{{ teacher.totalPosts }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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

      <template v-for="post in leadingPosts" :key="post.id">
        <PostCard 
          :post="post" 
          @like="handleLike"
          @comment="toggleCommentBox"
        />

        <div
          v-if="openComments[post.id]"
          class="-mt-3 rounded-[22px] border border-[var(--terra-outline-variant)] bg-[var(--surface)] p-4 shadow-sm"
        >
          <div class="space-y-3">
            <div v-if="post.commentItems?.length" class="space-y-3">
              <div
                v-for="comment in post.commentItems"
                :key="comment.id"
                class="flex gap-3 rounded-2xl bg-[var(--terra-background)] px-3 py-3"
              >
                <UiAvatar
                  :src="comment.user.avatar || comment.user.profilePicUrl"
                  :name="comment.user.displayName || comment.user.name"
                  size="sm"
                  class="rounded-xl"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-bold text-[var(--terra-primary)]">
                      {{ comment.user.displayName || comment.user.name }}
                    </p>
                    <span class="text-[11px] text-[var(--terra-tertiary)]">{{ formatCommentTimestamp(comment.timestamp) }}</span>
                  </div>
                  <p class="mt-1 whitespace-pre-wrap break-words text-sm text-[var(--terra-on-background)]">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="rounded-2xl border border-dashed border-[var(--terra-outline-variant)] bg-[var(--terra-background)] px-4 py-5 text-sm text-[var(--terra-tertiary)]"
            >
              No comments yet. Start the conversation.
            </div>

            <div class="flex gap-3 border-t border-[var(--terra-outline-variant)] pt-3">
              <UiAvatar 
                :src="userStore.user?.avatar" 
                :name="userStore.user?.name"
                size="sm"
                class="rounded-xl"
              />
              <div class="flex-1">
                <textarea
                  v-model="commentDrafts[post.id]"
                  rows="2"
                  class="w-full rounded-2xl border border-[var(--terra-outline-variant)] bg-[var(--terra-background)] px-4 py-3 text-sm text-[var(--terra-on-background)] placeholder:text-[var(--terra-tertiary)] focus:border-[var(--terra-primary)] focus:outline-none"
                  placeholder="Write a comment..."
                />
                <div class="mt-3 flex justify-end">
                  <button
                    type="button"
                    class="rounded-xl bg-[var(--terra-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="commentSubmitting[post.id] || !commentDrafts[post.id]?.trim()"
                    @click="submitComment(post.id)"
                  >
                    {{ commentSubmitting[post.id] ? 'Posting...' : 'Comment' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <section v-if="trailingPosts.length" class="space-y-4 rounded-[28px] border border-[var(--terra-outline-variant)] bg-[var(--terra-cream)] p-5">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h3 class="text-lg font-extrabold tracking-tight text-[var(--terra-primary)]">Top Teacher In Your Area</h3>
            <p class="text-sm font-medium text-[var(--terra-tertiary)]">More teachers while you keep scrolling</p>
          </div>
          <span class="rounded-full bg-[var(--surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--terra-tertiary)]">
            Recommended
          </span>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div
            v-for="(teacher, index) in topTeachersToShow"
            :key="`repeat-${teacher.id}`"
            class="group rounded-[22px] border border-[var(--terra-outline-variant)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--terra-primary)] hover:shadow-terra"
          >
            <div class="mb-4 flex items-start gap-3">
              <UiAvatar 
                :src="teacher.profilePicUrl" 
                :name="teacher.name"
                size="xl"
                class="h-14 w-14 rounded-2xl object-cover"
              />
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-black tracking-tight text-[var(--terra-primary)]">{{ teacher.name }}</p>
                  <span class="rounded-full bg-[var(--terra-background)] px-2 py-1 text-[10px] font-black text-[var(--terra-primary)]">#{{ index + 1 }}</span>
                </div>
                <p class="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-tertiary)]">{{ teacher.department || 'Teacher' }}</p>
                <p class="mt-1 truncate text-xs text-[var(--terra-tertiary)]">{{ teacher.institution || 'EduConnect' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 border-t border-[var(--terra-outline-variant)] pt-3">
              <div class="rounded-2xl bg-[var(--terra-background)] px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--terra-tertiary)]">Requests</p>
                <p class="mt-1 text-base font-black text-[var(--terra-primary)]">{{ teacher.totalRequests }}</p>
              </div>
              <div class="rounded-2xl bg-[var(--terra-background)] px-3 py-2.5">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--terra-tertiary)]">Posts</p>
                <p class="mt-1 text-base font-black text-[var(--terra-primary)]">{{ teacher.totalPosts }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <template v-for="post in trailingPosts" :key="post.id">
        <PostCard 
          :post="post" 
          @like="handleLike"
          @comment="toggleCommentBox"
        />

        <div
          v-if="openComments[post.id]"
          class="-mt-3 rounded-[22px] border border-[var(--terra-outline-variant)] bg-[var(--surface)] p-4 shadow-sm"
        >
          <div class="space-y-3">
            <div v-if="post.commentItems?.length" class="space-y-3">
              <div
                v-for="comment in post.commentItems"
                :key="comment.id"
                class="flex gap-3 rounded-2xl bg-[var(--terra-background)] px-3 py-3"
              >
                <UiAvatar
                  :src="comment.user.avatar || comment.user.profilePicUrl"
                  :name="comment.user.displayName || comment.user.name"
                  size="sm"
                  class="rounded-xl"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-bold text-[var(--terra-primary)]">
                      {{ comment.user.displayName || comment.user.name }}
                    </p>
                    <span class="text-[11px] text-[var(--terra-tertiary)]">{{ formatCommentTimestamp(comment.timestamp) }}</span>
                  </div>
                  <p class="mt-1 whitespace-pre-wrap break-words text-sm text-[var(--terra-on-background)]">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="rounded-2xl border border-dashed border-[var(--terra-outline-variant)] bg-[var(--terra-background)] px-4 py-5 text-sm text-[var(--terra-tertiary)]"
            >
              No comments yet. Start the conversation.
            </div>

            <div class="flex gap-3 border-t border-[var(--terra-outline-variant)] pt-3">
              <UiAvatar 
                :src="userStore.user?.avatar" 
                :name="userStore.user?.name"
                size="sm"
                class="rounded-xl"
              />
              <div class="flex-1">
                <textarea
                  v-model="commentDrafts[post.id]"
                  rows="2"
                  class="w-full rounded-2xl border border-[var(--terra-outline-variant)] bg-[var(--terra-background)] px-4 py-3 text-sm text-[var(--terra-on-background)] placeholder:text-[var(--terra-tertiary)] focus:border-[var(--terra-primary)] focus:outline-none"
                  placeholder="Write a comment..."
                />
                <div class="mt-3 flex justify-end">
                  <button
                    type="button"
                    class="rounded-xl bg-[var(--terra-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="commentSubmitting[post.id] || !commentDrafts[post.id]?.trim()"
                    @click="submitComment(post.id)"
                  >
                    {{ commentSubmitting[post.id] ? 'Posting...' : 'Comment' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

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
import PostCard from '~/components/feed/PostCard.vue'
import { getPopularTeachers, type PopularTeacher } from '~/services/api/tuition'

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
const topTeachers = ref<PopularTeacher[]>([])
const openComments = ref<Record<string, boolean>>({})
const commentDrafts = ref<Record<string, string>>({})
const commentSubmitting = ref<Record<string, boolean>>({})

const fallbackTopTeachers: Array<Pick<PopularTeacher, 'id' | 'name' | 'department' | 'profile_pic_url'>> = [
  { id: 1, name: 'Ayesha Rahman', department: 'Physics', profile_pic_url: undefined },
  { id: 2, name: 'Mahin Hasan', department: 'Math', profile_pic_url: undefined },
  { id: 3, name: 'Farhana Islam', department: 'Chemistry', profile_pic_url: undefined },
]

const topTeachersToShow = computed(() => {
  if (topTeachers.value.length) {
    return topTeachers.value.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      department: teacher.department,
      profilePicUrl: teacher.profile_pic_url,
      institution: teacher.institution,
      totalRequests: teacher.total_requests,
      totalPosts: teacher.total_posts,
    }))
  }

  return fallbackTopTeachers.map(teacher => ({
    id: teacher.id,
    name: teacher.name,
    department: teacher.department,
    profilePicUrl: teacher.profile_pic_url,
    institution: 'EduConnect',
    totalRequests: 0,
    totalPosts: 0,
  }))
})

const leadingPosts = computed(() => posts.value.slice(0, 20))
const trailingPosts = computed(() => posts.value.slice(20))

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
const toggleCommentBox = (postId: string) => {
  openComments.value[postId] = !openComments.value[postId]
}

const formatCommentTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const submitComment = async (postId: string) => {
  const commentText = commentDrafts.value[postId]?.trim()
  if (!commentText) return

  commentSubmitting.value[postId] = true
  const result = await postsStore.addCommentToPost(postId, commentText)
  commentSubmitting.value[postId] = false

  if (result.success) {
    commentDrafts.value[postId] = ''
    openComments.value[postId] = true
  }
}

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

const fetchTopTeachers = async () => {
  const result = await getPopularTeachers()
  if (result.success && result.data) {
    topTeachers.value = result.data.slice(0, 5)
  }
}

onMounted(() => {
  postsStore.fetchPosts(true)
  fetchTopTeachers()
})

onBeforeUnmount(() => revokePreviewUrl())
</script>

<style scoped lang="scss">
.no-scrollbar::-webkit-scrollbar { display: none; }
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
