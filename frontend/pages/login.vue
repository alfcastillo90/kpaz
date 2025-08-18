<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <p>¿No tienes cuenta? <NuxtLink to="/register">Regístrate</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const login = async () => {
  error.value = ''
  try {
    const res = await $fetch('/api/users/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    userStore.setUser(res.token, email.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Error al iniciar sesión'
  }
}
</script>

<style scoped lang="scss">
.login {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  text-align: center;
}
input {
  width: 90%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: #c00;
  margin: 1rem 0;
}
</style>