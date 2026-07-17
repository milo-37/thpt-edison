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
    <nav 
      className="container"
      aria-label="breadcrumb" 
      style={{ 
        padding: 'var(--space-6) var(--space-4) 0 var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--color-gray-500)',
        flexWrap: 'wrap',
      }}
    >
      <ol
        aria-label="breadcrumb"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '13px', 
          color: 'var(--color-gray-500)',
          flexWrap: 'wrap',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          padding: '8px 20px',
          borderRadius: '999px',
          boxShadow: '0 4px 20px -5px rgba(99, 102, 241, 0.05)',
          listStyle: 'none',
          margin: 0,
        }}
      >
        <li>
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
            onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
          >
            <Home size={14} aria-hidden="true" />
            <span>Trang chủ</span>
          </Link>
        </li>

        {segments.map((segment, idx) => {
          const url = '/' + segments.slice(0, idx + 1).join('/')
          const isLast = idx === segments.length - 1
          const label = customTitle && isLast ? customTitle : (segmentMap[segment] || prettifySlug(segment))

          return (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span aria-hidden="true" style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>
                <ChevronRight size={12} />
              </span>
              {isLast ? (
                <span aria-current="page" style={{ fontWeight: 700, color: '#4f46e5' }}>
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
