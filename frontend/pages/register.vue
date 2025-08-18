<template>
  <div class="register">
    <h2>Registro</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <p>¿Ya tienes cuenta? <NuxtLink to="/login">Inicia sesión</NuxtLink></p>
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

const register = async () => {
  error.value = ''
  try {
    await $fetch('/api/users/register', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    // Login automático tras registro
    const res = await $fetch('/api/users/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    userStore.setUser(res.token, email.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Error al registrarse'
  }
}
</script>

<style scoped lang="scss">
.register {
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