import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole, hashPassword } from '@/lib/auth'
import { isValidEmail, isStrongPassword } from '@/lib/validation'

// GET: Lấy danh sách người dùng (Chỉ dành cho Admin)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xem danh sách này' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách người dùng' }, { status: 500 })
  }
}

// POST: Tạo người dùng mới (Chỉ dành cho Admin)
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAuth(request)
    if (!adminUser || !requireRole(adminUser, ['admin'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { email, password, name, role } = await request.json()

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ các thông tin' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Địa chỉ email không hợp lệ' }, { status: 400 })
    }

    const checkPassword = isStrongPassword(password)
    if (!checkPassword.valid) {
      return NextResponse.json({ error: checkPassword.error }, { status: 400 })
    }

    // Kiểm tra email tồn tại
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Địa chỉ email này đã được sử dụng' }, { status: 400 })
    }

    if (!['admin', 'editor', 'reviewer'].includes(role)) {
      return NextResponse.json({ error: 'Vai trò không hợp lệ' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isActive: true,
      },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'user',
        entityId: user.id,
        details: `Admin ${adminUser.name} tạo tài khoản mới "${name}" (${email}) với vai trò ${role}`,
        userId: adminUser.id,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tạo tài khoản' }, { status: 500 })
  }
}
