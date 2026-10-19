import axios from 'axios'

// Базовый адрес нашего Django API.
// Тогда запросы будут вида: http://localhost:8000/api/v1/auth/login/
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
})

// Перед каждым запросом смотрим в localStorage.
// Если там есть access-токен — добавляем заголовок Authorization.
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access')
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Превращаем технические ошибки Axios в понятное текстовое сообщение.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Не удалось выполнить запрос.'

    if (error.response) {
      // Сервер ответил, но с ошибкой (4xx/5xx).
      const data = error.response.data
      if (typeof data === 'string') {
        message = data
      } else if (data && data.detail) {
        message = data.detail
      } else if (data && typeof data === 'object') {
        // DRF возвращает ошибки полей в виде { "поле": ["текст ошибки"] }.
        const field = Object.keys(data)[0]
        const value = data[field]
        message = Array.isArray(value) ? `${field}: ${value[0]}` : String(value)
      }
    } else {
      // Сервер не ответил (выключен, нет сети).
      message = 'Сервер недоступен. Убедитесь, что backend запущен.'
    }

    const apiError = new Error(message)
    // Сохраняем HTTP-статус, чтобы страницы могли отличить ошибку авторизации.
    apiError.status = error.response ? error.response.status : null
    return Promise.reject(apiError)
  },
)

export default api
