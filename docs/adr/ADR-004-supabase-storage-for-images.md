# ADR-004: Supabase Storage para imágenes de blog y works

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El admin panel necesita permitir la subida de imágenes de portada para posts de blog y para los casos de estudio (works). Actualmente las imágenes están en `src/assets/` (referenciadas en el bundle de React). Se necesita un destino para imágenes subidas dinámicamente desde el panel de administración.

Las opciones evaluadas:

- **Cloudinary** — CDN especializado en imágenes, transformaciones automáticas, SDK propio.
- **AWS S3 + CloudFront** — solución estándar, requiere cuenta AWS y configuración de CORS/permisos.
- **Supabase Storage** — storage integrado en el mismo proyecto Supabase, bucket público accesible via URL.

## Decision

Se usa **Supabase Storage** con un bucket público llamado `media`, organizado en dos prefijos:

- `media/blog/{slug}-{timestamp}.ext`
- `media/works/{slug}-{timestamp}.ext`

El helper `uploadImage(bucket, path, file)` en `src/lib/storage.ts` sube el archivo y retorna la URL pública, que se almacena en el campo `image_url` de la tabla correspondiente.

La validación del lado del cliente restringe a `jpg`, `png`, `webp` y máximo 5MB antes de intentar la subida.

## Rationale

- El bucket de Supabase Storage vive en el mismo proyecto que la base de datos — un solo proveedor, una sola factura, un solo set de credenciales.
- Para el volumen esperado (imágenes de portada de posts y proyectos), Supabase Storage es suficiente. No se requieren transformaciones de imagen en tiempo real (redimensionado, formatos adaptativos) que justificarían Cloudinary.
- El path `{slug}-{timestamp}` evita colisiones de nombres y permite reemplazar imágenes con `upsert: true`.

## Consequences

**Positivo:**
- Cero configuración adicional — el bucket se crea desde el dashboard de Supabase, sin credenciales AWS ni configuración de CORS externa.
- Las URLs son públicas y estables — se pueden usar directamente en `<img src>`.

**Negativo:**
- No hay CDN de edge por defecto en el free tier de Supabase — las imágenes se sirven desde el servidor Supabase más cercano, no desde un CDN global. Puede impactar latencia para usuarios fuera de la región del proyecto.
- No hay transformaciones automáticas (resize, WebP conversion) — las imágenes se sirven en el formato y tamaño en que se subieron. Si se necesita optimización futura, se requerirá migrar a Cloudinary o agregar un servicio de transformación.
- El límite de storage del free tier (1GB) puede alcanzarse si el volumen de imágenes crece sin limpieza de imágenes huérfanas (imágenes subidas pero no asociadas a ningún registro).
