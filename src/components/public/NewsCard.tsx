import Link from 'next/link'
import { Calendar, Eye, User } from 'lucide-react'
import { formatDateVi } from '@/lib/validation'

interface PostProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    thumbnail: string | null
    viewCount: number
    publishedAt: string | Date | null
    category?: {
      name: string
      slug: string
    } | null
    author: {
      name: string
    }
  }
  isFeatured?: boolean
}

export default function NewsCard({ post, isFeatured = false }: PostProps) {
  const defaultThumbnail = '/uploads/thumbnails/news-default.jpg'
  const postThumbnail = post.thumbnail || defaultThumbnail
  const publishedDate = post.publishedAt ? formatDateVi(post.publishedAt) : 'Chưa xuất bản'
  const isoDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined
  const postUrl = `/tin-tuc/${post.slug}`

  if (isFeatured) {
    return (
      <Link href={postUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <article className="premium-card news-featured" style={{ cursor: 'pointer', padding: 0 }}>
          <div className="card-image" style={{ height: '100%', minHeight: '350px' }}>
            <img src={postThumbnail} alt={post.title} />
            <div className="card-image-overlay" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.8) 0%, transparent 100%)' }}></div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-8)' }}>
            {post.category && (
              <span className="card-category">{post.category.name}</span>
            )}
            <h3 className="card-title" style={{ fontSize: 'var(--font-size-2xl)' }}>{post.title}</h3>
            <p className="card-excerpt" style={{ fontSize: 'var(--font-size-base)' }}>{post.excerpt}</p>
            <footer className="card-meta">
              <span className="card-meta-item">
                <User size={14} aria-hidden="true" />
                <address rel="author" style={{ fontStyle: 'normal', display: 'inline' }}>{post.author.name}</address>
              </span>
              <span className="card-meta-item">
                <Calendar size={14} aria-hidden="true" />
                <time dateTime={isoDate}>{publishedDate}</time>
              </span>
              <span className="card-meta-item">
                <Eye size={14} aria-hidden="true" />
                <span aria-label={`${post.viewCount} lượt xem`}>{post.viewCount} lượt xem</span>
              </span>
            </footer>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={postUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <article className="premium-card" style={{ cursor: 'pointer', height: '100%', padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="card-image">
          <img src={postThumbnail} alt={post.title} />
        </div>
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {post.category && (
            <span className="card-category">{post.category.name}</span>
          )}
          <h3 className="card-title">{post.title}</h3>
          <p className="card-excerpt" style={{ flex: 1 }}>{post.excerpt}</p>
          <footer className="card-meta" style={{ marginTop: 'auto' }}>
            <span className="card-meta-item">
              <Calendar size={14} aria-hidden="true" />
              <time dateTime={isoDate}>{publishedDate}</time>
            </span>
            <span className="card-meta-item">
              <Eye size={14} aria-hidden="true" />
              <span aria-label={`${post.viewCount} lượt xem`}>{post.viewCount}</span>
            </span>
          </footer>
        </div>
      </article>
    </Link>
  )
}
