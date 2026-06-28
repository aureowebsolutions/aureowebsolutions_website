---
# ADR-022: Redirect to list page after 1.5 seconds on successful save

## Status
Accepted

## Date
2026-06-27

## Context
After a successful form submission (create or update of a Work or Blog Post), the admin must be returned to the list page. The question is the timing and mechanism of that navigation:

1. **Immediate redirect** — navigate to `/admin/works` or `/admin/blog` as soon as the Supabase upsert resolves successfully.
2. **Delayed redirect (1.5 seconds)** — show a success feedback component (`<FormFeedback type="success">`) for 1.5 seconds, then navigate.
3. **Stay on form** — show success feedback on the same form without navigating, allowing the admin to make additional edits or just see that the save was successful.

## Decision
We use a **1.5-second delayed redirect** after a successful save. The sequence is:

1. Supabase upsert resolves without error.
2. `<FormFeedback type="success" message="Work saved successfully." />` renders below the submit button (or at the top of the form).
3. A `setTimeout(() => navigate('/admin/works'), 1500)` fires.
4. After 1.5 seconds, `navigate()` redirects to the list page.

The `setTimeout` handle is stored in a ref and cleared in the `useEffect` cleanup function to prevent a navigation firing on an unmounted component if the admin manually navigates away before the 1.5 seconds elapse.

## Alternatives Considered

**Immediate redirect (no delay)** — navigate as soon as the promise resolves. Rejected because the transition from form to list is instant, giving the admin no visual confirmation that the save was successful. The list page loads and shows the updated record, but the admin has no explicit confirmation that their action completed. For a first-time user or a user saving infrequently, the silent redirect can feel like the submit button did nothing until the list page appears.

**Stay on the form after save** — show success feedback without navigating. Rejected because after a successful save, the most common next action is to review the record in the list, navigate to another record, or return to the list to see ordering. Staying on the form requires an additional manual navigation ("← Back to Works") for the most common flow. The 1.5-second delay provides the confirmation benefit of staying while still advancing the user to the natural next destination.

## Consequences
### Positive
- The admin has unambiguous visual confirmation that the save was successful before the page changes.
- The 1.5-second window gives the admin time to read the success message. It is long enough to be readable but short enough that the workflow is not interrupted.
- The delayed redirect feels more intentional than an immediate one — it communicates "save completed, now returning you to the list."

### Negative
- If the admin submits the form, sees the success message, and immediately wants to make another edit, they cannot cancel the pending redirect without manually navigating back to the form after the list page loads.
- The `setTimeout` must be cleaned up in the component's unmount effect to prevent a React "Can't perform a state update on an unmounted component" warning. This is a known JavaScript async pattern risk.
- 1.5 seconds is a convention, not a user-tested value. It may feel too long for power users and too short for users on slow connections who spend time reading the message.

### Neutral
- The success message text is static per action ("Work saved successfully." / "Post saved successfully."). It does not include the record's title or slug. A future improvement could be "Post «My New Article» saved successfully."
---
