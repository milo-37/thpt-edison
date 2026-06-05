'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Tạo mảng số trang hiển thị
  const getPagesArray = () => {
    const pages = []
    const range = 2 // Số trang hiển thị xung quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  const pages = getPagesArray()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) 0',
        marginTop: 'var(--space-4)'
      }}
    >
      {/* Thông tin số lượng */}
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
        Trang <strong>{currentPage}</strong> trên tổng số <strong>{totalPages}</strong> trang
      </span>

      {/* Các nút phân trang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-ghost btn-icon btn-sm"
          style={{ border: '1px solid var(--color-gray-200)', width: '32px', height: '32px' }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Danh sách trang */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={idx}
                style={{
                  width: '32px',
                  textAlign: 'center',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                ...
              </span>
            )
          }

          const pageNum = p as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={idx}
              onClick={() => onPageChange(pageNum)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                width: '32px',
                height: '32px',
                padding: 0,
                borderRadius: 'var(--radius-md)',
                border: isActive ? 'none' : '1px solid var(--color-gray-200)',
                background: isActive ? 'var(--color-navy)' : 'transparent',
                color: isActive ? 'var(--color-gold)' : 'var(--color-gray-600)',
                fontWeight: isActive ? 700 : 500
              }}
            >
              {pageNum}
            </button>
          )
        })}

        {/* Nút Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-ghost btn-icon btn-sm"
          style={{ border: '1px solid var(--color-gray-200)', width: '32px', height: '32px' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
