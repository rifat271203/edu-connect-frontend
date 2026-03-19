<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-dark-700 dark:bg-dark-900">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5"
          :class="viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
          @click="viewMode = 'list'"
        >
          List View
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5"
          :class="viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
          @click="viewMode = 'calendar'"
        >
          Calendar View
        </button>
      </div>

      <BaseButton v-if="isTeacher" @click="sessionModalOpen = true">+ Add Session</BaseButton>
    </div>

    <section v-if="viewMode === 'list'" class="space-y-4">
      <div v-for="group in groupedSessions" :key="group.title" class="space-y-2">
        <h3 class="text-sm font-semibold text-slate-600 dark:text-dark-200">{{ group.title }}</h3>
        <div class="space-y-2">
          <BaseCard
            v-for="session in group.items"
            :key="session.id"
            class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
          >
            <div class="flex gap-3">
              <span class="w-1 rounded-full" :class="typeBorder(session.type)" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-sm font-semibold">{{ session.title }}</p>
                  <div class="flex items-center gap-2">
                    <BaseBadge size="sm" variant="neutral">{{ session.type }}</BaseBadge>
                    <BaseBadge size="sm" :variant="statusBadge(session.status)">{{ session.status }}</BaseBadge>
                  </div>
                </div>
                <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">
                  {{ formatDate(session.startAt) }} • {{ formatTime(session.startAt) }} - {{ formatTime(session.endAt) }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    v-if="session.meetingLink"
                    :href="session.meetingLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    Join meeting
                  </a>
                  <span v-else-if="session.location" class="text-slate-500 dark:text-dark-300">{{ session.location }}</span>
                </div>

                <div v-if="isTeacher" class="mt-3 flex gap-2">
                  <BaseButton size="sm" variant="ghost" @click="editSession(session.id)">Edit</BaseButton>
                  <BaseButton size="sm" variant="danger" @click="cancelSession(session.id)">Cancel</BaseButton>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>

    <section v-else class="space-y-3">
      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <div class="mb-3 flex items-center justify-between">
          <button type="button" class="rounded-lg border px-2 py-1 text-xs" @click="shiftMonth(-1)">← Prev</button>
          <div class="text-sm font-semibold">{{ monthLabel }}</div>
          <div class="flex items-center gap-2">
            <button type="button" class="rounded-lg border px-2 py-1 text-xs" @click="goToday">Today</button>
            <button type="button" class="rounded-lg border px-2 py-1 text-xs" @click="shiftMonth(1)">Next →</button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-slate-500 dark:text-dark-300">
          <div v-for="day in weekDays" :key="day">{{ day }}</div>
        </div>

        <div class="mt-2 grid grid-cols-7 gap-2">
          <button
            v-for="day in calendarCells"
            :key="day.key"
            type="button"
            class="relative min-h-[72px] rounded-lg border border-slate-200 p-2 text-left dark:border-dark-700"
            :class="day.inCurrentMonth ? 'bg-white dark:bg-dark-900' : 'bg-slate-50 text-slate-400 dark:bg-dark-800 dark:text-dark-400'"
            @click="selectedDate = day.date"
          >
            <p class="text-xs font-medium">{{ day.date.getDate() }}</p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="dot in dayDots(day.date)"
                :key="`${day.key}-${dot}-${Math.random()}`"
                class="h-1.5 w-1.5 rounded-full"
                :class="dotClass(dot)"
              />
            </div>
          </button>
        </div>
      </BaseCard>

      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">{{ selectedDateLabel }}</h3>
        <div class="mt-2 space-y-2">
          <div
            v-for="session in selectedDateSessions"
            :key="session.id"
            class="rounded-lg border border-slate-200 p-2 text-sm dark:border-dark-700"
          >
            <p class="font-medium">{{ session.title }}</p>
            <p class="text-xs text-slate-500 dark:text-dark-300">{{ formatTime(session.startAt) }} - {{ formatTime(session.endAt) }}</p>
          </div>
          <p v-if="!selectedDateSessions.length" class="text-xs text-slate-500 dark:text-dark-300">No sessions for this day.</p>
        </div>
      </BaseCard>
    </section>

    <BaseModal v-model="sessionModalOpen" :title="editingSessionId ? 'Edit Session' : 'Add Session'" size="lg">
      <div class="space-y-3">
        <BaseInput v-model="sessionForm.title" placeholder="Title" :error="sessionErrors.title" />
        <textarea
          v-model="sessionForm.description"
          class="textarea-field min-h-[90px] w-full rounded-xl px-3 py-2 text-sm"
          placeholder="Description"
        />
        <BaseSelect v-model="sessionForm.type" :options="typeOptions" placeholder="Type" />

        <div class="grid gap-3 md:grid-cols-2">
          <BaseInput v-model="sessionForm.startAt" type="datetime-local" placeholder="Start" :error="sessionErrors.startAt" />
          <BaseInput v-model="sessionForm.endAt" type="datetime-local" placeholder="End" :error="sessionErrors.endAt" />
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <BaseInput v-model="sessionForm.location" placeholder="Location" />
          <BaseInput v-model="sessionForm.meetingLink" placeholder="Meeting link" />
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="sessionForm.recurring" type="checkbox">
          Recurring (weekly)
        </label>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="closeSessionModal">Cancel</BaseButton>
          <BaseButton @click="saveSession">Save Session</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ClassroomSession, SessionType } from '~/types/classroom-room'
import { useScheduleStore } from '~/stores/schedule'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const scheduleStore = useScheduleStore()
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Schedule`,
}))

const viewMode = ref<'list' | 'calendar'>('list')
const selectedDate = ref(new Date())

const sessionModalOpen = ref(false)
const editingSessionId = ref('')

const sessionForm = reactive({
  title: '',
  description: '',
  type: 'lecture',
  startAt: '',
  endAt: '',
  location: '',
  meetingLink: '',
  recurring: false,
})

const sessionErrors = reactive({
  title: '',
  startAt: '',
  endAt: '',
})

const typeOptions = [
  { label: 'Lecture', value: 'lecture' },
  { label: 'Lab', value: 'lab' },
  { label: 'Exam', value: 'exam' },
  { label: 'Holiday', value: 'holiday' },
]

const sessions = computed(() => scheduleStore.sessionsByCourse(courseId.value))

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const groupLabel = (startAt: string) => {
  const date = new Date(startAt)
  const now = new Date()
  const tomorrow = new Date(Date.now() + 86400 * 1000)
  const weekEnd = new Date(Date.now() + 7 * 86400 * 1000)

  if (isSameDay(date, now)) return 'Today'
  if (isSameDay(date, tomorrow)) return 'Tomorrow'
  if (date <= weekEnd) return 'This Week'
  return 'Later'
}

const groupedSessions = computed(() => {
  const map = new Map<string, ClassroomSession[]>()

  for (const session of sessions.value) {
    const label = groupLabel(session.startAt)
    const list = map.get(label) || []
    list.push(session)
    map.set(label, list)
  }

  const order = ['Today', 'Tomorrow', 'This Week', 'Later']
  return order
    .filter((title) => map.has(title))
    .map((title) => ({
      title,
      items: (map.get(title) || []).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    }))
})

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

const typeBorder = (type: string) => {
  if (type === 'lecture') return 'bg-indigo-500'
  if (type === 'lab') return 'bg-emerald-500'
  if (type === 'exam') return 'bg-red-500'
  return 'bg-yellow-500'
}

const dotClass = typeBorder

const statusBadge = (status: string) => {
  if (status === 'cancelled') return 'danger'
  if (status === 'completed') return 'neutral'
  if (status === 'ongoing') return 'success'
  return 'accent'
}

const monthCursor = computed(() => {
  const [year, month] = scheduleStore.calendarMonth.split('-').map(Number)
  return new Date(year, month - 1, 1)
})

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'long',
    year: 'numeric',
  }).format(monthCursor.value),
)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarCells = computed(() => {
  const firstDay = new Date(monthCursor.value.getFullYear(), monthCursor.value.getMonth(), 1)
  const startWeekDay = firstDay.getDay()
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - startWeekDay)

  return Array.from({ length: 42 }).map((_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return {
      key: `${date.toISOString()}-${index}`,
      date,
      inCurrentMonth: date.getMonth() === monthCursor.value.getMonth(),
    }
  })
})

const dayDots = (date: Date) =>
  sessions.value
    .filter((session) => isSameDay(new Date(session.startAt), date))
    .map((session) => session.type)
    .slice(0, 3)

const selectedDateLabel = computed(() =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(selectedDate.value),
)

const selectedDateSessions = computed(() =>
  sessions.value.filter((session) => isSameDay(new Date(session.startAt), selectedDate.value)),
)

const shiftMonth = (delta: number) => {
  const date = new Date(monthCursor.value)
  date.setMonth(date.getMonth() + delta)
  scheduleStore.calendarMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const goToday = () => {
  const today = new Date()
  scheduleStore.calendarMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  selectedDate.value = today
}

const toLocalInput = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60_000
  const local = new Date(date.getTime() - tzOffset)
  return local.toISOString().slice(0, 16)
}

const resetSessionForm = () => {
  sessionForm.title = ''
  sessionForm.description = ''
  sessionForm.type = 'lecture'
  sessionForm.startAt = toLocalInput(new Date(Date.now() + 3 * 3600 * 1000))
  sessionForm.endAt = toLocalInput(new Date(Date.now() + 4 * 3600 * 1000))
  sessionForm.location = ''
  sessionForm.meetingLink = ''
  sessionForm.recurring = false
  sessionErrors.title = ''
  sessionErrors.startAt = ''
  sessionErrors.endAt = ''
}

const closeSessionModal = () => {
  sessionModalOpen.value = false
  editingSessionId.value = ''
}

const editSession = (sessionId: string) => {
  const session = sessions.value.find((item) => item.id === sessionId)
  if (!session) return

  editingSessionId.value = sessionId
  sessionForm.title = session.title
  sessionForm.description = session.description || ''
  sessionForm.type = session.type
  sessionForm.startAt = toLocalInput(new Date(session.startAt))
  sessionForm.endAt = toLocalInput(new Date(session.endAt))
  sessionForm.location = session.location || ''
  sessionForm.meetingLink = session.meetingLink || ''
  sessionForm.recurring = false
  sessionModalOpen.value = true
}

const validate = () => {
  sessionErrors.title = sessionForm.title.trim() ? '' : 'Title is required'
  sessionErrors.startAt = sessionForm.startAt ? '' : 'Start required'
  sessionErrors.endAt = sessionForm.endAt ? '' : 'End required'

  if (!sessionErrors.startAt && !sessionErrors.endAt) {
    const validRange = new Date(sessionForm.endAt).getTime() > new Date(sessionForm.startAt).getTime()
    if (!validRange) {
      sessionErrors.endAt = 'End must be after start'
    }
  }

  return !sessionErrors.title && !sessionErrors.startAt && !sessionErrors.endAt
}

const saveOneSession = (startAtIso: string, endAtIso: string) => {
  const payload: ClassroomSession = {
    id: editingSessionId.value || `${courseId.value}-session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    courseId: courseId.value,
    title: sessionForm.title.trim(),
    description: sessionForm.description.trim() || undefined,
    type: sessionForm.type as SessionType,
    startAt: startAtIso,
    endAt: endAtIso,
    location: sessionForm.location.trim() || undefined,
    meetingLink: sessionForm.meetingLink.trim() || undefined,
    status: 'scheduled',
  }

  scheduleStore.saveSession(payload)
}

const saveSession = () => {
  if (!validate()) return

  const startAtIso = new Date(sessionForm.startAt).toISOString()
  const endAtIso = new Date(sessionForm.endAt).toISOString()

  saveOneSession(startAtIso, endAtIso)

  if (!editingSessionId.value && sessionForm.recurring) {
    for (let week = 1; week <= 3; week += 1) {
      const nextStart = new Date(startAtIso)
      const nextEnd = new Date(endAtIso)
      nextStart.setDate(nextStart.getDate() + week * 7)
      nextEnd.setDate(nextEnd.getDate() + week * 7)
      saveOneSession(nextStart.toISOString(), nextEnd.toISOString())
    }
  }

  closeSessionModal()
  toast.success('Session saved')
}

const cancelSession = (sessionId: string) => {
  scheduleStore.cancelSession(sessionId)
  toast.success('Session cancelled')
}

onMounted(() => {
  resetSessionForm()
})
</script>

