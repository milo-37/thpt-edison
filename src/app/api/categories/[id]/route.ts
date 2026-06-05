import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'
import { createSlug } from '@/lib/validation'

// PUT: Cập nhật danh mục
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { name, description, order } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Tên danh mục là bắt buộc' }, { status: 400 })
    }

    // Kiểm tra danh mục tồn tại
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 })
    }

    const slug = createSlug(name)
    // Kiểm tra trùng slug với danh mục khác
    if (slug !== existing.slug) {
      const duplicate = await prisma.category.findUnique({ where: { slug } })
      if (duplicate) {
        return NextResponse.json({ error: 'Tên danh mục mới bị trùng lặp' }, { status: 400 })
      }
    }

    const category = await prisma.category.update({
      where: { id },
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
        action: 'update',
        entity: 'category',
        entityId: category.id,
        details: `Người dùng ${user.name} cập nhật danh mục thành "${name}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa danh mục
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa danh mục' }, { status: 403 })
    }

    // Kiểm tra xem danh mục có đang chứa bài viết hay tài liệu nào không
    const countData = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true, documents: true },
        },
      },
    })

    if (!countData) {
      return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 })
    }

    if (countData._count.posts > 0 || countData._count.documents > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa danh mục đang chứa bài viết hoặc tài liệu' },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    // Ghi log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'category',
        entityId: id,
        details: `Người dùng ${user.name} xóa danh mục "${countData.name}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa danh mục thành công' })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
