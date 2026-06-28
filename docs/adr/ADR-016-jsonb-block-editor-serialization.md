---
# ADR-016: JSONB block array — block editor as the client-side serialization layer

## Status
Accepted

## Date
2026-06-27

## Context
ADR-003 established that `blogs.content` is stored as a `JSONB` column containing a typed block array (`ContentBlock[]`). The admin CRUD panel must provide an editing interface for this column. The question is what form that interface takes and how it serializes user input into the JSONB structure.

Three editing models were considered:

1. **Raw JSON textarea** — expose the JSONB column directly as a `<textarea>` pre-filled with `JSON.stringify(content)`. The admin types raw JSON.
2. **Third-party rich-text editor** (TipTap, Slate.js, Quill) — a WYSIWYG or ProseMirror-based editor that manages internal state as a document model and exports a custom schema.
3. **Custom block editor** — a structured form UI where each block is a distinct card with type-specific inputs, reorder controls, and an "Add Block" button. State is a `ContentBlock[]` array; submit serializes it directly to the JSONB column.

ADR-005 established the custom block editor pattern. This ADR documents how that editor integrates with the admin CRUD form and the specific serialization contract it must honor.

## Decision
The admin blog form renders a **custom block editor** below the metadata fields. The editor manages a `ContentBlock[]` array as its controlled state. Each block renders as a card with:

- A type selector (`paragraph` | `heading` | `bullet_list`)
- Type-specific inputs (textarea for paragraph, level select + text input for heading, dynamic text inputs for bullet_list)
- Reorder controls (↑ Up / ↓ Down that swap adjacent blocks)
- A Remove button (no confirmation — individual block removal is low-risk)

On form submit, the `ContentBlock[]` array is passed directly to the Supabase upsert as the `content` field. No serialization step is needed — the array is already valid JSON.

On form load in edit mode, the `content` JSONB column is deserialized by `JSON.parse` automatically by the Supabase JS client and arrives as a `ContentBlock[]` — the editor initializes from it directly.

Validation before save: `content` must have at least 1 block; no block may have an empty `text` field (for paragraph and heading types) or an empty `items` array (for bullet_list).

## Alternatives Considered

**Raw JSON textarea** — rejected because it requires the admin to understand the internal block schema. A typo in the raw JSON would cause a malformed `content` column that breaks the blog post renderer. The admin is not expected to be a developer.

**TipTap / Slate.js** — rejected for the same reason as ADR-005: these libraries export their own internal document schema (ProseMirror JSON, Slate JSON), not the `ContentBlock[]` format that the blog renderer expects. A conversion layer would be needed between the editor's format and the DB schema, introducing a maintenance surface and a source of subtle format drift. The block types in the spec (paragraph, heading, bullet_list) do not require WYSIWYG capabilities.

## Consequences
### Positive
- The editor state and the database column share the same type (`ContentBlock[]`) — no serialization mismatch is possible.
- Adding a new block type requires only updating the type discriminant in `src/lib/types.js`, adding a case to the block editor's type selector, and adding a renderer case in the blog post renderer. No DB migration needed (ADR-003).
- The block-per-card structure makes reordering, adding, and removing blocks explicit user actions — there are no hidden cursor positions or selection state to manage.

### Negative
- The custom block editor provides no inline formatting (bold, italic, links within a paragraph). A paragraph block is a single `text: string`. Authors who need rich inline formatting within a paragraph have no mechanism for it without introducing a new block type or a markdown-in-paragraph convention.
- Block removal has no confirmation dialog — accidentally deleting a large block (e.g., a 500-word paragraph) loses the content immediately. A future improvement is a toast with an "Undo" action.
- The editor has no collaborative editing or auto-save — the admin can lose all unsaved edits if they navigate away or the browser crashes.

### Neutral
- This ADR complements ADR-003 (which covers the database storage decision) and ADR-005 (which covers the decision to build a custom editor vs use a library). ADR-016 specifically documents the serialization contract and validation rules for the admin CRUD context.
---
