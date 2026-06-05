import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { createSlug } from '@/lib/validation'

// GET: Lấy danh sách bài viết
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categorySlug = searchParams.get('category') || ''
    const status = searchParams.get('status') || 'published'
    const isFeatured = searchParams.get('featured') === 'true'
    const isPinned = searchParams.get('pinned') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Kiểm tra quyền nếu muốn xem bài viết nháp/chờ duyệt
    if (status !== 'published') {
      const user = await verifyAuth(request)
      if (!user) {
        return NextResponse.json({ error: 'Vui lòng đăng nhập để xem bài viết nháp' }, { status: 401 })
      }
    }

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ]
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    if (isFeatured) {
      where.isFeatured = true
    }

    if (isPinned) {
      where.isPinned = true
    }

    // Lấy tổng số lượng để phân trang
    const total = await prisma.post.count({ where })

    // Query dữ liệu
    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: {
          select: { name: true, slug: true },
        },
      },
    })

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Lỗi tải danh sách bài viết' }, { status: 500 })
  }
}

// POST: Tạo bài viết mới
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const {
      title,
      content,
      excerpt,
      thumbnail,
      categoryId,
      status,
      isFeatured,
      isPinned,
      tags = [],
      attachments = [],
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 })
    }

    // Tạo slug độc nhất
    let baseSlug = createSlug(title)
    let slug = baseSlug
    let suffix = 1
    while (true) {
      const existing = await prisma.post.findUnique({ where: { slug } })
      if (!existing) break
      slug = `${baseSlug}-${suffix}`
      suffix++
    }

    // Xác định trạng thái của bài viết dựa vào quyền hạn
    let finalStatus = 'draft'
    if (status) {
      if (user.role === 'editor') {
        // Biên tập viên chỉ được tạo nháp hoặc gửi chờ duyệt
        finalStatus = status === 'pending' ? 'pending' : 'draft'
      } else {
        // Admin & Reviewer có thể publish trực tiếp
        finalStatus = status
      }
    }

    // Chuẩn bị dữ liệu Tags
    const tagsConnectOrCreate = tags.map((tagName: string) => {
      const tagSlug = createSlug(tagName)
      return {
        where: { name: tagName },
        create: { name: tagName, slug: tagSlug },
      }
    })

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        thumbnail,
        status: finalStatus,
        isFeatured: !!isFeatured,
        isPinned: !!isPinned,
        publishedAt: finalStatus === 'published' ? new Date() : null,
        authorId: user.id,
        categoryId: categoryId || null,
        tags: {
          connectOrCreate: tagsConnectOrCreate,
        },
      },
    })

    // Tạo các file đính kèm nếu có
    if (attachments.length > 0) {
      await prisma.attachment.createMany({
        data: attachments.map((att: any) => ({
          filePath: att.filePath,
          fileName: att.fileName,
          fileSize: att.fileSize || 0,
          fileType: att.fileType || 'pdf',
          postId: post.id,
        })),
      })
    }

    // Ghi log hoạt động
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'post',
        entityId: post.id,
        details: `Người dùng ${user.name} tạo bài viết "${title}" ở trạng thái ${finalStatus}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tạo bài viết' }, { status: 500 })
  }
}
