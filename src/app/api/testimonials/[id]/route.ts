import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// PUT: Cập nhật testimonial
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    const { name, role, content, avatar, rating, order, isActive } = await request.json()
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        role,
        content,
        avatar,
        rating: Number(rating),
        order: Number(order),
        isActive
      },
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json({ error: 'Lỗi cập nhật đánh giá' }, { status: 500 })
  }
}

// DELETE: Xóa testimonial
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    await prisma.testimonial.delete({ where: { id } })

    await prisma.activityLog.create({
      data: { action: 'delete', entity: 'testimonial', entityId: id, details: `Xóa đánh giá`, userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json({ error: 'Lỗi xóa đánh giá' }, { status: 500 })
  }
}
