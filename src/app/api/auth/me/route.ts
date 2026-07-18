import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAuth(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      )
    }

    // Tìm lại user trong DB để lấy thông tin mới nhất
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại hoặc đã bị khóa' },
        { 
          status: 403,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      )
    }

    return NextResponse.json(
      { user },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống' },
      { status: 500 }
    )
  }
}
