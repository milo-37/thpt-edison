import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// POST: Public - Đăng ký nhận tin
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }
    const existing = await prisma.subscriber.findUnique({ where: { email } })
    if (existing) {
      if (!existing.isActive) {
        await prisma.subscriber.update({ where: { email }, data: { isActive: true, name } })
        return NextResponse.json({ success: true, message: 'Đã kích hoạt lại đăng ký nhận tin' })
      }
      return NextResponse.json({ error: 'Email này đã đăng ký nhận tin rồi' }, { status: 409 })
    }
    await prisma.subscriber.create({ data: { email, name } })
    return NextResponse.json({ success: true, message: 'Đăng ký nhận tin thành công!' })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi đăng ký' }, { status: 500 })
  }
}

// GET: Admin - Danh sách subscribers
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ subscribers })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải danh sách' }, { status: 500 })
  }
}

// DELETE: Admin - Xóa subscriber
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const { id } = await request.json()
    await prisma.subscriber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa subscriber' }, { status: 500 })
  }
}
