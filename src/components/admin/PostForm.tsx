'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Send, Eye, Check, X, Paperclip } from 'lucide-react'
import Link from 'next/link'
import PostEditor from './PostEditor'
import FileUpload from './FileUpload'
import Toast, { ToastMessage } from './Toast'

interface Category {
  id: string
  name: string
}

interface PostFormProps {
  postId?: string // Truyền vào nếu là chỉnh sửa
}

export default function PostForm({ postId }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [tagsInput, setTagsInput] = useState('')
  const [postStatus, setPostStatus] = useState('draft')
  const [rejectionNote, setRejectionNote] = useState('')
  const [attachments, setAttachments] = useState<{ id?: string; fileName: string; filePath: string; fileSize: number; fileType: string }[]>([])

  // Load User info
  useEffect(() => {
    fetch('/api/auth/me', {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user)
      })
  }, [])

  // Load Categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories)
      })
  }, [])

  // Load Post data if in Edit Mode
  useEffect(() => {
    if (!postId) return

    setLoading(true)
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          const p = data.post
          setTitle(p.title)
          setContent(p.content)
          setExcerpt(p.excerpt || '')
          setThumbnail(p.thumbnail || '')
          setCategoryId(p.categoryId || '')
          setIsFeatured(p.isFeatured)
          setIsPinned(p.isPinned)
          setPostStatus(p.status)
          setRejectionNote(p.rejectionNote || '')
          if (p.tags) {
            setTagsInput(p.tags.map((t: any) => t.name).join(', '))
          }
          if (p.attachments) {
            setAttachments(p.attachments)
          }
        } else {
          showToast('error', 'Không tìm thấy bài viết')
        }
      })
      .catch(() => showToast('error', 'Lỗi tải thông tin bài viết'))
      .finally(() => setLoading(false))
  }, [postId])

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const handleSave = async (status: 'draft' | 'pending' | 'published') => {
    if (!title) {
      showToast('warning', 'Vui lòng nhập tiêu đề bài viết')
      return
    }
    if (!content) {
      showToast('warning', 'Vui lòng nhập nội dung bài viết')
      return
    }

    setLoading(true)

    // Xử lý chuỗi tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const postData = {
      title,
      content,
      excerpt,
      thumbnail,
      categoryId,
      status,
      isFeatured,
      isPinned,
      tags,
      attachments,
    }

    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const method = postId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Lưu bài viết thất bại')
      }

      showToast('success', postId ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết mới thành công!')
      
      // Redirect về danh sách bài viết sau 1 giây
      setTimeout(() => {
        router.push('/admin/posts')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Form */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Link href="/admin/posts" className="btn btn-ghost btn-icon" title="Quay lại">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
              {postId ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
              {postId ? 'Cập nhật nội dung bài viết và thuộc tính đăng.' : 'Tạo bài viết mới và gửi xét duyệt.'}
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Nút lưu nháp */}
          <button
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="btn btn-outline"
            style={{ color: 'var(--color-gray-700)', borderColor: 'var(--color-gray-300)', gap: '6px' }}
          >
            <Save size={16} />
            Lưu nháp
          </button>

          {/* Nút gửi duyệt */}
          <button
            onClick={() => handleSave('pending')}
            disabled={loading}
            className="btn btn-primary"
            style={{ background: 'var(--color-primary-dark)', gap: '6px' }}
          >
            <Send size={16} />
            Gửi xét duyệt
          </button>

          {/* Nút xuất bản trực tiếp (Chỉ Admin/Reviewer được xuất bản ngay) */}
          {currentUser && ['admin', 'reviewer'].includes(currentUser.role) && (
            <button
              onClick={() => handleSave('published')}
              disabled={loading}
              className="btn btn-success"
              style={{ gap: '6px' }}
            >
              <Check size={16} />
              Xuất bản ngay
            </button>
          )}
        </div>
      </div>

      {/* Lý do từ chối bài viết (nếu bị từ chối) */}
      {postStatus === 'rejected' && rejectionNote && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', color: '#991b1b' }}>
          <h4 style={{ fontWeight: 700, margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-sm)' }}>
            ⚠️ Bài viết bị từ chối duyệt với lý do:
          </h4>
          <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, opacity: 0.9 }}>{rejectionNote}</p>
        </div>
      )}

      {/* Grid Layout chính */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-8)' }}>
        
        {/* Cột trái: Form Soạn thảo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Tiêu đề */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề hấp dẫn..."
              style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-base)', fontWeight: 600 }}
            />
          </div>

          {/* Tóm tắt */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
              Mô tả ngắn (Trích dẫn)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Nhập mô tả tóm tắt ngắn cho bài viết..."
              style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)', resize: 'vertical' }}
            />
          </div>

          {/* Soạn thảo nội dung */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
              Nội dung bài viết *
            </label>
            {/* Vì TipTap load content không đổi sau khi mounting, ta chỉ render khi content đã sẵn sàng (chế độ edit) */}
            {(!postId || content) && (
              <PostEditor
                value={content}
                onChange={(html) => setContent(html)}
                currentTitle={title}
                currentExcerpt={excerpt}
                onNormalize={(data) => {
                  if (data.title && (!title || title.trim() === '')) {
                    setTitle(data.title)
                  }
                  if (data.excerpt && (!excerpt || excerpt.trim() === '')) {
                    setExcerpt(data.excerpt)
                  }
                  if (data.contentHtml !== undefined) {
                    setContent(data.contentHtml)
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Cột phải: Thuộc tính bài viết */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Thẻ Ảnh Đại Diện */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)' }}>
              Ảnh đại diện bài viết
            </h3>
            <FileUpload
              type="image"
              subDir="thumbnails"
              value={thumbnail}
              onUploadSuccess={(file) => setThumbnail(file.filePath)}
              label="Chọn hoặc kéo thả ảnh"
            />
          </div>

          {/* Phân loại & Tags */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Cấu hình phân loại
            </h3>

            {/* Danh mục */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                Danh mục bài viết
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Thẻ tags */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                Thẻ từ khóa (Tags)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="toán học, tin tức, học sinh"
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', display: 'block', marginTop: '2px' }}>
                Các từ khóa ngăn cách bởi dấu phẩy.
              </span>
            </div>
          </div>

          {/* Thuộc tính Ghim / Đặc trưng */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Cài đặt hiển thị
            </h3>

            {/* Checkbox featured */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Bài viết đặc trưng nổi bật</span>
            </label>

            {/* Checkbox Pinned */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Ghim lên trên đầu tin tức</span>
            </label>
          </div>

          {/* Section đính kèm tài liệu */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Tài liệu đính kèm (PDF, Word...)
            </h3>
            <FileUpload
              type="document"
              subDir="documents"
              value=""
              onUploadSuccess={(file) => {
                if (file.filePath) {
                  setAttachments((prev) => [...prev, file])
                }
              }}
              label="Upload file đính kèm"
            />
            
            {attachments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-2)' }}>
                {attachments.map((att, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-100)', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', flex: 1 }}>
                      <Paperclip size={14} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={att.fileName}>
                        {att.fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
