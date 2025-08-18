import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const userStore = useUserStore()
    userStore.loadFromStorage()
  })

  return {
    provide: {
      fetchWithAuth: async (url: string, options: any = {}) => {
        const userStore = useUserStore()
        const headers = options.headers || {}
        if (userStore.token) {
          headers['Authorization'] = `Bearer ${userStore.token}`
        }
        return await $fetch(url, { ...options, headers })
      }
    }
  }
})