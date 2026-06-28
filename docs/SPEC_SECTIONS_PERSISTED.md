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

### 6.0 Homepage Blog Preview Section

Add a **Blog Preview** section to the existing homepage (`/`), placed immediately **below the Client Reviews / Testimonials section**.

**Component:** Create `src/components/HomeBlogPreview.tsx`

- Fetch the **3 most recent** published blogs from Supabase:
  ```ts
  supabase
    .from('blogs')
    .select('id, title, author, date_published, category, tags, image_url')
    .eq('is_published', true)
    .order('date_published', { ascending: false })
    .limit(3)
  ```
- Render a **3-column card grid** (single column on mobile, 2 on tablet, 3 on desktop)
- Each card displays: cover image, category badge, title, author, date, first 2 tags
- Each card links to `/blog/:id`
- Below the grid, add a **"View all posts →"** link pointing to `/blog`
- Section heading: `"Latest from the Blog"` (or match the heading style of other homepage sections)
- While loading: show 3 skeleton placeholder cards matching the card dimensions
- If no published blogs exist yet: hide the section entirely (do not render)
- **Style must match the homepage visual language exactly** — same fonts, spacing, card shadow/border patterns as other homepage sections

**Integration:** In the homepage component (likely `src/pages/Home.tsx` or `src/App.tsx`), import and place `<HomeBlogPreview />` directly after the Client Reviews section. Do not alter any surrounding sections.

---

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

## Phase 10 — Seed Data

After all tables are created and RLS policies are applied, run the following SQL in the Supabase SQL Editor to populate the `blogs` table with 4 sample posts. This data is for development and preview purposes.

```sql
INSERT INTO blogs (id, title, author, date_published, category, tags, image_url, is_published, content) VALUES

(
  'programming-with-claude',
  'Programming with Claude: How AI Is Changing the Way We Write Code',
  'Alex Rivera',
  '2024-10-15',
  'Technology',
  ARRAY['AI', 'Claude', 'Productivity', 'Development'],
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format',
  true,
  '[
    {"type":"paragraph","text":"The way developers write code is undergoing a fundamental shift. With AI assistants like Claude entering the workflow, tasks that once took hours can now be completed in minutes — and more importantly, with fewer errors."},
    {"type":"heading","level":2,"text":"What Does It Mean to Program With Claude?"},
    {"type":"paragraph","text":"Programming with Claude is not about replacing the developer. It is about augmenting your capabilities. Claude can read your codebase, understand context, suggest refactors, write tests, and explain complex logic in plain language."},
    {"type":"heading","level":2,"text":"Practical Use Cases"},
    {"type":"bullet_list","items":["Generating boilerplate components in seconds","Writing unit tests for existing functions","Debugging cryptic error messages","Refactoring legacy code with modern patterns","Drafting technical documentation from code comments"]},
    {"type":"heading","level":2,"text":"Getting Started"},
    {"type":"paragraph","text":"The best entry point is Claude Code via CLI. Install it, point it at your project, and start with a well-written SPEC.md that describes what you want to build. Claude will read your existing code first, then generate changes that match your conventions."},
    {"type":"paragraph","text":"The key insight is that Claude is only as good as the context you give it. Invest time in writing clear instructions and you will get production-quality output."}
  ]'::jsonb
),

(
  'redesign-your-online-store-with-ai',
  'Redesign Your Online Store With AI: A Step-by-Step Guide',
  'Maria Santos',
  '2024-11-03',
  'E-Commerce',
  ARRAY['AI', 'E-Commerce', 'Shopify', 'UX Design', 'Conversion'],
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format',
  true,
  '[
    {"type":"paragraph","text":"Your online store might be losing customers not because of your products, but because of how they are presented. AI tools are now capable of analyzing your store, identifying friction points, and generating redesign proposals — all in a fraction of the time a traditional agency would take."},
    {"type":"heading","level":2,"text":"Why AI-Driven Redesigns Work"},
    {"type":"paragraph","text":"Traditional redesigns rely on gut feeling and generic best practices. AI-driven redesigns start with data: your conversion funnel, heatmaps, and user behavior patterns. The result is a design that is tailored to your specific audience, not a template."},
    {"type":"heading","level":2,"text":"The 4-Step AI Redesign Process"},
    {"type":"bullet_list","items":["Audit: Use AI to scan your current store and flag UX issues (slow images, confusing navigation, weak CTAs)","Strategy: Feed your analytics and competitor data to Claude to generate a redesign brief","Design: Use AI design tools to generate layout options aligned with your brand","Implement: Use Claude Code to convert designs into production-ready Shopify or React components"]},
    {"type":"heading","level":2,"text":"Real Results"},
    {"type":"paragraph","text":"Stores that go through an AI-assisted redesign typically see a 20–40% increase in add-to-cart rate within the first 60 days. The reason is simple: AI removes bias from the design process and focuses purely on what converts."},
    {"type":"heading","level":2,"text":"Where to Start"},
    {"type":"paragraph","text":"Start with your product page. It is the highest-leverage page in any e-commerce store. Ask Claude to review your current product page HTML and suggest specific improvements to the layout, copy hierarchy, and image presentation."}
  ]'::jsonb
),

(
  'application-security-with-ai',
  'Application Security in the Age of AI: Threats, Tools, and Best Practices',
  'Jordan Lee',
  '2024-11-20',
  'Security',
  ARRAY['Security', 'AI', 'Cybersecurity', 'Development', 'Best Practices'],
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format',
  true,
  '[
    {"type":"paragraph","text":"AI is a double-edged sword in application security. On one side, it gives developers powerful tools to detect vulnerabilities faster than ever. On the other, it gives attackers the ability to craft more sophisticated exploits at scale. Understanding both sides is essential for any developer building production applications today."},
    {"type":"heading","level":2,"text":"How AI Is Being Used to Attack Applications"},
    {"type":"bullet_list","items":["Automated vulnerability scanning at unprecedented speed","AI-generated phishing content that bypasses traditional filters","Code generation used to create malware variants","Prompt injection attacks targeting AI-powered features in apps"]},
    {"type":"heading","level":2,"text":"How AI Helps You Defend"},
    {"type":"paragraph","text":"The same capabilities that make AI dangerous also make it a powerful defensive tool. You can use Claude to audit your codebase for common vulnerabilities like SQL injection, XSS, and insecure direct object references — and get remediation suggestions in context."},
    {"type":"heading","level":2,"text":"Practical Security Checklist for AI-Assisted Projects"},
    {"type":"bullet_list","items":["Never expose API keys in frontend code or version control","Enable Row Level Security (RLS) on all database tables","Validate and sanitize all user inputs server-side","Use environment variables for all secrets, never hardcode them","Audit third-party dependencies regularly with tools like npm audit","Implement rate limiting on all public API endpoints","Use HTTPS everywhere and enforce HSTS headers"]},
    {"type":"heading","level":2,"text":"The Bottom Line"},
    {"type":"paragraph","text":"Security is not a feature you add at the end — it is a discipline you practice throughout the development lifecycle. AI makes it easier to stay disciplined, but only if you use it intentionally. Make security audits part of your standard Claude Code prompts, not an afterthought."}
  ]'::jsonb
),

(
  'build-faster-with-claude-code',
  'Build Faster With Claude Code: From SPEC to Production in Record Time',
  'Alex Rivera',
  '2024-12-05',
  'Technology',
  ARRAY['Claude', 'Claude Code', 'Productivity', 'Workflow', 'AI'],
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format',
  true,
  '[
    {"type":"paragraph","text":"Claude Code is not just an autocomplete tool. When used correctly, it is a full development partner capable of reading your entire codebase, understanding your conventions, and implementing features end-to-end. The key is knowing how to communicate with it effectively."},
    {"type":"heading","level":2,"text":"The SPEC-First Workflow"},
    {"type":"paragraph","text":"The most effective way to work with Claude Code is to write a SPEC.md file before writing a single line of code. A SPEC is a structured markdown document that tells Claude what to build, how to build it, and what constraints to follow. Think of it as a contract between you and your AI developer."},
    {"type":"heading","level":2,"text":"What Makes a Good SPEC?"},
    {"type":"bullet_list","items":["A clear Pre-Task section that tells Claude to read the codebase first","Phased implementation steps ordered by dependency","Explicit TypeScript types and database schemas","Constraints that protect your existing code from unintended changes","A completion checklist Claude can verify against"]},
    {"type":"heading","level":2,"text":"ADRs: The Missing Piece"},
    {"type":"paragraph","text":"Architecture Decision Records (ADRs) complement your SPEC by documenting why you made specific technical choices. When Claude Code encounters a decision point not covered by your SPEC, it can reference your ADRs to stay aligned with your architectural vision."},
    {"type":"heading","level":2,"text":"Measuring the Speed Gain"},
    {"type":"paragraph","text":"Developers using the SPEC-first workflow with Claude Code consistently report completing features in 30–70% less time compared to traditional development. The gains are largest on well-defined, data-heavy features like admin panels, CRUD interfaces, and API integrations — exactly the kind of work that is tedious but critical."},
    {"type":"paragraph","text":"The investment is in the upfront thinking: writing a good SPEC takes 30–60 minutes. But it saves hours of back-and-forth and reduces the need for major refactors after the fact."}
  ]'::jsonb
);
```

> **Note:** The `image_url` values above use Unsplash URLs for development purposes. Replace them with actual uploaded images via the Admin panel before going to production.

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
- [ ] Seed data (4 blog posts) inserted into `blogs` table
- [ ] AuthContext and ProtectedRoute implemented
- [ ] `/login` page working with Supabase Auth
- [ ] `HomeBlogPreview` component renders below Client Reviews on homepage
- [ ] `HomeBlogPreview` shows skeleton cards while loading
- [ ] `HomeBlogPreview` hides itself when no published blogs exist
- [ ] `/blog` list page fetching from Supabase
- [ ] `/blog/:slug` post detail page rendering content blocks
- [ ] `/works` migrated to fetch from Supabase
- [ ] Blog link added to the navigation menu
- [ ] Admin panel accessible only when authenticated
- [ ] Admin Works CRUD with image upload working
- [ ] Admin Blog CRUD with block editor and image upload working
- [ ] TypeScript compiles with no errors
- [ ] `.env.local` is in `.gitignore`