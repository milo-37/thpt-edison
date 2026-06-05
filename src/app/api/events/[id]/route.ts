import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// PUT: Cập nhật sự kiện
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: 'Sự kiện không tồn tại' }, { status: 404 })
    }

    const { title, description, startDate, endDate, location } = await request.json()
    if (!title || !startDate) {
      return NextResponse.json({ error: 'Tiêu đề và ngày bắt đầu là bắt buộc' }, { status: 400 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
      },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'event',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật sự kiện "${title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa sự kiện
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa sự kiện' }, { status: 403 })
    }

    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: 'Sự kiện không tồn tại' }, { status: 404 })
    }

    await prisma.event.delete({ where: { id } })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'event',
        entityId: id,
        details: `Người dùng ${user.name} xóa sự kiện "${event.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa sự kiện thành công' })
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
