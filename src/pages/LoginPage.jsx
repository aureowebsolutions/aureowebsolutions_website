import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

// ADR-007: Admin-only login. No register link — admin is created via Supabase dashboard.
// ADR-007 negative consequence: no in-app password recovery. Direct admin to
// https://supabase.com/dashboard → Authentication → Users → Send reset email.
const LoginPage = () => {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await signIn(email, password)
    setLoading(false)
    if (authError) {
      setError('Invalid credentials. Check your email and password.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__brand">
          <span className="login-page__brand-gold">Aureo</span>
          <span className="login-page__brand-sub"> Web Solutions</span>
        </div>
        <h1 className="login-page__heading">Admin Login</h1>

        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <label htmlFor="email" className="login-page__label">Email</label>
            <input
              id="email"
              type="email"
              className="login-page__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="login-page__field">
            <label htmlFor="password" className="login-page__label">Password</label>
            <input
              id="password"
              type="password"
              className="login-page__input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-page__error">{error}</p>}

          <button
            type="submit"
            className="login-page__submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
