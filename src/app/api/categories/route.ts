import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'
import { createSlug } from '@/lib/validation'

// GET: Lấy danh sách danh mục (Public)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: true, documents: true },
        },
      },
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh mục' }, { status: 500 })
  }
}

// POST: Tạo danh mục mới (Chỉ dành cho admin/editor)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { name, description, order } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Tên danh mục là bắt buộc' }, { status: 400 })
    }

    const slug = createSlug(name)
    // Kiểm tra trùng slug
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Danh mục này đã tồn tại' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        order: order ? parseInt(order) : 0,
      },
    })

    // Ghi log
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'category',
        entityId: category.id,
        details: `Người dùng ${user.name} tạo danh mục "${name}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
