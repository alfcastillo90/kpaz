<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Descubre y Comparte
          <span class="text-primary">Reseñas de Libros</span>
        </h1>
        <p class="hero-subtitle">
          Únete a nuestra comunidad de lectores y encuentra tu próxima lectura favorita
        </p>
        <div class="hero-actions">
          <router-link to="/books" class="btn btn-primary btn-lg">
            Explorar Libros
          </router-link>
          <router-link v-if="!isAuthenticated" to="/register" class="btn btn-outline btn-lg">
            Registrarse
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="book-stack">
          <div class="book book-1"></div>
          <div class="book book-2"></div>
          <div class="book book-3"></div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ booksCount }}</div>
            <div class="stat-label">Libros</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ averageRating.toFixed(1) }}</div>
            <div class="stat-label">Rating Promedio</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ reviewsCount }}</div>
            <div class="stat-label">Reseñas</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Books -->
    <section class="featured-books">
      <div class="container">
        <h2 class="section-title">Libros Destacados</h2>
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Cargando libros...</p>
        </div>
        <div v-else-if="featuredBooks.length > 0" class="books-grid">
          <div
            v-for="book in featuredBooks"
            :key="book.id"
            class="book-card"
            @click="goToBook(book.id)"
          >
            <div class="book-cover">
              <img
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
              />
              <div v-else class="book-placeholder">
                <span>{{ book.title.charAt(0) }}</span>
              </div>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-rating">
                <div class="stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= book.rating }"
                  >
                    ★
                  </span>
                </div>
                <span class="rating-text">{{ book.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No hay libros disponibles</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="container">
        <h2>¿Listo para empezar?</h2>
        <p>Únete a nuestra comunidad y comparte tus reseñas favoritas</p>
        <router-link to="/books" class="btn btn-primary btn-lg">
          Ver Todos los Libros
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'

const router = useRouter()
const authStore = useAuthStore()
const booksStore = useBooksStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const loading = computed(() => booksStore.loading)
const booksCount = computed(() => booksStore.booksCount)
const averageRating = computed(() => booksStore.averageRating)
const reviewsCount = computed(() => {
  return booksStore.books.reduce((total, book) => total + book.reviewCount, 0)
})

const featuredBooks = computed(() => {
  return booksStore.books
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
})

function goToBook(bookId: string) {
  router.push({ name: 'book-detail', params: { id: bookId } })
}

onMounted(async () => {
  if (booksStore.books.length === 0) {
    await booksStore.fetchBooks()
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  display: flex;
  align-items: center;
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.text-primary {
  color: #ffd700;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: #ffd700;
  color: #333;
}

.btn-primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
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

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-stack {
  position: relative;
  width: 200px;
  height: 300px;
}

.book {
  position: absolute;
  width: 120px;
  height: 160px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.book-1 {
  transform: rotate(-15deg) translateY(0);
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.book-2 {
  transform: rotate(5deg) translateY(-20px);
  background: linear-gradient(45deg, #4834d4, #686de0);
}

.book-3 {
  transform: rotate(25deg) translateY(-40px);
  background: linear-gradient(45deg, #00b894, #00cec9);
}

.stats {
  padding: 4rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 2rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

.featured-books {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.book-cover {
  height: 200px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
}

.book-info {
  padding: 1.5rem;
}

.book-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.book-author {
  color: #666;
  margin-bottom: 1rem;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.1rem;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 0.9rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 4rem 0;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>
