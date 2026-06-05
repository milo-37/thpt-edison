import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, signToken, checkRateLimit } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

  // Kiểm tra rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 1 phút.' },
      { status: 429 }
    )
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ email và mật khẩu' },
        { status: 400 }
      )
    }

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      )
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      )
    }

    // Ký JWT Token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
    const token = await signToken(payload)

    // Tạo log hoạt động
    await prisma.activityLog.create({
      data: {
        action: 'login',
        entity: 'user',
        entityId: user.id,
        details: `Người dùng ${user.name} đăng nhập thành công`,
        userId: user.id,
      },
    })

    // Phản hồi thành công và set httpOnly Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống' },
      { status: 500 }
    )
  }
}
