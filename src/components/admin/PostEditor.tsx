'use client'

import { useState, useCallback } from 'react'
import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TiptapLink from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import FileUpload from './FileUpload'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  RemoveFormatting,
  FileText,
  Trash2,
  X,
  ExternalLink,
  Upload,
  Type,
  Globe,
  Check,
  Unlink,
} from 'lucide-react'

// =====================================================
// Custom YouTube SVG icon
// =====================================================
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" fill="currentColor" />
  </svg>
)

// =====================================================
// Custom TipTap Iframe Node Extension (for PDF embed)
// =====================================================
const IframeExtension = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: '600px' },
      frameborder: { default: '0' },
      allowfullscreen: { default: true },
      title: { default: 'Embedded document' },
    }
  },

  parseHTML() {
    return [{ tag: 'iframe' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'iframe-wrapper', style: 'position:relative;width:100%;margin:var(--space-4) 0;' },
      ['iframe', mergeAttributes(HTMLAttributes, {
        style: 'width:100%;height:600px;border:1px solid var(--color-gray-200);border-radius:var(--radius-md);',
      })],
    ]
  },
})

// =====================================================
// Modal Types
// =====================================================
type ModalType = null | 'link' | 'image' | 'youtube' | 'pdf'

// =====================================================
// Reusable Modal Wrapper Component
// =====================================================
function EditorModal({
  isOpen,
  title,
  icon,
  onClose,
  children,
}: {
  isOpen: boolean
  title: string
  icon: React.ReactNode
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.15s ease',
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '85vh',
          overflow: 'auto',
          zIndex: 9999,
          animation: 'scaleIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-gray-100)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(10, 75, 175, 0.08)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>
            <h3
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 700,
                color: 'var(--color-navy)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--color-gray-100)',
              color: 'var(--color-gray-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
            }}
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </>
  )
}

// =====================================================
// Styled Input helper
// =====================================================
function ModalInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  icon?: React.ReactNode
  type?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-gray-600)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-gray-400)',
              display: 'flex',
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '10px 12px 10px 38px' : '10px 12px',
            borderRadius: '12px',
            border: '1px solid var(--color-gray-200)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            transition: 'border-color 0.15s',
            background: 'var(--color-gray-50)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-gray-200)')}
        />
      </div>
    </div>
  )
}

// =====================================================
// Tab Switch helper
// =====================================================
function TabSwitch({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon: React.ReactNode }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--color-gray-100)',
        borderRadius: '12px',
        padding: '3px',
        gap: '2px',
        marginBottom: '16px',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: active === tab.id ? 'var(--color-white)' : 'transparent',
            color: active === tab.id ? 'var(--color-navy)' : 'var(--color-gray-500)',
            boxShadow: active === tab.id ? 'var(--shadow-sm)' : 'none',
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// =====================================================
// Main PostEditor Component
// =====================================================
interface PostEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function PostEditor({ value, onChange }: PostEditorProps) {
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Link modal state
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  // Image modal state
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  // YouTube modal state
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // PDF modal state
  const [pdfTab, setPdfTab] = useState<'upload' | 'url'>('upload')
  const [pdfUrl, setPdfUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'editor-youtube',
        },
      }),
      Placeholder.configure({
        placeholder: 'Viết nội dung bài viết của bạn ở đây...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      IframeExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // ========= Modal openers =========

  const openLinkModal = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')
    setLinkUrl(previousUrl)
    setLinkText(selectedText)
    setActiveModal('link')
  }, [editor])

  const openImageModal = useCallback(() => {
    setImageTab('upload')
    setImageUrl('')
    setImageAlt('')
    setActiveModal('image')
  }, [])

  const openYoutubeModal = useCallback(() => {
    setYoutubeUrl('')
    setActiveModal('youtube')
  }, [])

  const openPdfModal = useCallback(() => {
    setPdfTab('upload')
    setPdfUrl('')
    setActiveModal('pdf')
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  // ========= Modal confirmations =========

  const confirmLink = useCallback(() => {
    if (!editor) return
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    closeModal()
  }, [editor, linkUrl, closeModal])

  const removeLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    closeModal()
  }, [editor, closeModal])

  const confirmImage = useCallback(() => {
    if (!editor || !imageUrl) return
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || 'Hình ảnh bài viết' }).run()
    closeModal()
  }, [editor, imageUrl, imageAlt, closeModal])

  const confirmYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
    closeModal()
  }, [editor, youtubeUrl, closeModal])

  const confirmPdf = useCallback(() => {
    if (!editor || !pdfUrl) return
    editor.chain().focus().insertContent({
      type: 'iframe',
      attrs: {
        src: pdfUrl,
        width: '100%',
        height: '600px',
        title: 'Tài liệu PDF',
      },
    }).run()
    closeModal()
  }, [editor, pdfUrl, closeModal])

  // ========= YouTube helpers =========
  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    return match ? match[1] : null
  }
  const ytId = extractYoutubeId(youtubeUrl)
  const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run()
  }

  const addRowBefore = () => editor?.chain().focus().addRowBefore().run()
  const addRowAfter = () => editor?.chain().focus().addRowAfter().run()
  const addColumnBefore = () => editor?.chain().focus().addColumnBefore().run()
  const addColumnAfter = () => editor?.chain().focus().addColumnAfter().run()
  const deleteRow = () => editor?.chain().focus().deleteRow().run()
  const deleteColumn = () => editor?.chain().focus().deleteColumn().run()

  if (!editor) {
    return null
  }

  return (
    <div
      style={{
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-white)',
        overflow: 'hidden',
      }}
    >
      {/* ======== Rich Editor Toolbar ======== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: 'var(--space-2) var(--space-4)',
          borderBottom: '1px solid var(--color-gray-200)',
          background: 'var(--color-gray-50)',
          alignItems: 'center',
        }}
      >
        {/* Headings */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`btn-toolbar ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`} title="Tiêu đề lớn (H1)"><Heading1 size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`btn-toolbar ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`} title="Tiêu đề trung (H2)"><Heading2 size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`btn-toolbar ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`} title="Tiêu đề nhỏ (H3)"><Heading3 size={16} /></button>

        <div className="toolbar-separator" />

        {/* Formatting */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`btn-toolbar ${editor.isActive('bold') ? 'active' : ''}`} title="Đậm"><Bold size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn-toolbar ${editor.isActive('italic') ? 'active' : ''}`} title="Nghiêng"><Italic size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`btn-toolbar ${editor.isActive('underline') ? 'active' : ''}`} title="Gạch dưới"><UnderlineIcon size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`btn-toolbar ${editor.isActive('strike') ? 'active' : ''}`} title="Gạch ngang"><Strikethrough size={16} /></button>

        <div className="toolbar-separator" />

        {/* Alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`} title="Căn trái"><AlignLeft size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`} title="Căn giữa"><AlignCenter size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`} title="Căn phải"><AlignRight size={16} /></button>

        <div className="toolbar-separator" />

        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`btn-toolbar ${editor.isActive('bulletList') ? 'active' : ''}`} title="Danh sách dấu chấm"><List size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`btn-toolbar ${editor.isActive('orderedList') ? 'active' : ''}`} title="Danh sách số"><ListOrdered size={16} /></button>

        <div className="toolbar-separator" />

        {/* Media & Links */}
        <button type="button" onClick={openLinkModal} className={`btn-toolbar ${editor.isActive('link') ? 'active' : ''}`} title="Chèn liên kết"><LinkIcon size={16} /></button>
        <button type="button" onClick={openImageModal} className="btn-toolbar" title="Chèn hình ảnh"><ImageIcon size={16} /></button>
        <button type="button" onClick={openYoutubeModal} className="btn-toolbar" title="Nhúng video Youtube"><YoutubeIcon size={16} /></button>
        <button type="button" onClick={openPdfModal} className="btn-toolbar" title="Nhúng tài liệu PDF"><FileText size={16} /></button>
        <button type="button" onClick={addTable} className="btn-toolbar" title="Chèn bảng dữ liệu"><TableIcon size={16} /></button>
        {editor.isActive('table') && (
          <button type="button" onClick={deleteTable} className="btn-toolbar" title="Xóa bảng" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
        )}

        <div className="toolbar-separator" />

        {/* Utilities */}
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="btn-toolbar" title="Xóa định dạng"><RemoveFormatting size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="btn-toolbar" title="Undo (Hoàn tác)"><Undo size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="btn-toolbar" title="Redo (Làm lại)"><Redo size={16} /></button>
      </div>

      {/* ======== Table Operations Helper Toolbar ======== */}
      {editor.isActive('table') && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '6px 16px',
            borderBottom: '1px solid var(--color-gray-200)',
            background: 'rgba(10, 75, 175, 0.03)',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--color-navy)', marginRight: '8px' }}>
            Thao tác bảng:
          </span>
          <button type="button" onClick={addRowBefore} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}>
            + Thêm hàng trên
          </button>
          <button type="button" onClick={addRowAfter} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}>
            + Thêm hàng dưới
          </button>
          <button type="button" onClick={addColumnBefore} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}>
            + Thêm cột trái
          </button>
          <button type="button" onClick={addColumnAfter} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}>
            + Thêm cột phải
          </button>
          <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
          <button type="button" onClick={deleteRow} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px', color: 'var(--color-danger)' }}>
            Xóa hàng
          </button>
          <button type="button" onClick={deleteColumn} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px', color: 'var(--color-danger)' }}>
            Xóa cột
          </button>
          <button type="button" onClick={deleteTable} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', height: '24px', color: 'var(--color-danger)', fontWeight: 'bold' }}>
            Xóa bảng
          </button>
        </div>
      )}

      {/* ======== Editor Content Box ======== */}
      <div
        className="editor-content-area"
        style={{
          padding: 'var(--space-6)',
          minHeight: '350px',
          outline: 'none',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* ======== LINK MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'link'}
        title="Chèn liên kết"
        icon={<LinkIcon size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ModalInput
            label="Địa chỉ URL"
            value={linkUrl}
            onChange={setLinkUrl}
            placeholder="https://example.com"
            icon={<Globe size={14} />}
          />
          {linkText && (
            <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={12} />
              <span>Văn bản đã chọn: <strong style={{ color: 'var(--color-navy)' }}>{linkText}</strong></span>
            </div>
          )}

          {/* Preview */}
          {linkUrl && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(10, 75, 175, 0.04)',
                borderRadius: '12px',
                border: '1px solid rgba(10, 75, 175, 0.1)',
                fontSize: '13px',
                color: 'var(--color-primary)',
                overflow: 'hidden',
              }}
            >
              <ExternalLink size={14} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{linkUrl}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            {editor?.isActive('link') && (
              <button
                type="button"
                onClick={removeLink}
                className="btn btn-ghost"
                style={{ gap: '6px', color: 'var(--color-danger)', fontSize: '13px' }}
              >
                <Unlink size={14} />
                Xóa liên kết
              </button>
            )}
            <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ fontSize: '13px' }}>
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmLink}
              className="btn btn-primary"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <Check size={14} />
              Xác nhận
            </button>
          </div>
        </div>
      </EditorModal>

      {/* ======== IMAGE MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'image'}
        title="Chèn hình ảnh"
        icon={<ImageIcon size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TabSwitch
            tabs={[
              { id: 'upload', label: 'Upload ảnh', icon: <Upload size={13} /> },
              { id: 'url', label: 'Nhập URL', icon: <Globe size={13} /> },
            ]}
            active={imageTab}
            onChange={(id) => setImageTab(id as 'upload' | 'url')}
          />

          {imageTab === 'upload' ? (
            <FileUpload
              type="image"
              subDir="images"
              value={imageUrl}
              onUploadSuccess={(file) => {
                if (file.filePath) setImageUrl(file.filePath)
              }}
              label="Chọn hoặc kéo thả hình ảnh"
            />
          ) : (
            <ModalInput
              label="URL hình ảnh"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://example.com/image.jpg"
              icon={<Globe size={14} />}
            />
          )}

          <ModalInput
            label="Mô tả ảnh (alt text)"
            value={imageAlt}
            onChange={setImageAlt}
            placeholder="Mô tả ngắn nội dung hình ảnh"
            icon={<Type size={14} />}
          />

          {/* Preview */}
          {imageUrl && (
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--color-gray-200)',
                maxHeight: '180px',
              }}
            >
              <img
                src={imageUrl}
                alt={imageAlt || 'Preview'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ fontSize: '13px' }}>
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmImage}
              disabled={!imageUrl}
              className="btn btn-primary"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <Check size={14} />
              Chèn ảnh
            </button>
          </div>
        </div>
      </EditorModal>

      {/* ======== YOUTUBE MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'youtube'}
        title="Nhúng video YouTube"
        icon={<YoutubeIcon size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ModalInput
            label="URL video YouTube"
            value={youtubeUrl}
            onChange={setYoutubeUrl}
            placeholder="https://www.youtube.com/watch?v=..."
            icon={<Globe size={14} />}
          />

          {/* Thumbnail Preview */}
          {ytThumbnail && (
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--color-gray-200)',
                position: 'relative',
              }}
            >
              <img
                src={ytThumbnail}
                alt="YouTube thumbnail"
                style={{ width: '100%', display: 'block' }}
              />
              {/* Play button overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="10 8 16 12 10 16" /></svg>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Video ID: {ytId}
              </div>
            </div>
          )}

          {youtubeUrl && !ytId && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--color-danger)',
              }}
            >
              ⚠️ URL không hợp lệ. Vui lòng nhập đúng link YouTube (youtube.com/watch?v=... hoặc youtu.be/...)
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ fontSize: '13px' }}>
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmYoutube}
              disabled={!ytId}
              className="btn btn-primary"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <Check size={14} />
              Nhúng video
            </button>
          </div>
        </div>
      </EditorModal>

      {/* ======== PDF EMBED MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'pdf'}
        title="Nhúng tài liệu PDF"
        icon={<FileText size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TabSwitch
            tabs={[
              { id: 'upload', label: 'Upload PDF', icon: <Upload size={13} /> },
              { id: 'url', label: 'Nhập URL', icon: <Globe size={13} /> },
            ]}
            active={pdfTab}
            onChange={(id) => setPdfTab(id as 'upload' | 'url')}
          />

          {pdfTab === 'upload' ? (
            <FileUpload
              type="document"
              subDir="documents"
              value={pdfUrl}
              fileName={pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1)}
              onUploadSuccess={(file) => {
                if (file.filePath) setPdfUrl(file.filePath)
              }}
              label="Upload file PDF"
            />
          ) : (
            <ModalInput
              label="URL tài liệu PDF"
              value={pdfUrl}
              onChange={setPdfUrl}
              placeholder="https://example.com/document.pdf"
              icon={<Globe size={14} />}
            />
          )}

          {/* Preview */}
          {pdfUrl && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: 'rgba(10, 75, 175, 0.04)',
                borderRadius: '12px',
                border: '1px solid rgba(10, 75, 175, 0.1)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1) || 'document.pdf'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>
                  Tài liệu sẽ được nhúng dưới dạng iframe xem trực tiếp
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ fontSize: '13px' }}>
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmPdf}
              disabled={!pdfUrl}
              className="btn btn-primary"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <Check size={14} />
              Nhúng tài liệu
            </button>
          </div>
        </div>
      </EditorModal>

      {/* ======== Inline styling helper ======== */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 350px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--color-gray-400);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .btn-toolbar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--color-gray-600);
          background: transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-toolbar:hover {
          background: var(--color-gray-200);
          color: var(--color-gray-900);
        }
        .btn-toolbar.active {
          background: var(--color-navy);
          color: var(--color-gold);
        }
        .toolbar-separator {
          width: 1px;
          height: 20px;
          background: var(--color-gray-300);
          margin: 0 var(--space-1);
        }
        .editor-link {
          color: var(--color-primary);
          text-decoration: underline;
          cursor: pointer;
        }
        .editor-image {
          max-width: 100%;
          border-radius: var(--radius-md);
          margin: var(--space-4) auto;
        }
        .editor-youtube {
          max-width: 100%;
          aspect-ratio: 16/9;
          border-radius: var(--radius-md);
          margin: var(--space-4) auto;
        }
        .iframe-wrapper {
          position: relative;
          width: 100%;
          margin: var(--space-4) 0;
        }
        .iframe-wrapper iframe {
          width: 100%;
          height: 600px;
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md);
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror table td, .ProseMirror table th {
          min-width: 1em;
          border: 2px solid var(--color-gray-200);
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: var(--color-gray-50);
        }
      `}</style>
    </div>
  )
}
