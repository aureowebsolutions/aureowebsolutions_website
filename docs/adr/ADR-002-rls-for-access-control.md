# ADR-002: Row Level Security para control de acceso

**Status:** Accepted  
**Date:** 2026-06-27

## Context

El sitio tiene dos tipos de usuarios: visitantes públicos (solo lectura de contenido publicado) y un administrador (lectura y escritura de todo). Se necesita un mecanismo que impida que un visitante no autenticado pueda leer borradores o modificar registros, sin requerir un servidor intermediario que valide permisos.

## Decision

Se usa **Row Level Security (RLS) de PostgreSQL**, configurado directamente en Supabase, como única capa de control de acceso a los datos.

```sql
-- Lectura pública: solo registros publicados
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT USING (is_published = true);

-- Admin autenticado: acceso total
CREATE POLICY "Admins can manage blogs"
  ON blogs FOR ALL USING (auth.role() = 'authenticated');
```

El `ProtectedRoute` en el frontend es una segunda barrera de UX, no de seguridad.

## Rationale

- Al no tener un servidor propio, no existe un lugar natural para validar permisos en el servidor. Las opciones serían Netlify Functions como proxy o RLS directo.
- RLS en la base de datos garantiza que la regla se cumple independientemente de cómo se llame a la API — aunque alguien llame a Supabase directamente con la `anon key`, las políticas aplican.
- La lógica de autorización vive junto al schema, no dispersa en múltiples funciones serverless.

## Consequences

**Positivo:**
- La seguridad no depende del código del cliente. Un bug en el frontend no puede exponer datos no publicados.
- Las políticas son auditables directamente en el dashboard de Supabase.

**Negativo:**
- El modelo de admin es binario: `authenticated` tiene acceso total a todas las tablas. Si en el futuro se necesitan roles más granulares (ej. editor vs. super-admin), se requiere extender las políticas con `auth.jwt() ->> 'role'` y configurar claims personalizados.
- Las políticas RLS son invisibles para el desarrollador que solo lee el código React — la lógica de autorización está en un lugar externo al repositorio.
