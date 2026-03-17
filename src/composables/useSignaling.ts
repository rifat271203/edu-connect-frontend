// src/composables/useSignaling.ts
import { io, type Socket } from 'socket.io-client'
import type {
  ClassroomClientToServerEvents,
  ClassroomServerToClientEvents,
} from '~/types/classroom'

type ClassroomSocket = Socket<ClassroomServerToClientEvents, ClassroomClientToServerEvents>

const socket = shallowRef<ClassroomSocket | null>(null)
const isConnected = ref(false)
let tokenWatcherBound = false

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '')

const resolveSignalUrl = (): string => {
  const config = useRuntimeConfig()

  if (typeof config.public.signalUrl === 'string' && config.public.signalUrl.trim()) {
    return normalizeUrl(config.public.signalUrl)
  }

  if (typeof config.public.apiUrl === 'string' && config.public.apiUrl.trim()) {
    return normalizeUrl(config.public.apiUrl)
  }

  if (typeof config.public.backendUrl === 'string' && config.public.backendUrl.trim()) {
    return normalizeUrl(config.public.backendUrl)
  }

  return ''
}

const resolveToken = (): string | null => {
  const sessionStore = useSessionStore()
  if (sessionStore.token) {
    return sessionStore.token
  }

  if (!process.client) {
    return null
  }

  return localStorage.getItem('educonnect_token')
}

const bindConnectionStateListeners = (instance: ClassroomSocket) => {
  instance.on('connect', () => {
    isConnected.value = true
  })

  instance.on('disconnect', () => {
    isConnected.value = false
  })

  instance.on('connect_error', () => {
    isConnected.value = false
  })
}

export const useSignaling = () => {
  const sessionStore = useSessionStore()
  const vm = getCurrentInstance()

  const connect = (forceReconnect = false): ClassroomSocket | null => {
    if (!process.client) {
      return null
    }

    if (socket.value?.connected && !forceReconnect) {
      return socket.value
    }

    if (socket.value && (forceReconnect || !socket.value.connected)) {
      socket.value.removeAllListeners()
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }

    const token = resolveToken()

    const instance: ClassroomSocket = io(resolveSignalUrl(), {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      auth: {
        token,
      },
    })

    bindConnectionStateListeners(instance)
    socket.value = instance

    return instance
  }

  const disconnect = () => {
    if (!socket.value) return

    socket.value.removeAllListeners()
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const emit = <E extends keyof ClassroomClientToServerEvents>(
    event: E,
    ...args: Parameters<ClassroomClientToServerEvents[E]>
  ) => {
    if (!socket.value) {
      connect()
    }

    socket.value?.emit(event, ...args)
  }

  const on = <E extends keyof ClassroomServerToClientEvents>(
    event: E,
    handler: ClassroomServerToClientEvents[E],
  ) => {
    if (!socket.value) {
      connect()
    }

    if (!socket.value) return () => undefined

    socket.value.on(event, handler as never)

    return () => {
      socket.value?.off(event, handler as never)
    }
  }

  if (!tokenWatcherBound) {
    tokenWatcherBound = true

    watch(
      () => sessionStore.token,
      (nextToken, prevToken) => {
        if (!process.client || nextToken === prevToken || !nextToken) return

        connect(true)
      },
    )
  }

  if (vm) {
    onMounted(() => {
      connect()
    })

    onUnmounted(() => {
      disconnect()
    })
  }

  return {
    socket,
    isConnected: readonly(isConnected),
    emit,
    on,
    connect,
    disconnect,
  }
}
