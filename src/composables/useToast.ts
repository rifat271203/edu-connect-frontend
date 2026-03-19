type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  duration: number
}

const defaultDurations: Record<ToastType, number> = {
  success: 2600,
  error: 3600,
  info: 2600,
}

export const useToast = () => {
  const toasts = useState<ToastItem[]>('base-toasts', () => [])

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const add = (payload: {
    title: string
    message?: string
    type?: ToastType
    duration?: number
  }) => {
    const type = payload.type || 'info'
    const duration = payload.duration ?? defaultDurations[type]

    const toast: ToastItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: payload.title,
      message: payload.message,
      type,
      duration,
    }

    toasts.value = [...toasts.value, toast]

    if (duration > 0 && process.client) {
      window.setTimeout(() => remove(toast.id), duration)
    }

    return toast.id
  }

  const success = (title: string, message?: string, duration?: number) =>
    add({ title, message, duration, type: 'success' })

  const error = (title: string, message?: string, duration?: number) =>
    add({ title, message, duration, type: 'error' })

  const info = (title: string, message?: string, duration?: number) =>
    add({ title, message, duration, type: 'info' })

  return {
    toasts,
    add,
    success,
    error,
    info,
    remove,
  }
}

