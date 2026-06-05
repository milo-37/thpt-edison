import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const all = searchParams.get('all') === 'true'
    const where: any = all ? {} : { isActive: true }
    if (category) where.category = category
    const faqs = await prisma.faq.findMany({ where, orderBy: { order: 'asc' } })
    return NextResponse.json({ faqs })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tải FAQ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    const { question, answer, category, order, isActive } = await request.json()
    if (!question || !answer) return NextResponse.json({ error: 'Câu hỏi và câu trả lời là bắt buộc' }, { status: 400 })
    const faq = await prisma.faq.create({
      data: { question, answer, category: category || 'general', order: order || 0, isActive: isActive !== false },
    })
    return NextResponse.json({ success: true, faq })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm FAQ' }, { status: 500 })
  }
}
