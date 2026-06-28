# ADR-007: Supabase Auth con email/password para autenticación de administrador

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El panel de administración necesita proteger todas las operaciones de escritura (CRUD de blogs y works, subida de imágenes) de usuarios no autenticados. Se necesita un mecanismo de autenticación para un único administrador, sin registro público.

Las opciones evaluadas:

- **Supabase Auth email/password** — nativo de Supabase, sin dependencias adicionales.
- **Magic link (passwordless)** — también nativo de Supabase, sin contraseña.
- **OAuth (Google, GitHub)** — delega en un proveedor externo.
- **Auth0 / Clerk** — servicios de auth especializados con UI preconstruida.
- **JWT custom** — implementación propia con tokens firmados.

## Decision

Se usa **Supabase Auth con email/password**. El administrador se crea manualmente desde el dashboard de Supabase (Authentication → Users → Invite). No existe flujo de registro público.

El estado de autenticación se expone mediante un **`AuthContext`** de React que encapsula `user`, `loading`, `signIn(email, password)`, y `signOut()`.

```js
// src/context/AuthContext.jsx
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

## Rationale

- Supabase Auth está integrado en el mismo SDK que ya usa el proyecto — cero dependencias adicionales.
- El caso de uso es un único administrador con acceso total; no se necesitan roles, MFA, ni SSO.
- `getSession()` en el mount restaura la sesión persistida en `localStorage` sin requerir login en cada visita.
- `onAuthStateChange` mantiene el estado sincronizado si el token expira o se revoca desde el dashboard.
- El administrador se crea una sola vez desde el dashboard — no hay superficie de ataque de registro.

## Consequences

**Positivo:**
- Sin dependencias externas adicionales.
- La sesión persiste entre recargas de página vía `localStorage` de Supabase.
- Revocar acceso al administrador es inmediato desde el dashboard de Supabase.

**Negativo:**
- No hay MFA — la cuenta del administrador queda protegida solo por contraseña. Si la contraseña se compromete, el atacante tiene acceso total al panel.
- No hay flujo de recuperación de contraseña en la UI — el admin debe usar el dashboard de Supabase o el email de reset que Supabase envía automáticamente.
- El `user` en el `AuthContext` es un objeto de Supabase Auth, no un registro de la tabla `profiles` — si en el futuro se necesitan metadatos de usuario (nombre, avatar), se requiere una tabla adicional.
- Añadir un segundo administrador requiere invitarlo manualmente desde el dashboard.
