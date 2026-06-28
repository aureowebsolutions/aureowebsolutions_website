---
# ADR-024: ConfirmDeleteModal as mandatory UI gate for all destructive delete operations

## Status
Accepted

## Date
2026-06-27

## Context
The admin list pages expose a Delete action for each record. Deleting a published blog post or work case study is irreversible from the UI — there is no trash or undo mechanism. A misclick on the Delete button would permanently remove content without recovery.

The question is what interaction pattern to require before a delete executes: an immediate delete on button click, an inline confirmation ("Are you sure?" prompt in the row), or a modal overlay that requires explicit confirmation.

Additionally, the modal's accessibility and interaction details (keyboard dismissal, backdrop click behavior, loading state during the async delete) must be specified.

## Decision
All delete operations across the admin panel are gated behind a **`ConfirmDeleteModal`** that must be explicitly confirmed before any Supabase DELETE query executes. The flow is:

1. Admin clicks the **Delete** button in the table row → `setDeleteModalOpen(true)` + `setDeleteTarget({ id, name })`.
2. `ConfirmDeleteModal` renders with a fixed overlay (`fixed inset-0 bg-black/50 z-50`) and a centered card.
3. The modal displays the specific record name: "You are about to permanently delete «{itemName}»."
4. Admin can cancel by clicking: (a) the **Cancel** button, (b) the overlay backdrop, or (c) pressing the **Escape** key. Any of these sets `isOpen = false`; no delete executes.
5. Admin clicks **Delete** → `onConfirm()` fires, `isDeleting = true`, both buttons disable, the Delete button shows a spinner.
6. On success: modal closes, row is removed from local state (ADR-023).
7. On error: modal closes, error message displays in the list page.

The modal is implemented as a shared component (ADR-014). The `keydown` Escape listener is attached in a `useEffect` inside the modal and removed on unmount.

## Alternatives Considered

**Immediate delete on button click (no confirmation)** — single click deletes the record. Rejected because a delete on a published blog post with inbound links is a high-severity, irreversible action. The cost of a misclick (lost content, broken links) far exceeds the cost of an extra confirmation click. One-click delete is appropriate for low-severity, easily reversible actions; permanent content deletion does not qualify.

**Inline confirmation row (replace the Delete button with "Confirm / Cancel" in the table row)** — when Delete is clicked, the row expands inline with a "Are you sure? Yes / No" confirmation inline. No overlay is shown. Rejected because:
- The inline state must be managed per-row (which row is in "confirming" state). This adds complexity to the list component.
- The confirmation text and the record it refers to are visually proximate, but the pattern is less familiar to users than a modal overlay and can be accidentally dismissed by scrolling.
- The modal pattern is the established convention for permanent data deletion (used by GitHub, Netlify, Supabase Studio itself).

## Consequences
### Positive
- No record is deleted without two distinct user actions (click Delete + click Confirm). Misclicks on the Delete button are safely recoverable.
- The modal names the specific record being deleted ("Luz Candle Co." or "Programming with Claude") — the admin can verify they are deleting the intended record.
- Keyboard accessibility: Escape dismissal and focus management inside the modal meet basic WCAG 2.1 requirements for dialog interactions.
- The `isDeleting` spinner state prevents double-submission during the async delete request.

### Negative
- Every delete requires two clicks instead of one. For admin users who need to bulk-delete many records, this doubles the interaction cost. There is no bulk-delete or multi-select mechanism.
- The modal does not check if the record to be deleted is currently `is_published = true` and does not warn the admin that deleting a published record will break existing links. This is a gap between the modal's generic "permanent delete" warning and the actual business impact.
- Focus management (returning focus to the Delete button that triggered the modal after Cancel) requires explicit `useRef` management inside the modal; failure to implement this correctly leaves keyboard users stranded after modal dismissal.

### Neutral
- The modal re-uses the same `onCancel` handler for the Cancel button, backdrop click, and Escape key — all three are equivalent cancel actions. This simplifies the parent page's handler: it only needs to set `isOpen = false`.
---
