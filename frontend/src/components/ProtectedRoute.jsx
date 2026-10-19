import { Navigate, Outlet } from 'react-router-dom'

// Защищает вложенные маршруты: пускает дальше только с access-токеном.
function ProtectedRoute() {
  const access = localStorage.getItem('access')

  // Токена нет — отправляем на страницу входа.
  if (!access) {
    return <Navigate to="/login/" replace />
  }

  // Токен есть — показываем вложенную страницу.
  // Реальную проверку токена делает страница профиля (запрос к /auth/me/).
  return <Outlet />
}

export default ProtectedRoute
