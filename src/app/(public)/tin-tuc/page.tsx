import prisma from '@/lib/prisma'
import NewsCard from '@/components/public/NewsCard'
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

export default async function NewsPage(props: PageProps) {
  // Giải nén searchParams theo chuẩn Next.js 16
  const searchParams = await props.searchParams
  const search = searchParams.search || ''
  const categorySlug = searchParams.category || ''
  const currentPage = parseInt(searchParams.page || '1')
  const limit = 6
  const skip = (currentPage - 1) * limit

  // 1. Lọc điều kiện
  const where: any = {
    status: 'published',
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ]
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  // 2. Query dữ liệu song song
  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      include: {
        category: true,
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="section section-alt" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header trang */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span className="section-label">Tin mới cập nhật</span>
          <h1 className="section-title">Tin tức & sự kiện</h1>
        </div>

        {/* Thanh lọc & tìm kiếm */}
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
          {/* Danh mục lọc nhanh */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link
              href="/tin-tuc"
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
              Tất cả
            </Link>
            {categories.map((cat) => {
              const isSelected = categorySlug === cat.slug
              return (
                <Link
                  key={cat.id}
                  href={`/tin-tuc?category=${cat.slug}${search ? `&search=${search}` : ''}`}
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

          {/* Form tìm kiếm (Sử dụng form GET thuần để tìm kiếm đơn giản không cần JS phức tạp) */}
          <form method="GET" action="/tin-tuc" style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', maxWidth: '320px' }}>
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Tìm kiếm bài viết..."
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

        {/* Danh sách tin tức */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-500)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)' }}>
            <p>Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.</p>
            <Link href="/tin-tuc" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <>
            <div className="news-grid" style={{ marginBottom: 'var(--space-10)' }}>
              {posts.map((post) => (
                <NewsCard key={post.id} post={post as any} />
              ))}
            </div>

            {/* Phân trang đơn giản */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-8)' }}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const isCurrent = pageNum === currentPage
                  const pageUrl = `/tin-tuc?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`
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
          </>
        )}

      </div>
    </div>
  )
}
