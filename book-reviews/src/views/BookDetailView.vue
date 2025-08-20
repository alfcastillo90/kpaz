<template>
  <div class="book-detail-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando libro...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchBook" class="btn btn-primary">Reintentar</button>
      </div>

      <!-- Book Detail -->
      <div v-else-if="book" class="book-detail">
        <!-- Book Header -->
        <div class="book-header">
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
            <h1 class="book-title">{{ book.title }}</h1>
            <p class="book-author">por {{ book.author }}</p>
            
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
              <span class="review-count">({{ book.reviewCount }} reseñas)</span>
            </div>
            
            <div class="book-meta">
              <div class="meta-item">
                <span class="label">Género:</span>
                <span class="value">{{ book.genre }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Publicado:</span>
                <span class="value">{{ formatDate(book.publishedDate) }}</span>
              </div>
              <div v-if="book.isbn" class="meta-item">
                <span class="label">ISBN:</span>
                <span class="value">{{ book.isbn }}</span>
              </div>
            </div>
            
            <p class="book-description">{{ book.description }}</p>
            
            <div class="book-actions">
              <button
                v-if="isAuthenticated"
                @click="showReviewForm = true"
                class="btn btn-primary"
              >
                Escribir Reseña
              </button>
              <router-link to="/books" class="btn btn-outline">
                Volver a Libros
              </router-link>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h2>Reseñas ({{ book.reviewCount }})</h2>
          
          <!-- Review Form -->
          <div v-if="showReviewForm && isAuthenticated" class="review-form">
            <h3>Escribir Reseña</h3>
            <form @submit.prevent="submitReview">
              <div class="rating-input">
                <label>Calificación:</label>
                <div class="star-rating">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= newReview.rating }"
                    @click="newReview.rating = i"
                  >
                    ★
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="comment">Comentario:</label>
                <textarea
                  id="comment"
                  v-model="newReview.comment"
                  rows="4"
                  placeholder="Comparte tu opinión sobre este libro..."
                  required
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  {{ submitting ? 'Enviando...' : 'Publicar Reseña' }}
                </button>
                <button
                  type="button"
                  @click="showReviewForm = false"
                  class="btn btn-outline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <!-- Reviews List -->
          <div v-if="reviews.length > 0" class="reviews-list">
            <div
              v-for="review in reviews"
              :key="review.id"
              class="review-item"
            >
              <div class="review-header">
                <div class="reviewer-info">
                  <span class="reviewer-name">{{ review.user.name }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </div>
                <div class="review-rating">
                  <div class="stars">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="star"
                      :class="{ filled: i <= review.rating }"
                    >
                      ★
                    </span>
                  </div>
                  <span class="rating-text">{{ review.rating }}/5</span>
                </div>
              </div>
              
              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
          
          <div v-else class="no-reviews">
            <p>No hay reseñas aún. ¡Sé el primero en escribir una!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const booksStore = useBooksStore()

const showReviewForm = ref(false)
const submitting = ref(false)

const newReview = ref({
  rating: 0,
  comment: ''
})

const book = computed(() => booksStore.currentBook)
const reviews = computed(() => booksStore.bookReviews)
const loading = computed(() => booksStore.loading)
const error = computed(() => booksStore.error)
const isAuthenticated = computed(() => authStore.isAuthenticated)

async function fetchBook() {
  const bookId = route.params.id as string
  try {
    await booksStore.fetchBook(bookId)
    await booksStore.fetchBookReviews(bookId)
  } catch (err) {
    console.error('Error fetching book:', err)
  }
}

async function submitReview() {
  if (!book.value || submitting.value) return
  
  submitting.value = true
  
  try {
    await booksStore.createReview(book.value.id, {
      rating: newReview.value.rating,
      comment: newReview.value.comment
    })
    
    // Reset form
    newReview.value = { rating: 0, comment: '' }
    showReviewForm.value = false
  } catch (err) {
    console.error('Error submitting review:', err)
  } finally {
    submitting.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  const bookId = route.params.id as string
  if (bookId) {
    fetchBook()
  }
})
</script>

<style scoped>
.book-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.loading-state,
.error-state {
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

.book-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
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
  font-size: 4rem;
  font-weight: 700;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.book-author {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-weight: 600;
  color: #333;
}

.review-count {
  color: #666;
  font-size: 0.9rem;
}

.book-meta {
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.meta-item .label {
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.meta-item .value {
  color: #666;
}

.book-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.book-actions {
  display: flex;
  gap: 1rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border-color: #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.reviews-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reviews-section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}

.review-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.review-form h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.rating-input {
  margin-bottom: 1rem;
}

.rating-input label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star-rating .star {
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #666;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-comment {
  color: #555;
  line-height: 1.6;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .book-header {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .book-cover {
    height: 300px;
  }
  
  .book-title {
    font-size: 2rem;
  }
  
  .book-actions {
    flex-direction: column;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
