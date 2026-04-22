<template>
  <div class="px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-6xl">
      <div class="w-full text-center py-20" v-if="loadingAuth">
         <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
         <p class="mt-4 text-[var(--t2)] font-medium tracking-wide">Syncing profile...</p>
      </div>
      
      <div class="w-full" v-else>
        <!-- Header Section -->
        <section class="mb-8 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_88%,transparent),color-mix(in_srgb,var(--surface2)_72%,transparent))] p-6 shadow-[var(--shadow-sm)] md:p-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
              <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">
                <span class="material-symbols-rounded text-[16px] text-brand-primary">{{ isTeacher ? 'school' : 'menu_book' }}</span>
                Tuition Connect
              </div>
              <h1 class="text-3xl font-black tracking-tight text-[var(--t1)] md:text-4xl">
                {{ isTeacher ? 'Find Students' : 'Find Tutors' }}
              </h1>
              <p class="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-[var(--t2)] md:text-base">
                {{ isTeacher ? 'Post tuition offers, review incoming requests, and manage interested students from one clean workspace.' : 'Browse verified tuition opportunities, send connection requests, and move approved conversations into messages.' }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[22rem]">
              <div class="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">
                  {{ isTeacher ? 'Received Requests' : 'Sent Requests' }}
                </p>
                <p class="mt-2 text-2xl font-black tracking-tight text-[var(--t1)]">
                  {{ isTeacher ? tuitionStore.receivedRequests.length : tuitionStore.sentRequests.length }}
                </p>
              </div>
              <div class="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">Open Posts</p>
                <p class="mt-2 text-2xl font-black tracking-tight text-[var(--t1)]">{{ tuitionStore.posts.length }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button 
              v-if="isTeacher"
              @click="showCreateModal = true"
              class="btn-primary h-12 rounded-xl px-6 shadow-[var(--shadow-sm)]"
            >
              <span class="material-symbols-rounded text-[18px]">add_circle</span>
              <span class="font-bold">Post Opportunity</span>
            </button>
            
            <button 
              @click="activeTab = activeTab === 'browse' ? 'requests' : 'browse'"
              class="btn-secondary h-12 rounded-xl px-6"
            >
              <span class="material-symbols-rounded text-[18px]">
                {{ activeTab === 'browse' ? 'notifications_active' : 'travel_explore' }}
              </span>
              <span class="font-bold">{{ activeTab === 'browse' ? (isTeacher ? 'Manage Requests' : 'Sent Requests') : 'Browse Posts' }}</span>
            </button>
          </div>
        </section>

        <!-- Main Content Area -->
        <div v-if="tuitionStore.loading && !tuitionStore.posts.length" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>

        <div v-else class="animate-fadeIn">
          <!-- Browse Posts Tab -->
          <div v-if="activeTab === 'browse'" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div v-if="!tuitionStore.posts.length" class="col-span-full rounded-[32px] border border-[var(--line)] bg-[var(--surface)] py-24 text-center shadow-sm">
              <div class="w-20 h-20 bg-[var(--surface2)] rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-rounded text-4xl text-[var(--t3)]">search_off</span>
              </div>
              <p class="text-[var(--t2)] font-bold text-xl">No tuition opportunities found yet.</p>
            </div>

            <div 
              v-for="post in tuitionStore.posts" 
              :key="post.id"
              class="ui-card group flex h-full flex-col rounded-[26px] border-[var(--line)] p-6 transition-all duration-200 hover:border-brand-primary/35 hover:shadow-[var(--shadow-md)]"
            >
              <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-3">
                  <UiAvatar :src="post.profile_pic_url" :name="post.teacher_name" size="md" class="rounded-xl" />
                  <div>
                    <h3 class="font-black text-[var(--t1)] leading-none text-base">{{ post.teacher_name }}</h3>
                    <p class="text-[11px] text-[var(--t3)] font-bold uppercase tracking-wider mt-1.5">{{ post.teacher_institution || 'Verified Teacher' }}</p>
                  </div>
                </div>
                <div class="rounded-xl border border-brand-primary/15 bg-brand-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                  {{ post.subject }}
                </div>
              </div>

              <div class="flex-1 space-y-4">
                <img 
                  v-if="post.image_url" 
                  :src="post.image_url" 
                  alt="Tuition Post Image" 
                  class="mb-1 h-44 w-full rounded-2xl object-cover"
                />
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2.5 text-[var(--t2)]">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface2)]">
                      <span class="material-symbols-rounded text-sm">location_on</span>
                    </div>
                    <span class="text-sm font-bold">{{ post.location }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-brand-primary">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/15 bg-brand-primary/10">
                      <span class="material-symbols-rounded text-sm font-bold">payments</span>
                    </div>
                    <span class="text-sm font-black">{{ post.tuition_fee }}</span>
                  </div>
                </div>
                <div class="rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/50 p-4">
                  <p class="text-[13px] text-[var(--t2)] leading-relaxed line-clamp-3 font-medium">
                    {{ post.details }}
                  </p>
                </div>
              </div>

              <div class="mt-6 pt-5 border-t border-[var(--line)]">
                <button 
                  v-if="!isTeacher"
                  @click="handleConnect(post.id)"
                  :disabled="isRequesting(post.id)"
                  class="btn-primary h-12 w-full rounded-xl"
                >
                  <span class="material-symbols-rounded text-lg">contact_mail</span>
                  <span class="font-bold">{{ isRequesting(post.id) ? 'Requesting...' : 'Request to Connect' }}</span>
                </button>
                <div v-else class="text-center py-2 text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] opacity-60">
                  Opportunity ID: #{{ post.id }}
                </div>
              </div>
            </div>
          </div>

          <!-- Requests Tab -->
          <div v-else class="space-y-4 max-w-4xl mx-auto">
            <div v-if="isTeacher">
              <div class="flex items-center gap-3 mb-8">
                 <div class="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                   <span class="material-symbols-rounded text-brand-primary">inbox</span>
                 </div>
                 <h2 class="text-2xl font-black text-[var(--t1)] tracking-tight">Received Requests</h2>
              </div>
              
              <div v-if="!tuitionStore.receivedRequests.length" class="py-24 text-center bg-[var(--surface)] rounded-[32px] border border-[var(--line)]">
                <p class="text-[var(--t2)] font-bold text-lg">No connection requests received yet.</p>
              </div>

              <div 
                v-for="req in tuitionStore.receivedRequests" 
                :key="req.id"
                class="ui-card flex flex-col justify-between gap-5 rounded-[24px] border-l-4 p-5 shadow-sm transition-all sm:flex-row sm:items-center"
                :class="getStatusBorderClass(req.status)"
              >
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-center text-brand-primary shadow-inner">
                    <span class="material-symbols-rounded text-3xl">person_search</span>
                  </div>
                  <div>
                    <h4 class="font-black text-[var(--t1)] text-lg leading-none">{{ req.student_name }}</h4>
                    <p class="text-xs text-[var(--t3)] font-bold uppercase tracking-wider mt-2">{{ req.student_institution || 'Scholar' }} • {{ req.subject }}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3">
                  <template v-if="req.status === 'pending'">
                    <button @click="updateRequestStatus(req.id, 'approved')" class="btn-primary h-10 px-6 text-xs font-bold rounded-xl">Approve</button>
                    <button @click="updateRequestStatus(req.id, 'rejected')" class="btn-ghost h-10 px-6 text-xs font-bold rounded-xl border border-[var(--line)] hover:bg-red-500/10 hover:text-red-500 transition-all">Reject</button>
                  </template>
                  <div v-else class="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border" :class="getStatusBadgeClass(req.status)">
                    {{ req.status }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex items-center gap-3 mb-8">
                 <div class="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                   <span class="material-symbols-rounded text-brand-primary">send</span>
                 </div>
                 <h2 class="text-2xl font-black text-[var(--t1)] tracking-tight">Your Sent Requests</h2>
              </div>

              <div v-if="!tuitionStore.sentRequests.length" class="py-24 text-center bg-[var(--surface)] rounded-[32px] border border-[var(--line)]">
                <p class="text-[var(--t2)] font-bold text-lg">You haven't sent any requests yet.</p>
              </div>

              <div 
                v-for="req in tuitionStore.sentRequests" 
                :key="req.id"
                class="ui-card rounded-[24px] border-l-4 p-6 transition-all"
                :class="getStatusBorderClass(req.status)"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border" :class="getStatusBadgeClass(req.status)">
                        {{ req.status }}
                      </span>
                    </div>
                    <h4 class="font-black text-[var(--t1)] text-lg">{{ req.subject }} Tuition</h4>
                    <p class="text-sm text-[var(--t2)] font-medium mt-1">By <span class="font-bold text-brand-primary">{{ req.teacher_name }}</span> • {{ req.location }} • {{ req.tuition_fee }}</p>
                  </div>
                  <NuxtLink v-if="req.status === 'approved'" to="/messages" class="btn-primary h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-2">
                    <span class="material-symbols-rounded text-base">chat</span>
                    Message
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Post Modal (Teacher Only) -->
      <BaseModal
        v-if="showCreateModal"
        :modelValue="showCreateModal"
        @update:modelValue="showCreateModal = $event"
        @close="showCreateModal = false"
        title="Post Tuition Opportunity"
      >
        <form @submit.prevent="submitPost" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <BaseInput v-model="form.subject" label="Subject Name" required />
            <BaseInput v-model="form.location" label="Location" required />
          </div>
          <BaseInput v-model="form.tuition_fee" label="Expected Fee" required />
          <div>
            <label class="block text-[11px] font-black text-[var(--t3)] uppercase tracking-[0.15em] mb-2.5 ml-1">Details</label>
            <textarea 
              v-model="form.details" 
              class="textarea-field w-full min-h-[140px] rounded-2xl bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--t1)] p-4" 
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-[11px] font-black text-[var(--t3)] uppercase tracking-[0.15em] mb-2.5 ml-1">Upload Image</label>
            <BaseInput v-model="form.image" label="Upload Image" type="file" accept="image/jpeg, image/jpg, image/png" required />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="btn-ghost px-8 font-bold">Cancel</button>
            <button type="submit" :disabled="tuitionStore.loading" class="btn-primary px-10 font-bold">
              {{ tuitionStore.loading ? 'Posting...' : 'Publish' }}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTuitionStore } from '~/stores/tuition'
import { useUserStore } from '~/stores/user'
import { useToast } from '~/composables/useToast'
import BaseModal from '~/components/base/BaseModal.vue'
import BaseInput from '~/components/base/BaseInput.vue'

definePageMeta({
  middleware: ['auth-middleware'],
  layout: 'main'
})

const tuitionStore = useTuitionStore()
const userStore = useUserStore()
const toast = useToast()

const isTeacher = computed(() => userStore.user?.role === 'teacher')
const activeTab = ref('browse')
const showCreateModal = ref(false)
const requestingIds = ref(new Set<number>())
const loadingAuth = ref(true)

const form = ref({
  subject: '',
  location: '',
  tuition_fee: '',
  details: '',
  image: ''
})

onMounted(async () => {
  try {
    if (!userStore.user) {
      await userStore.syncCurrentUser()
    }
  } finally {
    loadingAuth.value = false
  }
  
  await tuitionStore.fetchPosts()
  if (isTeacher.value) await tuitionStore.fetchReceivedRequests()
  else await tuitionStore.fetchSentRequests()
})

const isRequesting = (id: number) => requestingIds.value.has(id)

const handleConnect = async (postId: number) => {
  requestingIds.value.add(postId)
  const result = await tuitionStore.connectToPost(postId)
  requestingIds.value.delete(postId)
  if (result.success) toast.success('Request sent!')
  else toast.error(result.error || 'Failed')
}

const submitPost = async () => {
  console.log('Submitting Post:', form.value);
  const result = await tuitionStore.createPost({ ...form.value });
  console.log('Post Result:', result);
  if (result.success) {
    toast.success('Posted!')
    showCreateModal.value = false
    form.value = { subject: '', location: '', tuition_fee: '', details: '', image: '' }
  } else {
    toast.error(result.error || 'Failed to post opportunity.');
  }
}

const updateRequestStatus = async (requestId: number, status: 'approved' | 'rejected') => {
  const result = await tuitionStore.handleRequest(requestId, status)
  if (result.success) toast.success(`Request ${status}`)
}

const getStatusBorderClass = (status: string) => {
  if (status === 'approved') return 'border-brand-primary'
  if (status === 'rejected') return 'border-red-500'
  return 'border-[var(--line)]'
}

const getStatusBadgeClass = (status: string) => {
  if (status === 'approved') return 'bg-brand-primary/10 text-brand-primary'
  if (status === 'rejected') return 'bg-red-500/10 text-red-500'
  return 'bg-slate-500/10 text-[var(--t3)]'
}

const logActiveTab = () => {
  console.log('Active Tab:', activeTab.value);
  console.log('Tuition Store Data:', {
    posts: tuitionStore.posts,
    receivedRequests: tuitionStore.receivedRequests,
    sentRequests: tuitionStore.sentRequests,
  });
};

watch(activeTab, logActiveTab);
</script>

<style scoped lang="scss">
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
</style>
