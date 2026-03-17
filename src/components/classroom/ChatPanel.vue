<!-- src/components/classroom/ChatPanel.vue -->
<template>
  <section class="flex h-full flex-col rounded-2xl border border-dark-700/70 bg-dark-900/85">
    <header class="flex items-center justify-between border-b border-dark-700/70 px-4 py-3">
      <h3 class="text-sm font-semibold text-dark-100">Chat</h3>
      <span
        v-if="!isOpen && unreadCount > 0"
        class="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white"
      >
        {{ unreadCount }}
      </span>
    </header>

    <div ref="listRef" class="flex-1 space-y-2 overflow-y-auto px-3 py-3">
      <article
        v-for="item in messages"
        :key="item.id"
        class="rounded-xl border border-dark-700/70 bg-dark-800/70 px-3 py-2"
      >
        <p class="text-xs font-semibold text-dark-100">{{ item.senderName }}</p>
        <p class="mt-1 whitespace-pre-wrap text-sm text-dark-200">{{ item.message }}</p>
        <p class="mt-1 text-[10px] text-dark-400">{{ item.timestamp }}</p>
      </article>

      <p v-if="messages.length === 0" class="text-sm text-dark-400">No messages yet.</p>
    </div>

    <div class="border-t border-dark-700/70 p-3">
      <div class="flex items-center gap-2">
        <input
          v-model="draft"
          type="text"
          class="w-full rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:border-accent focus:outline-none"
          placeholder="Type a message..."
          @keydown.enter.prevent="handleSend"
        >
        <button
          type="button"
          class="rounded-xl border border-accent/40 bg-accent/20 px-3 py-2 text-sm font-semibold text-accent-light transition hover:bg-accent/30"
          @click="handleSend"
        >
          Send
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types/classroom'

const props = defineProps<{
  messages: ChatMessage[]
  isOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'send', value: string): void
}>()

const listRef = ref<HTMLElement | null>(null)
const draft = ref('')
const unreadCount = ref(0)

watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (listRef.value) {
        listRef.value.scrollTop = listRef.value.scrollHeight
      }
    })

    if (!props.isOpen) {
      unreadCount.value += 1
    }
  },
)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      unreadCount.value = 0
    }
  },
)

const handleSend = () => {
  const text = draft.value.trim()
  if (!text) return

  emit('send', text)
  draft.value = ''
}
</script>

