import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

const DEFAULT_SETTINGS = {
  missionImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
  schoolName: 'EDISON SCHOOL MINH DUC',
  logoUrl: '/school-logo.jpg',
  phone: '024 1234 5678',
  email: 'contact@edison.edu.vn',
  address: 'Minh Đức, Mỹ Hào, Hưng Yên',
}

// GET: Lấy cấu hình hệ thống (Công khai)
export async function GET() {
  try {
    const settingsList = await (prisma as any).setting.findMany()
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS }
    
    settingsList.forEach((s: any) => {
      settings[s.key] = s.value
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Lỗi tải cấu hình hệ thống' }, { status: 500 })
  }
}

// POST: Lưu/Cập nhật cấu hình hệ thống (Yêu cầu quyền admin/editor)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Không có quyền thực hiện thao tác này' }, { status: 403 })
    }

    const { settings } = await request.json()
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
    }

    // Thực hiện lưu từng setting trong transaction
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        (prisma as any).setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )

    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'setting',
        entityId: 'system',
        details: 'Cập nhật cấu hình hệ thống',
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json({ error: 'Lỗi lưu cấu hình hệ thống' }, { status: 500 })
  }
}
