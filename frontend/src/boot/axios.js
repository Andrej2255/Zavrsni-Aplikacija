import axios from 'axios'
import { Platform } from 'quasar'
import { defineBoot } from '#q-app'
import { useAuthStore } from '@/stores/auth'

const baseURL = Platform.is.capacitor
  ? 'http://10.0.2.2:3000/api'
  : 'http://localhost:3000/api'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore()
      auth.logout()
    }
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
