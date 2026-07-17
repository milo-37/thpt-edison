'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, User } from 'lucide-react'
import ThemeToggle from '@/components/public/ThemeToggle'
import SearchModal from '@/components/public/SearchModal'

interface UserSession {
  name: string
  email: string
  role: string
  avatar?: string | null
}

interface HeaderProps {
  settings?: {
    schoolName?: string
    logoUrl?: string
    phone?: string
    email?: string
    address?: string
  }
}

function splitSchoolName(name: string): { title: string; subtitle: string } {
  const delimiters = ['-', '|', '/', ',']
  for (const delimiter of delimiters) {
    if (name.includes(delimiter)) {
      const parts = name.split(delimiter)
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(delimiter).trim()
      }
    }
  }
  
  const lowercaseName = name.toLowerCase()
  const suffixIndex = lowercaseName.indexOf('minh đức') !== -1 ? lowercaseName.indexOf('minh đức') : lowercaseName.indexOf('minh duc')
  if (suffixIndex > 0) {
    return {
      title: name.substring(0, suffixIndex).trim(),
      subtitle: name.substring(suffixIndex).trim()
    }
  }

  const schoolIndex = lowercaseName.lastIndexOf('school')
  if (schoolIndex > 0 && schoolIndex + 6 < name.length) {
    return {
      title: name.substring(0, schoolIndex + 6).trim(),
      subtitle: name.substring(schoolIndex + 6).trim()
    }
  }

  return {
    title: name,
    subtitle: ''
  }
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState<string | null>(null)
  const [user, setUser] = useState<UserSession | null>(null)
  const pathname = usePathname()

  const schoolName = settings?.schoolName || 'EDISON SCHOOL MINH DUC'
  const logoUrl = settings?.logoUrl || '/school-logo.jpg'
  const { title, subtitle } = splitSchoolName(schoolName)

  // Fetch logged in user info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Not logged in')
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Đọc tab parameter từ client side để tránh lỗi static render suspense
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setCurrentTab(params.get('tab'))
    }
  }, [pathname])

  // Đóng mobile menu khi chuyển route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Tin tức', href: '/tin-tuc' },
    { label: 'Hoạt động', href: '/hoat-dong?tab=calendar' },
    { label: 'Thư viện', href: '/tai-lieu' },
    { label: 'Liên hệ', href: '/lien-he' },
  ]

  return (
    <header className={`public-header glass-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="header-logo">
          <div className="header-logo-icon" style={{ background: 'var(--glass-bg)', overflow: 'hidden' }}>
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                transform: 'scale(1.25)',
                transformOrigin: 'center'
              }} 
            />
          </div>
          <div className="header-logo-text">
            <span className="logo-title">{title}</span>
            {subtitle && <span className="logo-subtitle">{subtitle}</span>}
          </div>
        </Link>



        {/* Desktop Navigation - menu links only */}
        <nav className="header-nav" aria-label="Điều hướng chính">
          {menuItems.map((item) => {
            const baseHref = item.href.split('?')[0]
            
            let isActive = false
            if (item.href === '/') {
              isActive = pathname === '/'
            } else if (baseHref === '/hoat-dong') {
              isActive = pathname === '/hoat-dong'
            } else {
              isActive = pathname === baseHref || pathname.startsWith(baseHref + '/')
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="header-actions" role="group" aria-label="Công cụ và hành động">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }}
            title="Tìm kiếm toàn trang"
            aria-label="Mở hộp tìm kiếm"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.15)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <Search size={20} aria-hidden="true" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* CMS Portal / User */}
          {user ? (
            <Link
              href="/admin/dashboard"
              className="btn btn-outline"
              style={{
                border: '1.5px solid #4f46e5',
                color: '#4f46e5',
                padding: '8px 16px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.05)'
              }}
              title="Đến trang quản lý"
            >
              <span
                aria-hidden="true"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 800,
                  overflow: 'hidden'
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{user.name.split(' ').pop()}</span>
            </Link>
          ) : (
            <Link href="/admin/login" className="btn btn-outline" style={{ border: '1.5px solid #4f46e5', color: '#4f46e5', padding: '8px 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.04)', whiteSpace: 'nowrap' }}>
              CMS Portal
            </Link>
          )}

          {/* Enroll CTA */}
          <Link href="/tuyen-sinh" className="btn btn-gold" style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#ffffff', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)', whiteSpace: 'nowrap' }}>
            Tuyển Sinh
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>


      {/* Mobile Menu Dropdown */}
      <nav id="mobile-nav" className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Điều hướng di động" aria-hidden={!isMobileMenuOpen}>
        {menuItems.map((item) => {
          const baseHref = item.href.split('?')[0]
          const queryTab = item.href.includes('?tab=') ? item.href.split('?tab=')[1] : null
          
          let isActive = false
          if (item.href === '/') {
            isActive = pathname === '/'
          } else if (baseHref === '/hoat-dong') {
            isActive = pathname === '/hoat-dong'
          } else {
            isActive = pathname === baseHref || pathname.startsWith(baseHref + '/')
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'active' : ''}
            >
              {item.label}
            </Link>
          )
        })}

        {/* Mobile search & theme controls */}
        <div role="group" aria-label="Công cụ tìm kiếm và giao diện" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '15px', padding: '10px 0', borderTop: '1px solid var(--color-gray-200)', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'inherit', fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer' }}
          >
            <Search size={18} /> Tìm kiếm
          </button>
          <ThemeToggle />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', width: '100%' }}>
          {user ? (
            <Link
              href="/admin/dashboard"
              className="btn btn-outline"
              style={{
                flex: 1,
                border: '1.5px solid #4f46e5',
                color: '#4f46e5',
                padding: '10px 0',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.05)'
              }}
            >
              <User size={16} />
              <span>Quản trị ({user.name.split(' ').pop()})</span>
            </Link>
          ) : (
            <Link href="/admin/login" className="btn btn-outline" style={{ flex: 1, border: '1.5px solid #4f46e5', color: '#4f46e5', padding: '10px 0', borderRadius: '12px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.04)' }}>
              CMS Portal
            </Link>
          )}
          <Link href="/tuyen-sinh" className="btn btn-gold" style={{ flex: 1, padding: '10px 0', borderRadius: '12px', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#ffffff' }}>
            Tuyển Sinh Ngay
          </Link>
        </div>
      </nav>

      {/* Global Search Modal overlay */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
