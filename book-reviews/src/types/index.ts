export interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage?: string
  publishedDate: string
  isbn?: string
  genre: string
  rating: number
  reviewCount: number
}

export interface Review {
  id: string
  bookId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
