import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
import prisma from './lib/prisma'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Cho phép các tệp tĩnh, hình ảnh, tài liệu và các API public đi qua
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Lấy token từ cookie
  const token = request.cookies.get('auth-token')?.value

  // Kiểm tra tính hợp lệ của token
  let user = null
  if (token) {
    const payload = await verifyToken(token)
    if (payload) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: payload.id },
          select: { id: true, isActive: true }
        })
        if (dbUser && dbUser.isActive) {
          user = payload
        }
      } catch (error) {
        console.error('Proxy auth check error:', error)
      }
    }
  }

  // 2. Bảo vệ các tuyến đường Admin
  if (pathname.startsWith('/admin')) {
    // Nếu chưa đăng nhập và không phải trang login -> chuyển hướng về login
    if (!user && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(loginUrl)
      // Xóa cookie hết hạn/hỏng để tránh loop
      response.cookies.set({
        name: 'auth-token',
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0,
      })
      return response
    }

    // Nếu đã đăng nhập và truy cập trang login -> chuyển hướng về dashboard
    if (user && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  // 3. Bảo vệ các API quản trị (bắt đầu bằng /api/ và không phải public auth API)
  if (pathname.startsWith('/api/')) {
    const isPublicApi = 
      pathname.startsWith('/api/auth/login') ||
      pathname.startsWith('/api/auth/logout') ||
      (pathname === '/api/contacts' && request.method === 'POST') || // Gửi form liên hệ
      (pathname === '/api/posts' && request.method === 'GET') || // Đọc tin tức công khai
      (pathname.startsWith('/api/posts/') && request.method === 'GET') || // Đọc chi tiết tin tức
      (pathname === '/api/documents' && request.method === 'GET') || // Xem tài liệu công khai
      (pathname === '/api/gallery' && request.method === 'GET') || // Xem album công khai
      (pathname === '/api/events' && request.method === 'GET') // Xem lịch sự kiện công khai

    if (!isPublicApi && !user) {
      return NextResponse.json(
        { error: 'Bạn không có quyền truy cập. Vui lòng đăng nhập.' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
}
