import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// GET: Lấy danh sách slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const slides = await prisma.slide.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Get slides error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách slides' }, { status: 500 })
  }
}

// POST: Tạo slide mới
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền thêm slide' }, { status: 403 })
    }

    const { title, subtitle, imageUrl, linkUrl, order, isActive } = await request.json()

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Tiêu đề và ảnh là bắt buộc' }, { status: 400 })
    }

    const slide = await prisma.slide.create({
      data: { title, subtitle, imageUrl, linkUrl, order: order || 0, isActive: isActive !== false },
    })

    await prisma.activityLog.create({
      data: { action: 'create', entity: 'slide', entityId: slide.id, details: `Tạo slide "${title}"`, userId: user.id },
    })

    return NextResponse.json({ success: true, slide })
  } catch (error) {
    console.error('Create slide error:', error)
    return NextResponse.json({ error: 'Lỗi tạo slide' }, { status: 500 })
  }
}
