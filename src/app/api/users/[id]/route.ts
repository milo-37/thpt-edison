import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole, hashPassword } from '@/lib/auth'
import { isStrongPassword } from '@/lib/validation'

// PUT: Cập nhật thông tin tài khoản
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    // Người dùng chỉ được tự sửa thông tin của mình, hoặc Admin sửa thông tin của mọi người
    if (user.role !== 'admin' && user.id !== id) {
      return NextResponse.json({ error: 'Bạn không có quyền sửa tài khoản này' }, { status: 403 })
    }

    const { name, role, isActive, avatar } = await request.json()
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 404 })
    }

    const dataToUpdate: any = {}
    if (name) dataToUpdate.name = name
    if (avatar !== undefined) dataToUpdate.avatar = avatar

    // Quyền hạn nâng cao chỉ Admin được đổi
    if (user.role === 'admin') {
      if (role) dataToUpdate.role = role
      if (isActive !== undefined) {
        // Tránh Admin tự khóa tài khoản của mình
        if (id === user.id && isActive === false) {
          return NextResponse.json({ error: 'Bạn không thể tự khóa tài khoản Admin của mình' }, { status: 400 })
        }
        dataToUpdate.isActive = !!isActive
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'user',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật thông tin tài khoản của ${updatedUser.name}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// PATCH: Đổi mật khẩu
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    // Chỉ Admin hoặc chính chủ tài khoản mới được đổi mật khẩu
    if (user.role !== 'admin' && user.id !== id) {
      return NextResponse.json({ error: 'Không có quyền thực hiện' }, { status: 403 })
    }

    const { newPassword } = await request.json()
    if (!newPassword) {
      return NextResponse.json({ error: 'Mật khẩu mới là bắt buộc' }, { status: 400 })
    }

    const checkPassword = isStrongPassword(newPassword)
    if (!checkPassword.valid) {
      return NextResponse.json({ error: checkPassword.error }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'user',
        entityId: id,
        details: `Người dùng ${user.name} thay đổi mật khẩu tài khoản`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}

// DELETE: Xóa tài khoản
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin'])) {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa tài khoản' }, { status: 403 })
    }

    // Không được tự xóa tài khoản của chính mình
    if (id === user.id) {
      return NextResponse.json({ error: 'Bạn không thể tự xóa tài khoản của chính mình' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 404 })
    }

    // Không được xóa tài khoản admin mặc định
    if (targetUser.email === 'admin@thpt.edu.vn') {
      return NextResponse.json({ error: 'Không thể xóa tài khoản Admin hệ thống' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    // Log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'user',
        entityId: id,
        details: `Admin ${user.name} xóa tài khoản của "${targetUser.name}" (${targetUser.email})`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa tài khoản thành công' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
