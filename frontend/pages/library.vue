<template>
  <div class="library">
    <h2>Mi biblioteca</h2>
    <form @submit.prevent="search">
      <input v-model="title" placeholder="Buscar por título" />
      <input v-model="author" placeholder="Buscar por autor" />
      <select v-model="sort">
        <option value="">Ordenar por</option>
        <option value="rating_asc">Calificación ascendente</option>
        <option value="rating_desc">Calificación descendente</option>
      </select>
      <label>
        <input type="checkbox" v-model="excludeNoReview" /> Excluir libros sin review
      </label>
      <button type="submit">Buscar</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-if="books.length">
      <li v-for="book in books" :key="book._id">
        <img v-if="book.coverBase64" :src="'data:image/jpeg;base64,' + book.coverBase64" width="60" />
        <span>{{ book.title }} - {{ book.author }} ({{ book.year }})</span>
        <span>Calificación: {{ book.rating }}</span>
        <span v-if="book.review">Review: {{ book.review }}</span>
        <button @click="editBook(book)">Editar</button>
        <button @click="deleteBook(book._id)">Eliminar</button>
      </li>
    </ul>
    <div v-else>No hay libros guardados.</div>
    <div v-if="showEdit" class="edit-modal">
      <h3>Editar libro</h3>
      <textarea v-model="editReview" maxlength="500"></textarea>
      <select v-model="editRating">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
      <button @click="saveEdit">Guardar</button>
      <button @click="showEdit = false">Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const books = ref<any[]>([])
const title = ref('')
const author = ref('')
const sort = ref('')
const excludeNoReview = ref(false)
const error = ref('')
const showEdit = ref(false)
const editId = ref('')
const editReview = ref('')
const editRating = ref(1)

const fetchWithAuth = (url: string, options: any = {}) => {
  const headers = options.headers || {}
  if (userStore.token) headers['Authorization'] = `Bearer ${userStore.token}`
  return $fetch(url, { ...options, headers })
}

const getBooks = async () => {
  error.value = ''
  try {
    books.value = await fetchWithAuth('/api/books/my-library', {
      params: {
        title: title.value,
        author: author.value,
        sort: sort.value,
        excludeNoReview: excludeNoReview.value
      }
    })
  } catch (e: any) {
    error.value = e.data?.message || 'Error al cargar libros'
  }
}

const search = () => {
  getBooks()
}

const editBook = (book: any) => {
  showEdit.value = true
  editId.value = book._id
  editReview.value = book.review
  editRating.value = book.rating
}

const saveEdit = async () => {
  try {
    await fetchWithAuth(`/api/books/my-library/${editId.value}`, {
      method: 'PUT',
      body: { review: editReview.value, rating: editRating.value }
    })
    showEdit.value = false
    getBooks()
  } catch (e: any) {
    error.value = e.data?.message || 'Error al editar libro'
  }
}

const deleteBook = async (id: string) => {
  if (!confirm('¿Seguro que deseas eliminar este libro?')) return
  try {
    await fetchWithAuth(`/api/books/my-library/${id}`, { method: 'DELETE' })
    getBooks()
  } catch (e: any) {
    error.value = e.data?.message || 'Error al eliminar libro'
  }
}

onMounted(() => {
  getBooks()
})
</script>

<style scoped lang="scss">
.library {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
}
form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
input, select, textarea {
  padding: 0.5rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.edit-modal {
  background: #eee;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
}
.error {
  color: #c00;
  margin: 1rem 0;
}
</style>