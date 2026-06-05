import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// PUT: Cập nhật slide
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    const { title, subtitle, imageUrl, linkUrl, order, isActive } = await request.json()
    const slide = await prisma.slide.update({
      where: { id },
      data: { title, subtitle, imageUrl, linkUrl, order, isActive },
    })

    return NextResponse.json({ success: true, slide })
  } catch (error) {
    console.error('Update slide error:', error)
    return NextResponse.json({ error: 'Lỗi cập nhật slide' }, { status: 500 })
  }
}

// DELETE: Xóa slide
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    await prisma.slide.delete({ where: { id } })

    await prisma.activityLog.create({
      data: { action: 'delete', entity: 'slide', entityId: id, details: `Xóa slide`, userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete slide error:', error)
    return NextResponse.json({ error: 'Lỗi xóa slide' }, { status: 500 })
  }
}
