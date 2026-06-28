import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ADR-008: UX guard only. Real security is RLS (ADR-002).
// loading === null prevents a flash redirect while getSession() restores from localStorage.
// ADR-008 negative consequence: if getSession() fails (network error), loading stays true
// and this renders null indefinitely. Add a timeout in AuthContext if that becomes an issue.
export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user)   return <Navigate to="/login" replace />
  return <Outlet />
}
