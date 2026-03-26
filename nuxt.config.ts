// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Use custom src directory
  srcDir: 'src/',
  
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'
        },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css' }
      ]
    },
    pageTransition: { name: 'fade' }
  },

  routeRules: {
    '/meeting/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      signalUrl: process.env.NUXT_PUBLIC_SIGNAL_URL,
      stunUrl: process.env.NUXT_PUBLIC_STUN_URL,
      turnUrl: process.env.NUXT_PUBLIC_TURN_URL,
      turnUser: process.env.NUXT_PUBLIC_TURN_USER,
      turnPass: process.env.NUXT_PUBLIC_TURN_PASS,
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
