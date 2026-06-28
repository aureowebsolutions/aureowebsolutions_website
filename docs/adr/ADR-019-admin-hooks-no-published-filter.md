---
# ADR-019: Admin hooks fetch all records without is_published filter; public hooks filter by is_published = true

## Status
Accepted

## Date
2026-06-27

## Context
The application has two distinct audiences for its data:

- **Public visitors** — should only see records where `is_published = true`. Showing drafts to the public would expose incomplete content.
- **Admin users** — must see all records (published and drafts) to manage them. Filtering to published-only would hide draft records from the admin list pages, making them uneditable.

The data-fetching layer (custom hooks + `src/lib/*.js` functions) must serve both audiences. The question is whether to use a single parameterized hook that accepts an `isAdmin` flag, or two separate hook sets.

## Decision
We maintain **two separate and distinct hook sets**:

**Public hooks** (`src/hooks/useBlogs.js`, `src/hooks/useWorks.js`) — call `getPublishedBlogs()` and `getPublishedWorks()`, which apply `.eq('is_published', true)` in the query. These are used by public-facing components (`HomeBlogPreview`, `Portfolio`).

**Admin hooks** (`src/hooks/admin/useBlogs.js`, `src/hooks/admin/useWorks.js`, `src/hooks/admin/useBlog.js`, `src/hooks/admin/useWork.js`) — call Supabase directly without an `is_published` filter. These are used exclusively by admin pages behind `ProtectedRoute`.

The admin hooks also expose a `refetch` function (returned alongside `data`, `loading`, `error`) so pages can trigger a re-fetch after a mutation without unmounting.

## Alternatives Considered

**Single parameterized hook with an `isAdmin: boolean` flag** — e.g., `useBlogs({ isAdmin: true })`. This merges public and admin logic into one file. Rejected because:
- The data access layer (lib functions) also needs to branch, so the parameterization propagates downward — the hook, the lib function, and the Supabase query all need the flag.
- A bug that removes the `is_published` filter from the public query (e.g., a merge conflict) would expose draft content to all visitors. Separate files make this class of mistake impossible.
- The admin hooks need a `refetch` function; public hooks do not. Merging them makes the API surface inconsistent depending on the flag value.

**Single hook that always fetches all records, with client-side filtering for public pages** — fetch everything from Supabase and filter `is_published` in JavaScript for public views. Rejected because it exposes unpublished records in the API response to unauthenticated clients, even if they are then filtered out in the client. Row Level Security (ADR-002) enforces the filter at the database level for the `anon` key, but this approach would rely on client-side filtering as the sole access control mechanism — a trust boundary violation.

## Consequences
### Positive
- The separation makes the access boundary explicit and auditable. A code reviewer can verify that public-facing components only import from `src/hooks/` (non-admin), not `src/hooks/admin/`.
- Row Level Security (ADR-002) and the hook-level filter are consistent — both enforce `is_published = true` for unauthenticated access. There is no gap between the two layers.
- Admin hooks can freely add admin-specific capabilities (`refetch`, optimistic updates) without complicating the public hook API.

### Negative
- Duplicated hook structure: `useBlogs` exists in two locations with different semantics. A developer unfamiliar with the codebase might import the wrong one. The directory structure (`src/hooks/admin/` vs. `src/hooks/`) is the only disambiguation, and it relies on the developer noticing the import path.
- Changes to the `Blog` or `Work` type (adding a new column) must be reflected in both hook sets independently.

### Neutral
- The public hooks were implemented first (ADR-009). The admin hooks are additions, not replacements. Existing public components do not need to change.
---
