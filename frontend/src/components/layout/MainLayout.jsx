import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__content">
        <Header />
        <main className="main-layout__main">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
