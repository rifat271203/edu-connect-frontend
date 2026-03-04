<template>
  <div class="h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-2rem)] p-2 lg:p-4 pb-24 lg:pb-4">
    <p v-if="pageError" class="mb-2 text-sm text-red-400">{{ pageError }}</p>

    <div class="h-full rounded-2xl border border-slate-300/50 dark:border-dark-700/70 bg-white/80 dark:bg-dark-950 overflow-hidden grid lg:grid-cols-[minmax(0,1fr)_360px]">
      <aside
        class="border-b lg:border-b-0 lg:border-l border-slate-300/60 dark:border-dark-700/70 flex flex-col bg-[var(--theme-control-bg-strong)] dark:bg-dark-900/60 lg:order-2"
        :class="showMobileConversation ? 'hidden lg:flex' : 'flex'"
      >
        <div class="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-dark-700/70">
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold text-slate-800 dark:text-dark-50">Messages</p>
            <p class="text-xs text-slate-500 dark:text-dark-400">@{{ userStore.user?.username || 'user' }}</p>
          </div>

          <div class="mt-3 flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              class="flex-1 px-3 py-2 rounded-xl bg-white/70 dark:bg-dark-800/80 text-sm text-slate-700 dark:text-dark-100 placeholder:text-slate-400 dark:placeholder:text-dark-400 border border-transparent focus:border-emerald-500/50 dark:focus:border-accent/40 focus:outline-none"
              placeholder="Search friends"
              @keydown.enter.prevent="runSearch"
            >
            <UiButton size="sm" :disabled="searchLoading || !searchQuery.trim()" @click="runSearch">
              {{ searchLoading ? '...' : 'Go' }}
            </UiButton>
          </div>

          <div class="mt-2 flex gap-2">
            <select
              v-model="searchRole"
              class="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-dark-800/80 text-sm text-slate-700 dark:text-dark-100 border border-transparent focus:border-emerald-500/50 dark:focus:border-accent/40 focus:outline-none"
            >
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <p v-if="searchError" class="mt-2 text-xs text-red-400">{{ searchError }}</p>

          <div v-if="searchedUsers.length" class="mt-2 max-h-40 overflow-y-auto space-y-1 pr-1">
            <button
              v-for="user in searchedUsers"
              :key="`search-${user.id}`"
              type="button"
              class="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-emerald-500/10 dark:hover:bg-dark-800/60 transition-colors text-left"
              @click="openConversation(user)"
            >
              <UiAvatar :src="user.avatar" :name="user.displayName" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-800 dark:text-dark-50 truncate">{{ user.displayName }}</p>
                <p class="text-[11px] text-slate-500 dark:text-dark-400 truncate">@{{ user.username }}</p>
              </div>
            </button>
          </div>
        </div>

        <div class="px-3 py-3 border-b border-slate-200 dark:border-dark-700/70">
          <div class="flex items-center justify-between px-1">
            <p class="text-[11px] uppercase tracking-wide text-slate-500 dark:text-dark-400">Friends</p>
            <span class="text-[11px] text-slate-500 dark:text-dark-400">{{ visibleFriends.length }}</span>
          </div>

          <div v-if="friendsLoading" class="mt-2 flex gap-2 overflow-hidden">
            <UiSkeleton v-for="idx in 5" :key="`friend-skeleton-${idx}`" variant="circular" class="w-12 h-12" />
          </div>

          <p v-else-if="friendsError" class="mt-2 text-xs text-red-400 px-1">{{ friendsError }}</p>

          <div v-else class="mt-2 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <button
              v-for="friend in visibleFriends"
              :key="`friend-${friend.id}`"
              type="button"
              class="shrink-0 flex flex-col items-center gap-1.5 w-14"
              @click="openConversation(friend)"
            >
              <UiAvatar :src="friend.avatar" :name="friend.displayName" size="md" />
              <span class="text-[11px] text-slate-600 dark:text-dark-300 truncate w-full">{{ friend.displayName }}</span>
            </button>
          </div>
        </div>

        <div class="px-4 py-2">
          <p class="text-[11px] uppercase tracking-wide text-slate-500 dark:text-dark-400">Recent</p>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-2">
          <div v-if="conversationsLoading" class="p-2 space-y-2">
            <UiSkeleton v-for="idx in 5" :key="idx" variant="rectangular" class="h-16 rounded-xl" />
          </div>

          <div v-else-if="sortedConversations.length === 0" class="p-4 text-sm text-slate-500 dark:text-dark-400">
            No recent conversations.
          </div>

          <div v-else class="space-y-1">
            <button
              v-for="conversation in sortedConversations"
              :key="`conversation-${conversation.user.id}`"
              type="button"
              class="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl transition-colors"
              :class="[
                selectedUserId === String(conversation.user.id)
                  ? 'bg-slate-200/70 dark:bg-dark-800 border border-slate-300 dark:border-dark-600'
                  : 'hover:bg-slate-100 dark:hover:bg-dark-800/60 border border-transparent',
              ]"
              @click="openConversation(conversation.user)"
            >
              <UiAvatar :src="conversation.user.avatar" :name="conversation.user.displayName" size="md" />

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-medium text-slate-800 dark:text-dark-50 truncate">
                    {{ conversation.user.displayName }}
                  </p>
                  <span class="text-[11px] text-slate-500 dark:text-dark-400 shrink-0">
                    {{ formatRelativeTime(conversation.lastMessageAt) }}
                  </span>
                </div>
                <p class="text-xs truncate" :class="conversation.unreadCount > 0 ? 'text-slate-800 dark:text-dark-100 font-medium' : 'text-slate-600 dark:text-dark-300'">
                  {{ conversation.lastMessageText || 'No messages yet' }}
                </p>
              </div>

              <span
                v-if="conversation.unreadCount > 0"
                class="shrink-0 min-w-5 px-1.5 h-5 rounded-full bg-emerald-500 dark:bg-accent text-white text-[11px] font-semibold inline-flex items-center justify-center"
              >
                {{ conversation.unreadCount }}
              </span>
            </button>
          </div>
        </div>
      </aside>

      <section class="flex flex-col min-h-0 bg-slate-100/40 dark:bg-[#060b14] lg:order-1" :class="showMobileConversation ? 'flex' : 'hidden lg:flex'">
        <template v-if="activeUser">
          <header class="px-4 py-3 border-b border-slate-300/50 dark:border-dark-700/70 flex items-center gap-3 bg-white/75 dark:bg-dark-900/60">
            <UiButton class="lg:hidden" variant="ghost" size="sm" @click="closeMobileConversation">
              Back
            </UiButton>
            <UiAvatar :src="activeUser.avatar" :name="activeUser.displayName" size="md" />
            <div class="min-w-0 flex-1">
              <p class="font-medium text-slate-800 dark:text-dark-50 truncate">{{ activeUser.displayName }}</p>
              <p class="text-xs text-slate-500 dark:text-dark-400 truncate">@{{ activeUser.username }}</p>
            </div>
            <div class="hidden sm:flex items-center gap-2 text-slate-500 dark:text-dark-300">
              <span class="text-xs">DM</span>
            </div>
          </header>

          <div ref="messageListRef" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <div class="text-center">
              <UiButton
                v-if="hasOlderMessages"
                variant="secondary"
                size="sm"
                :disabled="olderMessagesLoading"
                @click="loadOlderMessages"
              >
                {{ olderMessagesLoading ? 'Loading...' : 'Load older messages' }}
              </UiButton>
            </div>

            <p v-if="messagesLoading" class="text-sm text-slate-500 dark:text-dark-400 text-center">Loading messages...</p>

            <p v-else-if="messages.length === 0" class="text-sm text-slate-500 dark:text-dark-400 text-center pt-10">
              Start the conversation.
            </p>

            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[85%] sm:max-w-[68%] rounded-2xl px-3 py-2"
                :class="[
                  isOwnMessage(message)
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-accent dark:to-accent-dark text-white'
                    : 'bg-white dark:bg-dark-800/90 text-slate-800 dark:text-dark-100 border border-slate-300/50 dark:border-dark-700',
                ]"
              >
                <p class="text-sm whitespace-pre-wrap break-words">{{ message.messageText }}</p>
                <p
                  class="mt-1 text-[11px]"
                  :class="isOwnMessage(message) ? 'text-white/80' : 'text-slate-500 dark:text-dark-400'"
                >
                  {{ formatMessageTime(message.createdAt) }}
                  <span v-if="isOwnMessage(message)">· {{ message.isRead ? 'Seen' : 'Sent' }}</span>
                </p>
              </div>
            </div>
          </div>

          <form class="px-3 sm:px-4 py-3 border-t border-slate-300/50 dark:border-dark-700/70 bg-white/80 dark:bg-dark-900/70" @submit.prevent="handleSendMessage">
            <div class="flex items-center gap-2 rounded-full border border-slate-300/70 dark:border-dark-700 bg-white dark:bg-dark-800 px-3 py-2">
              <textarea
                v-model="messageDraft"
                rows="1"
                class="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-dark-100 placeholder:text-slate-400 dark:placeholder:text-dark-400 focus:outline-none"
                placeholder="Message..."
                :disabled="sendingMessage"
              />
              <UiButton type="submit" size="sm" :disabled="sendingMessage || !messageDraft.trim()">
                {{ sendingMessage ? '...' : 'Send' }}
              </UiButton>
            </div>
          </form>
        </template>

        <div v-else class="flex-1 flex items-center justify-center text-sm text-slate-500 dark:text-dark-400">
          Select a conversation to begin messaging.
        </div>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { io, type Socket } from 'socket.io-client'
import { useUserStore } from '~/stores/user'
import {
  getDmConversations,
  getDmMessages,
  getFriends,
  markDmMessageRead,
  searchUsersForDm,
  sendDmMessage,
  type DmConversation,
  type DmMessage,
  type SocialUserRole,
} from '~/services/api/social'
import type { UserPreview } from '~/types/user'

definePageMeta({
  layout: 'main',
})

const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()

const conversations = ref<DmConversation[]>([])
const conversationsLoading = ref(false)
const friends = ref<UserPreview[]>([])
const friendsLoading = ref(false)
const friendsError = ref('')
const messages = ref<DmMessage[]>([])
const messagesLoading = ref(false)
const olderMessagesLoading = ref(false)
const hasOlderMessages = ref(false)
const sendingMessage = ref(false)
const pageError = ref('')

const searchQuery = ref('')
const searchRole = ref<'' | SocialUserRole>('')
const searchLoading = ref(false)
const searchError = ref('')
const searchedUsers = ref<UserPreview[]>([])

const selectedUserId = ref('')
const selectedUser = ref<UserPreview | null>(null)
const messageDraft = ref('')
const showMobileConversation = ref(false)

const socket = ref<Socket | null>(null)
const pendingReadIds = new Set<string>()
const messageListRef = ref<HTMLElement | null>(null)

const currentUserId = computed(() => String(userStore.user?.id || ''))

const activeUser = computed(() => selectedUser.value)

const sortedConversations = computed(() => {
  return [...conversations.value].sort((a, b) => toEpoch(b.lastMessageAt) - toEpoch(a.lastMessageAt))
})

const conversationUserIds = computed(() => {
  return new Set(sortedConversations.value.map((conversation) => String(conversation.user.id)))
})

const visibleFriends = computed(() => {
  return friends.value.filter(
    (friend) =>
      String(friend.id) !== currentUserId.value &&
      !conversationUserIds.value.has(String(friend.id))
  )
})

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '')

const resolveSocketUrl = (): string => {
  const configuredUrl =
    runtimeConfig.public.socketUrl ||
    runtimeConfig.public.backendUrl ||
    process.env.NUXT_PUBLIC_SOCKET_URL ||
    process.env.NUXT_PUBLIC_BACKEND_URL ||
    'https://edu-connect-backend-production.up.railway.app/'

  return normalizeUrl(configuredUrl)
}

const getAuthToken = (): string | null => {
  if (!process.client) return null
  return localStorage.getItem('educonnect_token')
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const toId = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : ''

const toEpoch = (value: string): number => {
  const epoch = Date.parse(value)
  return Number.isNaN(epoch) ? 0 : epoch
}

const formatRelativeTime = (timestamp: string): string => {
  const epoch = toEpoch(timestamp)
  if (!epoch) return ''

  const diffMs = Date.now() - epoch
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'now'
  if (diffMinutes < 60) return `${diffMinutes}m`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(epoch)
}

const formatMessageTime = (timestamp: string): string => {
  const epoch = toEpoch(timestamp)
  if (!epoch) return ''

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(epoch)
}

const isOwnMessage = (message: DmMessage): boolean => message.senderId === currentUserId.value

const mergeMessages = (items: DmMessage[]): DmMessage[] => {
  const map = new Map<string, DmMessage>()

  items.forEach((item) => {
    if (!item.id) return
    map.set(item.id, item)
  })

  return [...map.values()].sort((a, b) => toEpoch(a.createdAt) - toEpoch(b.createdAt))
}

const ensureConversation = (user: UserPreview): DmConversation => {
  const existing = conversations.value.find((conversation) => String(conversation.user.id) === String(user.id))
  if (existing) return existing

  const created: DmConversation = {
    user,
    lastMessageText: '',
    lastMessageAt: new Date(0).toISOString(),
    unreadCount: 0,
  }

  conversations.value = [created, ...conversations.value]
  return created
}

const upsertConversationFromMessage = (message: DmMessage) => {
  const own = isOwnMessage(message)
  const partnerId = own ? message.receiverId : message.senderId
  if (!partnerId) return

  const partnerProfile = own
    ? message.receiver || conversations.value.find((c) => String(c.user.id) === partnerId)?.user
    : message.sender || conversations.value.find((c) => String(c.user.id) === partnerId)?.user

  if (!partnerProfile) return

  const existing = ensureConversation(partnerProfile)

  const unreadCount = own
    ? existing.unreadCount
    : selectedUserId.value === partnerId
      ? 0
      : existing.unreadCount + 1

  conversations.value = conversations.value.map((conversation) => {
    if (String(conversation.user.id) !== partnerId) return conversation

    return {
      ...conversation,
      user: partnerProfile,
      lastMessageId: message.id,
      lastMessageText: message.messageText,
      lastMessageAt: message.createdAt,
      unreadCount,
    }
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (!messageListRef.value) return
  messageListRef.value.scrollTop = messageListRef.value.scrollHeight
}

const normalizeSocketMessage = (payload: unknown): DmMessage | null => {
  const root = asRecord(payload)
  const source = asRecord(root?.message) || asRecord(root?.data) || root
  if (!source) return null

  const senderRecord = asRecord(source.sender)
  const receiverRecord = asRecord(source.receiver)

  const id = toId(source.id || source.messageId || source.message_id)
  const senderId = toId(source.senderId || source.sender_id || senderRecord?.id)
  const receiverId = toId(source.receiverId || source.receiver_id || receiverRecord?.id)
  const messageText =
    (typeof source.messageText === 'string' && source.messageText) ||
    (typeof source.message_text === 'string' && source.message_text) ||
    (typeof source.content === 'string' && source.content) ||
    ''

  if (!id || !senderId || !receiverId || !messageText) return null

  const createdAtRaw = source.createdAt || source.created_at || source.timestamp
  const readAtRaw = source.readAt || source.read_at

  return {
    id,
    senderId,
    receiverId,
    messageText,
    isRead: Boolean(source.isRead || source.is_read || source.read),
    createdAt: typeof createdAtRaw === 'string' && createdAtRaw ? createdAtRaw : new Date().toISOString(),
    readAt: typeof readAtRaw === 'string' && readAtRaw ? readAtRaw : undefined,
    sender: senderRecord
      ? {
          id: toId(senderRecord.id),
          username:
            (typeof senderRecord.username === 'string' && senderRecord.username) ||
            (typeof senderRecord.user_name === 'string' && senderRecord.user_name) ||
            'user',
          displayName:
            (typeof senderRecord.displayName === 'string' && senderRecord.displayName) ||
            (typeof senderRecord.name === 'string' && senderRecord.name) ||
            'User',
          avatar:
            (typeof senderRecord.avatar === 'string' && senderRecord.avatar) ||
            (typeof senderRecord.profilePicUrl === 'string' && senderRecord.profilePicUrl) ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(toId(senderRecord.id) || 'user')}`,
        }
      : undefined,
    receiver: receiverRecord
      ? {
          id: toId(receiverRecord.id),
          username:
            (typeof receiverRecord.username === 'string' && receiverRecord.username) ||
            (typeof receiverRecord.user_name === 'string' && receiverRecord.user_name) ||
            'user',
          displayName:
            (typeof receiverRecord.displayName === 'string' && receiverRecord.displayName) ||
            (typeof receiverRecord.name === 'string' && receiverRecord.name) ||
            'User',
          avatar:
            (typeof receiverRecord.avatar === 'string' && receiverRecord.avatar) ||
            (typeof receiverRecord.profilePicUrl === 'string' && receiverRecord.profilePicUrl) ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(toId(receiverRecord.id) || 'user')}`,
        }
      : undefined,
  }
}

const markVisibleMessagesRead = async () => {
  const myId = currentUserId.value
  if (!myId) return

  const unreadIncomingIds = messages.value
    .filter((message) => message.receiverId === myId && !message.isRead && !pendingReadIds.has(message.id))
    .map((message) => message.id)

  if (unreadIncomingIds.length === 0) return

  await Promise.all(
    unreadIncomingIds.map(async (messageId) => {
      pendingReadIds.add(messageId)

      const response = await markDmMessageRead(messageId)
      if (response.success) {
        messages.value = messages.value.map((message) =>
          message.id === messageId
            ? { ...message, isRead: true, readAt: message.readAt || new Date().toISOString() }
            : message
        )

        socket.value?.emit('dm-mark-read', { messageId })
      }

      pendingReadIds.delete(messageId)
    })
  )

  if (selectedUserId.value) {
    conversations.value = conversations.value.map((conversation) =>
      String(conversation.user.id) === selectedUserId.value
        ? {
            ...conversation,
            unreadCount: 0,
          }
        : conversation
    )
  }
}

const loadConversations = async () => {
  pageError.value = ''
  conversationsLoading.value = true

  const result = await getDmConversations(20, 0)
  conversationsLoading.value = false

  if (!result.success || !result.data) {
    pageError.value = result.error || 'Failed to load conversations'
    return
  }

  conversations.value = [...result.data].sort((a, b) => toEpoch(b.lastMessageAt) - toEpoch(a.lastMessageAt))
}

const loadFriends = async () => {
  friendsError.value = ''
  friendsLoading.value = true

  const result = await getFriends()
  friendsLoading.value = false

  if (!result.success || !result.data) {
    friends.value = []
    friendsError.value = result.error || 'Failed to load friends'
    return
  }

  friends.value = result.data
}

const loadMessages = async (options: { older?: boolean } = {}) => {
  if (!selectedUserId.value) return

  const { older = false } = options

  if (older) {
    olderMessagesLoading.value = true
  } else {
    messagesLoading.value = true
  }

  const beforeId = older ? messages.value[0]?.id : undefined
  const result = await getDmMessages(selectedUserId.value, 50, beforeId)

  if (older) {
    olderMessagesLoading.value = false
  } else {
    messagesLoading.value = false
  }

  if (!result.success || !result.data) {
    pageError.value = result.error || 'Failed to load messages'
    return
  }

  const fetchedMessages = mergeMessages(result.data)
  hasOlderMessages.value = fetchedMessages.length === 50

  if (older) {
    messages.value = mergeMessages([...fetchedMessages, ...messages.value])
  } else {
    messages.value = fetchedMessages
    await scrollToBottom()
  }

  await markVisibleMessagesRead()
}

const openConversation = async (user: UserPreview) => {
  const normalizedUserId = String(user.id)

  selectedUserId.value = normalizedUserId
  selectedUser.value = user
  messageDraft.value = ''
  showMobileConversation.value = true

  ensureConversation(user)
  conversations.value = conversations.value.map((conversation) =>
    String(conversation.user.id) === normalizedUserId
      ? {
          ...conversation,
          unreadCount: 0,
        }
      : conversation
  )

  await loadMessages()
}

const closeMobileConversation = () => {
  showMobileConversation.value = false
}

const loadOlderMessages = async () => {
  if (olderMessagesLoading.value || !hasOlderMessages.value) return
  await loadMessages({ older: true })
}

const runSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q || searchLoading.value) return

  searchError.value = ''
  searchLoading.value = true

  const result = await searchUsersForDm({
    q,
    role: searchRole.value || undefined,
    limit: 20,
  })

  searchLoading.value = false

  if (!result.success || !result.data) {
    searchedUsers.value = []
    searchError.value = result.error || 'Failed to search users'
    return
  }

  searchedUsers.value = result.data.filter((user) => String(user.id) !== currentUserId.value)
}

const handleSendMessage = async () => {
  const text = messageDraft.value.trim()
  if (!text || !selectedUserId.value || sendingMessage.value) return

  pageError.value = ''
  sendingMessage.value = true

  const tempId = `temp-${Date.now()}`
  const optimisticMessage: DmMessage = {
    id: tempId,
    senderId: currentUserId.value,
    receiverId: selectedUserId.value,
    messageText: text,
    isRead: false,
    createdAt: new Date().toISOString(),
  }

  messages.value = mergeMessages([...messages.value, optimisticMessage])
  messageDraft.value = ''
  await scrollToBottom()

  const useSocketSend = Boolean(socket.value?.connected)

  if (useSocketSend) {
    socket.value?.emit('dm-send', {
      receiverId: selectedUserId.value,
      messageText: text,
    })

    upsertConversationFromMessage(optimisticMessage)
    sendingMessage.value = false
    return
  }

  const result = await sendDmMessage({
    receiverId: selectedUserId.value,
    messageText: text,
  })

  sendingMessage.value = false

  if (!result.success || !result.data) {
    messages.value = messages.value.filter((message) => message.id !== tempId)
    pageError.value = result.error || 'Failed to send message'
    return
  }

  messages.value = mergeMessages([
    ...messages.value.filter((message) => message.id !== tempId),
    result.data,
  ])

  upsertConversationFromMessage(result.data)
  await scrollToBottom()
}

const handleIncomingMessage = async (payload: unknown) => {
  const incoming = normalizeSocketMessage(payload)
  if (!incoming) return

  const current = currentUserId.value
  const belongsToMe = incoming.senderId === current || incoming.receiverId === current
  if (!belongsToMe) return

  const partnerId = incoming.senderId === current ? incoming.receiverId : incoming.senderId

  const tempIndex = messages.value.findIndex(
    (message) =>
      message.id.startsWith('temp-') &&
      message.senderId === incoming.senderId &&
      message.receiverId === incoming.receiverId &&
      message.messageText === incoming.messageText
  )

  if (tempIndex >= 0) {
    const cloned = [...messages.value]
    cloned[tempIndex] = incoming
    messages.value = mergeMessages(cloned)
  } else {
    messages.value = mergeMessages([...messages.value, incoming])
  }

  upsertConversationFromMessage(incoming)

  if (selectedUserId.value === partnerId) {
    await markVisibleMessagesRead()
    await scrollToBottom()
  }
}

const handleIncomingReadReceipt = (payload: unknown) => {
  const source = asRecord(payload)
  if (!source) return

  const messageId = toId(source.messageId || source.message_id || source.id)
  if (!messageId) return

  const readAtRaw = source.readAt || source.read_at
  const readAt = typeof readAtRaw === 'string' && readAtRaw ? readAtRaw : new Date().toISOString()

  messages.value = messages.value.map((message) =>
    message.id === messageId
      ? {
          ...message,
          isRead: true,
          readAt,
        }
      : message
  )
}

const connectDmSocket = () => {
  if (!process.client) return

  const token = getAuthToken()

  if (socket.value) {
    socket.value.removeAllListeners()
    socket.value.disconnect()
    socket.value = null
  }

  socket.value = io(resolveSocketUrl(), {
    transports: ['websocket'],
    autoConnect: true,
    withCredentials: true,
    auth: {
      token,
    },
  })

  socket.value.on('connect', () => {
    socket.value?.emit('dm-auth', { token })
  })

  socket.value.on('dm-message', (payload: unknown) => {
    handleIncomingMessage(payload).catch(console.error)
  })

  socket.value.on('dm-message-read', (payload: unknown) => {
    handleIncomingReadReceipt(payload)
  })
}

onMounted(async () => {
  await Promise.all([loadConversations(), loadFriends()])
  connectDmSocket()

  if (conversations.value.length > 0) {
    await openConversation(conversations.value[0].user)
  }
})

onBeforeUnmount(() => {
  if (!socket.value) return
  socket.value.removeAllListeners()
  socket.value.disconnect()
  socket.value = null
})
</script>
