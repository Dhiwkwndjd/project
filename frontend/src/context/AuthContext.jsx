import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

// Контекст с данными авторизации. Компоненты получают его через useAuth().
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // При запуске приложения проверяем, есть ли сохранённый access-токен,
  // и пытаемся загрузить профиль.
  useEffect(() => {
    let active = true

    async function loadUser() {
      const access = localStorage.getItem('access')
      if (!access) {
        if (active) {
          setLoading(false)
        }
        return
      }

      try {
        const { data } = await api.get('auth/me/')
        if (active) {
          setUser(data)
        }
      } catch {
        // Токен недействителен — очищаем данные авторизации.
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [])

  // Вход: получаем токены, сохраняем их и загружаем профиль.
  async function login(username, password) {
    const { data } = await api.post('auth/login/', { username, password })

    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)

    const me = await api.get('auth/me/')
    setUser(me.data)
    return me.data
  }

  // Регистрация: просто создаём пользователя.
  // Автоматически не авторизуем — API этого не предусматривает.
  async function register(formData) {
    const { data } = await api.post('auth/register/', formData)
    return data
  }

  // Обновление профиля: отправляем PATCH /auth/me/ и синхронизируем user,
  // чтобы изменения сразу были видны во всех компонентах.
  async function updateProfile(formData) {
    const { data } = await api.patch('auth/me/', formData)
    setUser(data)
    return data
  }

  // Выход: удаляем токены и очищаем пользователя.
  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  const value = { user, loading, login, register, updateProfile, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Удобный хук для доступа к контексту.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return context
}
