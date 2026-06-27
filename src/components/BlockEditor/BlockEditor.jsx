import React from 'react'
import './BlockEditor.css'

// ADR-005: Custom block editor — no external WYSIWYG dependency.
// Output is ContentBlock[] (src/lib/types.js) — no parsing or transformation needed.
// Limitations (by design): no keyboard shortcuts, no drag-and-drop, no inline
// formatting (bold/italic/links). Extending: add a case here and in the renderer.

const BLOCK_TYPES = ['paragraph', 'heading', 'bullet_list']

function emptyBlock(type) {
  if (type === 'heading')     return { type: 'heading', level: 2, text: '' }
  if (type === 'bullet_list') return { type: 'bullet_list', items: [''] }
  return { type: 'paragraph', text: '' }
}

function ParagraphEditor({ block, onChange }) {
  return (
    <textarea
      className="be-input be-textarea"
      rows={4}
      placeholder="Paragraph text…"
      value={block.text}
      onChange={e => onChange({ ...block, text: e.target.value })}
    />
  )
}

function HeadingEditor({ block, onChange }) {
  return (
    <div className="be-row">
      <select
        className="be-input be-select-level"
        value={block.level}
        onChange={e => onChange({ ...block, level: Number(e.target.value) })}
        aria-label="Heading level"
      >
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
      </select>
      <input
        type="text"
        className="be-input be-text-grow"
        placeholder="Heading text…"
        value={block.text}
        onChange={e => onChange({ ...block, text: e.target.value })}
      />
    </div>
  )
}

function BulletListEditor({ block, onChange }) {
  const updateItem = (i, val) => {
    const items = [...block.items]
    items[i] = val
    onChange({ ...block, items })
  }
  const addItem = () => onChange({ ...block, items: [...block.items, ''] })
  const removeItem = (i) => {
    const items = block.items.filter((_, idx) => idx !== i)
    onChange({ ...block, items: items.length ? items : [''] })
  }

  return (
    <div className="be-bullet-list">
      {block.items.map((item, i) => (
        <div className="be-row" key={i}>
          <span className="be-bullet-dot">·</span>
          <input
            type="text"
            className="be-input be-text-grow"
            placeholder={`Item ${i + 1}…`}
            value={item}
            onChange={e => updateItem(i, e.target.value)}
          />
          <button
            type="button"
            className="be-btn be-btn--ghost"
            onClick={() => removeItem(i)}
            disabled={block.items.length === 1}
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="be-btn be-btn--add-item" onClick={addItem}>
        + Add item
      </button>
    </div>
  )
}

/**
 * Controlled block editor. Serializes directly to ContentBlock[].
 *
 * @param {{ value: import('../../lib/types').ContentBlock[], onChange: Function }} props
 */
const BlockEditor = ({ value = [], onChange }) => {
  const updateBlock = (i, block) => {
    const next = [...value]
    next[i] = block
    onChange(next)
  }

  const removeBlock = (i) => onChange(value.filter((_, idx) => idx !== i))

  const moveUp = (i) => {
    if (i === 0) return
    const next = [...value]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  const moveDown = (i) => {
    if (i === value.length - 1) return
    const next = [...value]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  const changeType = (i, type) => {
    const next = value.map((b, idx) => idx === i ? emptyBlock(type) : b)
    onChange(next)
  }

  const addBlock = () => onChange([...value, emptyBlock('paragraph')])

  return (
    <div className="block-editor">
      {value.length === 0 && (
        <p className="be-empty">No blocks yet. Add one below.</p>
      )}

      {value.map((block, i) => (
        <div className="be-block" key={i}>
          <div className="be-block__toolbar">
            <select
              className="be-select-type"
              value={block.type}
              onChange={e => changeType(i, e.target.value)}
              aria-label="Block type"
            >
              {BLOCK_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div className="be-block__actions">
              <button
                type="button"
                className="be-btn"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                aria-label="Move block up"
              >↑</button>
              <button
                type="button"
                className="be-btn"
                onClick={() => moveDown(i)}
                disabled={i === value.length - 1}
                aria-label="Move block down"
              >↓</button>
              <button
                type="button"
                className="be-btn be-btn--danger"
                onClick={() => removeBlock(i)}
                aria-label="Remove block"
              >✕</button>
            </div>
          </div>

          <div className="be-block__body">
            {block.type === 'paragraph'   && <ParagraphEditor   block={block} onChange={b => updateBlock(i, b)} />}
            {block.type === 'heading'     && <HeadingEditor     block={block} onChange={b => updateBlock(i, b)} />}
            {block.type === 'bullet_list' && <BulletListEditor  block={block} onChange={b => updateBlock(i, b)} />}
          </div>
        </div>
      ))}

      <button type="button" className="be-btn be-btn--add-block" onClick={addBlock}>
        + Add block
      </button>
    </div>
  )
}

export default BlockEditor
