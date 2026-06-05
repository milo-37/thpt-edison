import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// GET: Lấy danh sách sự kiện (Public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcomingOnly = searchParams.get('upcoming') === 'true'

    const where: any = {}

    // Lọc các sự kiện chưa kết thúc hoặc sắp diễn ra
    if (upcomingOnly) {
      where.startDate = {
        gte: new Date(),
      }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách sự kiện' }, { status: 500 })
  }
}

// POST: Tạo sự kiện mới (Yêu cầu admin/editor)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { title, description, startDate, endDate, location } = await request.json()

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Tiêu đề và ngày bắt đầu là bắt buộc' }, { status: 400 })
    }

    const event = await prisma.event.create({
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
        action: 'create',
        entity: 'event',
        entityId: event.id,
        details: `Người dùng ${user.name} tạo sự kiện "${title}" diễn ra vào ngày ${startDate}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tạo sự kiện' }, { status: 500 })
  }
}
