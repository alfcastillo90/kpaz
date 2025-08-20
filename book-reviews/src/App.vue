<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

async function logout() {
  await authStore.logout()
}

onMounted(() => {
  // Verificar si hay un token al cargar la aplicación
  authStore.fetchCurrentUser()
})
</script>

<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          📚 Book Reviews
        </router-link>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/books" class="nav-link">Libros</router-link>
          
          <div v-if="isAuthenticated" class="nav-user">
            <router-link to="/profile" class="nav-link">Perfil</router-link>
            <button @click="logout" class="nav-link logout-btn">Cerrar Sesión</button>
          </div>
          
          <div v-else class="nav-auth">
            <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
            <router-link to="/register" class="nav-link btn-register">Registrarse</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2024 Book Reviews. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation */
.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-brand:hover {
  color: #764ba2;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.nav-link:hover {
  color: #667eea;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #f0f2ff;
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  padding: 0.5rem 1.5rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.nav-user,
.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
  
  .nav-user,
  .nav-auth {
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .nav-user,
  .nav-auth {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }
}
</style>
