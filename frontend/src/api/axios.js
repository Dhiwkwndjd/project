import axios from 'axios'

// Базовый адрес нашего Django API.
// Тогда запросы будут вида: http://localhost:8000/api/v1/auth/login/
const BASE_URL = 'http://localhost:8000/api/v1/'

// Основной клиент, которым пользуются все компоненты.
const api = axios.create({
  baseURL: BASE_URL,
})

// Отдельный клиент ТОЛЬКО для обновления токена.
// У него нет наших интерсепторов, поэтому он не может вызвать бесконечный цикл.
const refreshClient = axios.create({
  baseURL: BASE_URL,
})

// --- Понятные сообщения об ошибках ---------------------------------------

// Достаём из ответа сервера человекочитаемый текст.
function buildMessage(data) {
  if (typeof data === 'string') {
    return data
  }
  if (data && data.detail) {
    return data.detail
  }
  if (data && typeof data === 'object') {
    // DRF возвращает ошибки полей в виде { "поле": ["текст ошибки"] }.
    const field = Object.keys(data)[0]
    const value = data[field]
    return Array.isArray(value) ? `${field}: ${value[0]}` : String(value)
  }
  return 'Не удалось выполнить запрос.'
}

// Создаём обычную ошибку, но сохраняем статус и данные ответа,
// чтобы формы могли показать ошибку конкретного поля.
function makeError(message, status, data) {
  const error = new Error(message)
  error.status = status ?? null
  error.data = data ?? null
  return error
}

// --- Request interceptor: подставляем access-токен ------------------------

api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access')
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// --- Автоматическое обновление токена -------------------------------------

// Пока идёт обновление, храним общий промис.
// Благодаря этому несколько параллельных 401 ждут один и тот же refresh-запрос,
// а не отправляют по запросу на каждый из них.
let refreshPromise = null

function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise
  }

  const refresh = localStorage.getItem('refresh')
  if (!refresh) {
    // Обновлять нечем.
    return Promise.reject(makeError('Нет refresh-токена', 401, null))
  }

  refreshPromise = refreshClient
    .post('auth/refresh/', { refresh })
    .then(({ data }) => {
      localStorage.setItem('access', data.access)
      return data.access
    })
    .finally(() => {
      // После завершения (успех или ошибка) снимаем «замок».
      refreshPromise = null
    })

  return refreshPromise
}

// Эндпоинты авторизации: для них НЕ нужно пытаться обновлять токен.
function isAuthEndpoint(url = '') {
  return (
    url.includes('auth/login/') ||
    url.includes('auth/register/') ||
    url.includes('auth/refresh/')
  )
}

// Полный выход: чистим токены и отправляем на страницу входа.
function forceLogout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  if (typeof window !== 'undefined' && window.location.pathname !== '/login/') {
    window.location.href = '/login/'
  }
}

// --- Response interceptor: повторяем запрос после обновления токена -------

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error.response
    const original = error.config || {}

    // Сервер вообще не ответил (выключен, нет сети).
    if (!response) {
      return Promise.reject(
        makeError('Сервер недоступен. Убедитесь, что backend запущен.', null, null),
      )
    }

    // Обновляем токен только при 401, только один раз и не для auth-запросов.
    const canRefresh =
      response.status === 401 && !original._retry && !isAuthEndpoint(original.url)

    if (canRefresh) {
      original._retry = true
      try {
        const newAccess = await refreshAccessToken()
        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${newAccess}`
        // Повторяем исходный запрос один раз с новым токеном.
        return api(original)
      } catch {
        forceLogout()
        return Promise.reject(
          makeError('Сессия истекла. Войдите заново.', 401, null),
        )
      }
    }

    return Promise.reject(
      makeError(buildMessage(response.data), response.status, response.data),
    )
  },
)

export default api
