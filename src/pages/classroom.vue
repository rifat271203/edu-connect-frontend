<template>
  <div class="max-w-4xl mx-auto p-4 pb-24 lg:pb-4">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-dark-50">Classroom</h1>
      <p class="text-dark-200">Your courses and learning materials</p>
    </header>
    
    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b border-surface-glass-border overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="tab-button whitespace-nowrap"
        :class="{ 'active': activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <UiCard class="p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-dark-50">Live Class Meetings</h2>
            <p class="text-sm text-dark-300">
              {{ isTeacher ? 'Create a room and share it with your students.' : 'Join a room shared by your teacher.' }}
            </p>
          </div>

          <div v-if="isTeacher">
            <UiButton :loading="meetingCreating" :disabled="meetingCreating" @click="handleCreateMeeting">
              {{ meetingCreating ? 'Creating...' : 'Create Room' }}
            </UiButton>
          </div>

          <div v-else class="flex items-center gap-2">
            <UiInput
              v-model="joinRoomId"
              placeholder="Enter room ID"
              class="min-w-44"
              @keydown.enter.prevent="handleJoinMeeting"
            />
            <UiButton @click="handleJoinMeeting">
              Join Room
            </UiButton>
          </div>
        </div>

        <p v-if="meetingError" class="mt-3 text-sm text-red-400">{{ meetingError }}</p>
      </UiCard>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UiCard class="p-4 text-center">
          <div class="text-2xl font-bold text-accent-light mb-1">5</div>
          <div class="text-sm text-dark-300">Active Courses</div>
        </UiCard>
        <UiCard class="p-4 text-center">
          <div class="text-2xl font-bold text-accent-light mb-1">12</div>
          <div class="text-sm text-dark-300">Completed</div>
        </UiCard>
        <UiCard class="p-4 text-center">
          <div class="text-2xl font-bold text-yellow-400 mb-1">3</div>
          <div class="text-sm text-dark-300">In Progress</div>
        </UiCard>
        <UiCard class="p-4 text-center">
          <div class="text-2xl font-bold text-purple-400 mb-1">85%</div>
          <div class="text-sm text-dark-300">Avg. Score</div>
        </UiCard>
      </div>
      
      <!-- Current Courses -->
      <div>
        <h2 class="section-title">Current Courses</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <UiCard v-for="course in courses" :key="course.id" class="p-4 hover:border-accent/30 transition-colors cursor-pointer">
            <div class="flex gap-4">
              <div 
                class="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                :style="{ backgroundColor: course.color + '20' }"
              >
                {{ course.icon }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-dark-50 mb-1">{{ course.title }}</h3>
                <p class="text-sm text-dark-300 mb-2">{{ course.instructor }}</p>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-accent rounded-full"
                      :style="{ width: course.progress + '%' }"
                    />
                  </div>
                  <span class="text-xs text-dark-400">{{ course.progress }}%</span>
                </div>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </div>
    
    <!-- Assignments Tab -->
    <div v-if="activeTab === 'assignments'" class="space-y-4">
      <UiCard v-for="assignment in assignments" :key="assignment.id" class="p-4">
        <div class="flex items-start gap-4">
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :class="assignment.status === 'completed' ? 'bg-green-500/20 text-green-400' : assignment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-dark-50">{{ assignment.title }}</h3>
            <p class="text-sm text-dark-300 mb-2">{{ assignment.course }}</p>
            <div class="flex items-center gap-4 text-xs text-dark-400">
              <span>Due: {{ assignment.dueDate }}</span>
              <span>{{ assignment.points }} points</span>
              <UiBadge :variant="assignment.status === 'completed' ? 'success' : assignment.status === 'pending' ? 'warning' : 'accent'">
                {{ assignment.status }}
              </UiBadge>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
    
    <!-- Members Tab -->
    <div v-if="activeTab === 'members'" class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <UiInput 
          v-model="searchQuery" 
          placeholder="Search members..." 
          class="flex-1"
        />
      </div>
      
      <div class="grid md:grid-cols-2 gap-3">
        <div 
          v-for="member in filteredMembers" 
          :key="member.id"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/30 transition-colors"
        >
          <UiAvatar :src="member.avatar" :name="member.name" size="md" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-dark-50 truncate">{{ member.name }}</p>
            <p class="text-sm text-dark-300">@{{ member.username }}</p>
          </div>
          <UiButton size="sm" variant="ghost">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createMeeting } from '~/services/api/meeting'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'main'
})

const activeTab = ref('overview')
const searchQuery = ref('')
const meetingCreating = ref(false)
const meetingError = ref('')
const joinRoomId = ref('')

const userStore = useUserStore()
const isTeacher = computed(() => userStore.user?.role === 'teacher')

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'members', label: 'Members' }
]

const courses = [
  { id: '1', title: 'Machine Learning', instructor: 'Dr. Smith', progress: 75, icon: '🤖', color: '#6366f1' },
  { id: '2', title: 'Data Structures', instructor: 'Prof. Johnson', progress: 60, icon: '📊', color: '#10b981' },
  { id: '3', title: 'Web Development', instructor: 'Ms. Williams', progress: 45, icon: '🌐', color: '#f59e0b' },
  { id: '4', title: 'Database Systems', instructor: 'Dr. Brown', progress: 30, icon: '🗄️', color: '#8b5cf6' }
]

const assignments = [
  { id: '1', title: 'Neural Network Implementation', course: 'Machine Learning', dueDate: 'Feb 25, 2024', points: 100, status: 'pending' },
  { id: '2', title: 'Binary Tree Traversal', course: 'Data Structures', dueDate: 'Feb 28, 2024', points: 50, status: 'in_progress' },
  { id: '3', title: 'REST API Design', course: 'Web Development', dueDate: 'Mar 1, 2024', points: 75, status: 'completed' },
  { id: '4', title: 'SQL Query Optimization', course: 'Database Systems', dueDate: 'Mar 5, 2024', points: 60, status: 'pending' }
]

const members = [
  { id: '1', name: 'Jane Doe', username: 'janedoe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
  { id: '2', name: 'Alex Chen', username: 'alexchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { id: '3', name: 'Sarah Kim', username: 'sarahk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { id: '4', name: 'Mike Brown', username: 'mikebrown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
  { id: '5', name: 'Emily Wang', username: 'emilyw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' }
]

const filteredMembers = computed(() => {
  if (!searchQuery.value) return members
  return members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleCreateMeeting = async () => {
  if (!isTeacher.value) {
    meetingError.value = 'Only teachers can create meeting rooms.'
    return
  }

  if (meetingCreating.value) return

  meetingError.value = ''
  meetingCreating.value = true

  const result = await createMeeting()
  meetingCreating.value = false

  if (!result.success || !result.data?.roomId) {
    meetingError.value = result.error || 'Unable to create meeting room'
    return
  }

  await navigateTo(`/meeting/${encodeURIComponent(result.data.roomId)}`)
}

const handleJoinMeeting = async () => {
  if (isTeacher.value) return

  const roomId = joinRoomId.value.trim()
  if (!roomId) {
    meetingError.value = 'Enter a room ID to join.'
    return
  }

  meetingError.value = ''
  await navigateTo(`/meeting/${encodeURIComponent(roomId)}`)
}
</script>
