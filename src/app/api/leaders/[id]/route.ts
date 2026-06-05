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
    const leader = await prisma.leader.update({ where: { id }, data })
    return NextResponse.json({ success: true, leader })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    await prisma.leader.delete({ where: { id } })
    await prisma.activityLog.create({ data: { action: 'delete', entity: 'leader', entityId: id, details: 'Xóa thành viên BGH', userId: user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa' }, { status: 500 })
  }
}
