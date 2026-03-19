export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.apiUrl || runtimeConfig.public.backendUrl

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = process.client
        ? localStorage.getItem('educonnect_token')
        : useCookie<string | null>('educonnect_token').value

      if (!token) return

      const headers = new Headers(options.headers || {})
      headers.set('Authorization', `Bearer ${token}`)
      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401 && process.client) {
        localStorage.removeItem('educonnect_token')
        localStorage.removeItem('educonnect_auth')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
