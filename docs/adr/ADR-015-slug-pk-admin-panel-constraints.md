---
# ADR-015: Slug as primary key — admin panel constraints and edit-mode behavior

## Status
Accepted

## Date
2026-06-27

## Context
ADR-006 established that the `blogs` table uses the slug as its primary key (`id VARCHAR PRIMARY KEY`). The admin CRUD panel makes this decision concrete and surfaces two specific constraints that must be enforced in the UI:

1. **Create mode**: the slug is auto-generated from the title via `slugify()`, must be validated as URL-safe, and must be unique before the INSERT executes.
2. **Edit mode**: changing the slug of a published post renames the primary key and breaks all existing external links. The admin form must warn the user if they modify the slug of a record that is currently published.

The question is where and how to enforce the uniqueness constraint and the edit-mode protection — at the database level only, in the client before the request, or both.

## Decision
We use the **slug as primary key** (per ADR-006) and enforce the following admin-specific rules:

- In **create mode**: the slug field auto-populates from `slugify(title)` as the user types. Before submitting, the form queries Supabase to check uniqueness: `supabase.from('blogs').select('id').eq('id', slug).maybeSingle()`. If a match is found, a validation error is shown below the slug field before the INSERT is attempted.
- In **edit mode**: the slug field is editable, but if the user modifies it and the record is currently `is_published = true`, a visible warning appears: "Changing the slug will break existing links to this post."
- The database UNIQUE constraint (the primary key itself) acts as the final safety net — if the client-side check races and two concurrent inserts collide, the database rejects the second with a constraint error, which is surfaced via `FormFeedback`.

## Alternatives Considered

**Read-only slug field in edit mode** — simpler UX, eliminates the warning entirely. Rejected because there are legitimate reasons to change a slug pre-publication (correcting a typo before going live). Locking the field permanently penalizes draft editing.

**Rely solely on the database UNIQUE constraint without a pre-check** — the database will always enforce uniqueness, so a pre-flight query is technically redundant. Rejected because database constraint errors surface as generic Supabase API errors, while a pre-check can surface a specific, user-friendly message ("This slug is already taken — try adding a suffix") before the user loses form state from a failed submission.

## Consequences
### Positive
- Users see a clear, actionable error message about slug conflicts before data loss occurs.
- The published-slug warning prevents accidental SEO breakage — the most common admin mistake for content-heavy sites.
- Two-layer enforcement (client pre-check + DB constraint) means no slug collision can result in a silent data error.

### Negative
- The pre-check query adds one extra round-trip to Supabase on form submission. Under normal network conditions this is negligible (<50ms), but it introduces a window where the uniqueness check passes but the INSERT races with another concurrent insert.
- Displaying the URL preview below the slug field (`yoursite.com/blog/{slug}`) requires rendering the current hostname, which differs between dev (`localhost:3000`) and production (`aureowebsolutions.com`). This must use `window.location.origin` rather than a hardcoded string.

### Neutral
- This ADR complements ADR-006, which covers the database-level rationale for using slug as PK. ADR-015 documents the resulting admin UI obligations, not the schema decision itself.
---
