export const useCountdownTimer = (endTime: MaybeRefOrGetter<string | number | Date>) => {
  const timeLeft = ref(0)

  const recalculate = () => {
    const value = toValue(endTime)
    const target = new Date(value).getTime()
    const diff = target - Date.now()
    timeLeft.value = Math.max(0, diff)
  }

  const formatted = computed(() => {
    const totalSeconds = Math.floor(timeLeft.value / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const hh = String(hours).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')
    const ss = String(seconds).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  })

  const isExpired = computed(() => timeLeft.value <= 0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    recalculate()
    intervalId = setInterval(recalculate, 1000)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

  watch(
    () => toValue(endTime),
    () => {
      recalculate()
    },
  )

  return {
    timeLeft,
    formatted,
    isExpired,
  }
}

