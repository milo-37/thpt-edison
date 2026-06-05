'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import ThemeToggle from '@/components/public/ThemeToggle'
import SearchModal from '@/components/public/SearchModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Đóng mobile menu khi chuyển route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Thành tích', href: '/thanh-tich' },
    { label: 'Tin tức', href: '/tin-tuc' },
    { label: 'Tuyển sinh', href: '/tuyen-sinh' },
    { label: 'Hoạt động', href: '/hoat-dong' },
    { label: 'Hỏi đáp', href: '/hoi-dap' },
    { label: 'Tài liệu', href: '/tai-lieu' },
    { label: 'Liên hệ', href: '/lien-he' },
  ]

  return (
    <header className={`public-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="header-logo">
          <div className="header-logo-icon" style={{ background: 'transparent' }}>
            <img src="/school-logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          </div>
          <div className="header-logo-text">
            <h1>THPT EDISON</h1>
            <span>Khát vọng & Sáng tạo</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="header-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            {/* Search Icon Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }}
              title="Tìm kiếm toàn trang"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <Search size={20} />
            </button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          <Link href="/admin/login" className="btn btn-primary btn-sm" style={{ marginLeft: '10px' }}>
            CMS Portal
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
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
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '15px', padding: '10px 0', borderTop: '1px solid var(--color-gray-200)', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'inherit', fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer' }}
          >
            <Search size={18} /> Tìm kiếm
          </button>
          <ThemeToggle />
        </div>

        <Link href="/admin/login" className="btn btn-primary" style={{ marginTop: '15px' }}>
          CMS Portal
        </Link>
      </div>

      {/* Global Search Modal overlay */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
