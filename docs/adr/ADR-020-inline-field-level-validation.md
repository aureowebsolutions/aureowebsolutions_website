---
# ADR-020: Inline field-level validation with error messages below each input

## Status
Accepted

## Date
2026-06-27

## Context
Both the WorksFormPage and BlogFormPage have required fields and format constraints (slug format, minimum character counts, valid date, file type). When a user submits an invalid form, the application must communicate what went wrong and where.

Two primary approaches exist for displaying form validation errors:

1. **Inline field-level errors** — each input has a dedicated error slot directly below it. When that field fails validation, its error message appears in its slot. Other fields are unaffected.
2. **Top-level error summary** — a single banner or list at the top (or bottom) of the form lists all validation errors. Inputs themselves may or may not be visually highlighted.

## Decision
We use **inline field-level validation** with error messages rendered directly below each `<input>` or `<textarea>`. Error messages appear only for fields that have failed their specific validation rule.

Implementation pattern:
```js
// Form state
const [errors, setErrors] = useState({})

// Validation on submit
const newErrors = {}
if (!formData.client_name || formData.client_name.length < 2) {
  newErrors.client_name = 'Client name must be at least 2 characters.'
}
if (!slugRegex.test(formData.slug)) {
  newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens.'
}
setErrors(newErrors)
if (Object.keys(newErrors).length > 0) return  // abort submit

// Render
<label htmlFor="client_name">Client Name</label>
<input id="client_name" ... />
{errors.client_name && (
  <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
)}
```

Validation runs on form submit, not on every keystroke. Once the form has been submitted at least once, errors are cleared on the specific field that the user edits (to provide immediate feedback that the correction was accepted).

## Alternatives Considered

**Top-level error summary only** — a single `<ul>` at the top of the form listing all errors. Rejected because admin forms are long (9+ fields for works, 10+ for blogs). A user who submits the form with three errors must scroll to the top of the form to read the error list, then scroll back down to find and fix each field. There is no visual indication at the field itself that it is invalid.

**HTML5 native validation (`required`, `pattern`, `minlength` attributes)** — the browser natively validates and shows an error callout for the first failing field only. Rejected because:
- Native browser validation appearance varies significantly between Chrome, Firefox, and Safari — it cannot be styled to match the admin UI.
- It does not support cross-field validation (e.g., "slug must be unique, checked asynchronously") or custom error messages for business rules.
- It fires on the first invalid field only — other invalid fields are not revealed until each preceding one is corrected.

## Consequences
### Positive
- The user can see at a glance which fields need correction without scrolling. For long forms, this is a significant usability improvement.
- Each error message is contextual and specific ("Slug must contain only lowercase letters, numbers, and hyphens") rather than generic ("Form is invalid").
- Errors clearing as the user edits the specific field provides immediate confirmation that the correction was accepted.

### Negative
- Validating only on submit (not on blur or keystroke) means the user does not know a field is invalid until they try to submit. This trades real-time feedback for reduced noise during normal typing.
- The `errors` state object and per-field `{errors.field_name && ...}` render pattern must be repeated for every field. On a 10-field form this is 10 additional JSX fragments and 10 validation branches. This is explicit but verbose.
- Async validations (slug uniqueness check) block the submit and add latency before any error is displayed.

### Neutral
- All `<input>` and `<textarea>` elements must have a corresponding `<label>` element (spec constraint 6). The inline error `<p>` is a sibling of the input within the field's wrapping `<div>`, not a child of the label, to keep the label's accessible name clean.
---
