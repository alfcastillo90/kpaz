<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-container">
        <div class="profile-header">
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal</p>
        </div>

        <div class="profile-content">
          <div class="profile-info">
            <div class="avatar-section">
              <div class="avatar">
                <span>{{ user?.name?.charAt(0) || 'U' }}</span>
              </div>
            </div>
            
            <div class="user-info">
              <h2>{{ user?.name }}</h2>
              <p class="email">{{ user?.email }}</p>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="logout" class="btn btn-danger">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

async function logout() {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.profile-container {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.user-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.email {
  color: #666;
  font-size: 1rem;
}

.profile-actions {
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.3);
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profile-header h1 {
    font-size: 1.75rem;
  }
}
</style>
