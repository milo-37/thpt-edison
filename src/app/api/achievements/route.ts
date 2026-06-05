import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const all = searchParams.get('all') === 'true'
    const where: any = all ? {} : { isActive: true }
    if (category) where.category = category
    const achievements = await prisma.achievement.findMany({ where, orderBy: { order: 'asc' } })
    return NextResponse.json({ achievements })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải thành tích' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const { title, description, imageUrl, year, studentName, category, order, isActive } = await request.json()
    if (!title) return NextResponse.json({ error: 'Tiêu đề là bắt buộc' }, { status: 400 })
    const achievement = await prisma.achievement.create({
      data: { title, description, imageUrl, year, studentName, category: category || 'academic', order: order || 0, isActive: isActive !== false },
    })
    await prisma.activityLog.create({ data: { action: 'create', entity: 'achievement', entityId: achievement.id, details: `Thêm thành tích "${title}"`, userId: user.id } })
    return NextResponse.json({ success: true, achievement })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm thành tích' }, { status: 500 })
  }
}
