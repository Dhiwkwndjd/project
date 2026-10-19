import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function ProfilePage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const { data } = await api.get('auth/me/')
        if (active) {
          setUser(data)
        }
      } catch (err) {
        if (err.status === 401) {
          // Токен недействителен или просрочен — удаляем токены и идём на вход.
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          navigate('/login/', { replace: true })
          return
        }
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login/')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <h1>Профиль</h1>
          <p>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Профиль</h1>

        {error && <p className="error">{error}</p>}

        {user && (
          <>
            <div className="profile-row">
              <span className="profile-label">ID</span>
              <span className="profile-value">{user.id}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Имя пользователя</span>
              <span className="profile-value">{user.username}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email || '—'}</span>
            </div>
          </>
        )}

        <div className="profile-actions">
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
