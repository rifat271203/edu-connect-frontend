<template>
  <div class="h-screen p-0 bg-[var(--bg)] flex flex-col overflow-hidden">
    <p v-if="pageError" class="mb-2 inline-flex rounded-full px-2.5 py-1 mono-label text-[11px] bg-[rgba(239,68,68,0.1)] text-[rgba(239,68,68,0.9)]">{{ pageError }}</p>

    <div class="flex-1 rounded-none border-none bg-[var(--surface)] overflow-hidden grid lg:grid-cols-[minmax(0,1fr)_360px]">
      <aside
        class="border-b lg:border-b-0 lg:border-l border-[var(--line)] flex flex-col bg-[var(--ink2)] lg:order-2"
        :class="showMobileConversation ? 'hidden lg:flex' : 'flex'"
      >
        <div class="px-4 pt-4 pb-3 border-b border-[var(--line)]">
          <div class="flex items-center justify-between">
            <p class="text-[24px] font-display font-bold tracking-tight text-[var(--t1)]">Messages</p>
            <p class="text-[12px] font-body text-[var(--t3)]">@{{ userStore.user?.username || 'user' }}</p>
          </div>

          <div class="mt-3 flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              class="flex-1 ui-input !h-10"
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
              class="w-full select-field !h-10"
            >
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <p v-if="searchError" class="mt-2 text-xs text-[rgba(239,68,68,0.9)]">{{ searchError }}</p>

          <div v-if="searchedUsers.length" class="mt-2 max-h-60 overflow-y-auto space-y-2 pr-1">
            <div
              v-for="user in searchedUsers"
              :key="`search-${user.id}`"
              class="w-full flex items-center gap-2 px-2 py-2 rounded-lg border border-[var(--line)] bg-[var(--surface2)] hover:border-[var(--line)] transition-colors text-left"
            >
              <UiAvatar :src="user.avatar" :name="user.displayName" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="text-xs text-[var(--t1)] truncate">{{ user.displayName }}</p>
                <p class="mono-label text-[11px] text-[var(--t3)] truncate">@{{ user.username }}</p>
              </div>

              <div class="shrink-0 flex gap-1">
                <template v-if="user.isFriend">
                  <UiButton size="sm" variant="secondary" @click="openConversation(user)">
                    Message
                  </UiButton>
                </template>
                <template v-else-if="user.pendingSent">
                  <UiButton size="sm" variant="ghost" disabled>
                    Sent
                  </UiButton>
                </template>
                <template v-else-if="user.pendingReceived">
                  <UiButton size="sm" variant="primary" @click="handleFriendAction(user, 'accept')">
                    Accept
                  </UiButton>
                </template>
                <template v-else>
                  <UiButton size="sm" variant="secondary" @click="handleFriendAction(user, 'add')">
                    Add
                  </UiButton>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="px-3 py-3 border-b border-[var(--line)]">
          <div class="flex items-center justify-between px-1 mb-2">
            <p class="section-label">Friends</p>
            <span class="text-[11px] font-semibold text-[var(--t3)]">{{ visibleFriends.length }}</span>
          </div>

          <div v-if="friendsLoading" class="mt-2 space-y-2">
            <UiSkeleton v-for="idx in 3" :key="`friend-skeleton-${idx}`" variant="rectangular" class="h-10 rounded-lg" />
          </div>

          <p v-else-if="friendsError" class="mt-2 text-xs text-[rgba(239,68,68,0.9)] px-1">{{ friendsError }}</p>

          <div v-else class="max-h-[200px] overflow-y-auto space-y-1">
            <button
              v-for="friend in visibleFriends"
              :key="`friend-${friend.id}`"
              type="button"
              class="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-[var(--surface2)] text-left"
              @click="openConversation(friend)"
            >
              <UiAvatar :src="friend.avatar" :name="friend.displayName" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="text-xs text-[var(--t1)] truncate">{{ friend.displayName }}</p>
                <p class="text-[10px] text-[var(--t3)] truncate">@{{ friend.username }}</p>
              </div>
            </button>
            <p v-if="visibleFriends.length === 0" class="text-[11px] text-[var(--t3)] px-1 italic">
              All friends are in recent chats.
            </p>
          </div>
        </div>

        <div v-if="courseGroups.length" class="px-3 py-2 border-b border-[var(--line)]">
          <p class="section-label mb-2">Course Groups</p>
          <div class="space-y-1">
            <button v-for="group in courseGroups" :key="'group-'+group.courseId" type="button" class="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg transition-colors hover:bg-[var(--surface2)]" @click="openGroupChat(group)">
              <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent-dim)] flex items-center justify-center text-xs shrink-0">📚</div>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-[var(--t1)] truncate font-medium">{{ group.courseTitle }}</p>
                <p class="text-[10px] text-[var(--t3)]">{{ group.memberCount }} members</p>
              </div>
              <span v-if="group.unreadCount > 0" class="shrink-0 min-w-4 px-1 h-4 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[10px] font-semibold inline-flex items-center justify-center">{{ group.unreadCount }}</span>
            </button>
          </div>
        </div>

        <div class="px-4 py-2">
          <p class="section-label">Recent</p>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-2">
          <div v-if="conversationsLoading" class="p-2 space-y-2">
            <UiSkeleton v-for="idx in 5" :key="idx" variant="rectangular" class="h-16 rounded-xl" />
          </div>

          <div v-else-if="sortedConversations.length === 0" class="p-4 text-sm text-[var(--t2)]">
            No recent conversations.
          </div>

          <div v-else class="space-y-1">
            <button
              v-for="conversation in sortedConversations"
              :key="`conversation-${conversation.user.id}`"
              type="button"
              class="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
              :class="[
                selectedUserId === String(conversation.user.id)
                  ? 'bg-[var(--accent-subtle)] border-l-2 border-l-[var(--primary)] border-[var(--line)]'
                  : 'hover:bg-[var(--surface2)] border border-transparent',
              ]"
              @click="openConversation(conversation.user)"
            >
              <UiAvatar :src="conversation.user.avatar" :name="conversation.user.displayName" size="md" />

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[13px] font-medium text-[var(--t1)] truncate">
                    {{ conversation.user.displayName }}
                  </p>
                  <span class="text-[11px] text-[var(--t3)] shrink-0">
                    {{ formatRelativeTime(conversation.lastMessageAt) }}
                  </span>
                </div>
                <p v-if="typingPartnerIds.has(String(conversation.user.id))" class="text-xs text-[var(--primary)] font-medium animate-pulse">
                  typing...
                </p>
                <p v-else class="text-xs truncate font-body" :class="conversation.unreadCount > 0 ? 'text-[var(--t1)] font-medium' : 'text-[var(--t2)]'">
                  {{ conversation.lastMessageText || 'No messages yet' }}
                </p>
              </div>

              <span
                v-if="conversation.unreadCount > 0"
                class="shrink-0 min-w-5 px-1.5 h-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[11px] font-semibold inline-flex items-center justify-center"
              >
                {{ conversation.unreadCount }}
              </span>
            </button>
          </div>
        </div>
      </aside>

      <section class="flex flex-col min-h-0 bg-[var(--ink)] lg:order-1" :class="showMobileConversation ? 'flex' : 'hidden lg:flex'">
        <template v-if="activeUser">
          <header class="px-4 py-3 border-b border-[var(--line)] flex items-center gap-3 bg-[color-mix(in_srgb,var(--ink2)_90%,transparent)]">
            <UiButton class="lg:hidden" variant="ghost" size="sm" @click="closeMobileConversation">
              Back
            </UiButton>
            <UiAvatar :src="activeUser.avatar || (activeUser as any).other_user_profile_pic_url" :name="activeUser.displayName" size="md" class="rounded-xl" />
            <div class="min-w-0 flex-1">
              <p class="text-[16px] font-display font-bold text-[var(--t1)] truncate">{{ activeUser.displayName }}</p>
              <p class="text-[12px] font-body text-[var(--t3)] truncate">@{{ activeUser.username }} • ID: {{ activeUser.id }}</p>
            </div>
            <div class="flex items-center gap-1 sm:gap-2">
              <UiButton variant="ghost" size="sm" icon class="text-[var(--t2)] hover:text-[var(--primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </UiButton>
              <div class="hidden sm:flex items-center gap-2 text-[var(--t2)]">
                <span class="text-[10px] rounded-full border border-[var(--line)] bg-[var(--surface2)] px-2 py-1 uppercase tracking-[0.1em] font-semibold">DM</span>
              </div>
            </div>
          </header>

          <div ref="messageListRef" class="flex-1 overflow-y-auto px-4 py-2 space-y-3">
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

            <p v-if="messagesLoading" class="text-sm text-[var(--t2)] text-center">Loading messages...</p>

            <p v-else-if="messages.length === 0" class="text-sm text-[var(--t2)] text-center pt-10">
              Start the conversation.
            </p>

            <div
              v-for="item in processedMessages"
              :key="item.id"
              class="flex flex-col"
            >
              <div v-if="'type' in item && item.type === 'timestamp'" class="flex justify-center my-4">
                <span class="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider bg-transparent px-3 py-1">
                  {{ item.time }}
                </span>
              </div>

              <div
                v-else-if="'messageText' in item"
                class="flex group relative mb-4"
                :class="isOwnMessage(item) ? 'justify-end' : 'justify-start'"
              >
                <!-- Message Actions Overlay - Tightly placed, no space, clear background -->
                <div 
                  class="absolute top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  :class="isOwnMessage(item) ? 'right-full' : 'left-full'"
                >
                  <button 
                    type="button" 
                    class="p-1.5 text-[var(--t3)] hover:text-[var(--primary)] transition-colors bg-transparent border-none"
                    title="Reply"
                    @click="handleReplyMessage(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                  </button>
                  
                  <div class="relative">
                    <button 
                      type="button" 
                      class="p-1.5 text-[var(--t3)] hover:text-[var(--primary)] transition-colors bg-transparent border-none"
                      title="React"
                      @click="toggleReactionMenu(item.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                    </button>
                    
                    <div v-if="activeReactionMenuId === item.id" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex gap-1 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xl z-20">
                      <button 
                        v-for="emoji in ['👍', '❤️', '😂', '😮', '😢', '🔥']" 
                        :key="emoji" 
                        class="text-lg hover:scale-125 transition-transform"
                        @click="handleReaction(item.id, emoji)"
                      >
                        {{ emoji }}
                      </button>
                    </div>
                  </div>

                  <div class="relative">
                    <button 
                      type="button" 
                      class="p-1.5 text-[var(--t3)] hover:text-[var(--primary)] transition-colors bg-transparent border-none"
                      title="More"
                      @click="toggleMessageMenu(item.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                    
                    <div v-if="activeMessageMenuId === item.id" class="absolute bottom-full mb-2 right-0 w-32 py-1 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xl z-20">
                      <button class="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--surface2)] flex items-center gap-2" @click="handleForwardMessage(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 17 20 12 15 7"></polyline><path d="M4 18v-2a4 4 0 0 1 4-4h12"></path></svg>
                        Forward
                      </button>
                      <button class="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--surface2)] text-[rgba(239,68,68,0.9)] flex items-center gap-2" @click="handleDeleteMessage(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col" :class="isOwnMessage(item) ? 'items-end' : 'items-start'">
                  <div
                    class="max-w-[85%] sm:max-w-[100%] rounded-2xl px-4 py-2.5 transition-all duration-200"
                    :class="[
                      isOwnMessage(item)
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-sm'
                        : 'bg-[var(--surface2)] text-[var(--t1)] border border-[var(--line)]',
                      replyingToMessage?.id === item.id ? 'opacity-50 scale-[0.98]' : ''
                    ]"
                  >
                    <p class="text-[14.5px] font-body whitespace-pre-wrap break-words leading-relaxed">{{ item.messageText }}</p>
                    <p
                      class="mt-1 text-[10px] font-medium"
                      :class="isOwnMessage(item) ? 'text-[var(--on-primary)]/70' : 'text-[var(--t3)]'"
                    >
                      {{ formatMessageTime(item.createdAt) }}
                      <span v-if="isOwnMessage(item)">· {{ item.isRead ? 'Seen' : 'Sent' }}</span>
                    </p>
                  </div>
                  
                  <!-- Reaction display just below the message -->
                  <div v-if="reactionsMap[item.id]?.length" class="flex flex-wrap gap-1 mt-1 px-1">
                    <span 
                      v-for="emoji in reactionsMap[item.id]" 
                      :key="emoji"
                      class="text-[12px] bg-[var(--surface2)] border border-[var(--line)] rounded-full px-1.5 py-0.5 leading-none"
                    >
                      {{ emoji }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showEmojiPicker" class="px-4 py-2 bg-[var(--surface2)] border-t border-[var(--line)] flex gap-2 overflow-x-auto no-scrollbar">
            <button
              v-for="emoji in ['😊', '😂', '❤️', '👍', '🙏', '🔥', '😮', '😢', '✨', '💯', '🙌']"
              :key="emoji"
              type="button"
              class="text-xl hover:scale-125 transition-transform p-1"
              @click="addEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>

          <div v-if="replyingToMessage" class="px-4 py-2 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border-t border-[var(--line)] flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">Replying to {{ replyingToMessage.sender?.displayName }}</p>
              <p class="text-xs text-[var(--t2)] truncate">{{ replyingToMessage.messageText }}</p>
            </div>
            <button type="button" class="p-1 hover:text-[var(--primary)] transition-colors" @click="replyingToMessage = null">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form class="px-4 py-2 border-t border-[var(--line)] bg-[var(--surface)]" @submit.prevent="handleSendMessage">
            <input 
              ref="fileInputRef" 
              type="file" 
              class="hidden" 
              accept="image/*"
              @change="handleImageSelection"
            >
            <div class="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-1.5 shadow-sm">
              <div class="flex items-center gap-1">
                <UiButton variant="ghost" size="sm" icon class="text-[var(--t3)] hover:text-[var(--primary)]" type="button" @click="showEmojiPicker = !showEmojiPicker">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </UiButton>
                <UiButton variant="ghost" size="sm" icon class="text-[var(--t3)] hover:text-[var(--primary)]" type="button" @click="triggerImageUpload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </UiButton>
              </div>
              <textarea
                v-model="messageDraft"
                rows="1"
                class="flex-1 resize-none bg-transparent text-[15px] font-body text-[var(--t1)] placeholder:text-[var(--t4)] focus:outline-none"
                placeholder="Write a message..."
                :disabled="sendingMessage"
                @input="handleTyping"
                @keydown.enter.exact.prevent="handleSendMessage"
              />
              <UiButton type="submit" size="sm" variant="primary" :disabled="sendingMessage || !messageDraft.trim()" class="rounded-xl px-5">
                {{ sendingMessage ? '...' : 'Send' }}
              </UiButton>
            </div>
          </form>
        </template>

        <div v-else class="flex-1 flex items-center justify-center text-sm text-[var(--t2)]">
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
  respondToFriendRequest,
  sendFriendRequest,
  type SocialUserRole,
} from '~/services/api/social'
import type { UserPreview } from '~/types/user'
import { getCourseGroupChat, type CourseGroupChatInfo } from '~/services/api/classroom'

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
const courseGroups = ref<CourseGroupChatInfo[]>([])
const activeGroupCourseId = ref('')
const showEmojiPicker = ref(false)
const activeMessageMenuId = ref<string | null>(null)
const activeReactionMenuId = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const replyingToMessage = ref<DmMessage | null>(null)
const reactionsMap = ref<Record<string, string[]>>({})

const typingPartnerIds = ref(new Set<string>())
let typingTimeout: any = null

const socket = ref<Socket | null>(null)
const pendingReadIds = new Set<string>()
const messageListRef = ref<HTMLElement | null>(null)

const currentUserId = computed(() => String(userStore.user?.id || ''))

const activeUser = computed(() => selectedUser.value)

const processedMessages = computed(() => {
  const result: (DmMessage | { type: 'timestamp'; time: string; id: string })[] = []
  let lastTimestamp: number | null = null

  messages.value.forEach((msg, index) => {
    const currentTimestamp = toEpoch(msg.createdAt)

    if (lastTimestamp === null || currentTimestamp - lastTimestamp > 30 * 60 * 1000) {
      result.push({
        type: 'timestamp',
        time: formatMessageTime(msg.createdAt),
        id: `timestamp-${msg.id}`,
      })
    }

    result.push(msg)
    lastTimestamp = currentTimestamp
  })

  return result
})

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
    'https://edu-connect-backend-bcf0.onrender.com/'

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
            (typeof senderRecord.profile_pic_url === 'string' && senderRecord.profile_pic_url) ||
            (typeof senderRecord.other_user_profile_pic_url === 'string' && senderRecord.other_user_profile_pic_url) ||
            '',
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
            (typeof receiverRecord.profile_pic_url === 'string' && receiverRecord.profile_pic_url) ||
            (typeof receiverRecord.other_user_profile_pic_url === 'string' && receiverRecord.other_user_profile_pic_url) ||
            '',
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

const handleFriendAction = async (user: UserPreview, action: 'add' | 'accept') => {
  if (searchLoading.value) return
  searchLoading.value = true
  searchError.value = ''

  try {
    if (action === 'add') {
      const result = await sendFriendRequest(user.id)
      if (result.success) {
        user.pendingSent = true
      } else {
        searchError.value = result.error || 'Failed to send request'
      }
    } else if (action === 'accept' && user.requestId) {
      const result = await respondToFriendRequest(user.requestId, 'accepted')
      if (result.success) {
        user.isFriend = true
        user.pendingReceived = false
        // Refresh friends list
        loadFriends()
      } else {
        searchError.value = result.error || 'Failed to accept request'
      }
    }
  } catch (err) {
    searchError.value = 'An error occurred'
  } finally {
    searchLoading.value = false
  }
}

const openConversation = async (user: UserPreview) => {
  if (!user.isFriend && String(user.id) !== currentUserId.value) {
    if (!conversationUserIds.value.has(String(user.id))) {
      return
    }
  }
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
  replyingToMessage.value = null // Clear reply state
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

const addEmoji = (emoji: string) => {
  messageDraft.value += emoji
}

const handleTyping = () => {
  if (!socket.value?.connected || !selectedUserId.value) return

  socket.value.emit('dm-typing', { receiverId: selectedUserId.value })

  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.value?.emit('dm-stop-typing', { receiverId: selectedUserId.value })
  }, 3000)
}

const triggerImageUpload = () => {
  fileInputRef.value?.click()
}

const handleImageSelection = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  
  const file = target.files[0]
  // In a real app, we would upload this file to a server
  // For now, we'll just log it
  console.log('Selected image:', file)
  
  // Show an optimistic message or just a placeholder
  const text = `[Image: ${file.name}]`
  messageDraft.value = text
  await handleSendMessage()
}

const toggleMessageMenu = (id: string) => {
  activeMessageMenuId.value = activeMessageMenuId.value === id ? null : id
  activeReactionMenuId.value = null
}

const toggleReactionMenu = (id: string) => {
  activeReactionMenuId.value = activeReactionMenuId.value === id ? null : id
  activeMessageMenuId.value = null
}

const handleReaction = (messageId: string, emoji: string) => {
  if (!reactionsMap.value[messageId]) {
    reactionsMap.value[messageId] = []
  }
  if (!reactionsMap.value[messageId].includes(emoji)) {
    reactionsMap.value[messageId].push(emoji)
  } else {
    reactionsMap.value[messageId] = reactionsMap.value[messageId].filter(e => e !== emoji)
  }
  activeReactionMenuId.value = null
}

const handleDeleteMessage = (messageId: string) => {
  messages.value = messages.value.filter(m => m.id !== messageId)
  activeMessageMenuId.value = null
}

const handleForwardMessage = (messageId: string) => {
  console.log(`Forwarding message ${messageId}`)
  activeMessageMenuId.value = null
}

const handleReplyMessage = (message: DmMessage) => {
  replyingToMessage.value = message
  activeMessageMenuId.value = null
  activeReactionMenuId.value = null
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

  socket.value.on('dm-typing', (payload: any) => {
    const partnerId = toId(payload.senderId || payload.partnerId)
    if (partnerId) typingPartnerIds.value.add(partnerId)
  })

  socket.value.on('dm-stop-typing', (payload: any) => {
    const partnerId = toId(payload.senderId || payload.partnerId)
    if (partnerId) typingPartnerIds.value.delete(partnerId)
  })
}

const openGroupChat = (group: CourseGroupChatInfo) => {
  activeGroupCourseId.value = group.courseId
  // For now, navigate to classroom messages for that course
  navigateTo(`/classroom/${encodeURIComponent(group.courseId)}/messages`)
}

const handleGroupQueryParam = async () => {
  const route = useRoute()
  const groupParam = route.query.group as string | undefined
  if (!groupParam || !groupParam.startsWith('course-')) return

  const courseId = groupParam.replace('course-', '')
  const result = await getCourseGroupChat(courseId)
  if (result.success && result.data) {
    if (!courseGroups.value.find(g => g.courseId === courseId)) {
      courseGroups.value = [result.data, ...courseGroups.value]
    }
    openGroupChat(result.data)
  }
}

onMounted(async () => {
  await Promise.all([loadConversations(), loadFriends()])
  connectDmSocket()

  // Handle group query param from classroom
  await handleGroupQueryParam()

  // No conversation opened by default as requested
  /*
  if (!activeGroupCourseId.value && conversations.value.length > 0) {
    await openConversation(conversations.value[0].user)
  }
  */
})

onBeforeUnmount(() => {
  if (!socket.value) return
  socket.value.removeAllListeners()
  socket.value.disconnect()
  socket.value = null
})
</script>
