<template>
  <button @click="logout">Cerrar sesión</button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
button {
  background: #c00;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #a00;
  }
}
</style>