import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'

const DEFAULT_SETTINGS = {
  aboutHistoryText: `Được thành lập từ năm 2015, Trường THPT Edison tọa lạc tại khu đô thị hiện đại với quy mô ban đầu chỉ gồm vài lớp học. Trải qua hơn một thập kỷ xây dựng và trưởng thành, nhà trường đã vươn lên thành một trong những điểm sáng của giáo dục phổ thông.

Edison tự hào sở hữu tỷ lệ học sinh đỗ tốt nghiệp luôn đạt 100%, tỷ lệ đỗ vào các trường đại học top đầu cả nước và du học đạt trên 85%. Nhiều thế hệ học sinh Edison đã ghi danh tại các kỳ thi học sinh giỏi cấp Thành phố và Quốc gia.`,
  aboutHistoryImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60',
  aboutVisionText: 'Trở thành ngôi trường THPT hàng đầu về đổi mới giáo dục, đào tạo ra những thế hệ công dân toàn cầu có tư duy độc lập, giàu lòng nhân ái và khả năng thích ứng cao với kỷ nguyên số.',
  aboutMissionText: 'Xây dựng môi trường giáo dục hạnh phúc và sáng tạo, khơi dậy tối đa tiềm năng riêng biệt của từng học sinh, trang bị đầy đủ kiến thức, kỹ năng sống và đạo đức để các em tự tin lập nghiệp.',
  aboutCoreValuesText: 'Khát vọng học hỏi - Tư duy sáng tạo - Trách nhiệm bản thân - Tôn trọng sự khác biệt - Tự hào nguồn cội dân tộc.',
  missionImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
  schoolName: 'EDISON SCHOOL MINH DUC',
  logoUrl: '/school-logo.jpg',
  phone: '024 1234 5678',
  email: 'contact@edison.edu.vn',
  address: 'Minh Đức, Mỹ Hào, Hưng Yên',
  defaultPostThumbnailUrl: '/uploads/thumbnails/tuyen-sinh-default.jpg',
  admissionQuotaHtml: `<ul style="display: flex; flex-direction: column; gap: var(--space-3); color: var(--color-gray-600); font-size: var(--font-size-sm); list-style: none; padding: 0; margin: 0;">
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Chỉ tiêu tuyển sinh:</strong> 450 học sinh khối 10 (chia làm 10 lớp học cơ bản và 2 lớp chất lượng cao định hướng IELTS).</span>
  </li>
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Đối tượng dự tuyển:</strong> Học sinh Việt Nam đã tốt nghiệp Trung học Cơ sở (THCS) theo quy định của Bộ Giáo dục & Đào tạo.</span>
  </li>
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Địa bàn tuyển sinh:</strong> Không giới hạn hộ khẩu thường trú (tuyển sinh học sinh toàn quốc).</span>
  </li>
</ul>`,
  admissionMethodsHtml: `<div style="display: flex; flex-direction: column; gap: var(--space-4);">
  <div style="padding-left: var(--space-2); border-left: 4px solid var(--color-primary);">
    <h3 style="font-size: var(--font-size-base); font-weight: 700; margin: 0 0 var(--space-1) 0; color: var(--color-gray-800);">Phương thức 1: Thi tuyển</h3>
    <p style="font-size: var(--font-size-sm); color: var(--color-gray-500); margin: 0;">
      Học sinh tham gia kỳ thi tuyển sinh lớp 10 THPT công lập chung do Sở GD&ĐT tổ chức (gồm 3 môn: Toán, Ngữ văn, Tiếng Anh). Nhà trường xét điểm trúng tuyển từ cao xuống thấp dựa trên điểm thi.
    </p>
  </div>
  <div style="padding-left: var(--space-2); border-left: 4px solid var(--color-gold);">
    <h3 style="font-size: var(--font-size-base); font-weight: 700; margin: 0 0 var(--space-1) 0; color: var(--color-gray-800);">Phương thức 2: Xét tuyển thẳng & Tuyển thẳng học bổng</h3>
    <p style="font-size: var(--font-size-sm); color: var(--color-gray-500); margin: 0;">
      Tuyển thẳng và cấp học bổng cho học sinh đạt giải Nhất, Nhì, Ba trong kỳ thi học sinh giỏi các môn văn hóa cấp Tỉnh/Thành phố trực thuộc Trung ương, hoặc học sinh có chứng chỉ tiếng Anh quốc tế IELTS đạt từ 6.5 trở lên.
    </p>
  </div>
</div>`,
  admissionTimelineHtml: `<div style="display: flex; flex-direction: column; gap: var(--space-4);">
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      01/05 - 15/06
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Phát hành và tiếp nhận hồ sơ đăng ký dự tuyển trực tuyến và trực tiếp.
    </div>
  </div>
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      18/06 - 20/06
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Thông báo danh sách học sinh đủ điều kiện trúng tuyển thẳng và xét tuyển đợt 1.
    </div>
  </div>
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      25/06 - 05/07
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Nhận hồ sơ nhập học chính thức cho học sinh trúng tuyển vào lớp 10.
    </div>
  </div>
</div>`,
  admissionStats: JSON.stringify([
    { value: '450', suffix: '+', label: 'Chỉ tiêu tuyển sinh', icon: 'GraduationCap' },
    { value: '10', suffix: '', label: 'Lớp học chính quy', icon: 'BookOpen' },
    { value: '98', suffix: '%', label: 'Tỷ lệ đỗ TN THPT', icon: 'Award' },
    { value: '2', suffix: '', label: 'Lớp CLC Quốc tế', icon: 'ShieldCheck' }
  ]),
  quickStats: JSON.stringify([
    { value: '1.500', suffix: '+', label: 'Học sinh đang theo học', icon: 'Users' },
    { value: '120', suffix: '+', label: 'Giáo viên chuyên môn', icon: 'UserCheck' },
    { value: '30', suffix: '+', label: 'Phòng học hiện đại', icon: 'BookOpen' },
    { value: '98', suffix: '%', label: 'Tỷ lệ đỗ Đại học', icon: 'GraduationCap' }
  ]),
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

    // 1. Lấy ảnh đại diện mặc định cũ trước khi lưu mới
    const oldDefaultSetting = await (prisma as any).setting.findUnique({
      where: { key: 'defaultPostThumbnailUrl' }
    })
    const oldDefaultUrl = oldDefaultSetting?.value || '/uploads/thumbnails/tuyen-sinh-default.jpg'

    // 2. Thực hiện lưu từng setting trong transaction
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        (prisma as any).setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )

    // 3. Nếu cấu hình defaultPostThumbnailUrl thay đổi, cập nhật các bài viết cũ
    if (settings.defaultPostThumbnailUrl) {
      const newDefaultUrl = String(settings.defaultPostThumbnailUrl)
      await prisma.post.updateMany({
        where: {
          OR: [
            { thumbnail: null },
            { thumbnail: '' },
            { thumbnail: oldDefaultUrl },
            { thumbnail: '/uploads/thumbnails/news-default.jpg' },
            { thumbnail: '/uploads/thumbnails/tuyen-sinh-default.jpg' },
          ]
        },
        data: {
          thumbnail: newDefaultUrl
        }
      })
    }

    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'setting',
        entityId: 'system',
        details: 'Cập nhật cấu hình hệ thống và cập nhật ảnh đại diện mặc định cho các bài viết cũ',
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json({ error: 'Lỗi lưu cấu hình hệ thống' }, { status: 500 })
  }
}
