import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Tìm kiếm toàn cục trên posts, documents, events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!q || q.length < 2) {
      return NextResponse.json({ posts: [], documents: [], events: [] })
    }

    const [posts, documents, events] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
          ],
        },
        select: { id: true, title: true, slug: true, excerpt: true, thumbnail: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      }),
      prisma.document.findMany({
        where: {
          isVisible: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: { id: true, title: true, description: true, filePath: true, fileType: true, fileSize: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: { id: true, title: true, description: true, startDate: true, location: true },
        orderBy: { startDate: 'desc' },
        take: limit,
      }),
    ])

    return NextResponse.json({ posts, documents, events })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Lỗi tìm kiếm' }, { status: 500 })
  }
}
