import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { validateFile, saveFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Chỉ các tài khoản đã đăng nhập mới được upload file
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để upload file' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as 'image' | 'document') || 'image'
    const subDir = (formData.get('subDir') as 'images' | 'documents' | 'thumbnails') || 'images'

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file upload' }, { status: 400 })
    }

    // Xác thực định dạng và dung lượng file
    const validation = validateFile(file, type)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Lưu file vào thư mục local
    const uploadResult = await saveFile(file, subDir)

    return NextResponse.json({
      success: true,
      file: uploadResult,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Lỗi tải lên file' },
      { status: 500 }
    )
  }
}
