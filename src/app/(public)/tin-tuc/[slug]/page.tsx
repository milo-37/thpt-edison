import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Eye, User, ChevronLeft, Download, FileText } from 'lucide-react'
import { formatDateVi, sanitizeHtml, formatFileSize } from '@/lib/validation'

// Ép kiểu dynamic fetch để tránh static cache lỗi thời
export const revalidate = 0

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function PostDetailPage(props: Props) {
  // Giải nén params theo chuẩn Next.js 16
  const { slug } = await props.params

  // Lấy chi tiết bài viết
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true, role: true, avatar: true } },
      attachments: true,
    },
  })

  // Nếu không thấy hoặc bài viết chưa xuất bản
  if (!post || post.status !== 'published') {
    notFound()
  }

  // Tăng lượt xem lên 1 trực tiếp tại server
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  // Lấy danh sách bài viết liên quan (cùng danh mục, loại trừ bài viết hiện tại)
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'published',
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { category: true },
  })

  // Làm sạch HTML của bài viết phòng chống XSS
  let cleanContent = sanitizeHtml(post.content)

  // Loại bỏ ảnh thumbnail trùng lặp khỏi nội dung bài viết
  // (Thumbnail đã được hiển thị riêng phía trên nội dung)
  if (post.thumbnail) {
    // Escape special regex chars in the thumbnail URL
    const escapedThumb = post.thumbnail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const thumbImgRegex = new RegExp(`<img[^>]*src=["']${escapedThumb}["'][^>]*/?>`, 'gi')
    cleanContent = cleanContent.replace(thumbImgRegex, '')
  }

  const defaultThumbnail = '/uploads/thumbnails/news-default.jpg'

  return (
    <div className="section section-alt" style={{ minHeight: '80vh', padding: 'var(--space-12) 0' }}>
      <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
        
        {/* Nút quay lại */}
        <Link
          href="/tin-tuc"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-6)',
            fontWeight: 600
          }}
        >
          <ChevronLeft size={16} />
          Quay lại danh sách tin tức
        </Link>

        {/* Nội dung bài viết */}
        <article style={{ background: 'var(--color-white)', padding: 'var(--space-8) var(--space-10)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
          
          {/* Metadata */}
          {post.category && (
            <span className="card-category" style={{ marginBottom: 'var(--space-3)' }}>
              {post.category.name}
            </span>
          )}

          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.3, marginBottom: 'var(--space-4)' }}>
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-6)',
              flexWrap: 'wrap',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-gray-400)',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--color-gray-100)',
              marginBottom: 'var(--space-6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              <span>Người đăng: <strong>{post.author.name}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Ngày xuất bản: {post.publishedAt ? formatDateVi(post.publishedAt) : ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} />
              <span>{post.viewCount + 1} lượt xem</span>
            </div>
          </div>



          {/* Khối Nội Dung Rich Text */}
          <div
            className="rich-text-content"
            style={{
              fontSize: 'var(--font-size-base)',
              lineHeight: 1.8,
              color: 'var(--color-gray-700)'
            }}
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Đính kèm tài liệu (nếu có) */}
          {post.attachments.length > 0 && (
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>
                Tài liệu đính kèm bài viết:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {post.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.filePath}
                    download={file.fileName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--color-gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-gray-200)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-700)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                      <span>{file.fileName} ({formatFileSize(file.fileSize)})</span>
                    </div>
                    <Download size={16} style={{ color: 'var(--color-gray-400)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

        </article>

        {/* Khối Bài viết liên quan */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 'var(--space-12)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 'var(--space-6)' }}>
              Bài Viết Liên Quan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  style={{
                    background: 'var(--color-white)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-gray-100)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {rPost.category && (
                    <span className="card-category" style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {rPost.category.name}
                    </span>
                  )}
                  <Link href={`/tin-tuc/${rPost.slug}`}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 'var(--space-2) 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {rPost.title}
                    </h4>
                  </Link>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>
                    {rPost.publishedAt ? formatDateVi(rPost.publishedAt) : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
