import axios from 'axios'
import { APP_CONFIG } from '../config/appConfig.js'

// Tạo một instance riêng để quản lý API
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL, // đọc từ config/.env
  withCredentials: false,           // true nếu dùng cookie
})

// Thêm interceptor để tự động gắn token (nếu có)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api   // <-- QUAN TRỌNG: default export
