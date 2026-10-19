import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Защищает вложенные маршруты: пускает дальше только авторизованного пользователя.
function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Пока идёт первоначальная проверка авторизации — ничего не перенаправляем.
  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  // Пользователя нет — отправляем на страницу входа.
  if (!user) {
    return <Navigate to="/login/" replace />
  }

  // Пользователь авторизован — показываем вложенную страницу.
  return <Outlet />
}

export default ProtectedRoute
