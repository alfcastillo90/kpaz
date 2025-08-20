<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div class="actions">
          <router-link to="/" class="btn btn-primary">
            Volver al Inicio
          </router-link>
          <router-link to="/books" class="btn btn-outline">
            Ver Libros
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica adicional para esta vista
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.not-found-content h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.not-found-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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

.btn-primary {
  background: #ffd700;
  color: #333;
}

.btn-primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.btn-outline {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-outline:hover {
  background: white;
  color: #333;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  .not-found-content h1 {
    font-size: 2rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
