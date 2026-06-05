import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (user) {
      // Ghi log hoạt động logout
      await prisma.activityLog.create({
        data: {
          action: 'logout',
          entity: 'user',
          entityId: user.id,
          details: `Người dùng ${user.name} đăng xuất khỏi hệ thống`,
          userId: user.id,
        },
      })
    }

    const response = NextResponse.json({ success: true, message: 'Đăng xuất thành công' })
    
    // Xóa cookie bằng cách set maxAge = 0
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống' },
      { status: 500 }
    )
  }
}
