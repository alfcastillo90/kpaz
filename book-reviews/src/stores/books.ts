import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, Review } from '@/types'
import { apiService } from '@/services/api'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const currentBook = ref<Book | null>(null)
  const bookReviews = ref<Review[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const booksCount = computed(() => books.value.length)
  const averageRating = computed(() => {
    if (books.value.length === 0) return 0
    const totalRating = books.value.reduce((sum, book) => sum + book.rating, 0)
    return totalRating / books.value.length
  })

  async function fetchBooks() {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getBooks()
      if (response.success && response.data) {
        books.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar los libros'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBook(id: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getBook(id)
      if (response.success && response.data) {
        currentBook.value = response.data
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el libro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBook(bookData: Omit<Book, 'id' | 'rating' | 'reviewCount'>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createBook(bookData)
      if (response.success && response.data) {
        books.value.push(response.data)
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear el libro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBook(id: string, bookData: Partial<Book>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateBook(id, bookData)
      if (response.success && response.data) {
        const index = books.value.findIndex(book => book.id === id)
        if (index !== -1) {
          books.value[index] = response.data
        }
        if (currentBook.value?.id === id) {
          currentBook.value = response.data
        }
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar el libro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBook(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteBook(id)
      books.value = books.value.filter(book => book.id !== id)
      if (currentBook.value?.id === id) {
        currentBook.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar el libro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBookReviews(bookId: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getBookReviews(bookId)
      if (response.success && response.data) {
        bookReviews.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar las reseñas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createReview(bookId: string, reviewData: { rating: number; comment: string }) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createReview(bookId, reviewData)
      if (response.success && response.data) {
        bookReviews.value.push(response.data)
        // Actualizar el libro actual si es el mismo
        if (currentBook.value?.id === bookId) {
          await fetchBook(bookId)
        }
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear la reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateReview(bookId: string, reviewId: string, reviewData: { rating: number; comment: string }) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateReview(bookId, reviewId, reviewData)
      if (response.success && response.data) {
        const index = bookReviews.value.findIndex(review => review.id === reviewId)
        if (index !== -1) {
          bookReviews.value[index] = response.data
        }
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar la reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteReview(bookId: string, reviewId: string) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteReview(bookId, reviewId)
      bookReviews.value = bookReviews.value.filter(review => review.id !== reviewId)
      // Actualizar el libro actual si es el mismo
      if (currentBook.value?.id === bookId) {
        await fetchBook(bookId)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar la reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentBook() {
    currentBook.value = null
    bookReviews.value = []
  }

  return {
    books,
    currentBook,
    bookReviews,
    loading,
    error,
    booksCount,
    averageRating,
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    fetchBookReviews,
    createReview,
    updateReview,
    deleteReview,
    clearError,
    clearCurrentBook
  }
})
