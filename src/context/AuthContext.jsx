import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ADR-007: Supabase Auth with email/password.
// user is a Supabase Auth object, not a profiles row — no display name or avatar.
// Recovery flow is handled by Supabase dashboard; there is no in-app reset UI.
// Adding a second admin requires an invite from the Supabase dashboard.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    // Restore persisted session from localStorage on mount (ADR-007 positive consequence)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Keep state in sync if token expires or is revoked from dashboard
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  // ADR-007 negative consequence: no MFA. If this credential is compromised,
  // the attacker has full admin access. Rotate from the Supabase dashboard immediately.
  const signIn = (email, password) => {
    if (!supabase) return Promise.resolve({ error: new Error('Supabase not configured') })
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = () => {
    if (!supabase) return Promise.resolve()
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
