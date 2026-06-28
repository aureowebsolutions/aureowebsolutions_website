# ADR-009: Custom hooks para data fetching (useBlogs, useWorks)

**Status:** Accepted  
**Date:** 2026-06-27

## Context

Las páginas públicas (`BlogPage`, `BlogPostPage`, `Portfolio`) y las páginas de admin necesitan obtener datos de Supabase. Se necesita decidir dónde vive la lógica de fetching: dentro de cada componente de página, en una capa de servicios llamada directamente, o en custom hooks.

Las opciones evaluadas:

- **Fetching directo en el componente** — `useEffect` + `useState` en cada página que necesite datos.
- **Custom hooks (`useBlogs`, `useWorks`)** — encapsulan `useEffect`, `useState`, loading y error; las páginas solo consumen el hook.
- **React Query / SWR** — librerías de data fetching con caché, revalidación, y deduplicación automática.
- **Context global con datos precargados** — un provider que carga todos los datos al inicio y los expone por contexto.

## Decision

Se usan **custom hooks** que encapsulan la lógica de fetching, `loading`, y `error`. Cada hook corresponde a un caso de uso específico:

```js
// src/hooks/useBlogs.js
export function useBlogs() {
  const [blogs, setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getPublishedBlogs()
      .then(setBlogs)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { blogs, loading, error }
}

// src/hooks/useBlog.js  (post individual)
export function useBlog(slug) {
  const [blog, setBlog]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!slug) return
    getBlog(slug)
      .then(setBlog)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [slug])

  return { blog, loading, error }
}
```

Las páginas solo importan el hook:
```jsx
const { blogs, loading, error } = useBlogs()
```

No se introduce React Query ni SWR — el volumen de fetching no justifica la dependencia.

## Rationale

- El spec establece explícitamente "keep components focused — separate data-fetching logic from UI (use custom hooks where appropriate)".
- Los custom hooks son testeables de forma aislada sin necesidad de renderizar el componente de página.
- Si en el futuro se introduce React Query, la migración es local al hook — las páginas no cambian.
- El volumen de datos es bajo (pocos posts, pocos works) y no hay polling ni revalidación necesaria — una librería de caché añadiría complejidad sin beneficio observable.

## Consequences

**Positivo:**
- Las páginas de UI no tienen `useEffect` ni `useState` para fetching — son declarativas.
- El mismo hook puede usarse en múltiples componentes (ej. `useBlogs` en `BlogPage` y en `HomeBlogPreview`).
- Testear el fetching no requiere montar componentes de página completos.

**Negativo:**
- Sin caché: si `BlogPage` y `HomeBlogPreview` están montados a la vez, se hacen dos peticiones a Supabase para los mismos datos. Para el volumen esperado esto no es un problema práctico, pero es un desperdicio de recursos.
- Sin deduplicación ni revalidación automática — si el admin actualiza un post, el visitante no verá el cambio hasta que recargue la página.
- Cada hook gestiona su propio estado de loading/error — no hay un estado global de carga de la aplicación.
