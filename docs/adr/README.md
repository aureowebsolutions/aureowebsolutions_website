# Architecture Decision Records

Decisiones arquitectónicas para la extensión del sitio de Aureo Web Solutions con persistencia en Supabase y panel de administración.

Spec de referencia: [`../SPEC_SECTIONS_PERSISTED.md`](../SPEC_SECTIONS_PERSISTED.md)

## Infraestructura y datos (ADR-001 → 006)

| ADR | Título | Status |
|---|---|---|
| [ADR-001](ADR-001-supabase-as-backend.md) | Supabase como backend de persistencia | Accepted |
| [ADR-002](ADR-002-rls-for-access-control.md) | Row Level Security para control de acceso | Accepted |
| [ADR-003](ADR-003-jsonb-for-blog-content.md) | JSONB para el contenido de blog (block model) | Accepted |
| [ADR-004](ADR-004-supabase-storage-for-images.md) | Supabase Storage para imágenes | Accepted |
| [ADR-005](ADR-005-custom-block-editor.md) | Block editor custom vs. librería WYSIWYG | Accepted |
| [ADR-006](ADR-006-slug-as-pk-for-blogs.md) | Slug como Primary Key en tabla blogs | Accepted |

## Autenticación, routing y UI (ADR-007 → 012)

| ADR | Título | Status |
|---|---|---|
| [ADR-007](ADR-007-supabase-auth-email-password.md) | Supabase Auth email/password para administrador | Accepted |
| [ADR-008](ADR-008-protected-route-outlet-pattern.md) | ProtectedRoute con React Router v6 Outlet | Accepted |
| [ADR-009](ADR-009-custom-hooks-data-fetching.md) | Custom hooks para data fetching (useBlogs, useWorks) | Accepted |
| [ADR-010](ADR-010-javascript-over-typescript.md) | JavaScript (JSDoc) en lugar de TypeScript | Accepted |
| [ADR-011](ADR-011-homeblogpreview-skeleton-conditional.md) | HomeBlogPreview con skeleton loading y renderizado condicional | Accepted |
| [ADR-012](ADR-012-sql-seed-data-for-development.md) | Seed data en SQL para desarrollo y preview | Accepted |
