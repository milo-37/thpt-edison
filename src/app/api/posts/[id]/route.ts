import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAuth, requireRole } from '@/lib/auth'
import { createSlug } from '@/lib/validation'

// GET: Lấy chi tiết bài viết (hoặc tăng viewCount)
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)
    const incView = searchParams.get('incView') === 'true'

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        tags: {
          select: { name: true },
        },
        attachments: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
    }

    // Nếu bài viết chưa xuất bản thì yêu cầu auth
    if (post.status !== 'published') {
      const user = await verifyAuth(request)
      if (!user) {
        return NextResponse.json({ error: 'Bạn không có quyền xem bài viết này' }, { status: 403 })
      }
    }

    // Tăng lượt xem nếu được yêu cầu
    if (incView && post.status === 'published') {
      await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json({ error: 'Lỗi tải bài viết' }, { status: 500 })
  }
}

// PUT: Cập nhật bài viết
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

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
    }

    // Kiểm tra quyền sửa bài: Editor chỉ được sửa bài của mình
    if (user.role === 'editor' && post.authorId !== user.id) {
      return NextResponse.json({ error: 'Bạn không có quyền sửa bài viết của người khác' }, { status: 403 })
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
      attachments,
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 })
    }

    // Cập nhật slug mới nếu đổi tiêu đề
    let slug = post.slug
    if (title !== post.title) {
      let baseSlug = createSlug(title)
      slug = baseSlug
      let suffix = 1
      while (true) {
        const existing = await prisma.post.findFirst({
          where: { slug, id: { not: id } },
        })
        if (!existing) break
        slug = `${baseSlug}-${suffix}`
        suffix++
      }
    }

    // Xác định trạng thái mới
    let finalStatus = post.status
    if (status) {
      if (user.role === 'editor') {
        // Editor cập nhật bài viết sẽ chuyển về nháp hoặc chờ duyệt
        finalStatus = status === 'pending' ? 'pending' : 'draft'
      } else {
        // Admin, Reviewer có quyền duyệt xuất bản trực tiếp
        finalStatus = status
      }
    }

    // Xử lý Tags (disconnect tất cả cũ và connect/create mới)
    const tagsConnectOrCreate = tags.map((tagName: string) => {
      const tagSlug = createSlug(tagName)
      return {
        where: { name: tagName },
        create: { name: tagName, slug: tagSlug },
      }
    })

    // Lưu phiên bản chỉnh sửa vào PostRevision
    await prisma.postRevision.create({
      data: {
        title: post.title,
        content: post.content,
        editedBy: user.name,
        postId: id,
      },
    })

    // Resolve thumbnail: fallback to defaultPostThumbnailUrl from system settings if missing
    let finalThumbnail = thumbnail
    if (!finalThumbnail || finalThumbnail.trim() === '') {
      const defaultSetting = await (prisma as any).setting.findUnique({
        where: { key: 'defaultPostThumbnailUrl' }
      })
      finalThumbnail = defaultSetting?.value || '/uploads/thumbnails/tuyen-sinh-default.jpg'
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        thumbnail: finalThumbnail,
        status: finalStatus,
        isFeatured: !!isFeatured,
        isPinned: !!isPinned,
        publishedAt: finalStatus === 'published' && post.status !== 'published' ? new Date() : post.publishedAt,
        categoryId: categoryId || null,
        tags: {
          set: [], // Xóa kết nối cũ
          connectOrCreate: tagsConnectOrCreate,
        },
      },
    })

    // Cập nhật file đính kèm nếu có
    if (attachments !== undefined) {
      await prisma.attachment.deleteMany({ where: { postId: id } })
      if (attachments.length > 0) {
        await prisma.attachment.createMany({
          data: attachments.map((att: any) => ({
            filePath: att.filePath,
            fileName: att.fileName,
            fileSize: att.fileSize || 0,
            fileType: att.fileType || 'pdf',
            postId: id,
          })),
        })
      }
    }

    // Ghi log hoạt động
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'post',
        entityId: id,
        details: `Người dùng ${user.name} cập nhật bài viết "${title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, post: updatedPost })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi cập nhật bài viết' }, { status: 500 })
  }
}

// DELETE: Xóa bài viết
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
    }

    // Kiểm tra quyền xóa: Chỉ Admin hoặc chính tác giả bài viết đó (nếu là editor) mới được xóa
    if (user.role === 'editor' && post.authorId !== user.id) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa bài viết này' }, { status: 403 })
    }

    await prisma.post.delete({
      where: { id },
    })

    // Ghi log hoạt động
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'post',
        entityId: id,
        details: `Người dùng ${user.name} xóa bài viết "${post.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Xóa bài viết thành công' })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi xóa bài viết' }, { status: 500 })
  }
}

// PATCH: Thay đổi trạng thái bài viết nhanh (Duyệt/Từ chối bài viết dành cho Admin/Reviewer)
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await verifyAuth(request)
    if (!user || !requireRole(user, ['admin', 'reviewer'])) {
      return NextResponse.json({ error: 'Chỉ Admin hoặc Reviewer mới có quyền duyệt bài' }, { status: 403 })
    }

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
    }

    const { status, note } = await request.json()

    if (!['published', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Trạng thái duyệt không hợp lệ' }, { status: 400 })
    }

    const dataToUpdate: any = {
      status,
      rejectionNote: status === 'rejected' ? note : null,
    }

    if (status === 'published') {
      dataToUpdate.publishedAt = new Date()
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    })

    // Log revision nếu từ chối hoặc duyệt
    await prisma.postRevision.create({
      data: {
        title: post.title,
        content: post.content,
        note: note || (status === 'published' ? 'Đã phê duyệt xuất bản' : ''),
        editedBy: user.name,
        postId: id,
      },
    })

    // Ghi log hoạt động
    await prisma.activityLog.create({
      data: {
        action: status === 'published' ? 'publish' : 'reject',
        entity: 'post',
        entityId: id,
        details: status === 'published' 
          ? `Người dùng ${user.name} duyệt xuất bản bài viết "${post.title}"` 
          : `Người dùng ${user.name} từ chối bài viết "${post.title}" với lý do: "${note}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, post: updatedPost })
  } catch (error) {
    console.error('Patch post error:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi cập nhật trạng thái bài viết' }, { status: 500 })
  }
}
