---
# ADR-017: Client-side slug uniqueness validation before Supabase insert

## Status
Accepted

## Date
2026-06-27

## Context
Both the blog form and the works form auto-generate a slug from the record's primary text field (`title` for blogs, `client_name` for works). The slug must be unique before a new record is inserted. The database enforces uniqueness at the constraint level (blogs: PRIMARY KEY; works: UNIQUE on `slug`), but a constraint violation surfaces as a generic Supabase PostgREST error that must be parsed and translated into a user-friendly message.

The question is whether to add a pre-insert uniqueness check in the client, rely solely on the database constraint error, or both.

## Decision
We perform a **client-side uniqueness pre-check** on form submit, before the INSERT or UPDATE request is sent:

```js
const { data } = await supabase
  .from('blogs')
  .select('id')
  .eq('id', slug)
  .maybeSingle()

if (data) {
  setFieldError('slug', 'This slug is already in use. Please choose a different one.')
  return
}
```

The pre-check runs:
- In **create mode**: always, before the INSERT.
- In **edit mode**: only if the slug field has been changed from its original value (to avoid a false positive when saving without modifying the slug).

The database constraint remains in place as a final safety net for race conditions.

## Alternatives Considered

**Rely solely on the database UNIQUE / PRIMARY KEY constraint error** — the database will always reject a duplicate. Rejected because PostgREST error codes (e.g., `23505`) require parsing `error.code` in the catch block and mapping it to a human-readable message. The error does not identify which field caused the violation in a multi-column table. A pre-check surfaces the error before the round-trip, at the specific field, with a clear actionable message.

**Real-time uniqueness check on every keystroke (debounced)** — query Supabase as the user types the slug. Rejected because it generates a network request on every keystroke (even debounced at 500ms, a 10-character slug = 10+ requests during fast typing), it adds latency before the user has finished typing, and the result may be stale by the time they submit. A single check at submit time is sufficient for the expected admin usage pattern (one user, low concurrency).

## Consequences
### Positive
- The user sees a clear, field-level error message ("This slug is already in use") instead of a generic toast or a failed submission with no visible feedback.
- The error is surfaced at the correct field (the slug input), not at the top of the form or in a global error state.
- The pre-check catches the vast majority of conflicts without requiring the user to interpret a database error.

### Negative
- The pre-check introduces one additional Supabase query per form submission. This is negligible in practice but technically redundant when no conflict exists.
- There is a TOCTOU (time-of-check-time-of-use) race condition: two admin sessions could simultaneously pass the uniqueness check and both attempt the INSERT. The database constraint catches this and the second insert fails, but the second user sees a Supabase error rather than the friendly pre-check message. This is an acceptable risk for a single-admin panel.

### Neutral
- The pre-check uses `.maybeSingle()` rather than `.single()` to avoid throwing on zero results. A `null` return means the slug is available; a non-null return means it is taken.
---
