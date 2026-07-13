import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

/**
 * sitemap.xml — Tạo sitemap động cho SEO
 * Bao gồm tất cả trang public và bài viết đã xuất bản
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thpt-edison.edu.vn'

  // Lấy danh sách bài viết đã xuất bản
  let postEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    })

    postEntries = posts.map((post) => ({
      url: `${baseUrl}/tin-tuc/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Sitemap: Failed to fetch posts:', error)
  }

  // Các trang tĩnh
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tuyen-sinh`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hoat-dong`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tai-lieu`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/thanh-tich`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hoi-dap`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  return [...staticPages, ...postEntries]
}
