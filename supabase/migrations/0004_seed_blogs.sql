-- ADR-012: Seed data for development.
-- Run manually in the Supabase SQL Editor after 0001–0003 have been applied.
-- Safe to re-run: INSERT ... ON CONFLICT DO NOTHING.

INSERT INTO blogs (id, title, author, date_published, image_url, tags, content, is_published)
VALUES

(
  'shopify-conversion-rate-optimization',
  'Shopify Conversion Rate Optimization: 7 Tactics That Actually Work',
  'Aureo Team',
  '2024-05-10',
  '',
  ARRAY['Shopify', 'CRO', 'E-commerce'],
  '[
    {"type":"heading","level":2,"text":"Why Most Stores Leave Money on the Table"},
    {"type":"paragraph","text":"Traffic without conversion is just an expense. The average Shopify store converts at 1–2%, but optimized stores routinely hit 4–6%. Here are the seven highest-leverage changes we deploy for every client."},
    {"type":"heading","level":2,"text":"1. Compress Your Above-the-Fold Load"},
    {"type":"paragraph","text":"A one-second delay in page load reduces conversions by 7%. Audit your hero image size, eliminate render-blocking scripts, and defer non-critical third-party apps."},
    {"type":"heading","level":2,"text":"The 7 Tactics"},
    {"type":"bullet_list","items":["Compress hero images to WebP and serve via CDN","Remove unused Shopify apps that inject scripts","Add trust signals (reviews, guarantees) above the fold","Simplify the cart drawer — one clear CTA","Use sticky Add-to-Cart on product pages","A/B test your headline every 30 days","Set up cart abandonment email sequences"]}
  ]'::jsonb,
  true
),

(
  'seo-for-ecommerce-2024',
  'E-commerce SEO in 2024: What Changed and What to Do About It',
  'Aureo Team',
  '2024-04-22',
  '',
  ARRAY['SEO', 'E-commerce', 'Google'],
  '[
    {"type":"paragraph","text":"Google''s 2024 core updates hit thin e-commerce content harder than almost any other category. If your organic traffic dropped after March, here is what happened and how to recover."},
    {"type":"heading","level":2,"text":"What the Update Targeted"},
    {"type":"bullet_list","items":["Auto-generated category descriptions with no unique value","Duplicate product copy lifted from manufacturer specs","Thin blog content created purely for keyword volume","Pages with no first-hand experience signals"]},
    {"type":"heading","level":2,"text":"The Recovery Playbook"},
    {"type":"paragraph","text":"Audit your top-50 organic landing pages. For each one, ask: does this page answer a question better than any competitor? If not, merge it into a stronger page or rewrite it with real product expertise — photos, test results, customer outcomes."},
    {"type":"paragraph","text":"Category pages are the biggest opportunity. A 400-word buying guide at the top of a category page, written by someone who actually uses the products, can move a page from page 3 to position 5 in under 60 days."}
  ]'::jsonb,
  true
),

(
  'content-strategy-for-shopify-brands',
  'Content Strategy for Shopify Brands: From Zero to Authority',
  'Aureo Team',
  '2024-03-15',
  '',
  ARRAY['Content', 'Shopify', 'Brand'],
  '[
    {"type":"paragraph","text":"Most Shopify brands publish blog posts the same way they upload products: inconsistently, with no strategic intent. A content strategy changes that — it turns your store into a resource people return to before they''re ready to buy."},
    {"type":"heading","level":2,"text":"The Three-Layer Content Model"},
    {"type":"bullet_list","items":["Awareness layer: educational content that ranks for problem-aware keywords","Consideration layer: comparison and how-to content for solution-aware shoppers","Decision layer: case studies, reviews, and trust-builders for purchase-ready buyers"]},
    {"type":"heading","level":2,"text":"Publishing Cadence"},
    {"type":"paragraph","text":"Consistency beats volume. Two well-researched posts per month outperform eight thin posts every time. Set a 90-day editorial calendar with topics mapped to each layer, and stick to it."},
    {"type":"heading","level":2,"text":"Measuring What Matters"},
    {"type":"paragraph","text":"Track organic sessions to blog posts, email signups from blog CTAs, and assisted conversions (sessions that included a blog visit before purchase). Revenue attribution is the metric that gets content budget approved."}
  ]'::jsonb,
  true
),

(
  'choosing-a-shopify-partner-agency',
  'How to Choose a Shopify Partner Agency: 8 Questions to Ask Before You Sign',
  'Aureo Team',
  '2024-02-28',
  '',
  ARRAY['Shopify', 'Agency', 'Guide'],
  '[
    {"type":"paragraph","text":"Not all Shopify agencies are equal. The wrong partner costs you months of momentum and a store that underperforms from day one. These eight questions will separate serious partners from generalist shops that happened to learn Shopify last year."},
    {"type":"heading","level":2,"text":"The 8 Questions"},
    {"type":"bullet_list","items":["Can you show me three stores in my niche you have built?","What is your average store launch time from kick-off to go-live?","Who owns the store code and design files when we part ways?","How do you handle Shopify app conflicts on launch day?","What post-launch support is included in the project price?","Have you worked with our product volume and catalog complexity before?","How do you approach mobile-first design?","What does your QA process look like before handoff?"]},
    {"type":"heading","level":2,"text":"Red Flags to Watch For"},
    {"type":"paragraph","text":"Agencies that cannot show live stores, quote vague timelines, or claim ownership of your assets after the project ends should be disqualified immediately. Your store is a long-term business asset — treat the agency relationship accordingly."}
  ]'::jsonb,
  true
)

ON CONFLICT (id) DO NOTHING;
