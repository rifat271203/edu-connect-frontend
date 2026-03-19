<template>
  <div class="flex h-[calc(100vh-8.25rem)] min-h-[520px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
    <header class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-dark-700">
      <div>
        <h2 class="text-sm font-semibold">Message Room</h2>
        <p class="text-xs text-slate-500 dark:text-dark-300">Realtime class chat</p>
      </div>
      <BaseBadge :variant="chatStore.isConnected ? 'success' : 'warning'" size="sm" dot>
        {{ chatStore.isConnected ? 'Connected' : 'Offline' }}
      </BaseBadge>
    </header>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <div class="border-b border-slate-200 px-4 py-2 dark:border-dark-700">
        <BaseButton size="sm" variant="ghost" @click="loadMore">Load more</BaseButton>
      </div>

      <div ref="messagesContainerRef" class="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
        <template v-for="(row, idx) in renderedRows" :key="row.id">
          <div v-if="row.type === 'separator'" class="py-1 text-center text-[11px] font-medium text-slate-400 dark:text-dark-400">
            {{ row.label }}
          </div>

          <div
            v-else
            class="group flex gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 dark:border-dark-700 dark:hover:bg-dark-800/60"
            :class="isOwnMessage(row.message) ? 'border-indigo-200 dark:border-indigo-900/50' : ''"
          >
            <UiAvatar :name="row.message.senderName" :src="row.message.senderAvatar" size="sm" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ row.message.senderName }}</p>
                <BaseBadge v-if="row.message.isTeacher" size="sm" variant="accent">Teacher</BaseBadge>
                <p class="text-[11px] text-slate-400 dark:text-dark-400">{{ formatMessageTime(row.message.createdAt) }}</p>
              </div>
              <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-dark-100">{{ row.message.content }}</p>

              <div v-if="row.message.attachment" class="mt-2 rounded-lg border border-slate-200 p-2 dark:border-dark-700">
                <img
                  v-if="row.message.attachment.type.startsWith('image/')"
                  :src="row.message.attachment.url"
                  :alt="row.message.attachment.name"
                  class="max-h-44 w-auto rounded-md border border-slate-200 object-cover dark:border-dark-700"
                >
                <a
                  v-else
                  :href="row.message.attachment.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  📎 {{ row.message.attachment.name }}
                </a>
              </div>
            </div>

            <button
              v-if="canDelete(row.message)"
              type="button"
              class="opacity-0 transition group-hover:opacity-100"
              @click="deleteMessage(row.message.id)"
            >
              <span class="text-xs text-red-500">Delete</span>
            </button>
          </div>

          <div v-if="idx === renderedRows.length - 1 && typingText" class="px-1 text-xs text-slate-500 dark:text-dark-300">
            {{ typingText }}
          </div>
        </template>
      </div>

      <div class="border-t border-slate-200 p-3 dark:border-dark-700">
        <form class="flex items-end gap-2" @submit.prevent="handleSend">
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-dark-700 dark:text-dark-300 dark:hover:bg-dark-800"
            @click="openAttachmentPicker"
          >
            📎
          </button>

          <textarea
            v-model="draftMessage"
            rows="2"
            class="textarea-field min-h-[44px] flex-1 resize-none rounded-xl px-3 py-2 text-sm"
            placeholder="Write a message..."
            @keydown="onComposerKeydown"
            @input="onTyping"
          />

          <BaseButton type="submit" :disabled="!canSend" class-name="h-10 px-4">
            Send
          </BaseButton>
        </form>

        <input
          ref="attachmentInputRef"
          type="file"
          class="hidden"
          @change="onAttachmentSelected"
        >

        <div v-if="selectedAttachmentName" class="mt-2 text-xs text-slate-500 dark:text-dark-300">
          Selected: {{ selectedAttachmentName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ClassroomChatMessage } from '~/types/classroom-room'
import { useClassroomStore } from '~/stores/classroom'
import { useChatStore } from '~/stores/chat'
import { useUserStore } from '~/stores/user'
import { useClassroomSocket } from '~/composables/useClassroomSocket'
import { useFileUpload } from '~/composables/useFileUpload'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

type RenderRow =
  | { id: string; type: 'separator'; label: string }
  | { id: string; type: 'message'; message: ClassroomChatMessage }

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const classroomStore = useClassroomStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const { isTeacher } = useRole()
const toast = useToast()
const { upload } = useFileUpload()

const { sortedMessages } = storeToRefs(chatStore)

const socket = useClassroomSocket(courseId.value)

const messagesContainerRef = ref<HTMLElement | null>(null)
const attachmentInputRef = ref<HTMLInputElement | null>(null)
const draftMessage = ref('')
const selectedAttachment = ref<File | null>(null)

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Messages`,
}))

const currentUserId = computed(() => String(userStore.user?.id || 'student-1'))

const courseMessages = computed(() =>
  sortedMessages.value.filter((message) => message.courseId === courseId.value),
)

const selectedAttachmentName = computed(() => selectedAttachment.value?.name || '')
const canSend = computed(() => Boolean(draftMessage.value.trim() || selectedAttachment.value))

const getDayLabel = (iso: string) => {
  const target = new Date(iso)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86400 * 1000)

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (sameDay(target, today)) return 'Today'
  if (sameDay(target, yesterday)) return 'Yesterday'

  return new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', year: 'numeric' }).format(target)
}

const renderedRows = computed<RenderRow[]>(() => {
  const rows: RenderRow[] = []
  let previousDay = ''

  for (const message of courseMessages.value) {
    const day = getDayLabel(message.createdAt)
    if (day !== previousDay) {
      rows.push({ id: `sep-${message.id}`, type: 'separator', label: day })
      previousDay = day
    }
    rows.push({ id: message.id, type: 'message', message })
  }

  return rows
})

const typingText = computed(() => {
  const others = chatStore.typingUsers.filter((name) => name && name !== (userStore.user?.displayName || userStore.user?.name))
  if (!others.length) return ''
  if (others.length === 1) return `${others[0]} is typing...`
  return `${others[0]} and ${others.length - 1} more are typing...`
})

const formatMessageTime = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

const scrollToBottom = () => {
  nextTick(() => {
    if (!messagesContainerRef.value) return
    messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
  })
}

const isOwnMessage = (message: ClassroomChatMessage) => message.senderId === currentUserId.value

const canDelete = (message: ClassroomChatMessage) => isTeacher.value || isOwnMessage(message)

const deleteMessage = (messageId: string) => {
  chatStore.deleteMessage(messageId)
  socket.emit('classroom:message:delete', { messageId })
  toast.success('Message deleted')
}

const loadMore = () => {
  const older = Array.from({ length: 5 }).map((_, index) => ({
    id: `${courseId.value}-older-${Date.now()}-${index}`,
    courseId: courseId.value,
    senderId: 'teacher-1',
    senderName: 'Dr. Rahman',
    isTeacher: true,
    content: `Earlier discussion point ${index + 1}`,
    createdAt: new Date(Date.now() - (index + 6) * 3600 * 1000).toISOString(),
    read: true,
  }))

  chatStore.prependMessages(older)
}

const openAttachmentPicker = () => {
  attachmentInputRef.value?.click()
}

const onAttachmentSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedAttachment.value = input.files?.[0] || null
}

const sendMessage = async () => {
  const content = draftMessage.value.trim()
  if (!content && !selectedAttachment.value) return

  let attachment: ClassroomChatMessage['attachment'] | undefined
  if (selectedAttachment.value) {
    const uploaded = await upload(selectedAttachment.value)
    if (uploaded) {
      attachment = {
        name: uploaded.fileName,
        url: uploaded.fileUrl,
        type: uploaded.mimeType,
      }
    }
  }

  const message: ClassroomChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    courseId: courseId.value,
    senderId: currentUserId.value,
    senderName: userStore.user?.displayName || userStore.user?.name || 'You',
    senderAvatar: userStore.user?.avatar,
    isTeacher: isTeacher.value,
    content,
    createdAt: new Date().toISOString(),
    read: true,
    attachment,
  }

  chatStore.addMessage(message)
  socket.emit('classroom:message:new', message)

  draftMessage.value = ''
  selectedAttachment.value = null
  if (attachmentInputRef.value) {
    attachmentInputRef.value.value = ''
  }

  scrollToBottom()
}

const handleSend = async () => {
  await sendMessage()
}

const onComposerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void sendMessage()
  }
}

const onTyping = () => {
  const name = userStore.user?.displayName || userStore.user?.name || 'Someone'
  socket.emit('classroom:typing', { userName: name })
}

watch(
  () => courseMessages.value.length,
  () => {
    scrollToBottom()
  },
)

onMounted(() => {
  chatStore.markAllRead()

  socket.connect()
  chatStore.setConnected(true)

  socket.on<{ message: ClassroomChatMessage }>('classroom:message:new', (payload) => {
    if (!payload?.message) return
    chatStore.addMessage(payload.message)
  })

  socket.on<{ users: string[] }>('classroom:typing', (payload) => {
    chatStore.setTypingUsers(payload?.users || [])
  })

  scrollToBottom()
})

onUnmounted(() => {
  chatStore.setConnected(false)
  socket.disconnect()
})
</script>

