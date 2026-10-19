import { useAuth } from '../../context/AuthContext'
import './Header.css'

function Header() {
  const { user } = useAuth()
  const avatarUrl = user?.avatar_url?.trim()
  const showImage = avatarUrl !== ''
  const initial = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <header className="header">
      <div className="header__left">
        <h2 className="header__title">Dashboard</h2>
      </div>
      <div className="header__right">
        {user?.username && <span className="header__username">{user.username}</span>}
        {showImage ? (
          <img
            className="header__avatar"
            src={avatarUrl}
            alt={`Аватар ${user?.username || ''}`}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="header__avatar-placeholder">{initial}</div>
        )}
      </div>
    </header>
  )
}

export default Header
