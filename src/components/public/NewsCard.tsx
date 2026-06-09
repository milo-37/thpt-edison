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
  const postUrl = `/tin-tuc/${post.slug}`

  if (isFeatured) {
    return (
      <Link href={postUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <article className="card news-featured" style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
          <div className="card-image">
            <img src={postThumbnail} alt={post.title} />
            <div className="card-image-overlay"></div>
          </div>
          <div className="card-body">
            {post.category && (
              <span className="card-category">{post.category.name}</span>
            )}
            <h3 className="card-title">{post.title}</h3>
            <p className="card-excerpt">{post.excerpt}</p>
            <div className="card-meta">
              <div className="card-meta-item">
                <User size={14} />
                <span>{post.author.name}</span>
              </div>
              <div className="card-meta-item">
                <Calendar size={14} />
                <span>{publishedDate}</span>
              </div>
              <div className="card-meta-item">
                <Eye size={14} />
                <span>{post.viewCount} lượt xem</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={postUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease', height: '100%' }}>
        <div className="card-image">
          <img src={postThumbnail} alt={post.title} />
        </div>
        <div className="card-body">
          {post.category && (
            <span className="card-category">{post.category.name}</span>
          )}
          <h3 className="card-title">{post.title}</h3>
          <p className="card-excerpt">{post.excerpt}</p>
          <div className="card-meta">
            <div className="card-meta-item">
              <Calendar size={14} />
              <span>{publishedDate}</span>
            </div>
            <div className="card-meta-item">
              <Eye size={14} />
              <span>{post.viewCount}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
