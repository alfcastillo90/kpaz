import type { Book, Review, User, LoginCredentials, RegisterData, ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = localStorage.getItem('token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Books endpoints
  async getBooks(): Promise<ApiResponse<Book[]>> {
    return this.request('/books')
  }

  async getBook(id: string): Promise<ApiResponse<Book>> {
    return this.request(`/books/${id}`)
  }

  async createBook(book: Omit<Book, 'id' | 'rating' | 'reviewCount'>): Promise<ApiResponse<Book>> {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    })
  }

  async updateBook(id: string, book: Partial<Book>): Promise<ApiResponse<Book>> {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    })
  }

  async deleteBook(id: string): Promise<ApiResponse<void>> {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    })
  }

  // Reviews endpoints
  async getBookReviews(bookId: string): Promise<ApiResponse<Review[]>> {
    return this.request(`/books/${bookId}/reviews`)
  }

  async createReview(bookId: string, review: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
    return this.request(`/books/${bookId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    })
  }

  async updateReview(bookId: string, reviewId: string, review: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    })
  }

  async deleteReview(bookId: string, reviewId: string): Promise<ApiResponse<void>> {
    return this.request(`/books/${bookId}/reviews/${reviewId}`, {
      method: 'DELETE',
    })
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/users/me')
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }
}

export const apiService = new ApiService()
