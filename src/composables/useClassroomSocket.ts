import { io, type Socket } from 'socket.io-client'

export const useClassroomSocket = (courseId: string) => {
  const runtimeConfig = useRuntimeConfig()
  const socketUrl = runtimeConfig.public.socketUrl || runtimeConfig.public.backendUrl
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  const connect = () => {
    if (!process.client || socket.value) return

    const token = localStorage.getItem('educonnect_token') || ''

    const instance = io(socketUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
      query: {
        courseId,
      },
    })

    instance.on('connect', () => {
      isConnected.value = true
      instance.emit('classroom:join', { courseId })
    })

    instance.on('disconnect', () => {
      isConnected.value = false
    })

    socket.value = instance
  }

  const disconnect = () => {
    if (!socket.value) return
    socket.value.emit('classroom:leave', { courseId })
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const on = <T = unknown>(event: string, handler: (payload: T) => void) => {
    socket.value?.on(event, handler as (...args: unknown[]) => void)
  }

  const off = (event: string) => {
    socket.value?.off(event)
  }

  const emit = (event: string, payload?: Record<string, unknown>) => {
    socket.value?.emit(event, {
      courseId,
      ...(payload || {}),
    })
  }

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    on,
    off,
    emit,
  }
}

