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
    <div className="section section-alt" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header trang */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Kho tài liệu số</span>
          <h1 className="section-title">Tài liệu học tập & biểu mẫu</h1>
          <p className="section-desc">
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
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link
              href="/tai-lieu"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                background: !categorySlug ? 'var(--color-navy)' : 'var(--color-white)',
                color: !categorySlug ? 'var(--color-gold)' : 'var(--color-gray-600)',
                border: '1px solid var(--color-gray-200)',
                transition: 'all var(--transition-fast)'
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
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    background: isSelected ? 'var(--color-navy)' : 'var(--color-white)',
                    color: isSelected ? 'var(--color-gold)' : 'var(--color-gray-600)',
                    border: '1px solid var(--color-gray-200)',
                    transition: 'all var(--transition-fast)'
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
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-4) var(--space-2) var(--space-10)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-gray-200)',
                  outline: 'none',
                  fontSize: 'var(--font-size-sm)'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Tìm
            </button>
          </form>
        </div>

        {/* Lưới hiển thị danh sách tài liệu */}
        <DocumentList initialDocuments={documents as any} />

        {/* Phân trang */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-10)' }}>
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
                    background: isCurrent ? 'var(--color-navy)' : 'var(--color-white)',
                    color: isCurrent ? 'var(--color-gold)' : 'var(--color-gray-600)',
                    border: isCurrent ? 'none' : '1px solid var(--color-gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
