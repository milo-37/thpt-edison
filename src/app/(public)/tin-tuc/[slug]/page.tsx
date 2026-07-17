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
    <div className="section section-alt" style={{ minHeight: '80vh', padding: 'var(--space-12) 0', position: 'relative' }}>
      <style>{`
        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          fontSize: var(--font-size-sm);
          color: #4f46e5;
          margin-bottom: var(--space-6);
          font-weight: 700;
          transition: transform 0.2s ease;
        }
        .back-link-btn:hover {
          transform: translateX(-4px);
        }
        .attachment-link-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--glass-bg);
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          font-size: var(--font-size-sm);
          color: var(--color-gray-700);
          transition: all 0.2s ease;
        }
        .attachment-link-item:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: #6366f1;
        }
        .related-post-card {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          padding: var(--space-6);
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.02);
          transition: all 0.3s ease;
        }
        .related-post-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.05);
        }
      `}</style>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="container" style={{ maxWidth: 'var(--content-width)', position: 'relative', zIndex: 1 }}>
        
        {/* Nút quay lại */}
        <Link
          href="/tin-tuc"
          className="back-link-btn"
        >
          <ChevronLeft size={16} />
          Quay lại danh sách tin tức
        </Link>

        {/* Nội dung bài viết */}
        <article style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', padding: 'var(--space-8) var(--space-10)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.15)', boxShadow: '0 20px 45px rgba(99, 102, 241, 0.05)' }}>
          
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
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-500)',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
              marginBottom: 'var(--space-6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} style={{ color: '#6366f1' }} />
              <span>Người đăng: <strong>{post.author.name}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} style={{ color: '#6366f1' }} />
              <span>Ngày xuất bản: {post.publishedAt ? formatDateVi(post.publishedAt) : ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} style={{ color: '#6366f1' }} />
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
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>
                Tài liệu đính kèm bài viết:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {post.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.filePath}
                    download={file.fileName}
                    className="attachment-link-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <FileText size={16} style={{ color: '#4f46e5' }} />
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
                  className="related-post-card"
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
