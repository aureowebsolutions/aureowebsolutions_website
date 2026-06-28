# ADR-012: Seed data en SQL para desarrollo y preview

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El panel de administración (Phase 7 del spec) requiere que ya existan datos en las tablas `blogs` y `works` para poder probarlo y previsualizarlo. Sin datos, las páginas públicas (`/blog`, `/blog/:slug`) están vacías y el admin panel muestra listas vacías. Se necesita decidir cómo poblar las tablas durante el desarrollo.

Las opciones evaluadas:

- **SQL `INSERT` en el SQL Editor de Supabase** — sentencias SQL ejecutadas manualmente una vez.
- **Seed via admin panel** — crear los posts a través de la UI del admin una vez que esté implementado.
- **Script de seed en Node.js** — un script que usa el cliente Supabase para insertar datos.
- **Fixtures en JSON cargadas en el boot** — datos de ejemplo cargados automáticamente en cada deploy.

## Decision

Se usa un bloque de **SQL `INSERT`** provisto en el spec que el desarrollador ejecuta manualmente en el Supabase SQL Editor una sola vez, después de crear las tablas y aplicar las políticas RLS.

El seed incluye **4 posts de blog publicados** (`is_published = true`) con contenido real (no lorem ipsum), imágenes de Unsplash, y bloques de contenido que ejercitan los tres tipos (`paragraph`, `heading`, `bullet_list`).

No se proporciona seed data para `works` — esos datos los crea el administrador a través del panel.

## Rationale

- Las páginas públicas de blog (`/blog`, `/blog/:slug`, `HomeBlogPreview`) pueden desarrollarse y probarse sin haber implementado el admin panel — el seed SQL desacopla estas dependencias.
- El SQL es simple, declarativo, y no requiere un script de Node.js adicional con sus propias dependencias.
- Las imágenes de Unsplash proveen URLs válidas durante el desarrollo sin requerir subidas reales a Supabase Storage. El spec advierte explícitamente que deben reemplazarse antes de ir a producción.
- `is_published = true` en el seed permite que las políticas RLS públicas funcionen sin necesidad de autenticarse como admin.

## Consequences

**Positivo:**
- El desarrollo de páginas públicas puede comenzar inmediatamente después de crear el schema, sin esperar el admin panel.
- Los 4 posts cubren los tres tipos de bloque de contenido — son un test funcional de `BlogPostPage` además de datos de ejemplo.
- Un solo paso manual (ejecutar el SQL) — sin herramientas adicionales.

**Negativo:**
- El seed es un paso manual que no se puede automatizar en un pipeline CI/CD sin exponer credenciales de Supabase con permisos de escritura.
- Las URLs de Unsplash son externas y pueden cambiar o volverse inaccesibles — si se ejecuta el seed en un entorno de staging de larga duración, las imágenes podrían romperse.
- No hay seed para `works` — el `Portfolio.jsx` de la homepage seguirá mostrando datos hardcodeados hasta que el admin cree works reales en Supabase y se migre el componente.
- El seed data no se puede revertir fácilmente si se quiere empezar limpio — se necesita `DELETE FROM blogs WHERE id IN (...)` manual.
