# ADR-008: ProtectedRoute con React Router v6 Outlet para rutas de admin

**Status:** Accepted  
**Date:** 2026-06-27

## Context

Las rutas `/admin/*` deben ser inaccesibles para usuarios no autenticados. Se necesita un mecanismo de protección que funcione con React Router v6 y el `AuthContext` de ADR-007.

Las opciones evaluadas:

- **`<ProtectedRoute>` wrapper con `<Outlet />`** — patrón nativo de React Router v6 para rutas anidadas protegidas.
- **HOC (Higher-Order Component)** — envuelve cada página de admin individualmente.
- **Middleware en el router** — intercepta la navegación antes de renderizar.
- **Guards en cada página** — cada página de admin verifica `useAuth()` y redirige si no hay sesión.

## Decision

Se implementa un componente `ProtectedRoute` que actúa como **layout route** en React Router v6. Se coloca como parent de todas las rutas `/admin/*` en el árbol de rutas:

```jsx
// src/components/ProtectedRoute.jsx
export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return null          // sesión restaurándose desde localStorage
  if (!user)   return <Navigate to="/login" replace />
  return <Outlet />                 // renderiza la ruta hija
}

// En App.js
<Route element={<ProtectedRoute />}>
  <Route path="admin"            element={<AdminLayout />} />
  <Route path="admin/works"      element={<AdminWorksPage />} />
  <Route path="admin/works/new"  element={<WorksFormPage />} />
  <Route path="admin/works/:id"  element={<WorksFormPage />} />
  <Route path="admin/blog"       element={<AdminBlogPage />} />
  <Route path="admin/blog/new"   element={<BlogFormPage />} />
  <Route path="admin/blog/:id"   element={<BlogFormPage />} />
</Route>
```

`ProtectedRoute` es **solo una barrera de UX**. La seguridad real la proveen las políticas RLS de ADR-002 — un usuario que llame directamente a la API de Supabase con la `anon key` igualmente no podrá escribir porque no tiene sesión autenticada.

## Rationale

- El patrón `<Outlet />` es el idioma de React Router v6 para rutas anidadas — evitar este patrón en favor de un HOC añadiría repetición en cada página de admin.
- Un solo `ProtectedRoute` protege todas las rutas admin con un único punto de verificación. Añadir una nueva ruta de admin no requiere recordar añadir protección.
- `loading === true` renderiza `null` en lugar de redirigir inmediatamente — esto evita el flash de redireccionamiento cuando la sesión se restaura desde `localStorage` en el mount.

## Consequences

**Positivo:**
- Un único componente protege todas las rutas admin — sin repetición.
- Compatible directamente con el patrón de layout routes de React Router v6.
- El estado `loading` evita falsos redirects durante la restauración de sesión.

**Negativo:**
- Si `getSession()` falla (error de red), `loading` nunca pasa a `false` y la ruta admin muestra `null` indefinidamente. Se debe añadir manejo de timeout o error en `AuthContext`.
- La redirección a `/login` ocurre en el cliente — un crawler o bot puede hacer GET a `/admin/*` y recibir el HTML inicial antes de que React rediriga. Para SEO esto no importa (el admin no debe indexarse), pero es una consideración si se requiere SSR en el futuro.
- `replace` en `<Navigate>` borra `/admin` del historial — el botón "atrás" del navegador no vuelve a la ruta protegida después del login, lo cual es el comportamiento correcto pero puede sorprender a usuarios que esperan volver.
