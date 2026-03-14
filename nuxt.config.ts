// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Use custom src directory
  srcDir: 'src/',
  
  // Explicitly set public directory (since srcDir is customized)
  publicDir: 'public',
  
  // Configure modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  
  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },
  
  // App configuration
  app: {
    head: {
      title: 'EduConnect - Social Learning Platform',
      meta: [
        { name: 'description', content: 'A modern social media platform for education' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a0a0f' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  routeRules: {
    '/meeting/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      backendUrl:
        process.env.NUXT_PUBLIC_BACKEND_URL ||
        'https://sincere-spontaneity-production-ab4e.up.railway.app',
      socketUrl:
        process.env.NUXT_PUBLIC_SOCKET_URL ||
        process.env.NUXT_PUBLIC_BACKEND_URL ||
        'https://sincere-spontaneity-production-ab4e.up.railway.app',
      iceServers:
        process.env.NUXT_PUBLIC_ICE_SERVERS ||
        '[{"urls":"stun:stun.l.google.com:19302"},{"urls":"stun:stun1.l.google.com:19302"}]',
    },
  },
  
  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false
  }
})
