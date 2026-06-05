'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
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
  RemoveFormatting
} from 'lucide-react'

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" fill="currentColor" />
  </svg>
)

interface PostEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function PostEditor({ value, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
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
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  // Action Helpers
  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Nhập địa chỉ URL liên kết:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('Nhập địa chỉ URL hình ảnh:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addYoutube = () => {
    const url = window.prompt('Nhập địa chỉ URL video YouTube:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div
      style={{
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-white)',
        overflow: 'hidden'
      }}
    >
      {/* Rich Editor Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: 'var(--space-2) var(--space-4)',
          borderBottom: '1px solid var(--color-gray-200)',
          background: 'var(--color-gray-50)',
          alignItems: 'center'
        }}
      >
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`btn-toolbar ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
          title="Tiêu đề lớn (H1)"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`btn-toolbar ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          title="Tiêu đề trung (H2)"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`btn-toolbar ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          title="Tiêu đề nhỏ (H3)"
        >
          <Heading3 size={16} />
        </button>

        <div className="toolbar-separator" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn-toolbar ${editor.isActive('bold') ? 'active' : ''}`}
          title="Đậm"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn-toolbar ${editor.isActive('italic') ? 'active' : ''}`}
          title="Nghiêng"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`btn-toolbar ${editor.isActive('underline') ? 'active' : ''}`}
          title="Gạch dưới"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`btn-toolbar ${editor.isActive('strike') ? 'active' : ''}`}
          title="Gạch ngang"
        >
          <Strikethrough size={16} />
        </button>

        <div className="toolbar-separator" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`btn-toolbar ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
          title="Căn trái"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`btn-toolbar ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
          title="Căn giữa"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`btn-toolbar ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
          title="Căn phải"
        >
          <AlignRight size={16} />
        </button>

        <div className="toolbar-separator" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn-toolbar ${editor.isActive('bulletList') ? 'active' : ''}`}
          title="Danh sách dấu chấm"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn-toolbar ${editor.isActive('orderedList') ? 'active' : ''}`}
          title="Danh sách số"
        >
          <ListOrdered size={16} />
        </button>

        <div className="toolbar-separator" />

        {/* Media & Links */}
        <button
          type="button"
          onClick={addLink}
          className={`btn-toolbar ${editor.isActive('link') ? 'active' : ''}`}
          title="Chèn liên kết"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="btn-toolbar"
          title="Chèn hình ảnh từ URL"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addYoutube}
          className="btn-toolbar"
          title="Nhúng video Youtube"
        >
          <YoutubeIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addTable}
          className="btn-toolbar"
          title="Chèn bảng dữ liệu"
        >
          <TableIcon size={16} />
        </button>

        <div className="toolbar-separator" />

        {/* Utilities */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="btn-toolbar"
          title="Xóa định dạng"
        >
          <RemoveFormatting size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="btn-toolbar"
          title="Undo (Hoàn tác)"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="btn-toolbar"
          title="Redo (Làm lại)"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content Box */}
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

      {/* Inline styling helper */}
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
