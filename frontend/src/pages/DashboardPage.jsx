import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './DashboardPage.css'

function DashboardPage() {
  const { user } = useAuth()
  const avatarUrl = user?.avatar_url?.trim()
  const showImage = avatarUrl !== ''
  const initial = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <div className="dashboard fade-in">
      <h1 className="dashboard__welcome">
        Добро пожаловать, {user?.username || 'Пользователь'}
      </h1>

      <div className="dashboard__cards">
        <div className="dashboard__card fade-in-card">
          <h2 className="dashboard__card-title">Краткая информация о профиле</h2>
          <div className="dashboard__profile">
            {showImage ? (
              <img
                className="dashboard__avatar"
                src={avatarUrl}
                alt={`Аватар ${user?.username || ''}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <div className="dashboard__avatar-placeholder">{initial}</div>
            )}
            <div className="dashboard__profile-info">
              <div className="dashboard__profile-row">
                <span className="dashboard__profile-label">Имя пользователя</span>
                <span className="dashboard__profile-value">{user?.username || '—'}</span>
              </div>
              <div className="dashboard__profile-row">
                <span className="dashboard__profile-label">Email</span>
                <span className="dashboard__profile-value">{user?.email || '—'}</span>
              </div>
              <div className="dashboard__profile-row">
                <span className="dashboard__profile-label">О себе</span>
                <span className="dashboard__profile-value">{user?.bio || '—'}</span>
              </div>
            </div>
          </div>
          <Link to="/profile" className="dashboard__link">Перейти в личный кабинет</Link>
        </div>

        <div className="dashboard__card fade-in-card">
          <h2 className="dashboard__card-title">Подсказка</h2>
          <p className="dashboard__hint">В личном кабинете вы можете редактировать своё описание и ссылку на аватар.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
