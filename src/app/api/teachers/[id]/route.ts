import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const data = await request.json()
    const teacher = await prisma.teacher.update({ where: { id }, data })
    return NextResponse.json({ success: true, teacher })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    await prisma.teacher.delete({ where: { id } })
    await prisma.activityLog.create({ data: { action: 'delete', entity: 'teacher', entityId: id, details: 'Xóa giáo viên', userId: user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa' }, { status: 500 })
  }
}
