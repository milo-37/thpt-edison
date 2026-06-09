import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'
import { isValidEmail, isValidPhone } from '@/lib/validation'

// GET: Lấy danh sách liên hệ (Admin)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const isHandledParam = searchParams.get('isHandled')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    const typeParam = searchParams.get('type')
    if (typeParam === 'admission') {
      where.subject = {
        contains: 'Tuyển sinh'
      }
    } else if (typeParam === 'contact') {
      where.subject = {
        not: {
          contains: 'Tuyển sinh'
        }
      }
    }

    if (isHandledParam === 'true') {
      where.isHandled = true
    } else if (isHandledParam === 'false') {
      where.isHandled = false
    }

    const total = await prisma.contact.count({ where })

    const contacts = await prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách liên hệ' }, { status: 500 })
  }
}

// POST: Gửi liên hệ mới (Public)
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ các trường bắt buộc' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Địa chỉ email không hợp lệ' }, { status: 400 })
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không đúng định dạng Việt Nam' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi gửi liên hệ' }, { status: 500 })
  }
}
