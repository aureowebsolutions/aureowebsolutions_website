-- ADR-002: Row Level Security para control de acceso
-- Run this in the Supabase SQL Editor after creating the blogs and works tables.
--
-- Security model:
--   - Unauthenticated (anon key): SELECT on published rows only.
--   - Authenticated (admin session): full access (SELECT, INSERT, UPDATE, DELETE).
--
-- NOTE: The ProtectedRoute component in the React app is a UX guard only.
-- This file is the authoritative security layer — it applies regardless of
-- how the Supabase API is called.

-- ── blogs ─────────────────────────────────────────────────────────────────────

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Grant table-level access so RLS policies can evaluate (RLS filters rows, GRANT allows table entry)
GRANT SELECT ON public.blogs TO anon;
GRANT ALL    ON public.blogs TO authenticated;

CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage blogs"
  ON blogs FOR ALL
  USING (auth.role() = 'authenticated');

-- ── works ─────────────────────────────────────────────────────────────────────

ALTER TABLE works ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.works TO anon;
GRANT ALL    ON public.works TO authenticated;

CREATE POLICY "Public can read published works"
  ON works FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage works"
  ON works FOR ALL
  USING (auth.role() = 'authenticated');
