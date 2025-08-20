import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { apiService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.login(credentials)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.register(userData)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al registrarse'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiService.logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    
    try {
      const response = await apiService.getCurrentUser()
      if (response.success && response.data) {
        user.value = response.data
      }
    } catch (err) {
      console.error('Error al obtener usuario actual:', err)
      // Si hay error, limpiar el token
      logout()
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError
  }
})
