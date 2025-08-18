import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null as string | null,
    email: null as string | null,
  }),
  actions: {
    setUser(token: string, email: string) {
      this.token = token
      this.email = email
      localStorage.setItem('token', token)
      localStorage.setItem('email', email)
    },
    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    },
    loadFromStorage() {
      this.token = localStorage.getItem('token')
      this.email = localStorage.getItem('email')
    }
  }
})