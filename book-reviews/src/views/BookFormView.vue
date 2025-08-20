<template>
  <div class="book-form-page">
    <div class="container">
      <div class="form-container">
        <div class="form-header">
          <h1>{{ isEditing ? 'Editar Libro' : 'Crear Nuevo Libro' }}</h1>
          <p>{{ isEditing ? 'Actualiza la información del libro' : 'Agrega un nuevo libro a nuestra biblioteca' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="book-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Título *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="Título del libro"
                :disabled="loading"
              />
            </div>

            <div class="form-group">
              <label for="author">Autor *</label>
              <input
                id="author"
                v-model="form.author"
                type="text"
                required
                placeholder="Nombre del autor"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="genre">Género *</label>
              <select
                id="genre"
                v-model="form.genre"
                required
                :disabled="loading"
              >
                <option value="">Selecciona un género</option>
                <option value="Ficción">Ficción</option>
                <option value="No Ficción">No Ficción</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Fantasía">Fantasía</option>
                <option value="Misterio">Misterio</option>
                <option value="Romance">Romance</option>
                <option value="Terror">Terror</option>
                <option value="Histórico">Histórico</option>
                <option value="Biografía">Biografía</option>
                <option value="Autoayuda">Autoayuda</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Cocina">Cocina</option>
                <option value="Viajes">Viajes</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="publishedDate">Fecha de Publicación *</label>
              <input
                id="publishedDate"
                v-model="form.publishedDate"
                type="date"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="isbn">ISBN</label>
            <input
              id="isbn"
              v-model="form.isbn"
              type="text"
              placeholder="ISBN del libro (opcional)"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="coverImage">URL de la Portada</label>
            <input
              id="coverImage"
              v-model="form.coverImage"
              type="url"
              placeholder="https://ejemplo.com/portada.jpg"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="description">Descripción *</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="6"
              required
              placeholder="Describe brevemente el libro..."
              :disabled="loading"
            ></textarea>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Libro' : 'Crear Libro') }}
            </button>
            <router-link to="/books" class="btn btn-outline">
              Cancelar
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const form = reactive({
  title: '',
  author: '',
  genre: '',
  publishedDate: '',
  isbn: '',
  coverImage: '',
  description: ''
})

const loading = ref(false)
const error = ref('')

const isEditing = computed(() => route.name === 'book-edit')

async function loadBook() {
  if (!isEditing.value) return
  
  const bookId = route.params.id as string
  try {
    const book = await booksStore.fetchBook(bookId)
    if (book) {
      form.title = book.title
      form.author = book.author
      form.genre = book.genre
      form.publishedDate = book.publishedDate.split('T')[0] // Convert to YYYY-MM-DD
      form.isbn = book.isbn || ''
      form.coverImage = book.coverImage || ''
      form.description = book.description
    }
  } catch (err) {
    console.error('Error loading book:', err)
    error.value = 'Error al cargar el libro'
  }
}

async function handleSubmit() {
  if (loading.value) return

  loading.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      const bookId = route.params.id as string
      await booksStore.updateBook(bookId, form)
    } else {
      await booksStore.createBook(form)
    }
    
    router.push('/books')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar el libro'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBook()
})
</script>

<style scoped>
.book-form-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1.1rem;
}

.book-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  border: 1px solid #fed7d7;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
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

@media (max-width: 768px) {
  .form-container {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-header h1 {
    font-size: 1.75rem;
  }
}
</style>
