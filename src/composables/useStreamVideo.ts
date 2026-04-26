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
  const call = shallowRef<Call | null>(null)
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

  const joinCall = async (roomId: string, type: string = 'default', options: { audio?: boolean, video?: boolean } = { audio: true, video: true }) => {
    const streamClient = await initClient()
    if (!streamClient) return null

    try {
      const newCall = streamClient.call(type, roomId)
      
      await newCall.join({ create: true })

      // Explicitly enable media based on options
      if (options.video) {
        try {
          // Debugging: Log available devices
          if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(d => d.kind === 'videoinput')
            console.log('[StreamVideo] Detected video devices:', videoDevices.length ? videoDevices : 'NONE FOUND BY BROWSER')
          }
          await newCall.camera.enable()
        } catch (e: any) {
          if (e.name === 'NotAllowedError' || e.name === 'NotFoundError' || e.name === 'NotReadableError') {
            console.warn(`[StreamVideo] Camera access failed (${e.name}):`, e.message)
          } else {
            console.error('[StreamVideo] Camera enable failed:', e)
          }
        }
      }
      
      if (options.audio) {
        try {
          await newCall.microphone.enable()
        } catch (e: any) {
          if (e.name === 'NotAllowedError' || e.name === 'NotFoundError' || e.name === 'NotReadableError') {
            console.warn(`[StreamVideo] Microphone access failed (${e.name}):`, e.message)
          } else {
            console.error('[StreamVideo] Microphone enable failed:', e)
          }
        }
      }

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
