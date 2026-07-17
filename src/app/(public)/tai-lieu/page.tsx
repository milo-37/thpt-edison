import prisma from '@/lib/prisma'
import DocumentList from '@/components/public/DocumentList'
import Link from 'next/link'
import { Search } from 'lucide-react'

// Ép kiểu dynamic fetch để tránh static cache lỗi thời
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    page?: string
  }>
}

export default async function DocumentsPage(props: PageProps) {
  // Giải nén searchParams theo chuẩn Next.js 16
  const searchParams = await props.searchParams
  const search = searchParams.search || ''
  const categorySlug = searchParams.category || ''
  const currentPage = parseInt(searchParams.page || '1')
  const limit = 8
  const skip = (currentPage - 1) * limit

  // 1. Build query filters
  const where: any = {
    isVisible: true,
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { fileName: { contains: search } },
    ]
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  // 2. Fetch dữ liệu song song
  const [documents, total, categories] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { name: true },
        },
      },
    }),
    prisma.document.count({ where }),
    prisma.category.findMany({
      where: {
        documents: {
          some: {
            isVisible: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="section section-alt" style={{ minHeight: '80vh', padding: 'var(--space-12) 0', position: 'relative' }}>
      <style>{`
        .search-input-field {
          width: 100%;
          padding: 8px 16px 8px 36px;
          border-radius: 12px;
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          background: var(--glass-bg);
          backdrop-filter: blur(8px);
          outline: none;
          font-size: 14px;
          color: var(--color-navy);
          transition: all 0.3s ease;
        }
        .search-input-field:focus {
          border-color: #6366f1 !important;
          background: var(--glass-bg)!important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
      `}</style>
      
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', filter: 'blur(45px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header trang */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="section-label" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: 'var(--font-size-xs)', fontWeight: 700, display: 'inline-block', marginBottom: 'var(--space-3)' }}>
            Kho tài liệu số
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 var(--space-2) 0' }}>
            Tài liệu học tập & biểu mẫu
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: '0 auto', maxWidth: '600px', lineHeight: 1.6 }}>
            Nơi chia sẻ đề cương ôn tập, tài liệu học tập, công văn hướng dẫn và các biểu mẫu học chính thức cho học sinh và giáo viên.
          </p>
        </div>

        {/* Bộ lọc và Tìm kiếm */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-8)'
          }}
        >
          {/* Lọc danh mục */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              href="/tai-lieu"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                background: !categorySlug ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255, 255, 255, 0.7)',
                color: !categorySlug ? '#ffffff' : '#6366f1',
                border: !categorySlug ? 'none' : '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: !categorySlug ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Tất cả tài liệu
            </Link>
            {categories.map((cat) => {
              const isSelected = categorySlug === cat.slug
              return (
                <Link
                  key={cat.id}
                  href={`/tai-lieu?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: isSelected ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255, 255, 255, 0.7)',
                    color: isSelected ? '#ffffff' : '#6366f1',
                    border: isSelected ? 'none' : '1px solid rgba(99, 102, 241, 0.15)',
                    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

          {/* Form tìm kiếm */}
          <form method="GET" action="/tai-lieu" style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', maxWidth: '320px' }}>
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Tìm kiếm tài liệu..."
                className="search-input-field"
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#ffffff', fontWeight: 600, padding: '0 16px' }}>
              Tìm
            </button>
          </form>
        </div>

        {/* Lưới hiển thị danh sách tài liệu */}
        <DocumentList initialDocuments={documents as any} />

        {/* Phân trang */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-10)' }}>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              const isCurrent = pageNum === currentPage
              const pageUrl = `/tai-lieu?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`
              return (
                <Link
                  key={pageNum}
                  href={pageUrl}
                  className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: 0,
                    borderRadius: '50%',
                    background: isCurrent ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255, 255, 255, 0.8)',
                    color: isCurrent ? '#ffffff' : 'var(--color-gray-600)',
                    border: isCurrent ? 'none' : '1px solid rgba(99, 102, 241, 0.12)',
                    boxShadow: isCurrent ? '0 4px 10px rgba(99, 102, 241, 0.15)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {pageNum}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
