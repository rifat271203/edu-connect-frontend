import { io, type Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)

export const useGlobalSocket = () => {
  const runtimeConfig = useRuntimeConfig()
  
  const resolveSocketUrl = (): string => {
    const configuredUrl =
      runtimeConfig.public.socketUrl ||
      runtimeConfig.public.backendUrl ||
      'https://edu-connect-backend-bcf0.onrender.com'
    return configuredUrl.replace(/\/+$/, '')
  }

  const connect = () => {
    if (!process.client || (socket.value && socket.value.connected)) return

    const token = localStorage.getItem('educonnect_token')
    if (!token) return

    socket.value = io(resolveSocketUrl(), {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10
    })

    socket.value.on('connect', () => {
      console.log('[GlobalSocket] Connected')
    })

    socket.value.on('connect_error', (err) => {
      console.error('[GlobalSocket] Connection error:', err)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const on = <T = any>(event: string, handler: (payload: T) => void) => {
    socket.value?.on(event, handler)
  }

  const off = (event: string, handler?: any) => {
    if (handler) {
      socket.value?.off(event, handler)
    } else {
      socket.value?.off(event)
    }
  }

  return {
    socket,
    connect,
    disconnect,
    on,
    off
  }
}
