<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a nuestra comunidad de lectores</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="name">Nombre Completo</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Tu nombre completo"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="tu@email.com"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Repite tu contraseña"
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn-register" :disabled="loading || !isFormValid">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="register-footer">
          <p>
            ¿Ya tienes una cuenta?
            <router-link to="/login" class="link">Inicia sesión aquí</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword
  )
})

async function handleRegister() {
  if (loading.value || !isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    await authStore.register(form)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Si ya está autenticado, redirigir
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #fed7d7;
}

.btn-register {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.register-footer p {
  color: #666;
  font-size: 0.9rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-page {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem;
  }
  
  .register-header h1 {
    font-size: 1.75rem;
  }
}
</style>
