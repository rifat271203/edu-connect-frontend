import { defineStore } from 'pinia'
import * as tuitionApi from '~/services/api/tuition'
import type { TuitionPost, TuitionConnectRequest, TuitionCreateRequest } from '~/services/api/tuition'

export const useTuitionStore = defineStore('tuition', {
  state: () => ({
    posts: [] as TuitionPost[],
    receivedRequests: [] as TuitionConnectRequest[],
    sentRequests: [] as TuitionConnectRequest[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      const result = await tuitionApi.getAllTuitionPosts()
      if (result.success && result.data) {
        this.posts = result.data
      } else {
        this.error = result.error || 'Failed to fetch tuition posts'
      }
      this.loading = false
    },

    async createPost(data: TuitionCreateRequest) {
      this.loading = true
      const result = await tuitionApi.createTuitionPost(data)
      if (result.success) {
        await this.fetchPosts()
      }
      this.loading = false
      return result
    },

    async connectToPost(postId: number) {
      const result = await tuitionApi.requestToConnect(postId)
      if (result.success) {
        await this.fetchSentRequests()
      }
      return result
    },

    async fetchReceivedRequests() {
      this.loading = true
      const result = await tuitionApi.getReceivedConnectRequests()
      if (result.success && result.data) {
        this.receivedRequests = result.data
      }
      this.loading = false
    },

    async fetchSentRequests() {
      this.loading = true
      const result = await tuitionApi.getSentConnectRequests()
      if (result.success && result.data) {
        this.sentRequests = result.data
      }
      this.loading = false
    },

    async handleRequest(requestId: number, status: 'approved' | 'rejected') {
      const result = await tuitionApi.handleConnectRequest(requestId, status)
      if (result.success) {
        await this.fetchReceivedRequests()
      }
      return result
    }
  }
})
