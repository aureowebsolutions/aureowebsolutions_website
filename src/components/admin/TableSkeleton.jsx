import React from 'react'

const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r} className="skeleton-row">
        {Array.from({ length: cols }).map((__, c) => (
          <td key={c}>
            <span className="skeleton-cell" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

export default TableSkeleton
