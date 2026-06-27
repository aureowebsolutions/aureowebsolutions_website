/**
 * ADR-003: ContentBlock is the contract between the blogs.content JSONB column
 * and the blog post renderer. Validation of block shape happens here (in the
 * app), not at the database level — the DB accepts any valid JSON.
 *
 * Adding a new block type only requires extending this typedef and updating
 * the renderer; no DB migration needed.
 */

/**
 * @typedef {{ type: 'paragraph'; text: string }} ParagraphBlock
 * @typedef {{ type: 'heading'; level: 2 | 3 | 4; text: string }} HeadingBlock
 * @typedef {{ type: 'bullet_list'; items: string[] }} BulletListBlock
 * @typedef {ParagraphBlock | HeadingBlock | BulletListBlock} ContentBlock
 */

/**
 * @typedef {Object} Blog
 * @property {string}         id             - URL-safe slug; also the PK (ADR-006)
 * @property {string}         title
 * @property {string}         author
 * @property {string}         date_published - ISO date string
 * @property {string}         [category]
 * @property {string[]}       tags
 * @property {string}         [image_url]
 * @property {ContentBlock[]} content        - JSONB array of blocks (ADR-003)
 * @property {boolean}        is_published
 * @property {string}         created_at
 * @property {string}         updated_at
 */

/**
 * @typedef {Object} Work
 * @property {string}   id
 * @property {string}   client_name
 * @property {string}   slug
 * @property {string}   [description]
 * @property {string[]} tags
 * @property {string}   [image_url]
 * @property {string}   [image_alt]
 * @property {string}   [metric_value]
 * @property {string}   [metric_label]
 * @property {number}   sort_order
 * @property {boolean}  is_published
 * @property {string}   created_at
 */
