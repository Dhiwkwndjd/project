import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const navigate = useNavigate()
  // Данные профиля уже загружены в AuthProvider через auth/me/.
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login/')
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Профиль</h1>

        {user && (
          <>
            <div className="profile-row">
              <span className="profile-label">Имя пользователя</span>
              <span className="profile-value">{user.username}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">О себе</span>
              <span className="profile-value">{user.bio || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Аватар</span>
              <span className="profile-value">
                {user.avatar_url ? (
                  <a href={user.avatar_url} target="_blank" rel="noreferrer">
                    {user.avatar_url}
                  </a>
                ) : (
                  '—'
                )}
              </span>
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
