import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// GET: Lấy danh sách tài liệu (Public + Admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categorySlug = searchParams.get('category') || ''
    const isVisibleParam = searchParams.get('isVisible')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    // Lọc theo ẩn hiện
    if (isVisibleParam === 'true') {
      where.isVisible = true
    } else if (isVisibleParam === 'false') {
      where.isVisible = false
    } else {
      // Đối với public mặc định chỉ hiển thị tài liệu visible
      const user = await verifyAuth(request)
      if (!user) {
        where.isVisible = true
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { fileName: { contains: search } },
      ]
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    const total = await prisma.document.count({ where })

    const documents = await prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return NextResponse.json({
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách tài liệu' }, { status: 500 })
  }
}

// POST: Tạo tài liệu mới (Yêu cầu admin/editor)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const {
      title,
      description,
      filePath,
      fileName,
      fileSize,
      fileType,
      categoryId,
      isVisible,
    } = await request.json()

    if (!title || !filePath || !fileName) {
      return NextResponse.json({ error: 'Thiếu thông tin tài liệu bắt buộc' }, { status: 400 })
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        filePath,
        fileName,
        fileSize: parseInt(fileSize) || 0,
        fileType,
        isVisible: isVisible !== false,
        categoryId: categoryId || null,
      },
    })

    // Ghi log
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'document',
        entityId: document.id,
        details: `Người dùng ${user.name} thêm tài liệu "${title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Create document error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
