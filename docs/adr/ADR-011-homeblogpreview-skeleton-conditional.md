# ADR-011: HomeBlogPreview con skeleton loading y renderizado condicional

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El spec añade una sección `HomeBlogPreview` en el homepage, debajo de la sección de testimoniales, que muestra los 3 posts de blog más recientes. Esta sección presenta dos estados especiales: mientras los datos cargan desde Supabase, y cuando no existe ningún post publicado todavía.

Se necesita decidir cómo manejar el estado de loading y el estado vacío.

Las opciones evaluadas para **loading**:
- **Spinner central** — un indicador de carga genérico en el centro de la sección.
- **Skeleton cards** — 3 placeholders con las mismas dimensiones que las cards reales.
- **null / sección oculta durante carga** — no renderizar nada hasta que los datos estén listos.

Las opciones evaluadas para **estado vacío** (no hay posts publicados):
- **Mensaje "No posts yet"** — texto informativo visible para el visitante.
- **Ocultar la sección completamente** — `return null` si `blogs.length === 0`.
- **Cards placeholder hardcodeadas** — mostrar contenido ficticio hasta que haya posts reales.

## Decision

- **Durante loading:** renderizar **3 skeleton cards** con las mismas dimensiones (imagen, título, badge de categoría) que las cards reales, usando CSS `background: var(--elevated)` y una animación de shimmer.
- **Estado vacío:** **no renderizar la sección** (`return null`). El homepage no debe mostrar una sección vacía o con mensaje de error al visitante.

```jsx
const HomeBlogPreview = () => {
  const { blogs, loading } = useBlogs()

  if (!loading && blogs.length === 0) return null

  return (
    <section className="aureo-blog-preview">
      <h2>Latest from the Blog</h2>
      <div className="aureo-blog-preview__grid">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div className="aureo-blog-preview__skeleton" key={i} />
            ))
          : blogs.slice(0, 3).map(blog => <BlogCard key={blog.id} blog={blog} />)
        }
      </div>
      {!loading && <a href="/blog">View all posts →</a>}
    </section>
  )
}
```

## Rationale

- Los skeleton cards evitan el **layout shift** (CLS) — la sección ocupa su espacio durante la carga, evitando que el contenido de abajo suba y baje cuando los datos lleguen. Un spinner central no reserva espacio.
- Ocultar la sección cuando no hay posts publicados es la decisión de producto correcta: el homepage está diseñado como landing de ventas; una sección vacía o con mensaje de error reduce la credibilidad percibida.
- El link "View all posts →" se oculta durante la carga y cuando `blogs.length === 0` — nunca dirige a una página `/blog` vacía.

## Consequences

**Positivo:**
- Sin layout shift durante la carga — el homepage se ve estable mientras Supabase responde.
- El homepage se mantiene limpio y coherente cuando el blog aún no tiene contenido publicado.
- El patron `loading ? skeletons : content` es predecible y fácil de mantener.

**Negativo:**
- Los 3 skeleton cards ocupan espacio visual durante la carga aunque no haya posts publicados — el usuario ve placeholders y luego la sección desaparece. Para evitarlo se necesitaría un estado más complejo (ej. `initialLoading` separado de `refreshLoading`).
- El `return null` cuando `blogs.length === 0` solo se ejecuta después de que la petición a Supabase resuelve — si la petición es lenta, el usuario ve los skeletons por más tiempo antes de que la sección desaparezca.
- Los skeleton cards son CSS manual — si el diseño de las cards cambia, los skeletons deben actualizarse a mano para que las dimensiones sigan coincidiendo.
