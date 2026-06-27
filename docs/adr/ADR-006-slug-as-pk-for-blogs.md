# ADR-006: Slug como Primary Key en la tabla blogs

**Status:** Accepted  
**Date:** 2026-06-27

## Context

La tabla `blogs` necesita un identificador primario. El sitio ya usa el slug como parámetro de ruta en `/blog/:id`. Se necesita decidir entre usar el slug directamente como PK o usar un UUID/SERIAL separado y mantener el slug como campo único indexado.

## Decision

Se usa el **slug (`VARCHAR`) como Primary Key** de la tabla `blogs`.

```sql
CREATE TABLE blogs (
  id VARCHAR PRIMARY KEY,  -- el slug es el PK
  ...
);
```

La tabla `works` usa `UUID DEFAULT gen_random_uuid()` como PK y `slug VARCHAR UNIQUE` como campo separado.

## Rationale

- El slug ya cumple los requisitos de un PK: es único, obligatorio y no cambia una vez que el post está publicado (cambiar el slug de un post publicado rompe todos los links externos).
- En el route `/blog/:id`, el `id` del URL es directamente el slug — hacer `SELECT * FROM blogs WHERE id = $1` es más simple que `SELECT * FROM blogs WHERE slug = $1` con un UUID como PK.
- Para `works`, la URL no está implementada todavía (no hay `/works/:slug` en el spec), así que el slug de works es un campo auxiliar que puede cambiar — justifica un UUID como PK estable.

## Consequences

**Positivo:**
- El fetch del post individual es `supabase.from('blogs').select().eq('id', slug).single()` — directo, sin JOIN.
- No hay desincronización posible entre el PK y el slug.

**Negativo:**
- Si se necesita renombrar el slug de un post (corrección de typo, SEO), se requiere actualizar el PK — lo que puede fallar si hay foreign keys que lo referencien (ej. una tabla de `comments` en el futuro).
- Los slugs como PKs son más lentos en índices B-tree que integers o UUIDs para tablas grandes. Para el volumen esperado esto no es un problema práctico.
- Requiere disciplina en el admin: una vez publicado un post, el campo slug debe ser read-only o protegido con una advertencia.
