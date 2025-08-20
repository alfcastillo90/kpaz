<template>
  <div class="books-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1>Biblioteca de Libros</h1>
        <p>Explora nuestra colección de libros y encuentra tu próxima lectura</p>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar libros por título o autor..."
            class="search-input"
          />
        </div>
        
        <div class="filters">
          <select v-model="selectedGenre" class="filter-select">
            <option value="">Todos los géneros</option>
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
          
          <select v-model="sortBy" class="filter-select">
            <option value="title">Ordenar por título</option>
            <option value="author">Ordenar por autor</option>
            <option value="rating">Ordenar por rating</option>
            <option value="publishedDate">Ordenar por fecha</option>
          </select>
        </div>

        <div v-if="isAuthenticated" class="add-book-btn">
          <router-link to="/books/new" class="btn btn-primary">
            <span>+</span> Agregar Libro
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando libros...</p>
      </div>

      <!-- Books Grid -->
      <div v-else-if="filteredBooks.length > 0" class="books-grid">
        <div
          v-for="book in filteredBooks"
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
            <p class="book-genre">{{ book.genre }}</p>
            
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
            
            <div class="book-meta">
              <span class="review-count">{{ book.reviewCount }} reseñas</span>
              <span class="published-date">{{ formatDate(book.publishedDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No se encontraron libros</h3>
        <p>Intenta ajustar tus filtros de búsqueda</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchBooks" class="btn btn-primary">Reintentar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'

const router = useRouter()
const authStore = useAuthStore()
const booksStore = useBooksStore()

const searchQuery = ref('')
const selectedGenre = ref('')
const sortBy = ref('title')

const loading = computed(() => booksStore.loading)
const error = computed(() => booksStore.error)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const books = computed(() => booksStore.books)

const genres = computed(() => {
  const genreSet = new Set(books.value.map(book => book.genre))
  return Array.from(genreSet).sort()
})

const filteredBooks = computed(() => {
  let filtered = books.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    )
  }

  // Filter by genre
  if (selectedGenre.value) {
    filtered = filtered.filter(book => book.genre === selectedGenre.value)
  }

  // Sort books
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      case 'rating':
        return b.rating - a.rating
      case 'publishedDate':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      default:
        return 0
    }
  })

  return filtered
})

function goToBook(bookId: string) {
  router.push({ name: 'book-detail', params: { id: bookId } })
}

function formatDate(dateString: string) {
  return new Date(dateString).getFullYear()
}

async function fetchBooks() {
  try {
    await booksStore.fetchBooks()
  } catch (err) {
    console.error('Error fetching books:', err)
  }
}

onMounted(() => {
  if (books.value.length === 0) {
    fetchBooks()
  }
})

// Watch for changes in filters to update URL params
watch([searchQuery, selectedGenre, sortBy], () => {
  const params = new URLSearchParams()
  if (searchQuery.value) params.set('q', searchQuery.value)
  if (selectedGenre.value) params.set('genre', selectedGenre.value)
  if (sortBy.value !== 'title') params.set('sort', sortBy.value)
  
  const newUrl = params.toString() ? `?${params.toString()}` : '/books'
  router.replace(newUrl)
})
</script>

<style scoped>
.books-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.add-book-btn {
  margin-left: auto;
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
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  line-height: 1.3;
}

.book-author {
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.book-genre {
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  font-weight: 600;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
}

.error-state {
  text-align: center;
  padding: 4rem 0;
}

.error-state p {
  color: #c53030;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filters {
    justify-content: space-between;
  }
  
  .add-book-btn {
    margin-left: 0;
    text-align: center;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
