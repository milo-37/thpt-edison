import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// PATCH: Cập nhật trạng thái liên hệ (Đã đọc/Đã xử lý)
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { isRead, isHandled } = await request.json()
    const dataToUpdate: any = {}

    if (isRead !== undefined) dataToUpdate.isRead = !!isRead
    if (isHandled !== undefined) dataToUpdate.isHandled = !!isHandled

    const contact = await prisma.contact.update({
      where: { id },
      data: dataToUpdate,
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'contact',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật trạng thái liên hệ "${contact.subject}" của ${contact.name}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error('Patch contact error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa liên hệ
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa liên hệ' }, { status: 403 })
    }

    const contact = await prisma.contact.findUnique({ where: { id } })
    if (!contact) {
      return NextResponse.json({ error: 'Liên hệ không tồn tại' }, { status: 404 })
    }

    await prisma.contact.delete({ where: { id } })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'contact',
        entityId: id,
        details: `Người dùng ${user.name} xóa liên hệ "${contact.subject}" của ${contact.name}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa liên hệ thành công' })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
