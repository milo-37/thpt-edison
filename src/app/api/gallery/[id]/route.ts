import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// PUT: Cập nhật album ảnh
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

    const album = await prisma.album.findUnique({ where: { id } })
    if (!album) {
      return NextResponse.json({ error: 'Album không tồn tại' }, { status: 404 })
    }

    const { title, description, coverImage, photos = [] } = await request.json()
    if (!title) {
      return NextResponse.json({ error: 'Tiêu đề album là bắt buộc' }, { status: 400 })
    }

    // Cập nhật thông tin album và xóa toàn bộ ảnh cũ rồi ghi ảnh mới
    await prisma.$transaction([
      prisma.photo.deleteMany({
        where: { albumId: id },
      }),
      prisma.album.update({
        where: { id },
        data: {
          title,
          description,
          coverImage,
          photos: {
            create: photos.map((p: any, idx: number) => ({
              filePath: p.filePath,
              caption: p.caption || '',
              order: parseInt(p.order) || idx,
            })),
          },
        },
      }),
    ])

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'album',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật album ảnh "${title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Cập nhật album thành công' })
  } catch (error) {
    console.error('Update album error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa album ảnh
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa album' }, { status: 403 })
    }

    const album = await prisma.album.findUnique({ where: { id } })
    if (!album) {
      return NextResponse.json({ error: 'Album không tồn tại' }, { status: 404 })
    }

    // Xóa album (Prisma Cascade delete đã cấu hình ở schema sẽ tự xóa các Photo liên quan)
    await prisma.album.delete({ where: { id } })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'album',
        entityId: id,
        details: `Người dùng ${user.name} xóa album ảnh "${album.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa album thành công' })
  } catch (error) {
    console.error('Delete album error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
