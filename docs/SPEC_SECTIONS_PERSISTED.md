# SPEC: Blog Section, Supabase Persistence & Admin Auth

## Overview

This document instructs Claude Code to extend the existing React portfolio website with:

1. A **Blog section** (`/blog`) added to the navigation menu
2. **Supabase** as the database backend for both `works` and `blogs` data
3. A **Login page** (`/login`) with Supabase Auth (email/password)
4. A protected **Admin CRUD panel** for managing Works and Blog posts, including image uploads

---

## Pre-Task: Read the Codebase First

Before writing any code, read and understand the following:

- The full component tree (especially the existing `Menu`/`Navbar` component)
- How the current `Works` section is implemented (data source, component structure, routing)
- How `React Router` routes are defined (likely in `App.tsx` or a router file)
- Any existing types or interfaces for `works` data
- The project's CSS approach (CSS Modules, Tailwind, styled-components, etc.) — **match it exactly**
- The existing color palette, font family, spacing scale, and component patterns

Use this reading to infer the correct field names, styling conventions, and file structure before proceeding.

---

## Phase 1 — Supabase Setup

### 1.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 1.2 Create Supabase Config File

Create `src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 1.3 Environment Variables

Add to `.env.local` (and add `.env.local` to `.gitignore` if not already there):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add a `.env.example` file with the same keys but empty values for documentation purposes.

---

## Phase 2 — Database Schema

Run the following SQL in the Supabase SQL Editor to create all required tables.

### 2.1 `blogs` Table

```sql
CREATE TABLE blogs (
  id            VARCHAR PRIMARY KEY,         -- URL-safe slug, e.g. "how-to-optimize-your-website"
  title         VARCHAR        NOT NULL,
  author        VARCHAR        NOT NULL,
  date_published DATE          NOT NULL,
  category      VARCHAR,
  tags          TEXT[]         DEFAULT '{}',
  image_url     VARCHAR,
  content       JSONB          NOT NULL DEFAULT '[]',
  -- content is an array of blocks, e.g.:
  -- [{ "type": "paragraph", "text": "..." },
  --  { "type": "heading",   "level": 2, "text": "..." },
  --  { "type": "bullet_list","items": ["...", "..."] }]
  is_published  BOOLEAN        NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### 2.2 `works` Table

```sql
CREATE TABLE works (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name   VARCHAR        NOT NULL,
  slug          VARCHAR        UNIQUE NOT NULL,
  description   TEXT,
  tags          TEXT[]         DEFAULT '{}',
  image_url     VARCHAR,
  image_alt     VARCHAR,
  metric_value  VARCHAR,
  metric_label  VARCHAR,
  sort_order    INTEGER        NOT NULL DEFAULT 0,
  is_published  BOOLEAN        NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);
```

### 2.3 Supabase Storage Bucket

In the Supabase dashboard, create a Storage bucket named `media` with **public** access. This will store blog cover images and works images.

### 2.4 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Public read: only published content
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published works"
  ON works FOR SELECT
  USING (is_published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage blogs"
  ON blogs FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage works"
  ON works FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## Phase 3 — Authentication

### 3.1 Auth Context

Create `src/context/AuthContext.tsx` that:

- Wraps the app with a React context
- Exposes `user`, `loading`, `signIn(email, password)`, and `signOut()` methods
- On mount, calls `supabase.auth.getSession()` to restore existing session
- Subscribes to `supabase.auth.onAuthStateChange` to keep state in sync

### 3.2 Login Page

Create `src/pages/LoginPage.tsx`:

- Route: `/login`
- UI must match the existing site style (same fonts, colors, spacing)
- Form fields: **Email** and **Password**
- On submit: call `signIn()` from AuthContext
- On success: redirect to `/admin`
- On error: show inline error message (e.g. "Invalid credentials")
- Do **not** show a "register" link — this is an admin-only login

### 3.3 Protected Route

Create `src/components/ProtectedRoute.tsx`:

- If `loading` is true, render a spinner or null
- If `user` is null, redirect to `/login`
- Otherwise, render `<Outlet />`

---

## Phase 4 — Routing Updates

Update the router (likely `App.tsx`) to add the following routes:

```
/blog              → BlogPage        (public)
/blog/:slug        → BlogPostPage    (public)
/login             → LoginPage       (public)
/admin             → ProtectedRoute → AdminLayout
/admin/works       → AdminWorksPage
/admin/works/new   → WorksFormPage
/admin/works/:id   → WorksFormPage  (edit mode)
/admin/blog        → AdminBlogPage
/admin/blog/new    → BlogFormPage
/admin/blog/:id    → BlogFormPage   (edit mode)
```

---

## Phase 5 — Navigation Menu

Update the existing `Menu`/`Navbar` component to add a **Blog** link:

- Add `Blog` item pointing to `/blog`
- Insert it between `Works` and `Contact` (or wherever it fits best given the current order)
- Keep the exact same styling as the other nav items
- Do **not** show `/admin` or `/login` in the public menu

---

## Phase 6 — Public Pages

### 6.1 Blog List Page (`/blog`)

Create `src/pages/BlogPage.tsx`:

- Fetch all blogs where `is_published = true`, ordered by `date_published DESC`
- Display a grid/list of cards, each showing: cover image, title, category, date, author, tags
- Each card links to `/blog/:id` (using the slug as the id)
- Match the visual style of the existing Works section (card layout, colors, spacing)

### 6.2 Blog Post Page (`/blog/:slug`)

Create `src/pages/BlogPostPage.tsx`:

- Fetch a single blog by `id` (slug) where `is_published = true`
- If not found, show a 404 message
- Render the `content` JSONB field block by block:
  - `{ type: "paragraph", text }` → `<p>`
  - `{ type: "heading", level, text }` → `<h2>` / `<h3>` etc.
  - `{ type: "bullet_list", items }` → `<ul><li>` list
- Display: title, author, date, category, tags, cover image at the top

### 6.3 Works Page (migrate existing data)

- Keep the existing `/works` route and component
- Replace any hardcoded/static data with a Supabase fetch: `works` table where `is_published = true`, ordered by `sort_order ASC`
- Keep the existing UI exactly as-is — only swap the data source

---

## Phase 7 — Admin Panel

Create `src/pages/admin/` directory with the following pages. All admin pages must include a simple top nav with links to `/admin/works` and `/admin/blog`, plus a **Logout** button.

### 7.1 Admin Works List (`/admin/works`)

- Table listing all works (published and drafts)
- Columns: thumbnail, client_name, metric_value, sort_order, is_published, actions
- Actions: **Edit** (→ `/admin/works/:id`) | **Delete** (with confirmation dialog)
- Button: **+ New Work**

### 7.2 Works Form (`/admin/works/new` and `/admin/works/:id`)

Fields matching the `works` table schema:

| Field | Input Type |
|---|---|
| client_name | text input |
| slug | text input (auto-generated from client_name, editable) |
| description | textarea |
| tags | text input, comma-separated, stored as array |
| image_url | file upload → Supabase Storage `media/works/` |
| image_alt | text input |
| metric_value | text input |
| metric_label | text input |
| sort_order | number input |
| is_published | toggle/checkbox |

- On image upload: upload file to `media/works/{slug}-{timestamp}.ext` and store the public URL in `image_url`
- On save: upsert to `works` table
- Show success/error feedback

### 7.3 Admin Blog List (`/admin/blog`)

- Table listing all blog posts
- Columns: cover image, title, category, date_published, is_published, actions
- Actions: **Edit** | **Delete** (with confirmation)
- Button: **+ New Post**

### 7.4 Blog Form (`/admin/blog/new` and `/admin/blog/:id`)

Fields matching the `blogs` table schema:

| Field | Input Type |
|---|---|
| id (slug) | text input (auto-generated from title, editable) |
| title | text input |
| author | text input |
| date_published | date picker |
| category | text input |
| tags | text input, comma-separated, stored as array |
| image_url | file upload → Supabase Storage `media/blog/` |
| is_published | toggle/checkbox |
| content | block editor (see below) |

**Content block editor** — implement a simple block editor:

- A list of blocks, each with a `type` selector: `paragraph`, `heading`, `bullet_list`
- For `paragraph`: textarea for `text`
- For `heading`: number input for `level` (2–4) + text input for `text`
- For `bullet_list`: dynamic list of text inputs for `items`
- Buttons to **Add block**, **Remove block**, **Move block up/down**
- On save: serialize the blocks array to JSONB and upsert to `blogs` table

---

## Phase 8 — Shared Utilities

### 8.1 `src/lib/slugify.ts`

```ts
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### 8.2 `src/lib/storage.ts`

Helper to upload a file to Supabase Storage and return the public URL:

```ts
import { supabase } from './supabase'

export async function uploadImage(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
```

---

## Phase 9 — TypeScript Types

Create `src/types/index.ts` with:

```ts
export interface Blog {
  id: string
  title: string
  author: string
  date_published: string
  category?: string
  tags: string[]
  image_url?: string
  content: ContentBlock[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'bullet_list'; items: string[] }

export interface Work {
  id: string
  client_name: string
  slug: string
  description?: string
  tags: string[]
  image_url?: string
  image_alt?: string
  metric_value?: string
  metric_label?: string
  sort_order: number
  is_published: boolean
  created_at: string
}
```

---

## Constraints & Rules

1. **Do not change** any existing page styling, layout, or component logic unless it is directly required by this spec.
2. **Match** the existing visual language exactly — fonts, colors, spacing, component patterns.
3. All Supabase calls must handle **loading** and **error** states with appropriate UI feedback.
4. **Never** commit `.env.local` — ensure it is in `.gitignore`.
5. The public site must work for unauthenticated users — only CRUD operations are protected.
6. Use `async/await` consistently; no `.then()` chains.
7. Keep components focused — separate data-fetching logic from UI (use custom hooks where appropriate, e.g. `useBlogs`, `useWorks`).
8. All form inputs must have `<label>` elements for accessibility.
9. Image uploads should validate file type (jpg, png, webp only) and size (max 5MB) before uploading.
10. After completing each phase, verify the app compiles without TypeScript errors before moving to the next phase.

---

## Completion Checklist

- [ ] Supabase client configured with env vars
- [ ] `blogs` and `works` tables created with RLS policies
- [ ] `media` storage bucket created and public
- [ ] AuthContext and ProtectedRoute implemented
- [ ] `/login` page working with Supabase Auth
- [ ] `/blog` list page fetching from Supabase
- [ ] `/blog/:slug` post detail page rendering content blocks
- [ ] `/works` migrated to fetch from Supabase
- [ ] Blog link added to the navigation menu
- [ ] Admin panel accessible only when authenticated
- [ ] Admin Works CRUD with image upload working
- [ ] Admin Blog CRUD with block editor and image upload working
- [ ] TypeScript compiles with no errors
- [ ] `.env.local` is in `.gitignore`
