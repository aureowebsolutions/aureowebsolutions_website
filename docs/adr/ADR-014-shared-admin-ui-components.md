---
# ADR-014: Shared reusable admin UI sub-components instead of inline per-page logic

## Status
Accepted

## Date
2026-06-27

## Context
The admin panel has two list pages (AdminWorksPage, AdminBlogPage) and two form pages (WorksFormPage, BlogFormPage). Across these pages, several UI patterns recur identically:

- A confirmation step before any destructive delete operation
- A visual indicator distinguishing Published records from Draft records
- Animated placeholder rows while data is loading from Supabase
- A success or error feedback banner after a form submission

Without a shared component strategy, each page would inline its own version of these patterns, duplicating markup and behavior. The decision is whether to share them as extracted components or keep them co-located per page.

## Decision
We extract four shared components into `src/components/admin/`:

| Component | Responsibility |
|---|---|
| `ConfirmDeleteModal` | Centered overlay modal; requires explicit user confirmation before executing a delete. Props: `isOpen`, `itemName`, `onConfirm`, `onCancel`, `isDeleting`. |
| `StatusBadge` | Renders a green "Published" pill or a gray "Draft" pill based on the `isPublished: boolean` prop. |
| `TableSkeleton` | Renders `rows × cols` animated placeholder cells while the data fetch is in flight. Props: `rows`, `cols`. |
| `FormFeedback` | Inline success or error banner rendered below the form's submit button. Props: `type: 'success' | 'error'`, `message: string`. |

All four are stateless (or near-stateless) presentational components — they receive all data via props and emit callbacks. They share no internal state with the pages that use them.

## Alternatives Considered

**Inline each pattern per page** — rejected because it creates four independent implementations of the delete modal, each requiring its own `isOpen` state, keyboard listener, backdrop click handler, and spinner logic. A bug fix (e.g., Escape key not closing the modal) must be applied in every page. This violates the single-source-of-truth principle for UI behavior.

**A single monolithic `AdminShared.jsx` file exporting all sub-components** — rejected because it creates an implicit coupling between unrelated components. A change to `ConfirmDeleteModal` triggers a re-bundle of `StatusBadge` consumers. Separate files allow tree-shaking and independent iteration.

## Consequences
### Positive
- A single fix to `ConfirmDeleteModal` (accessibility, animation, keyboard behavior) propagates to all pages that use it.
- `StatusBadge` ensures visual consistency — the same colors, text, and border-radius appear on the works list and the blog list without per-page CSS.
- `TableSkeleton` provides a consistent loading experience across all admin list pages without duplicating the animated placeholder markup.
- New admin pages (e.g., a future `/admin/media` page) can import the same components with zero additional work.

### Negative
- Props interfaces must be stable — a rename of a prop (e.g., `itemName` → `label` in `ConfirmDeleteModal`) requires updating every caller. In a small codebase this is trivial, but it is a coupling cost.
- The `ConfirmDeleteModal` requires the parent page to manage `isOpen` state and pass `onConfirm` / `onCancel` callbacks, which adds a small amount of wiring boilerplate per page.

### Neutral
- Components live in `src/components/admin/` rather than `src/pages/admin/` — this places them in the component layer, consistent with the project's existing architectural separation between `src/components/` (reusable UI) and `src/pages/` (route-level containers).
---
