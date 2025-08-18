<template>
  <div class="main-search">
    <h1>Book Reviews</h1>
    <form @submit.prevent="searchBooks">
      <input v-model="query" placeholder="Escribe el nombre de un Libro para continuar" />
      <button type="submit">Buscar</button>
    </form>
    <div v-if="lastSearches.length" class="last-searches">
      <h3>Últimas búsquedas</h3>
      <ul>
        <li v-for="(item, i) in lastSearches" :key="i">{{ item }}</li>
      </ul>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="results.length" class="results">
      <h3>Resultados</h3>
      <ul>
        <li v-for="book in results" :key="book.openLibraryId">
          <img v-if="book.coverUrl" :src="book.coverUrl" alt="Portada" width="60" />
          <span>{{ book.title }}</span>
          <button @click="goToDetail(book)">Ver detalle</button>
        </li>
      </ul>
    </div>
    <div v-else-if="searched">No encontramos libros con el título ingresado.</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const query = ref('')
const results = ref<any[]>([])
const lastSearches = ref<string[]>([])
const error = ref('')
const searched = ref(false)
const router = useRouter()

const fetchWithAuth = (url: string, options: any = {}) => {
  // No requiere JWT para buscar libros
  return $fetch(url, options)
}

const searchBooks = async () => {
  error.value = ''
  results.value = []
  searched.value = false
  try {
    const res = await fetchWithAuth(`/api/books/search?q=${encodeURIComponent(query.value)}`)
    results.value = res
    searched.value = true
    await getLastSearches()
  } catch (e: any) {
    error.value = e.data?.message || 'Error al buscar libros'
  }
}

const getLastSearches = async () => {
  try {
    lastSearches.value = await fetchWithAuth('/api/books/last-search')
  } catch {}
}

const goToDetail = (book: any) => {
  router.push({ path: `/book/${encodeURIComponent(book.openLibraryId)}`, query: { title: book.title } })
}

onMounted(() => {
  getLastSearches()
})
</script>

<style scoped lang="scss">
.main-search {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  text-align: center;
}
input {
  width: 80%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
}
.last-searches {
  margin: 1rem 0;
  text-align: left;
}
.results ul {
  list-style: none;
  padding: 0;
}
.results li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.results img {
  margin-right: 1rem;
  border-radius: 4px;
}
.error {
  color: #c00;
  margin: 1rem 0;
}
</style>