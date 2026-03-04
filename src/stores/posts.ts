import { defineStore } from 'pinia'
import { addComment, createPost, getFeedPosts, likePost, unlikePost, uploadPostMedia } from '~/services/api/social'
import type { Post } from '~/types/post'

interface PostsState {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
  limit: number
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    limit: 20,
  }),
  
  getters: {
    getPosts: (state) => state.posts,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  
  actions: {
    async fetchPosts(reset = false) {
      if (this.loading) return

      if (reset) {
        this.page = 1
        this.hasMore = true
      }

      if (!this.hasMore && !reset) {
        return
      }
      
      this.loading = true
      this.error = null

      const offset = (this.page - 1) * this.limit
      const result = await getFeedPosts(this.limit, offset)

      if (result.success && result.data) {
        const incomingPosts = result.data

        if (this.page === 1 || reset) {
          this.posts = incomingPosts
        } else {
          const existingIds = new Set(this.posts.map((post) => post.id))
          const uniqueIncoming = incomingPosts.filter((post) => !existingIds.has(post.id))
          this.posts = [...this.posts, ...uniqueIncoming]
        }

        this.hasMore = incomingPosts.length === this.limit
      } else {
        this.error = result.error || 'Unable to load posts'

        if (this.page === 1) {
          this.posts = []
        }
      }
      
      this.loading = false
    },

    async createNewPost(content: string, mediaFile?: File | null) {
      const trimmedContent = content.trim()
      if (!trimmedContent && !mediaFile) {
        return { success: false, error: 'Post content cannot be empty' }
      }

      let mediaUrl: string | undefined

      if (mediaFile) {
        const uploadResult = await uploadPostMedia(mediaFile)
        if (!uploadResult.success || !uploadResult.data?.mediaUrl) {
          return {
            success: false,
            error: uploadResult.error || 'Failed to upload media',
            status: uploadResult.status,
          }
        }

        mediaUrl = uploadResult.data.mediaUrl
      }

      const result = await createPost({
        content: trimmedContent,
        mediaUrl,
        privacy: 'public',
      })

      if (result.success && result.data) {
        this.posts.unshift(result.data)
      }

      return result
    },
    
    async loadMore() {
      if (this.loading || !this.hasMore) return
      
      this.page++
      await this.fetchPosts()
    },
    
    async toggleLike(postId: string) {
      const post = this.posts.find(p => p.id === postId)
      if (!post) return

      const wasLiked = post.isLiked
      post.isLiked = !wasLiked
      post.likes += post.isLiked ? 1 : -1

      const result = post.isLiked ? await likePost(postId) : await unlikePost(postId)

      if (!result.success) {
        post.isLiked = wasLiked
        post.likes += post.isLiked ? 1 : -1
        this.error = result.error || 'Failed to update like status'
      }
    },

    async addCommentToPost(postId: string, commentText: string) {
      const post = this.posts.find((p) => p.id === postId)
      if (!post) {
        return { success: false, error: 'Post not found' }
      }

      const trimmedComment = commentText.trim()
      if (!trimmedComment) {
        return { success: false, error: 'Comment cannot be empty' }
      }

      const previousCount = post.comments
      post.comments += 1

      const result = await addComment(postId, { commentText: trimmedComment })

      if (!result.success) {
        post.comments = previousCount
        this.error = result.error || 'Failed to add comment'
      }

      return result
    }
  }
})
