import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './components/ProfilePage'
import RegisterForm from './components/RegisterForm'
import DashboardPage from './pages/DashboardPage'
import MainLayout from './components/layout/MainLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'
import './animations.css'

// Главная страница: авторизованных ведём на dashboard, остальных — на вход.
function HomeRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return <Navigate to={user ? '/dashboard' : '/login/'} replace />
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
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
