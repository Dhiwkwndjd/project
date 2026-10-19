import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__brand">MyApp</div>
        <nav className="sidebar__nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            Мой профиль
          </NavLink>
        </nav>
      </div>
      <div className="sidebar__bottom">
        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
