import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// GET: Xem lịch sử hoạt động (Chỉ dành cho Admin)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || ''
    const entity = searchParams.get('entity') || ''
    const userIdFilter = searchParams.get('userId') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    if (userIdFilter) {
      where.userId = userIdFilter
    }

    const total = await prisma.activityLog.count({ where })

    const logs = await prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    })

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get activity logs error:', error)
    return NextResponse.json({ error: 'Lỗi tải lịch sử hoạt động' }, { status: 500 })
  }
}
