# SPEC: Admin Panel — Works & Blogs CRUD Pages

## Overview

This spec instructs Claude Code to build the full admin CRUD interface for two sections:

- `/admin/works` — list, create, edit, and delete portfolio works
- `/admin/blog` — list, create, edit, and delete blog posts

Both sections share the same layout shell, interaction patterns, and Tailwind CSS styling conventions. All pages are protected by the existing `ProtectedRoute` component.

---

## Pre-Task: Read the Codebase First

Before writing any code, read and understand:

- `src/lib/supabase.ts` — confirm the Supabase client export
- `src/types/index.ts` — confirm the `Work`, `Blog`, and `ContentBlock` types
- `src/context/AuthContext.tsx` — confirm `signOut()` is available
- `src/components/ProtectedRoute.tsx` — confirm how protected routes are wrapped
- Any existing admin layout or shell component already in `src/pages/admin/`
- The Tailwind config (`tailwind.config.js`) — note any custom colors, fonts, or spacing
- The existing router file — confirm where `/admin/*` routes are registered

Do not create files that already exist. Extend them where needed.

---

## Shared Admin Layout

### AdminLayout Component

If `src/pages/admin/AdminLayout.tsx` does not already exist, create it. If it exists, extend it.

The layout must include:

**Top navigation bar:**
- Left: site logo or text "Admin Panel" linking to `/admin`
- Center: navigation links — `Works` (→ `/admin/works`) | `Blog` (→ `/admin/blog`)
- Right: logged-in user email + `Logout` button that calls `signOut()` and redirects to `/login`
- Active link must have a visible active state (underline or background highlight)
- Tailwind classes — use `bg-gray-900 text-white` or match the existing admin palette

**Main content area:**
- Full-width container with `max-w-7xl mx-auto px-6 py-8`
- Renders `<Outlet />` from React Router

**Reusable sub-components to create inside `src/components/admin/`:**

| Component | Purpose |
|---|---|
| `ConfirmDeleteModal.tsx` | Reusable modal for delete confirmation |
| `StatusBadge.tsx` | Green "Published" / Gray "Draft" pill badge |
| `TableSkeleton.tsx` | Animated skeleton rows while data loads |
| `FormFeedback.tsx` | Success / error inline banner for form submissions |

---

## ConfirmDeleteModal Component

`src/components/admin/ConfirmDeleteModal.tsx`

Props:
```ts
interface ConfirmDeleteModalProps {
  isOpen: boolean
  itemName: string        // e.g. "Luz Candle Co." or "Programming with Claude"
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean     // shows spinner on confirm button while request is in flight
}
```

Behavior:
- Renders a centered overlay with `fixed inset-0 bg-black/50 z-50`
- Modal card: `bg-white rounded-2xl shadow-xl p-6 max-w-md w-full`
- Heading: `"Delete this item?"`
- Body: `"You are about to permanently delete «{itemName}». This action cannot be undone."`
- Two buttons: **Cancel** (outline) and **Delete** (red, `bg-red-600 hover:bg-red-700`)
- While `isDeleting` is true: disable both buttons, show a spinner inside the Delete button
- Pressing Escape key triggers `onCancel`
- Clicking the overlay backdrop triggers `onCancel`

---

## Phase 1 — Admin Works Pages

### 1.1 Works List Page (`/admin/works`)

**File:** `src/pages/admin/AdminWorksPage.tsx`

**Data fetching:**
```ts
supabase
  .from('works')
  .select('*')
  .order('sort_order', { ascending: true })
```
Fetch all records (published and drafts). No `is_published` filter here.

**Page header:**
- Title: `"Works"` (large heading, `text-2xl font-bold`)
- Right side: `"+ New Work"` button → navigates to `/admin/works/new`
  - Tailwind: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`

**Table columns:**

| Column | Content |
|---|---|
| Image | `<img>` thumbnail `w-16 h-12 object-cover rounded` or gray placeholder if no image |
| Client | `client_name` — bold |
| Description | `description` truncated to 60 chars with ellipsis |
| Tags | First 3 tags as small gray pills, `+N more` if extra |
| Metric | `metric_value` + `metric_label` stacked in small text |
| Order | `sort_order` number |
| Status | `<StatusBadge>` component |
| Actions | **Edit** button + **Delete** button |

**Interactions:**
- **Edit** → navigate to `/admin/works/:id`
- **Delete** → open `<ConfirmDeleteModal>` with `itemName = client_name`
  - On confirm: call `supabase.from('works').delete().eq('id', id)`
  - On success: remove the row from local state (no full refetch needed)
  - On error: show error toast or inline message

**Loading state:** Show `<TableSkeleton rows={5} cols={8} />` while fetching

**Empty state:** If no records exist, show a centered message:
```
No works yet.
[+ Add your first work]  ← links to /admin/works/new
```

---

### 1.2 Works Form Page (`/admin/works/new` and `/admin/works/:id`)

**File:** `src/pages/admin/WorksFormPage.tsx`

**Mode detection:**
- If `id` param exists → **Edit mode**: fetch record on mount, pre-fill all fields
- If no `id` param → **Create mode**: all fields start empty

**Page header:**
- Edit mode: `"Edit Work — {client_name}"`
- Create mode: `"New Work"`
- Back link: `← Back to Works` → `/admin/works`

**Form fields:**

| Field | Input | Notes |
|---|---|---|
| `client_name` | `<input type="text">` | Required. On change in create mode, auto-generate `slug` via `slugify()` |
| `slug` | `<input type="text">` | Editable. Show preview: `yoursite.com/works/{slug}` below the field |
| `description` | `<textarea rows={4}>` | Optional |
| `tags` | `<input type="text">` | Comma-separated string input. Display current tags as removable pills above input. On Enter or comma: add tag to array |
| `image_url` | File upload + preview | Accept jpg, png, webp only. Max 5MB. Show current image if in edit mode. Upload to `media/works/{slug}-{timestamp}.ext` via `uploadImage()`. Show upload progress bar |
| `image_alt` | `<input type="text">` | Required if image is set |
| `metric_value` | `<input type="text">` | e.g. `+284%` |
| `metric_label` | `<input type="text">` | e.g. `revenue in 90 days` |
| `sort_order` | `<input type="number" min={0}>` | Default `0` |
| `is_published` | Toggle switch | Default `false`. Label: "Published" when on, "Draft" when off |

**Validation rules (run on submit, show errors inline below each field):**
- `client_name` — required, min 2 chars
- `slug` — required, must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, must be unique (check Supabase in edit mode only if slug changed)
- `image_alt` — required if `image_url` is set
- `sort_order` — must be a non-negative integer

**Submit behavior:**
- Create mode: `supabase.from('works').insert([formData])`
- Edit mode: `supabase.from('works').update(formData).eq('id', id)`
- On success: show `<FormFeedback type="success" message="Work saved successfully." />` then redirect to `/admin/works` after 1.5 seconds
- On error: show `<FormFeedback type="error" message={error.message} />`
- While submitting: disable the submit button and show a spinner

**Form layout:**
- Two-column grid on desktop (`grid grid-cols-1 md:grid-cols-2 gap-6`)
- Image upload and description span full width (`col-span-2`)
- Submit button at the bottom right: `"Save Work"` (create) or `"Update Work"` (edit)
- Cancel button next to submit: navigates back to `/admin/works` without saving

---

## Phase 2 — Admin Blog Pages

### 2.1 Blog List Page (`/admin/blog`)

**File:** `src/pages/admin/AdminBlogPage.tsx`

**Data fetching:**
```ts
supabase
  .from('blogs')
  .select('id, title, author, date_published, category, is_published, image_url')
  .order('date_published', { ascending: false })
```

**Page header:**
- Title: `"Blog Posts"`
- Right side: `"+ New Post"` button → `/admin/blog/new`

**Table columns:**

| Column | Content |
|---|---|
| Cover | Thumbnail `w-16 h-12 object-cover rounded` or placeholder |
| Title | Bold, links to `/admin/blog/:id` for quick edit |
| Category | Gray text |
| Author | Gray text |
| Date | Formatted as `Nov 20, 2024` |
| Status | `<StatusBadge>` |
| Actions | **Edit** + **Delete** buttons |

**Interactions:**
- **Edit** → `/admin/blog/:id`
- **Delete** → `<ConfirmDeleteModal>` with `itemName = title`
  - On confirm: `supabase.from('blogs').delete().eq('id', id)`
  - On success: remove from local state

**Loading state:** `<TableSkeleton rows={4} cols={7} />`

**Empty state:**
```
No blog posts yet.
[+ Write your first post]  ← links to /admin/blog/new
```

---

### 2.2 Blog Form Page (`/admin/blog/new` and `/admin/blog/:id`)

**File:** `src/pages/admin/BlogFormPage.tsx`

**Mode detection:**
- If `id` param exists → **Edit mode**: fetch full record including `content` blocks
- If no `id` param → **Create mode**: all fields empty, `content` starts as `[]`

**Page header:**
- Edit mode: `"Edit Post — {title}"`
- Create mode: `"New Blog Post"`
- Back link: `← Back to Blog` → `/admin/blog`

**Form fields:**

| Field | Input | Notes |
|---|---|---|
| `title` | `<input type="text">` | Required. Auto-generates `id` (slug) via `slugify()` in create mode |
| `id` (slug) | `<input type="text">` | Editable. Show preview URL below. In edit mode: warn "Changing the slug will break existing links" if modified |
| `author` | `<input type="text">` | Required |
| `date_published` | `<input type="date">` | Required. Default to today in create mode |
| `category` | `<input type="text">` | Optional, e.g. "Technology" |
| `tags` | Tag input | Same pill-based tag input as Works form |
| `image_url` | File upload + preview | Upload to `media/blog/{slug}-{timestamp}.ext`. Show current image in edit mode |
| `is_published` | Toggle switch | Default `false` |
| `content` | Block editor (see below) | Required — must have at least 1 block |

**Content Block Editor:**

Render a vertical list of blocks. Each block has:

```
┌─────────────────────────────────────────────────┐
│  [Type Selector ▼]   [↑ Up] [↓ Down] [✕ Remove] │
│  ─────────────────────────────────────────────── │
│  [Block-specific inputs]                         │
└─────────────────────────────────────────────────┘
```

**Type selector options:** `Paragraph` | `Heading` | `Bullet List`

**Block inputs by type:**

`paragraph`:
```
<textarea rows={3} placeholder="Write a paragraph..." />
→ saves as { type: "paragraph", text: string }
```

`heading`:
```
<select> Level: H2 | H3 | H4 </select>
<input type="text" placeholder="Heading text..." />
→ saves as { type: "heading", level: 2|3|4, text: string }
```

`bullet_list`:
```
Dynamic list of <input type="text" /> fields
[+ Add item] button appends a new input
Each item has a [✕] remove button
→ saves as { type: "bullet_list", items: string[] }
```

**Block controls:**
- `↑ Up` / `↓ Down` — reorder blocks (swap with adjacent)
- `✕ Remove` — remove block from list (no confirmation needed for individual blocks)
- `+ Add Block` button at the bottom of the list — appends a new paragraph block by default

**Minimum requirement:** At least 1 block must exist before saving. Show validation error if `content` is empty.

**Block editor styling:**
- Each block card: `bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3`
- Add Block button: `border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-3 w-full text-gray-500 hover:text-blue-500`

**Form layout:**
- Single column layout (blog forms are more vertical by nature)
- `max-w-3xl mx-auto` — centered, readable width
- Metadata fields (title, slug, author, date, category, tags, image, is_published) grouped at the top
- Block editor below with clear section heading `"Content"`
- Submit and Cancel buttons fixed at the bottom or at end of form

**Validation rules:**
- `title` — required
- `id` (slug) — required, URL-safe format, unique check on create
- `author` — required
- `date_published` — required, valid date
- `content` — minimum 1 block, no empty `text` fields allowed

**Submit behavior:**
- Create: `supabase.from('blogs').insert([formData])`
- Edit: `supabase.from('blogs').update(formData).eq('id', id)`
- On success: `<FormFeedback type="success">` then redirect to `/admin/blog` after 1.5s
- On error: `<FormFeedback type="error" message={error.message}>`

---

## Phase 3 — Routing

Confirm or add the following routes inside the `ProtectedRoute` wrapper in the router file:

```
/admin                  → redirect to /admin/works
/admin/works            → AdminWorksPage
/admin/works/new        → WorksFormPage
/admin/works/:id        → WorksFormPage  (edit mode)
/admin/blog             → AdminBlogPage
/admin/blog/new         → BlogFormPage
/admin/blog/:id         → BlogFormPage   (edit mode)
/login                  → LoginPage      (public, outside ProtectedRoute)
```

If any of these routes already exist, do not duplicate them — verify and extend.

---

## Phase 4 — Custom Hooks

Create the following hooks in `src/hooks/`:

### `useWorks.ts`
```ts
// Returns: { works, loading, error, refetch }
// Fetches all works ordered by sort_order (no is_published filter)
```

### `useWork.ts`
```ts
// Returns: { work, loading, error }
// Fetches a single work by id
```

### `useBlogs.ts`
```ts
// Returns: { blogs, loading, error, refetch }
// Fetches all blogs ordered by date_published DESC (no is_published filter)
```

### `useBlog.ts`
```ts
// Returns: { blog, loading, error }
// Fetches a single blog by id (slug)
```

Each hook must handle loading and error states. Admin hooks fetch all records; public-facing hooks (already in the main SPEC) filter by `is_published = true`.

---

## Tailwind Conventions

Follow these patterns consistently across all admin pages:

```
Page title:        text-2xl font-bold text-gray-900
Section label:     text-sm font-medium text-gray-700 mb-1
Input base:        w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
Textarea base:     same as input + resize-y
Error text:        text-red-500 text-xs mt-1
Primary button:    bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors
Danger button:     bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors
Outline button:    border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors
Table header:      bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3
Table row:         border-b border-gray-100 hover:bg-gray-50 transition-colors
Published badge:   bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full
Draft badge:       bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full
```

---

## Constraints & Rules

1. **Do not modify** any public-facing pages (`/`, `/works`, `/blog`, `/blog/:slug`) — this spec covers admin only.
2. **Do not duplicate** types already defined in `src/types/index.ts` — import them.
3. **Do not duplicate** the `slugify()` or `uploadImage()` utilities — import from `src/lib/`.
4. All Supabase mutations must be wrapped in `try/catch` with user-facing error messages.
5. The Delete operation must first open the modal, then execute only after explicit user confirmation.
6. All `<input>` and `<textarea>` elements must have an associated `<label>`.
7. Image file validation (type and size) must happen **before** the upload request is sent.
8. Slug uniqueness must be validated **before** the insert/update request is sent, with a clear error message.
9. After completing each phase, run `tsc --noEmit` and fix all TypeScript errors before proceeding.
10. Do not use `any` type — infer or declare proper types for all variables and function parameters.

---

## File Structure Reference

```
src/
├── components/
│   └── admin/
│       ├── ConfirmDeleteModal.tsx   ← new
│       ├── StatusBadge.tsx          ← new
│       ├── TableSkeleton.tsx        ← new
│       └── FormFeedback.tsx         ← new
├── hooks/
│   ├── useWorks.ts                  ← new
│   ├── useWork.ts                   ← new
│   ├── useBlogs.ts                  ← new
│   └── useBlog.ts                   ← new
└── pages/
    └── admin/
        ├── AdminLayout.tsx          ← create or extend
        ├── AdminWorksPage.tsx       ← new
        ├── WorksFormPage.tsx        ← new
        ├── AdminBlogPage.tsx        ← new
        └── BlogFormPage.tsx         ← new
```

---

## Completion Checklist

### Shared
- [ ] `AdminLayout` renders top nav with Works, Blog links and Logout
- [ ] `ConfirmDeleteModal` opens, confirms, and cancels correctly
- [ ] `StatusBadge` renders Published / Draft correctly
- [ ] `TableSkeleton` renders animated placeholder rows
- [ ] `FormFeedback` renders success and error states

### Works
- [ ] `/admin/works` lists all works from Supabase (published + drafts)
- [ ] Works table shows thumbnail, client, description, tags, metric, order, status, actions
- [ ] Delete opens modal with correct `client_name`, executes on confirm
- [ ] `/admin/works/new` form creates a new work and redirects on success
- [ ] `/admin/works/:id` pre-fills all fields from existing record
- [ ] Slug auto-generates from `client_name` in create mode
- [ ] Image upload works, stores public URL, shows preview
- [ ] All validation errors display inline below their fields
- [ ] `sort_order` and `is_published` fields save correctly

### Blog
- [ ] `/admin/blog` lists all posts from Supabase (published + drafts)
- [ ] Blog table shows cover, title, category, author, date, status, actions
- [ ] Delete opens modal with correct `title`, executes on confirm
- [ ] `/admin/blog/new` form creates a new post and redirects on success
- [ ] `/admin/blog/:id` pre-fills all fields including full `content` blocks
- [ ] Slug auto-generates from `title` in create mode
- [ ] Slug change warning shown in edit mode
- [ ] Block editor supports paragraph, heading, bullet_list types
- [ ] Blocks can be added, reordered (up/down), and removed
- [ ] Image upload works, stores public URL, shows preview
- [ ] Content validates: at least 1 block, no empty text fields

### Types & Hooks
- [ ] `useWorks`, `useWork`, `useBlogs`, `useBlog` hooks implemented
- [ ] No `any` types used anywhere in new files
- [ ] `tsc --noEmit` passes with zero errors