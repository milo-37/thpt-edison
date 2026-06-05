import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const data = await request.json()
    const achievement = await prisma.achievement.update({ where: { id }, data })
    return NextResponse.json({ success: true, achievement })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    await prisma.achievement.delete({ where: { id } })
    await prisma.activityLog.create({ data: { action: 'delete', entity: 'achievement', entityId: id, details: 'Xóa thành tích', userId: user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa' }, { status: 500 })
  }
}
