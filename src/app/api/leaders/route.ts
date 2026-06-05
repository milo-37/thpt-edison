import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const leaders = await prisma.leader.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ leaders })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải danh sách BGH' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }
    const { name, role, description, avatar, order, isActive } = await request.json()
    if (!name || !role) {
      return NextResponse.json({ error: 'Tên và chức vụ là bắt buộc' }, { status: 400 })
    }
    const leader = await prisma.leader.create({
      data: { name, role, description, avatar, order: order || 0, isActive: isActive !== false },
    })
    await prisma.activityLog.create({
      data: { action: 'create', entity: 'leader', entityId: leader.id, details: `Thêm thành viên BGH "${name}"`, userId: user.id },
    })
    return NextResponse.json({ success: true, leader })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm thành viên BGH' }, { status: 500 })
  }
}
