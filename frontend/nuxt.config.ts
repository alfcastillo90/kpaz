import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  css: [
    '@/assets/styles/main.scss'
  ],
  // Puedes agregar más configuración aquí si lo necesitas
})
