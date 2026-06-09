import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// GET: Lấy danh sách testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách đánh giá' }, { status: 500 })
  }
}

// POST: Tạo testimonial mới
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện thao tác này' }, { status: 403 })
    }

    const { name, role, content, avatar, rating, order, isActive } = await request.json()

    if (!name || !content) {
      return NextResponse.json({ error: 'Họ tên và nội dung đánh giá là bắt buộc' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || '',
        content,
        avatar: avatar || null,
        rating: Number(rating) || 5,
        order: Number(order) || 0,
        isActive: isActive !== false
      },
    })

    await prisma.activityLog.create({
      data: { action: 'create', entity: 'testimonial', entityId: testimonial.id, details: `Tạo đánh giá của "${name}"`, userId: user.id },
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json({ error: 'Lỗi tạo đánh giá' }, { status: 500 })
  }
}
