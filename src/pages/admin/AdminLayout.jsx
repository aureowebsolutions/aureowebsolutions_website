import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

const AdminLayout = () => {
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-layout">
      <header className="admin-nav">
        <span className="admin-nav__brand">
          <span className="admin-nav__brand-gold">Aureo</span> Admin
        </span>
        <nav className="admin-nav__links">
          <Link to="/admin/works">Works</Link>
          <Link to="/admin/blog">Blog</Link>
        </nav>
        <button className="admin-nav__logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
