import prisma from '@/lib/prisma'
import NewsCard from '@/components/public/NewsCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

import PageBanner from '@/components/public/PageBanner'

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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .search-input-field {
          width: 100%;
          padding: 8px 16px 8px 36px;
          border-radius: 12px;
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          background: var(--glass-bg);
          backdrop-filter: blur(8px);
          outline: none;
          font-size: var(--font-size-sm);
          color: var(--color-navy);
          transition: all 0.3s ease;
        }
        .search-input-field:focus {
          border-color: #6366f1 !important;
          background: var(--glass-bg)!important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
      `}</style>
      
      {/* Header trang */}
      <PageBanner
        label="Tin mới cập nhật"
        title="Tin tức & sự kiện"
      />

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      <section className="section section-alt" style={{ minHeight: '80vh', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

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
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              href="/tin-tuc"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 700,
                background: !categorySlug ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255, 255, 255, 0.7)',
                color: !categorySlug ? '#ffffff' : '#6366f1',
                border: !categorySlug ? 'none' : '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: !categorySlug ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.2s ease'
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
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: 'var(--font-size-sm)',
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
          <form method="GET" action="/tin-tuc" style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', maxWidth: '320px' }}>
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Tìm kiếm bài viết..."
                className="search-input-field"
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#ffffff', fontWeight: 600, padding: '0 16px' }}>
              Tìm
            </button>
          </form>
        </div>

        {/* Danh sách tin tức */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-500)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <p>Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.</p>
            <Link href="/tin-tuc" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#ffffff' }}>
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
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-8)' }}>
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
          </>
        )}

      </div>
      </section>
    </div>
  )
}
