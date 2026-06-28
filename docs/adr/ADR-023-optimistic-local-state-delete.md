---
# ADR-023: Optimistic local state delete — remove row from state without full table refetch

## Status
Accepted

## Date
2026-06-27

## Context
When an admin deletes a record (Work or Blog Post) from the list page, the Supabase DELETE query executes and the row is removed from the database. The list page's in-memory state still contains the deleted row. The application must update the UI to reflect the deletion.

Two approaches exist:

1. **Full refetch** — after a successful DELETE, call the list hook's `refetch()` function to re-query all rows from Supabase and replace the in-memory list with the fresh server response.
2. **Optimistic local state update** — after a successful DELETE, filter the deleted row out of the in-memory `works` or `blogs` array using its `id`, with no additional network request.

## Decision
We use **optimistic local state update** on delete success:

```js
const handleDelete = async (id) => {
  setIsDeleting(true)
  try {
    await supabase.from('works').delete().eq('id', id)
    setWorks(prev => prev.filter(w => w.id !== id))  // remove from state, no refetch
  } catch (err) {
    setDeleteError(err.message)
  } finally {
    setIsDeleting(false)
    setDeleteModalOpen(false)
  }
}
```

If the DELETE fails, the row remains in local state (unchanged) and an error message is displayed. No premature removal of the row occurs before the server confirms success.

## Alternatives Considered

**Full refetch after delete** — call `refetch()` after DELETE resolves. This guarantees the list reflects the true server state (e.g., if a concurrent admin session also added or deleted records during the operation). Rejected because:
- A full refetch generates an additional Supabase query per delete — for a table with many rows, this is unnecessarily expensive when only one row changed.
- The admin panel has a single authenticated user in the expected deployment; concurrent admin sessions are not a design requirement. The full-refetch approach optimizes for a multi-user scenario that does not exist here.
- The resulting UX is identical: after the DELETE resolves, the row disappears from the list. The full-refetch path adds latency (a second network round-trip) before the list re-renders.

**Optimistic removal before server confirmation** — remove the row from state immediately when the admin clicks "Delete" in the modal, before the Supabase DELETE resolves. Show a rollback if the delete fails. Rejected because the spec requires explicit modal confirmation before execution. By the time the DELETE is called, the user has already confirmed; the delete is almost always expected to succeed. However, removing the row *before* server confirmation means a failed DELETE (network error, permission error) requires re-adding the row to state, which adds rollback complexity. Removing after server confirmation is simpler and reliable.

## Consequences
### Positive
- The deleted row disappears from the list immediately after server confirmation, with no second loading state.
- No additional Supabase query is fired — one DELETE request, one state update.
- The implementation is simple: `setRecords(prev => prev.filter(r => r.id !== id))` — a pure local array operation.

### Negative
- If the list data was modified server-side between the initial fetch and the delete (e.g., another record was added by a future multi-admin setup), those changes are not reflected until the user navigates away and back. The local state becomes a snapshot rather than a live view.
- Errors during the delete do not provide a specific reason visible to the list (e.g., "Record is referenced by a foreign key"). The error is shown in the delete modal before it closes.

### Neutral
- The `refetch` function exposed by the admin list hooks remains available for cases where a full sync is needed (e.g., the admin wants to refresh the list manually). It is not called on every delete, but it can be wired to a "Refresh" button in the future.
---
