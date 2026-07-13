import type { MetadataRoute } from 'next'

/**
 * robots.txt — Hướng dẫn bot tìm kiếm:
 * - Cho phép index tất cả trang public
 * - CHẶN index trang admin, API, uploads nội bộ
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thpt-edison.edu.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
