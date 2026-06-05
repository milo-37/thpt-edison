'use client'

import { LoadingSpinner } from '../shared/LoadingSpinner'

interface ColumnProps<T> {
  header: string
  accessor?: keyof T | ((row: T) => React.ReactNode)
  render?: (row: T) => React.ReactNode
  width?: string
  style?: React.CSSProperties
}

interface DataTableProps<T> {
  columns: ColumnProps<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Không tìm thấy dữ liệu phù hợp.',
}: DataTableProps<T>) {
  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '200px'
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', fontWeight: 500 }}>Đang tải...</span>
          </div>
        </div>
      )}

      {/* Table Element */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-gray-600)', fontWeight: 600 }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: 'var(--space-4) var(--space-6)',
                    width: col.width,
                    ...col.style
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ color: 'var(--color-gray-700)' }}>
            {data.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-12)',
                    color: 'var(--color-gray-400)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    borderBottom: '1px solid var(--color-gray-100)',
                    transition: 'background var(--transition-fast)',
                  }}
                  className="table-row-hover"
                >
                  {columns.map((col, colIdx) => {
                    let content: React.ReactNode = null

                    if (col.render) {
                      content = col.render(row)
                    } else if (col.accessor) {
                      if (typeof col.accessor === 'function') {
                        content = col.accessor(row)
                      } else {
                        content = row[col.accessor] as unknown as React.ReactNode
                      }
                    }

                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: 'var(--space-4) var(--space-6)',
                          verticalAlign: 'middle',
                          ...col.style
                        }}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
