'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbProps {
  customTitle?: string
}

const segmentMap: Record<string, string> = {
  'gioi-thieu': 'Giới thiệu',
  'thanh-tich': 'Thành tích',
  'tin-tuc': 'Tin tức',
  'tuyen-sinh': 'Tuyển sinh',
  'hoat-dong': 'Hoạt động & Sự kiện',
  'hoi-dap': 'Hỏi đáp FAQ',
  'tai-lieu': 'Tài liệu học tập',
  'lien-he': 'Liên hệ'
}

export default function Breadcrumb({ customTitle }: BreadcrumbProps) {
  const pathname = usePathname()
  
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  const prettifySlug = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="container" style={{ padding: 'var(--space-4) var(--space-4) 0 var(--space-4)' }}>
      <nav 
        aria-label="breadcrumb" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--color-gray-500)',
          flexWrap: 'wrap'
        }}
      >
        <Link 
          href="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: 'var(--color-gray-500)',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
        >
          <Home size={14} />
          <span>Trang chủ</span>
        </Link>

        {segments.map((segment, idx) => {
          const url = '/' + segments.slice(0, idx + 1).join('/')
          const isLast = idx === segments.length - 1
          const label = customTitle && isLast ? customTitle : (segmentMap[segment] || prettifySlug(segment))

          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronRight size={12} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
              {isLast ? (
                <span style={{ fontWeight: 600, color: 'var(--color-navy-light)' }}>
                  {label}
                </span>
              ) : (
                <Link 
                  href={url}
                  style={{ 
                    color: 'var(--color-gray-500)',
                    textDecoration: 'none',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
                >
                  {label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
