import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

// GET: Lấy danh sách album ảnh (Public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')

    // Nếu truyền albumId, trả về thông tin chi tiết của album đó bao gồm tất cả các ảnh trong album
    if (albumId) {
      const album = await prisma.album.findUnique({
        where: { id: albumId },
        include: {
          photos: {
            orderBy: { order: 'asc' },
          },
        },
      })
      if (!album) {
        return NextResponse.json({ error: 'Album không tồn tại' }, { status: 404 })
      }
      return NextResponse.json({ album })
    }

    // Nếu không truyền, trả về danh sách tất cả các album
    const albums = await prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    })

    return NextResponse.json({ albums })
  } catch (error) {
    console.error('Get gallery error:', error)
    return NextResponse.json({ error: 'Lỗi tải album ảnh' }, { status: 500 })
  }
}

// POST: Tạo album mới (Yêu cầu admin/editor)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { title, description, coverImage, photos = [] } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Tiêu đề album là bắt buộc' }, { status: 400 })
    }

    const album = await prisma.album.create({
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
      include: {
        photos: true,
      },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'album',
        entityId: album.id,
        details: `Người dùng ${user.name} tạo album ảnh "${title}" với ${photos.length} ảnh`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, album })
  } catch (error) {
    console.error('Create album error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
