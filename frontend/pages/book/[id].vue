<template>
  <div class="book-detail" v-if="book">
    <h2>{{ book.title }}</h2>
    <div class="meta">
      <span><b>Autor:</b> {{ book.author }}</span>
      <span><b>Año:</b> {{ book.year }}</span>
    </div>
    <img v-if="book.coverUrl" :src="book.coverUrl" alt="Portada" width="120" />
    <form @submit.prevent="saveBook">
      <textarea v-model="review" maxlength="500" placeholder="Escribe tu review (máx 500 caracteres)"></textarea>
      <div class="rating">
        <label>Calificación:</label>
        <select v-model="rating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <button type="submit">Guardar en mi biblioteca</button>
    </form>
    <div v-if="success" class="success">¡Libro guardado con éxito!</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
const route = useRoute()
const userStore = useUserStore()
const book = ref<any>(null)
const review = ref('')
const rating = ref(5)
const error = ref('')
const success = ref(false)

const fetchWithAuth = (url: string, options: any = {}) => {
  const headers = options.headers || {}
  if (userStore.token) headers['Authorization'] = `Bearer ${userStore.token}`
  return $fetch(url, { ...options, headers })
}

const getBook = async () => {
  // Recibe datos por query o busca en backend si es necesario
  book.value = {
    openLibraryId: route.params.id,
    title: route.query.title || '',
    author: route.query.author || '',
    year: route.query.year || '',
    coverUrl: route.query.coverUrl || ''
  }
}

const saveBook = async () => {
  error.value = ''
  success.value = false
  try {
    await fetchWithAuth('/api/books/my-library', {
      method: 'POST',
      body: {
        openLibraryId: book.value.openLibraryId,
        title: book.value.title,
        author: book.value.author,
        year: book.value.year,
        coverBase64: '', // Aquí deberías convertir la portada a base64 si es necesario
        review: review.value,
        rating: rating.value
      }
    })
    success.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Error al guardar libro'
  }
}

onMounted(() => {
  getBook()
})
</script>

<style scoped lang="scss">
.book-detail {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  text-align: center;
}
.meta {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-around;
}
textarea {
  width: 90%;
  min-height: 80px;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
.rating {
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
.success {
  color: #080;
  margin: 1rem 0;
}
.error {
  color: #c00;
  margin: 1rem 0;
}
</style>