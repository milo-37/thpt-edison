import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// PATCH: Cập nhật ẩn hiện hoặc tăng downloadCount
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const { action, isVisible } = await request.json()

    // Trường hợp 1: Tăng lượt tải (Public)
    if (action === 'download') {
      const document = await prisma.document.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      })
      return NextResponse.json({ success: true, downloadCount: document.downloadCount })
    }

    // Trường hợp 2: Cập nhật ẩn hiện (Yêu cầu admin/editor)
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const document = await prisma.document.update({
      where: { id },
      data: { isVisible: !!isVisible },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'document',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật trạng thái hiển thị của tài liệu "${document.title}" thành ${isVisible}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Patch document error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// PUT: Cập nhật toàn bộ thông tin tài liệu
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

    const body = await request.json()
    const { title, description, categoryId, isVisible, filePath, fileName, fileSize, fileType } = body

    if (!title) {
      return NextResponse.json({ error: 'Tiêu đề tài liệu không được để trống' }, { status: 400 })
    }

    const updateData: any = {
      title,
      description,
      categoryId: categoryId || null,
      isVisible: isVisible !== undefined ? !!isVisible : undefined,
    }

    if (filePath) {
      updateData.filePath = filePath
      updateData.fileName = fileName
      updateData.fileSize = fileSize
      updateData.fileType = fileType
    }

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    })

    // Log hoạt động
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'document',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật tài liệu "${document.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Put document error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa tài liệu
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa tài liệu' }, { status: 403 })
    }

    const document = await prisma.document.findUnique({ where: { id } })
    if (!document) {
      return NextResponse.json({ error: 'Tài liệu không tồn tại' }, { status: 404 })
    }

    await prisma.document.delete({ where: { id } })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'document',
        entityId: id,
        details: `Người dùng ${user.name} xóa tài liệu "${document.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa tài liệu thành công' })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
