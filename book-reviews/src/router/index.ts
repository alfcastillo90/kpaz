import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Inicio - Book Reviews' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Iniciar Sesión - Book Reviews' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: 'Registrarse - Book Reviews' }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/views/BooksView.vue'),
      meta: { title: 'Libros - Book Reviews' }
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: () => import('@/views/BookDetailView.vue'),
      meta: { title: 'Detalle del Libro - Book Reviews' }
    },
    {
      path: '/books/new',
      name: 'book-create',
      component: () => import('@/views/BookFormView.vue'),
      meta: { 
        title: 'Crear Libro - Book Reviews',
        requiresAuth: true 
      }
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: () => import('@/views/BookFormView.vue'),
      meta: { 
        title: 'Editar Libro - Book Reviews',
        requiresAuth: true 
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { 
        title: 'Perfil - Book Reviews',
        requiresAuth: true 
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada - Book Reviews' }
    }
  ]
})

// Guardia de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Actualizar el título de la página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
