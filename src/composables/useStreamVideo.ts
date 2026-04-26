import {
  StreamVideoClient,
  type Call,
  type User,
  CallState,
} from '@stream-io/video-client'
import { getStreamToken } from '~/services/api/classroom'
import { useUserStore } from '~/stores/user'

export const useStreamVideo = () => {
  const userStore = useUserStore()
  const runtimeConfig = useRuntimeConfig()
  
  const client = shallowRef<StreamVideoClient | null>(null)
  const call = ref<Call | null>(null)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)

  const initClient = async () => {
    if (client.value) return client.value
    if (!userStore.user) {
      error.value = 'User not authenticated'
      return null
    }

    isConnecting.value = true
    error.value = null

    try {
      const response = await getStreamToken()
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch Stream token')
      }

      const { token, apiKey } = response.data
      const user: User = {
        id: userStore.user.id.toString(),
        name: userStore.user.displayName,
        image: userStore.user.avatar,
      }

      const streamClient = new StreamVideoClient({
        apiKey: apiKey || runtimeConfig.public.streamApiKey,
        user,
        token,
      })

      client.value = streamClient
      return streamClient
    } catch (err: any) {
      error.value = err.message
      console.error('[StreamVideo] Init failed:', err)
      return null
    } finally {
      isConnecting.value = false
    }
  }

  const joinCall = async (roomId: string, type: string = 'default') => {
    const streamClient = await initClient()
    if (!streamClient) return null

    try {
      const newCall = streamClient.call(type, roomId)
      await newCall.join({ create: true })
      call.value = newCall
      return newCall
    } catch (err: any) {
      error.value = err.message
      console.error('[StreamVideo] Join failed:', err)
      return null
    }
  }

  const leaveCall = async () => {
    if (call.value) {
      await call.value.leave()
      call.value = null
    }
  }

  const disconnect = async () => {
    await leaveCall()
    if (client.value) {
      await client.value.disconnectUser()
      client.value = null
    }
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    client,
    call,
    isConnecting,
    error,
    initClient,
    joinCall,
    leaveCall,
    disconnect,
  }
}
