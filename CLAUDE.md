# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:3000
npm run build      # production build → build/
npm test           # Jest in watch mode
npm test -- --watchAll=false  # single test run (CI mode)
```

## Architecture

This is a Create React App site for Aureo Web Solutions, a web development agency. Deployed on Netlify (`public/_redirects` handles SPA routing; `data-netlify="true"` on the contact form enables Netlify Forms as a fallback).

**Three routes** defined in `src/App.js`:
- `/` → `src/pages/home/Home.jsx` — assembles all section containers in order
- `/contact-us/` → `src/pages/contact-us/ContactUs.jsx`
- `/blog/:id` → `src/containers/blog_layout/BlogLayout.jsx`

**Layer separation:**
- `src/pages/` — page-level components; compose containers into full pages
- `src/containers/` — section-level components (Header, Footer, Blog, Features, WhatAUREO, Posibility, forms, blog_layout); each has its own CSS file
- `src/components/` — smaller reusable UI pieces (Navbar, Brand, Cta, Feature, Article, ScrollToTop); barrel-exported from `src/components/index.js`
- `src/containers/index.js` — barrel export for containers

**Blog system** is JSON-driven with no CMS. All blog content lives in `src/containers/blog/blogs.json`. Each entry has an `id` (used as the URL slug), `title`, `author`, `date_published`, `image_url` (relative to `src/assets/`), and a `content` array. The `content` array supports three types: `"heading"`, `"paragraph"`, and `"bullet_points"`. `BlogPage.jsx` loads the matching entry via `useParams()` and renders it; a missing id redirects to `/#blog`. Blog images are loaded dynamically via `require.context('../../assets', true)`.

**Contact form** uses EmailJS (service ID `service_t9x28ev`, template `template_do871yd`) with Google reCAPTCHA — the send button stays disabled until reCAPTCHA is verified.

**Styling** uses Tailwind CSS v3 with the `@tailwindcss/typography` plugin (applied to blog content via `prose-*` classes). Many JSX files mix `class` and `className` attributes — this is pre-existing and the app renders correctly despite it.

**Icons** come from two libraries used together: `@fortawesome/react-fontawesome` (React components) and Font Awesome CDN classes via raw `<i>` tags (loaded in `public/index.html`), plus `react-icons`.

## Adding a blog post

Add a new object to the `"blogs"` array in `src/containers/blog/blogs.json`. The `id` must be URL-safe (kebab-case) and unique — it becomes the route `/blog/<id>`. Place the post image in `src/assets/` and set `image_url` to the filename. Then add the image to `src/containers/blog/imports.js` and update the hardcoded lists in `BlogLayout.jsx` (Related Post, Most Popular Post, Random Post sections) and `src/containers/blog/Blog.jsx` if you want it shown on the home page.
