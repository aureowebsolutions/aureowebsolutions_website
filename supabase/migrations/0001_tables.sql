-- ADR-003: JSONB para el contenido de blog (block model)
-- ADR-006: Slug como Primary Key en tabla blogs
--
-- The key decision in this migration is content JSONB on blogs.
-- Validation of block shape is NOT enforced at the DB level — it relies on
-- the admin form and the ContentBlock type contract in src/lib/types.js.
-- See ADR-003 consequences: a malformed block passes the JSONB constraint.
--
-- Run this FIRST. 0002_rls_policies.sql and 0003_storage_bucket.sql depend on these tables.

-- ── blogs ─────────────────────────────────────────────────────────────────────

CREATE TABLE blogs (
  id             VARCHAR        PRIMARY KEY,  -- URL-safe slug; see ADR-006
  title          VARCHAR        NOT NULL,
  author         VARCHAR        NOT NULL,
  date_published DATE           NOT NULL,
  category       VARCHAR,
  tags           TEXT[]         DEFAULT '{}',
  image_url      VARCHAR,
  content        JSONB          NOT NULL DEFAULT '[]',
  -- content is an array of ContentBlock objects, e.g.:
  -- [{ "type": "paragraph", "text": "..." },
  --  { "type": "heading",   "level": 2, "text": "..." },
  --  { "type": "bullet_list", "items": ["...", "..."] }]
  -- Shape is validated in the app, not here. See src/lib/types.js.
  is_published   BOOLEAN        NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ── works ─────────────────────────────────────────────────────────────────────

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
