<template>
  <div :class="['home-shell min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d1117] dark:text-slate-100', { dark: isDarkTheme, 'is-dark-ui': isDarkTheme }]">
    <nav class="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/85 md:px-6">
      <div class="flex items-center gap-3 md:gap-8">
        <NuxtLink to="/home" class="bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent md:text-2xl">
          EduConnect BD
        </NuxtLink>

        <div class="hidden items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <span class="material-symbols-outlined mr-2 text-sm text-slate-400">search</span>
          <input
            class="w-64 border-none bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            type="text"
            placeholder="Search knowledge base..."
          />
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <div class="hidden items-center gap-6 md:flex">
          <NuxtLink class="font-bold text-emerald-600 dark:text-emerald-400" to="/home">Home</NuxtLink>
          <NuxtLink class="text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400" to="/courses">Academy</NuxtLink>
          <NuxtLink class="text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400" to="/messages">Messages</NuxtLink>
        </div>

        <div class="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800 md:ml-2 md:gap-2 md:pl-4">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            :aria-label="isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="handleThemeToggle"
          >
            <span class="material-symbols-outlined" :class="isDarkTheme ? 'text-emerald-300' : 'text-slate-500'">{{ themeToggleIcon }}</span>
          </button>

          <button type="button" class="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span class="material-symbols-outlined">notifications</span>
            <span v-if="notificationsCount > 0" class="absolute right-1 top-1 min-w-4 rounded-full bg-emerald-500 px-1 text-center text-[10px] font-bold text-white dark:text-slate-950">{{ notificationsCount }}</span>
          </button>

          <NuxtLink to="/messages" class="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span class="material-symbols-outlined">mail</span>
            <span v-if="unreadDmCount > 0" class="absolute right-1 top-1 min-w-4 rounded-full bg-emerald-500 px-1 text-center text-[10px] font-bold text-white dark:text-slate-950">{{ unreadDmCount }}</span>
          </NuxtLink>

          <NuxtLink to="/profile" class="h-8 w-8 overflow-hidden rounded-full border border-emerald-500/30 md:h-9 md:w-9">
            <img :src="profileAvatar" alt="Profile" class="h-full w-full object-cover" />
          </NuxtLink>
        </div>
      </div>
    </nav>

    <div class="flex min-h-screen pt-[92px] md:pt-24">
      <aside class="hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white transition-colors dark:border-slate-900 dark:bg-slate-950 md:fixed md:left-0 md:top-16 md:flex">
        <div class="flex items-center gap-3 px-4 py-7">
          <div class="h-10 w-10 overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-500/10">
            <img :src="profileAvatar" :alt="profileName" class="h-full w-full object-cover" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ profileName }}</p>
            <p class="mt-1 text-[9px] font-extrabold tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{{ profileRoleLabel }}</p>
          </div>
        </div>

        <nav class="flex flex-col gap-1">
          <NuxtLink class="group flex items-center gap-3 border-l-4 border-emerald-500 bg-emerald-500/5 px-6 py-3.5 text-[13px] font-semibold text-emerald-600 dark:text-emerald-400" to="/home">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">home</span>
            Home
          </NuxtLink>
          <NuxtLink class="group flex items-center gap-3 border-l-4 border-transparent px-6 py-3.5 text-[13px] font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200" to="/classroom">
            <span class="material-symbols-outlined text-[20px]">school</span>
            Classroom
          </NuxtLink>
          <NuxtLink class="group flex items-center gap-3 border-l-4 border-transparent px-6 py-3.5 text-[13px] font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200" to="/ai-tutor">
            <span class="material-symbols-outlined text-[20px]">smart_toy</span>
            AI Tutor
          </NuxtLink>
          <NuxtLink class="group flex items-center gap-3 border-l-4 border-transparent px-6 py-3.5 text-[13px] font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200" to="/messages">
            <span class="material-symbols-outlined text-[20px]">forum</span>
            Messages
          </NuxtLink>
          <NuxtLink class="group flex items-center gap-3 border-l-4 border-transparent px-6 py-3.5 text-[13px] font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200" to="/settings">
            <span class="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </NuxtLink>
        </nav>

        <div class="mt-7 px-4">
          <button
            type="button"
            class="w-full rounded-lg bg-emerald-500 py-3 text-[13px] font-bold tracking-wide text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 dark:text-slate-950"
            :disabled="isGuest"
            @click="scrollToComposer"
          >
            New Post
          </button>
        </div>
      </aside>

      <main class="w-full p-4 pt-14 md:ml-64 md:p-8 md:pt-14 lg:mr-80">
        <div class="mx-auto max-w-3xl space-y-7 pb-24">
          <section class="flex items-center gap-4 overflow-x-auto pb-2 pt-10 md:pt-12">
            <div class="shrink-0 text-center">
              <button type="button" class="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-emerald-500 p-1">
                <span class="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-emerald-600 transition-all group-hover:bg-emerald-500 group-hover:text-white dark:bg-slate-800 dark:text-emerald-400 dark:group-hover:text-slate-950">
                  <span class="material-symbols-outlined">add</span>
                </span>
              </button>
              <p class="mt-2 text-[10px] font-bold uppercase tracking-tight text-emerald-600 dark:text-emerald-400">Recommendation</p>
            </div>

            <div v-for="story in storyUsers" :key="story.id" class="shrink-0 text-center">
              <div class="rounded-full bg-gradient-to-tr from-emerald-500 to-transparent p-0.5">
                <img :src="story.avatar" :alt="story.name" class="h-16 w-16 rounded-full border-2 border-slate-50 object-cover dark:border-[#0d1117]" />
              </div>
              <p class="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">{{ story.name }}</p>
            </div>
          </section>

          <section ref="composerRef" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#141c25]">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Create Post</h2>
              <span class="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">API /api/social/posts</span>
            </div>

            <div class="flex gap-4">
              <img :src="profileAvatar" alt="User" class="h-10 w-10 rounded-full object-cover" />

              <div class="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all focus-within:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900">
                <textarea
                  v-model="newPostContent"
                  class="h-12 w-full resize-none border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                  placeholder="Share a thought or start a discussion with your peers..."
                />

                <div v-if="mediaPreviewUrl" class="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-black/80 dark:border-slate-700">
                  <img v-if="selectedMediaType === 'image'" :src="mediaPreviewUrl" alt="Preview" class="max-h-80 w-full object-cover" />
                  <video v-else :src="mediaPreviewUrl" controls class="max-h-80 w-full" preload="metadata" />
                </div>

                <input
                  ref="mediaInputRef"
                  type="file"
                  class="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-matroska"
                  @change="handleMediaSelected"
                />

                <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <button type="button" class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase text-emerald-600 transition-all hover:bg-emerald-500/10 dark:text-emerald-400" @click="openMediaPicker">
                      <span class="material-symbols-outlined text-lg">image</span>
                      Image
                    </button>
                    <button type="button" class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase text-emerald-600 transition-all hover:bg-emerald-500/10 dark:text-emerald-400" @click="openMediaPicker">
                      <span class="material-symbols-outlined text-lg">bar_chart</span>
                      Poll
                    </button>
                    <button v-if="selectedMediaFile" type="button" class="text-xs font-semibold text-red-500" @click="clearSelectedMedia">Remove</button>
                  </div>

                  <button
                    type="button"
                    class="rounded-full bg-emerald-100 px-6 py-2 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:text-slate-950"
                    :disabled="creatingPost || (!newPostContent.trim() && !selectedMediaFile) || isGuest"
                    @click="handleCreatePost"
                  >
                    {{ creatingPost ? 'Posting...' : 'POST' }}
                  </button>
                </div>
              </div>
            </div>

            <p v-if="displayError" class="mt-3 text-sm text-red-500">{{ displayError }}</p>
            <p v-if="isGuest" class="mt-3 text-sm text-slate-500 dark:text-slate-400">Login is required for posting, liking, and commenting.</p>
          </section>

          <section v-if="featuredPost" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#141c25]">
            <div class="p-6">
              <div class="mb-5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img :src="featuredPost.user.avatar || profileAvatar" :alt="featuredPost.user.displayName" class="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h3 class="font-bold text-slate-900 dark:text-slate-100">{{ featuredPost.user.displayName }}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatRelativeTime(featuredPost.timestamp) }} • Social Feed</p>
                  </div>
                </div>
                <span class="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">API /api/social/posts</span>
              </div>

              <div class="flex flex-col gap-5 md:flex-row">
                <div class="flex-1 space-y-3">
                  <h2 class="text-2xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">{{ truncateText(featuredPost.content || 'Latest updates from your learning community.', 130) }}</h2>
                  <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ featuredPost.content }}</p>
                </div>

                <div v-if="featuredPost.mediaUrl" class="h-32 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-emerald-500/10 dark:bg-slate-900 md:w-48">
                  <img v-if="featuredPost.mediaType !== 'video'" :src="featuredPost.mediaUrl" alt="Featured media" class="h-full w-full object-cover" />
                  <video v-else :src="featuredPost.mediaUrl" controls class="h-full w-full object-cover" preload="metadata" />
                </div>
              </div>

              <div class="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <button type="button" class="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-[10px] font-bold text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400" @click="handleLike(featuredPost.id)">
                  <span class="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400" :class="{ 'icon-fill': featuredPost.isLiked }">favorite</span>
                  {{ formatCount(featuredPost.likes) }} LIKES
                </button>
                <button type="button" class="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-[10px] font-bold text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400" @click="toggleCommentBox(featuredPost.id)">
                  <span class="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400">chat_bubble</span>
                  {{ formatCount(featuredPost.comments) }} COMMENTS
                </button>
                <button type="button" class="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-[10px] font-bold text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400">
                  <span class="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400">grade</span>
                  STAR RECOMMEND
                </button>
              </div>

              <div v-if="!isGuest && isCommentBoxOpen(featuredPost.id)" class="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                <textarea
                  v-model="commentDrafts[featuredPost.id]"
                  rows="2"
                  class="w-full resize-none border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                  placeholder="Write a comment..."
                  @keydown.enter.exact.prevent="submitComment(featuredPost.id)"
                />
                <div class="mt-2 flex justify-end gap-2">
                  <button type="button" class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300" @click="closeCommentBox(featuredPost.id)">Cancel</button>
                  <button type="button" class="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 dark:text-slate-950" :disabled="isCommentSubmitting(featuredPost.id) || !getCommentDraft(featuredPost.id).trim()" @click="submitComment(featuredPost.id)">Comment</button>
                </div>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
            <article v-for="post in secondaryPosts" :key="post.id" class="overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#141c25]">
              <div class="relative aspect-video bg-black">
                <img v-if="post.mediaUrl && post.mediaType !== 'video'" :src="post.mediaUrl" :alt="post.user.displayName" class="h-full w-full object-cover opacity-75" />
                <video v-else-if="post.mediaUrl" :src="post.mediaUrl" class="h-full w-full object-cover opacity-80" muted />
                <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700/30 to-slate-900">
                  <span class="material-symbols-outlined text-5xl text-emerald-300">school</span>
                </div>
                <div class="absolute bottom-3 left-3 rounded bg-emerald-500 px-2 py-0.5 text-[8px] font-extrabold tracking-wider text-white dark:text-slate-950">LIVE API</div>
              </div>
              <div class="p-4">
                <h4 class="mb-1 line-clamp-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{ truncateText(post.content || 'Untitled update', 60) }}</h4>
                <div class="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{{ post.user.displayName }}</span>
                  <span>{{ formatCount(post.likes) }} likes</span>
                </div>
              </div>
            </article>

            <article class="course-card rounded-lg border border-slate-200 p-5 dark:border-slate-800">
              <div class="space-y-4">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="max-w-[150px] text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">{{ featuredCourse.title }}</h4>
                    <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{{ featuredCourseSource }}</p>
                  </div>
                  <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400">auto_awesome</span>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <span>PROGRESS</span>
                    <span class="text-emerald-600 dark:text-emerald-400">{{ featuredCourse.progress }}%</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                    <div class="h-full rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(0,229,160,0.5)]" :style="{ width: `${featuredCourse.progress}%` }" />
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <span class="text-[10px] text-slate-500 dark:text-slate-400">Instructor: {{ featuredCourse.instructor }}</span>
                <button type="button" class="rounded-full border border-emerald-500/20 bg-slate-100 px-4 py-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:bg-slate-900 dark:text-emerald-400 dark:hover:text-slate-950">
                  Continue
                </button>
              </div>
            </article>
          </section>

          <div v-if="hasMore && !loading" class="text-center">
            <button type="button" class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300" @click="loadMore">
              Load more posts
            </button>
          </div>
        </div>
      </main>

      <aside class="home-right-sidebar hidden h-[calc(100vh-64px)] w-80 flex-col gap-7 overflow-y-auto border-l border-slate-200 bg-white p-6 transition-colors dark:border-slate-900 dark:bg-slate-950 lg:fixed lg:right-0 lg:top-16 lg:flex">
        <header>
          <h5 class="mb-1 text-[10px] font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400">ACTIVITY HUB</h5>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Notifications & Updates</p>
        </header>

        <section class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#1c2633]">
          <h6 class="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Connected Endpoints</h6>
          <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li class="flex items-center justify-between gap-3">
              <span>/api/social/posts</span>
              <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
            </li>
            <li class="flex items-center justify-between gap-3">
              <span>/api/social/notifications/unread-count</span>
              <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
            </li>
            <li class="flex items-center justify-between gap-3">
              <span>/api/social/dm/conversations</span>
              <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
            </li>
            <li class="flex items-center justify-between gap-3">
              <span>/api/classroom/courses</span>
              <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
            </li>
            <li class="flex items-center justify-between gap-3">
              <span>Upcoming events panel</span>
              <span class="rounded-full bg-slate-200 px-2 py-0.5 font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">DEMO</span>
            </li>
          </ul>
        </section>

        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h6 class="text-sm font-bold text-slate-900 dark:text-slate-100">Live Classes</h6>
            <span class="rounded-full border border-emerald-500/20 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">{{ classroomCourses.length }} ACTIVE</span>
          </div>

          <div class="space-y-3">
            <article v-for="course in liveClassCards" :key="course.id" class="rounded-lg border border-slate-100 bg-slate-50 p-4 shadow-sm dark:border-emerald-500/10 dark:bg-[#1c2633]">
              <div class="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p class="text-[8px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{{ (course.department || 'GENERAL').toUpperCase() }}</p>
                  <h3 class="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">{{ course.title }}</h3>
                </div>
                <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>{{ course.instructor.displayName }}</span>
                <button type="button" class="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-extrabold text-white transition-all hover:scale-105 dark:text-slate-950">Join</button>
              </div>
            </article>
          </div>
        </section>

        <section class="space-y-3">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span class="material-symbols-outlined text-lg">schedule</span>
            <h6 class="text-sm font-bold text-slate-900 dark:text-slate-100">Upcoming</h6>
            <span class="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">DEMO</span>
          </div>
          <article v-for="event in demoUpcoming" :key="event.id" class="cursor-pointer rounded-lg p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
            <p class="mb-1 text-[8px] font-bold uppercase text-emerald-600 dark:text-emerald-400">{{ event.topic }}</p>
            <h4 class="mb-1 text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400">{{ event.title }}</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">{{ event.time }}</p>
          </article>
        </section>
      </aside>
    </div>

    <nav class="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white/90 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/90 md:hidden">
      <NuxtLink to="/home" class="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
        <span class="text-[8px] font-bold">Home</span>
      </NuxtLink>
      <NuxtLink to="/classroom" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
        <span class="material-symbols-outlined">school</span>
        <span class="text-[8px] font-bold">Classroom</span>
      </NuxtLink>
      <button type="button" class="relative -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 dark:text-slate-950" @click="scrollToComposer">
        <span class="material-symbols-outlined">add</span>
      </button>
      <NuxtLink to="/messages" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
        <span class="material-symbols-outlined">forum</span>
        <span class="text-[8px] font-bold">Messages</span>
      </NuxtLink>
      <NuxtLink to="/profile" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
        <span class="material-symbols-outlined">account_circle</span>
        <span class="text-[8px] font-bold">Profile</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { usePostsStore } from '~/stores/posts'
import { useTheme } from '~/composables/useTheme'
import { getClassroomCourses, type ClassroomCourse } from '~/services/api/classroom'
import { getDmConversations, getUnreadNotificationsCount } from '~/services/api/social'
import type { Post } from '~/types/post'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
  ],
})

interface StoryUser {
  id: string
  name: string
  avatar: string
}

interface FeaturedCourseCard {
  title: string
  instructor: string
  progress: number
}

const userStore = useUserStore()
const postsStore = usePostsStore()
const { posts, loading, hasMore, error } = storeToRefs(postsStore)
const { themePreference, resolvedTheme, setThemePreference, initTheme } = useTheme()

const isGuest = computed(() => !userStore.isAuthenticated)
const isDarkTheme = computed(() => resolvedTheme.value === 'dark')
const themeToggleIcon = computed(() => (isDarkTheme.value ? 'light_mode' : 'dark_mode'))
const profileName = computed(() => userStore.user?.displayName || userStore.user?.name || 'Alex Rivera')
const profileAvatar = computed(() => userStore.user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwMf6dhDv9v9KjnW_S7rljQDjBOZmA6xkP8QGyBXlwiddh1UfuatBEqNP8f4vOp_bMYXFTs0kwP5raMJo5gsAZnREt1X0IRHW0Jh77dKkXp69yEoC2fHn7N879pofiwnVYZWkiIHzRgwOFrvrPkyGLxd13qCTvyaXpdB09w_T9vp9tchhuAvx5tUuh41X9YUx-ovoQ9hcxoM-ae9CLIBMhoTXcPFtf9LMmBDPhy-MFioJdHiJBYdkBvUO3wGD0pPj5t8_H-cf9wKzH')
const profileRoleLabel = computed(() => (userStore.user?.role || 'student').toUpperCase())

const composerRef = ref<HTMLElement | null>(null)
const notificationsCount = ref(0)
const unreadDmCount = ref(0)
const classroomCourses = ref<ClassroomCourse[]>([])

const newPostContent = ref('')
const creatingPost = ref(false)
const mediaInputRef = ref<HTMLInputElement | null>(null)
const selectedMediaFile = ref<File | null>(null)
const mediaPreviewUrl = ref('')
const selectedMediaType = ref<'image' | 'video'>('image')
const localError = ref('')
const openCommentPostIds = ref<string[]>([])
const commentDrafts = ref<Record<string, string>>({})
const commentSubmittingByPost = ref<Record<string, boolean>>({})

const allowedMediaTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
])

const maxMediaBytes = 50 * 1024 * 1024

const fallbackStories: StoryUser[] = [
  {
    id: 'story-1',
    name: 'ELENA_DESIGN',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO65tkgGjRffICE48w7L7PmvFTS4d79WNYHZ0WZSVc5wBGBUAQHkRMqmmFqAL-qTyc4Yh2Cfn805o3MjoAYp4k0z655Vmhwk-kgusSeOf9OIRBwlnJaJsGBFMckokLJ3mgF_IgryyYVQIL6H0tlcxdf6hBJIcoXro8ywe12JX-0cvxLh9lyOhQinJLroB1TYisoA8q_fScmT1UEtQTbAahpbsjGrdVbbkF6RB5QQ8spkTLD7VsV6T_glrRR0nUZSoajU8Uv6505Z_T',
  },
  {
    id: 'story-2',
    name: 'PROFESSOR_X',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5G0LnQQGO_LczmdzQnrPgGlrqY-MDz43BtLjA4MAJV6j4yYNgMomQGeTVuKCK9zlo0KqA0lWlUFcO6WNxoAamTQeF7pKVUgZr-KLJKn1J6ffTkVtSRL0x8cfBbRrv1ROMVY2g9u0G-4iA5WYTH5YCc3gYGjjm6K1uDUd1ELsA7hpeuHEj7L9idSPTLn45p_IvPEe5-2NyPBDpXY7FtdkjusbHSbYEuSTsI4iKNedesiZkZC0GF-LEgbi4Do5MOzUfPUj_YtdwY3TP',
  },
  {
    id: 'story-3',
    name: 'BIO_MATE',
    avatar: 'https://images.unsplash.com/photo-1542204625-de293a2f0de2?auto=format&fit=crop&w=160&q=80',
  },
]

const demoUpcoming = [
  { id: 'up-1', topic: 'Bio-Tech', title: 'CRISPR Editing Ethics', time: 'Tomorrow, 10:00 AM' },
  { id: 'up-2', topic: 'Economics', title: 'Digital Currencies in 2026', time: 'Fri, 2:00 PM' },
]

const featuredDemoCourse: FeaturedCourseCard = {
  title: 'Applied Machine Learning II',
  instructor: 'Dr. Sarah Chen',
  progress: 65,
}

const displayError = computed(() => localError.value || error.value || '')
const featuredPost = computed<Post | null>(() => posts.value[0] || null)
const secondaryPosts = computed<Post[]>(() => posts.value.slice(1, 5))

const storyUsers = computed<StoryUser[]>(() => {
  const mapped = posts.value
    .filter((post) => Boolean(post.user?.avatar))
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      name: post.user.displayName,
      avatar: post.user.avatar || profileAvatar.value,
    }))

  if (mapped.length >= 3) {
    return mapped
  }

  return [...mapped, ...fallbackStories].slice(0, 5)
})

const liveClassCards = computed<ClassroomCourse[]>(() => {
  if (classroomCourses.value.length) {
    return classroomCourses.value.slice(0, 2)
  }

  return [
    {
      id: 'demo-course-1',
      title: 'Quantum Entanglement and Non-locality',
      code: 'AST-602',
      description: 'Demo card because no live classroom course endpoint response was available.',
      department: 'Advanced Astrophysics',
      status: 'active',
      createdAt: new Date().toISOString(),
      instructor: {
        id: 'demo-teacher-1',
        username: 'marcus.thorne',
        displayName: 'Prof. Marcus Thorne',
        avatar: profileAvatar.value,
        profilePicUrl: profileAvatar.value,
        isProfilePublic: true,
      },
      enrollmentStatus: 'open',
      memberCount: 32,
    },
  ]
})

const featuredCourse = computed<FeaturedCourseCard>(() => {
  const apiCourse = classroomCourses.value[0]
  if (!apiCourse) {
    return featuredDemoCourse
  }

  return {
    title: apiCourse.title,
    instructor: apiCourse.instructor.displayName,
    progress: Math.min(95, Math.max(20, (apiCourse.memberCount % 80) + 15)),
  }
})

const featuredCourseSource = computed(() => (classroomCourses.value.length ? 'LIVE API /api/classroom/courses' : 'DEMO'))

const formatRelativeTime = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`

  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const formatCount = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

const truncateText = (value: string, max = 120): string => {
  if (!value) return ''
  if (value.length <= max) return value
  return `${value.slice(0, max).trim()}...`
}

const loadSidebarData = async () => {
  const [notificationsResult, dmResult, coursesResult] = await Promise.all([
    getUnreadNotificationsCount(),
    getDmConversations(20, 0),
    getClassroomCourses({ page: 1, limit: 6, status: 'active', sortBy: 'createdAt', sortOrder: 'desc' }),
  ])

  if (notificationsResult.success && notificationsResult.data) {
    notificationsCount.value = notificationsResult.data.unreadCount
  }

  if (dmResult.success && dmResult.data) {
    unreadDmCount.value = dmResult.data.reduce((sum, row) => sum + (row.unreadCount || 0), 0)
  }

  if (coursesResult.success && coursesResult.data) {
    classroomCourses.value = coursesResult.data
  }
}

const revokePreviewUrl = () => {
  if (mediaPreviewUrl.value) {
    URL.revokeObjectURL(mediaPreviewUrl.value)
    mediaPreviewUrl.value = ''
  }
}

const clearSelectedMedia = () => {
  selectedMediaFile.value = null
  selectedMediaType.value = 'image'
  revokePreviewUrl()

  if (mediaInputRef.value) {
    mediaInputRef.value.value = ''
  }
}

const openMediaPicker = () => {
  mediaInputRef.value?.click()
}

const handleMediaSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  localError.value = ''

  if (!allowedMediaTypes.has(file.type)) {
    localError.value = 'Unsupported file type. Please upload a supported image or video.'
    clearSelectedMedia()
    return
  }

  if (file.size > maxMediaBytes) {
    localError.value = 'File is too large. Maximum allowed size is 50MB.'
    clearSelectedMedia()
    return
  }

  revokePreviewUrl()
  selectedMediaFile.value = file
  selectedMediaType.value = file.type.startsWith('video/') ? 'video' : 'image'
  mediaPreviewUrl.value = URL.createObjectURL(file)
}

const handleLike = async (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to like posts.'
    return
  }

  await postsStore.toggleLike(postId)
}

const isCommentBoxOpen = (postId: string) => openCommentPostIds.value.includes(postId)

const toggleCommentBox = (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to comment on posts.'
    return
  }

  if (isCommentBoxOpen(postId)) {
    openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
    return
  }

  openCommentPostIds.value.push(postId)
  if (commentDrafts.value[postId] === undefined) {
    commentDrafts.value[postId] = ''
  }
}

const closeCommentBox = (postId: string) => {
  openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
}

const getCommentDraft = (postId: string) => commentDrafts.value[postId] || ''
const isCommentSubmitting = (postId: string) => Boolean(commentSubmittingByPost.value[postId])

const submitComment = async (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to comment on posts.'
    return
  }

  const draft = getCommentDraft(postId).trim()
  if (!draft || isCommentSubmitting(postId)) return

  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: true,
  }

  const result = await postsStore.addCommentToPost(postId, draft)

  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: false,
  }

  if (result.success) {
    commentDrafts.value = {
      ...commentDrafts.value,
      [postId]: '',
    }
    closeCommentBox(postId)
    return
  }

  localError.value = result.error || 'Failed to add comment'
}

const handleCreatePost = async () => {
  if (isGuest.value) {
    localError.value = 'Please log in to create a post.'
    return
  }

  if (!newPostContent.value.trim() && !selectedMediaFile.value) return

  localError.value = ''
  creatingPost.value = true

  const result = await postsStore.createNewPost(newPostContent.value.trim(), selectedMediaFile.value)

  creatingPost.value = false

  if (result.success) {
    newPostContent.value = ''
    clearSelectedMedia()
    await loadSidebarData()
    return
  }

  localError.value = result.error || 'Failed to publish post'
}

const loadMore = async () => {
  await postsStore.loadMore()
}

const scrollToComposer = () => {
  composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const handleThemeToggle = () => {
  setThemePreference(resolvedTheme.value === 'dark' ? 'light' : 'dark')
}

onMounted(async () => {
  initTheme()

  // Keep the new home UI aligned with the design baseline: default dark on first visit.
  if (themePreference.value === 'system' && process.client) {
    const hasSavedPreference = Boolean(localStorage.getItem('educonnect_theme_preference'))
    if (!hasSavedPreference) {
      setThemePreference('dark')
    }
  }

  await Promise.all([
    postsStore.fetchPosts(true),
    loadSidebarData(),
  ])
})

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>

<style lang="css">
.home-shell,
.home-shell * {
  transition: background-color 0.4s ease, border-color 0.4s ease, color 0.35s ease, box-shadow 0.35s ease;
}

.home-shell {
  font-family: 'Inter', sans-serif;
}

.home-shell .font-headline,
.home-shell h1,
.home-shell h2,
.home-shell h3,
.home-shell h4,
.home-shell h5,
.home-shell h6 {
  font-family: 'Manrope', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.icon-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.home-right-sidebar,
.course-card {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 229, 160, 0.03) 0px,
    rgba(0, 229, 160, 0.03) 1px,
    transparent 1px,
    transparent 10px
  );
}

.is-dark-ui {
  background-color: #10141a !important;
  color: #dfe2eb !important;
}

.is-dark-ui nav.fixed.top-0 {
  background: rgba(2, 6, 12, 0.8) !important;
  border-bottom-color: rgba(59, 74, 65, 0.2) !important;
  box-shadow: 0 0 20px rgba(110, 255, 192, 0.05) !important;
}

.is-dark-ui aside {
  background: rgba(11, 15, 22, 0.78) !important;
  border-color: rgba(59, 74, 65, 0.2) !important;
}

.is-dark-ui section,
.is-dark-ui article,
.is-dark-ui .course-card {
  border-color: rgba(59, 74, 65, 0.2) !important;
}

.is-dark-ui section {
  background-color: #1c2026 !important;
}

.is-dark-ui .home-right-sidebar section {
  background-color: #1c2026 !important;
}

.is-dark-ui textarea,
.is-dark-ui input {
  color: #dfe2eb !important;
}

.is-dark-ui textarea::placeholder,
.is-dark-ui input::placeholder {
  color: #bacbbf !important;
}

.is-dark-ui .rounded-xl.border {
  background-color: #0a0e14 !important;
  border-color: rgba(59, 74, 65, 0.35) !important;
}

.is-dark-ui .home-right-sidebar,
.is-dark-ui .course-card {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(110, 255, 192, 0.03) 0px,
    rgba(110, 255, 192, 0.03) 1px,
    transparent 1px,
    transparent 10px
  ) !important;
}
</style>
