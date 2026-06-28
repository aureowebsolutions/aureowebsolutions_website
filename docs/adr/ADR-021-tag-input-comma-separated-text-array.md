---
# ADR-021: Tag input as comma-separated string converted to TEXT[] array

## Status
Accepted

## Date
2026-06-27

## Context
Both blogs and works have a `tags` field stored as `TEXT[]` (PostgreSQL array) in their respective tables. The admin forms need a UI for entering, displaying, and removing tags. The question is what input mechanism to use and how to bridge the UX interaction to the `TEXT[]` storage format.

Three models were considered:

1. **Comma-separated string input** — a single `<input type="text">` where the user types tags separated by commas. On submit, split by comma, trim whitespace, and convert to an array.
2. **Pill-based tag input (add on Enter/comma, remove with ✕)** — a text input that shows existing tags as pills above it. Pressing Enter or comma finalizes the current input as a new tag pill. Each pill has a ✕ button to remove it.
3. **Normalized tags table with a join** — a separate `tags` table and a `blog_tags` / `work_tags` junction table. The form renders a multi-select or autocomplete against the tags table.

## Decision
We use a **pill-based tag input** backed by a local `string[]` state in the form component. The user interaction is:

1. The user types a tag in the text input.
2. Pressing **Enter** or typing a **comma** finalizes the current input as a new pill and clears the text input.
3. Each pill displays the tag text and a **✕** button that removes it from the array.
4. On form submit, the `string[]` state is passed directly as the `tags` field in the Supabase upsert — it maps directly to `TEXT[]`.

The text input accepts free-form strings; no autocomplete against existing tags is provided. Tags are stored as a denormalized `TEXT[]` in each table row.

## Alternatives Considered

**Plain comma-separated text input (split only on submit)** — simpler to implement. Rejected because the user has no visual feedback about which tags they have added until they submit the form. A typo in a comma-separated string is easy to miss. The pill metaphor makes the tag list explicit and editable at all times.

**Normalized tags table with junction table** — the most relational approach: a `tags` table with a unique tag slug, `blog_tags(blog_id, tag_id)` and `work_tags(work_id, tag_id)` junction tables. Rejected because:
- It requires three additional tables, three additional SQL migrations, and three additional Supabase queries per save (delete old junctions, insert new junctions, upsert tags).
- The expected use case is a small number of tags per content item (3–5) and a small total tag vocabulary. The overhead of full normalization is not justified.
- Querying blogs by tag would still require a JOIN, which is possible but adds complexity to the already-minimal query layer.
- If tag analytics or tag management (merge, rename, delete globally) are needed in the future, the `TEXT[]` can be migrated to a normalized structure at that point.

## Consequences
### Positive
- The UX is intuitive — pills are a well-established pattern for multi-value inputs (used by Gmail, Notion, Linear). Users do not need to remember separator syntax.
- The local `string[]` state maps directly to `TEXT[]` with no transformation layer — what the user sees in the UI is exactly what is stored.
- Filtering blogs or works by tag requires only a Supabase `.contains('tags', [tagValue])` query — no JOIN needed.

### Negative
- Tags are not deduplicated globally — the same tag concept can be entered with different spellings ("ecommerce", "E-Commerce", "e-commerce") across different records. Without a shared tag registry, tag-based filtering becomes case-sensitive and fragile.
- Tags are not validated for format or length. An admin can add a tag that is 500 characters long or contains special characters. A future improvement would be to trim each tag and enforce a character limit.
- Removing a tag from a record does not cascade — if a tag is "deleted" from a post, any references to that tag elsewhere are unaffected (which is correct for a denormalized model, but surprising if the admin expects "delete this tag everywhere").

### Neutral
- The `TEXT[]` type is indexed with a GIN index in PostgreSQL for efficient array containment queries. For the expected data volume (< 1000 records), this is not yet necessary but is available without schema changes.
---
