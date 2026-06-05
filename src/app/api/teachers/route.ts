import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const teachers = await prisma.teacher.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ teachers })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải danh sách giáo viên' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const { name, subject, degree, description, avatar, order, isActive } = await request.json()
    if (!name || !subject) return NextResponse.json({ error: 'Tên và bộ môn là bắt buộc' }, { status: 400 })
    const teacher = await prisma.teacher.create({
      data: { name, subject, degree, description, avatar, order: order || 0, isActive: isActive !== false },
    })
    await prisma.activityLog.create({ data: { action: 'create', entity: 'teacher', entityId: teacher.id, details: `Thêm giáo viên "${name}"`, userId: user.id } })
    return NextResponse.json({ success: true, teacher })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm giáo viên' }, { status: 500 })
  }
}
