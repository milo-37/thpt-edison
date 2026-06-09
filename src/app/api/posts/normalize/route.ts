import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { normalizeContent } from '@/lib/contentNormalizer'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập. Vui lòng đăng nhập để thực hiện.' }, { status: 401 })
    }

    // 2. Parse request payload
    const { contentHtml, title, excerpt } = await request.json()

    if (contentHtml === undefined || contentHtml === null) {
      return NextResponse.json({ error: 'Nội dung bài viết là bắt buộc' }, { status: 400 })
    }

    // 3. Perform normalization
    const result = await normalizeContent(contentHtml, title, excerpt)

    // 4. Return results
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Normalize error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi chuẩn hóa nội dung' }, { status: 500 })
  }
}
