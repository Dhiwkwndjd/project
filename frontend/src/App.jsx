import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './components/ProfilePage'
import RegisterForm from './components/RegisterForm'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Главная страница: авторизованных ведём на профиль, остальных — на вход.
function HomeRedirect() {
  const { user, loading } = useAuth()

  // Ждём окончания проверки авторизации, чтобы не перенаправить не туда.
  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return <Navigate to={user ? '/profile/' : '/login/'} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register/" element={<RegisterForm />} />
          <Route path="/login/" element={<LoginForm />} />

          {/* Всё, что внутри ProtectedRoute, доступно только с токеном. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<HomeRedirect />} />
          {/* Любой неизвестный адрес тоже отправляет на главную. */}
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
