---
# ADR-013: Custom hooks as the data-fetching layer for admin CRUD pages

## Status
Accepted

## Date
2026-06-27

## Context
The admin CRUD pages (AdminWorksPage, AdminBlogPage, WorksFormPage, BlogFormPage) need to fetch data from Supabase — a list of all works, a list of all blog posts, and single-record fetches for edit mode. The spec requires this logic to be decoupled from the UI components that render it.

Three patterns were viable:

1. **Inline `useEffect` + `useState` inside each page component** — the simplest approach. Every page that needs data manages its own fetch, loading, and error state directly in the component body.
2. **Custom hooks (`useWorks`, `useWork`, `useBlogs`, `useBlog`)** — extract fetch logic into a reusable hook. Each page calls a hook and receives `{ data, loading, error }`.
3. **React Query or SWR** — third-party data-fetching libraries that add automatic caching, deduplication, background revalidation, and optimistic updates.

ADR-009 established the custom hooks pattern for public-facing pages. This ADR documents the same pattern applied to the admin layer, where the constraints and requirements differ: admin hooks must not filter by `is_published`, must expose a `refetch` function for post-mutation refresh, and operate exclusively behind an authenticated session.

## Decision
We use **custom hooks** (`useWorks`, `useWork`, `useBlogs`, `useBlog`) as the exclusive data-fetching layer for admin pages. Each hook encapsulates its own `useState` for the data, `loading`, and `error`, a `useEffect` that fires on mount (or when a key param changes), and a cancellation flag (`let cancelled = false`) to prevent state updates on unmounted components.

Admin hooks — unlike their public counterparts — do not apply an `is_published = true` filter. List hooks (`useWorks`, `useBlogs`) return a `refetch` function so pages can trigger a fresh fetch after mutations without unmounting and remounting.

## Alternatives Considered

**Inline useEffect in each page component** — rejected because it duplicates fetch boilerplate (loading state, error handling, cancellation) across every page. If the Supabase schema changes or error handling conventions change, every page must be updated individually.

**React Query / SWR** — rejected for the same reason as ADR-009: the admin data volume is low, there is no need for multi-tab synchronization or background revalidation during the initial build. The abstraction cost (new dependency, query key conventions, cache invalidation strategy) is not justified for an admin panel serving a single authenticated user.

## Consequences
### Positive
- Admin pages are declarative: `const { works, loading, error } = useWorks()` — no fetch boilerplate in UI components.
- Hooks are independently testable without rendering the full page component.
- If React Query is introduced later, the migration is local to each hook file; page components remain unchanged.
- The `refetch` function returned by list hooks allows post-delete and post-save refreshes without full page navigation.

### Negative
- Each hook is a standalone module; there is no shared cache. If two components mount `useWorks()` simultaneously, two Supabase requests fire independently.
- Admin hooks require a live authenticated Supabase session — they will silently fail or return empty if the session has expired between navigation events. The `ProtectedRoute` guard reduces but does not eliminate this window.
- Without React Query, there is no automatic background revalidation — an admin who leaves the list page open for a long time will see stale data until they trigger a refetch or navigate away and back.

### Neutral
- The hook filenames mirror the public hook filenames (`useBlogs.js`, `useWorks.js`). The admin and public variants are different files with different fetch logic; naming must be distinguished clearly (e.g., co-locate admin hooks in `src/hooks/admin/` if naming collisions arise).
---
