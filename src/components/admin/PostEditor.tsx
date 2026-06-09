'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent, Node as TiptapNode, mergeAttributes } from '@tiptap/react'
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
import { Mark, Extension } from '@tiptap/core'
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
  AlignJustify,
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
  Smile,
  Search,
  Maximize2,
  Minimize2,
  ChevronDown,
  Baseline,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Sparkles,
  Loader2,
} from 'lucide-react'

// Custom YoutubeIcon since brand icons are not in this version of lucide-react
function YoutubeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9" fill="currentColor" />
    </svg>
  )
}


// =====================================================
// Custom TipTap Extensions for Rich Formatting
// =====================================================

// 1. Subscript
const Subscript = Mark.create({
  name: 'subscript',
  parseHTML() {
    return [
      { tag: 'sub' },
      { style: 'vertical-align', getAttrs: value => value === 'sub' && null },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['sub', mergeAttributes(HTMLAttributes), 0]
  },
})

// 2. Superscript
const Superscript = Mark.create({
  name: 'superscript',
  parseHTML() {
    return [
      { tag: 'sup' },
      { style: 'vertical-align', getAttrs: value => value === 'super' && null },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(HTMLAttributes), 0]
  },
})

// 3. FontSize
const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) {
            return {}
          }
          return { style: `font-size: ${attributes.size}` }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const hasSize = (element as HTMLElement).style.fontSize
          return hasSize ? {} : false
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

// 4. FontFamily
const FontFamily = Mark.create({
  name: 'fontFamily',
  addAttributes() {
    return {
      font: {
        default: null,
        parseHTML: element => element.style.fontFamily,
        renderHTML: attributes => {
          if (!attributes.font) {
            return {}
          }
          return { style: `font-family: ${attributes.font}` }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const hasFont = (element as HTMLElement).style.fontFamily
          return hasFont ? {} : false
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

// 5. LineHeight
const LineHeight = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
})

// 6. Text Color
const Color = Mark.create({
  name: 'color',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.color,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {}
          }
          return { style: `color: ${attributes.color}` }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const hasColor = (element as HTMLElement).style.color
          return hasColor ? {} : false
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

// 7. Highlight (Background Color)
const Highlight = Mark.create({
  name: 'highlight',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {}
          }
          return { style: `background-color: ${attributes.color}` }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const hasBg = (element as HTMLElement).style.backgroundColor
          return hasBg ? {} : false
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

// =====================================================
// Custom TipTap Iframe Node Extension (for PDF embed)
// =====================================================
const IframeExtension = TiptapNode.create({
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
type ModalType = null | 'link' | 'image' | 'youtube' | 'pdf' | 'emoji' | 'special-char' | 'search-replace'

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
// Constants for Dropdowns
// =====================================================
const FONT_FAMILIES = [
  { label: 'Mặc định (Inter)', value: "'Inter', sans-serif" },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
]

const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '13px', value: '13px' },
  { label: '14px (Bình thường)', value: '14px' },
  { label: '15px', value: '15px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
]

const LINE_HEIGHTS = [
  { label: 'Đơn (1.0)', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.3', value: '1.3' },
  { label: 'Trung bình (1.5)', value: '1.5' },
  { label: '1.8', value: '1.8' },
  { label: 'Kép (2.0)', value: '2' },
]

const COLOR_PALETTE = [
  '#000000', '#374151', '#4B5563', '#9CA3AF', '#D1D5DB', '#FFFFFF',
  '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2',
  '#F97316', '#FB923C', '#FDBA74', '#FFEDD5',
  '#FACC15', '#FDE047', '#FEF08A', '#FEF9C3',
  '#10B981', '#34D399', '#6EE7B7', '#D1FAE5',
  '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE',
  '#1E3A8A', '#2563EB', '#1D4ED8', '#1E40AF',
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#EDE9FE',
  '#EC4899', '#F472B6', '#F9A8D4', '#FCE7F3',
]

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
  '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
  '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
  '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
  '🎉', '🎁', '🎈', '🎆', '🎇', '🧨', '✨', '🌟', '🔔', '📢',
  '🔥', '💧', '☀️', '⭐', '❤️', '💔', '💖', '💗', '🎯', '🚀',
]

const SPECIAL_CHARS = [
  'Ω', 'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ψ', 'ω',
  '±', '×', '÷', '≠', '≈', '≤', '≥', '≡', '∞', '√', '∫', '∂', '∆', '∏',
  '°', '′', '″', '‰', '℃', '℉', '←', '→', '↑', '↓', '↔', '↕', '⇒', '⇔',
  '✓', '✗', '★', '☆', '♥', '♦', '♣', '♠', '▲', '▼', '◀', '▶', '●', '■',
  '©', '®', '™', '§', '¶', '†', '‡', '•', '–', '—', '“', '”', '‘', '’',
  '¼', '½', '¾', '⅓', '⅔', '⅛', '⅜', '⅝', '⅞', '¢', '£', '€', '¥', '元',
]

// =====================================================
// Main PostEditor Component
// =====================================================
interface PostEditorProps {
  value: string
  onChange: (html: string) => void
  onNormalize?: (data: { title?: string; excerpt?: string; slug?: string; contentHtml: string }) => void
  currentTitle?: string
  currentExcerpt?: string
}

export default function PostEditor({ value, onChange, onNormalize, currentTitle, currentExcerpt }: PostEditorProps) {
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Popover States
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  
  // Fullscreen State
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Normalization and Undo States
  const [isNormalizing, setIsNormalizing] = useState(false)
  const [prevContent, setPrevContent] = useState<string | null>(null)
  const [prevTitle, setPrevTitle] = useState<string | null>(null)
  const [prevExcerpt, setPrevExcerpt] = useState<string | null>(null)

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

  // Search & Replace state
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [replaceAll, setReplaceAll] = useState(false)

  // Refs for Color popovers
  const colorRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  // Handle outside click to close color pickers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(event.target as any)) {
        setShowColorPicker(false)
      }
      if (bgRef.current && !bgRef.current.contains(event.target as any)) {
        setShowBgColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      FontSize,
      FontFamily,
      LineHeight,
      Color,
      Highlight,
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

  // ========= Search and Replace Command =========
  const handleReplace = useCallback(() => {
    if (!editor || !findText) return
    const { state, view } = editor
    const { doc } = state
    const regex = new RegExp(findText, replaceAll ? 'g' : '')
    let transaction = state.tr
    let offset = 0
    let count = 0

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match
        const textContent = node.text
        while ((match = regex.exec(textContent)) !== null) {
          const start = pos + match.index + offset
          const end = start + findText.length
          transaction = transaction.replaceWith(start, end, state.schema.text(replaceText))
          offset += replaceText.length - findText.length
          count++
          if (!replaceAll) break
        }
      }
      if (!replaceAll && count > 0) return false
    })

    if (count > 0) {
      view.dispatch(transaction)
      closeModal()
      setFindText('')
      setReplaceText('')
    } else {
      alert('Không tìm thấy văn bản cần thay thế!')
    }
  }, [editor, findText, replaceText, replaceAll, closeModal])

  // ========= Insert Special Content =========
  const insertText = (text: string) => {
    if (!editor) return
    editor.chain().focus().insertContent(text).run()
    closeModal()
  }

  // ========= Content Normalization & Undo =========
  const handleNormalize = async () => {
    if (!editor) return

    setIsNormalizing(true)
    const currentHtml = editor.getHTML()

    try {
      const res = await fetch('/api/posts/normalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentHtml: currentHtml,
          title: currentTitle || '',
          excerpt: currentExcerpt || '',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi chuẩn hóa nội dung')
      }

      // Save previous state for Undo
      setPrevContent(currentHtml)
      setPrevTitle(currentTitle || '')
      setPrevExcerpt(currentExcerpt || '')

      // Update editor
      editor.commands.setContent(data.contentHtml)

      // Notify parent
      if (onNormalize) {
        onNormalize(data)
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi hệ thống khi chuẩn hóa')
    } finally {
      setIsNormalizing(false)
    }
  }

  const handleUndoNormalize = () => {
    if (!editor || !prevContent) return

    // Restore content
    editor.commands.setContent(prevContent)

    // Restore parent
    if (onNormalize) {
      onNormalize({
        contentHtml: prevContent,
        title: prevTitle || undefined,
        excerpt: prevExcerpt || undefined,
      })
    }

    // Clear state
    setPrevContent(null)
    setPrevTitle(null)
    setPrevExcerpt(null)
  }

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
      style={isFullScreen ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      } : {
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
          gap: '6px',
          padding: '8px 16px',
          borderBottom: '1px solid var(--color-gray-200)',
          background: 'var(--color-gray-50)',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Undo / Redo */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="btn-toolbar" title="Undo (Hoàn tác)"><Undo size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="btn-toolbar" title="Redo (Làm lại)"><Redo size={15} /></button>

        <div className="toolbar-separator" />

        {/* Headings / Format Select */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <select
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
            }
            onChange={(e) => {
              const val = e.target.value
              if (val === 'p') editor.chain().focus().setParagraph().run()
              else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
              else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
              else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
            }}
            style={{
              padding: '4px 24px 4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid var(--color-gray-300)',
              outline: 'none',
              background: 'var(--color-white)',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--color-gray-700)',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
              backgroundPosition: 'right 4px center',
              backgroundSize: '16px 16px',
              backgroundRepeat: 'no-repeat',
              minWidth: '95px'
            }}
            title="Định dạng văn bản"
          >
            <option value="p">Văn bản</option>
            <option value="h1">Tiêu đề lớn</option>
            <option value="h2">Tiêu đề trung</option>
            <option value="h3">Tiêu đề nhỏ</option>
          </select>
        </div>

        {/* Font Family Select */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            onChange={(e) => {
              const font = e.target.value
              if (font === 'default') editor.chain().focus().unsetMark('fontFamily').run()
              else editor.chain().focus().setMark('fontFamily', { font }).run()
            }}
            style={{
              padding: '4px 24px 4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid var(--color-gray-300)',
              outline: 'none',
              background: 'var(--color-white)',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--color-gray-700)',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
              backgroundPosition: 'right 4px center',
              backgroundSize: '16px 16px',
              backgroundRepeat: 'no-repeat',
              minWidth: '110px'
            }}
            title="Phông chữ"
          >
            <option value="default">Phông chữ</option>
            {FONT_FAMILIES.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>

        {/* Font Size Select */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            onChange={(e) => {
              const size = e.target.value
              if (size === 'default') editor.chain().focus().unsetMark('fontSize').run()
              else editor.chain().focus().setMark('fontSize', { size }).run()
            }}
            style={{
              padding: '4px 24px 4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid var(--color-gray-300)',
              outline: 'none',
              background: 'var(--color-white)',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--color-gray-700)',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
              backgroundPosition: 'right 4px center',
              backgroundSize: '16px 16px',
              backgroundRepeat: 'no-repeat',
              minWidth: '80px'
            }}
            title="Cỡ chữ"
          >
            <option value="default">Cỡ chữ</option>
            {FONT_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>

        {/* Line Height Select */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            onChange={(e) => {
              const height = e.target.value
              if (height === 'default') {
                editor.chain().focus().updateAttributes('paragraph', { lineHeight: null }).updateAttributes('heading', { lineHeight: null }).run()
              } else {
                editor.chain().focus().updateAttributes('paragraph', { lineHeight: height }).updateAttributes('heading', { lineHeight: height }).run()
              }
            }}
            style={{
              padding: '4px 24px 4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid var(--color-gray-300)',
              outline: 'none',
              background: 'var(--color-white)',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--color-gray-700)',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
              backgroundPosition: 'right 4px center',
              backgroundSize: '16px 16px',
              backgroundRepeat: 'no-repeat',
              minWidth: '95px'
            }}
            title="Giãn dòng"
          >
            <option value="default">Giãn dòng</option>
            {LINE_HEIGHTS.map(lh => (
              <option key={lh.value} value={lh.value}>{lh.label}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-separator" />

        {/* Formatting Buttons */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`btn-toolbar ${editor.isActive('bold') ? 'active' : ''}`} title="In đậm"><Bold size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn-toolbar ${editor.isActive('italic') ? 'active' : ''}`} title="In nghiêng"><Italic size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`btn-toolbar ${editor.isActive('underline') ? 'active' : ''}`} title="Gạch chân"><UnderlineIcon size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`btn-toolbar ${editor.isActive('strike') ? 'active' : ''}`} title="Gạch ngang"><Strikethrough size={15} /></button>

        {/* Subscript / Superscript */}
        <button type="button" onClick={() => editor.chain().focus().toggleMark('subscript').run()} className={`btn-toolbar ${editor.isActive('subscript') ? 'active' : ''}`} title="Chỉ số dưới (x₂)"><SubscriptIcon size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleMark('superscript').run()} className={`btn-toolbar ${editor.isActive('superscript') ? 'active' : ''}`} title="Chỉ số trên (x²)"><SuperscriptIcon size={15} /></button>

        <div className="toolbar-separator" />

        {/* Alignments */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`} title="Căn lề trái"><AlignLeft size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`} title="Căn lề giữa"><AlignCenter size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`} title="Căn lề phải"><AlignRight size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`btn-toolbar ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`} title="Căn đều 2 bên"><AlignJustify size={15} /></button>

        <div className="toolbar-separator" />

        {/* Color pickers */}
        <div style={{ position: 'relative' }} ref={colorRef}>
          <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="btn-toolbar" title="Màu chữ"><Baseline size={15} /></button>
          {showColorPicker && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-200)',
                zIndex: 100,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '4px',
                padding: '10px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                width: '170px'
              }}
            >
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setMark('color', { color }).run()
                    setShowColorPicker(false)
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  title={color}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetMark('color').run()
                  setShowColorPicker(false)
                }}
                className="btn btn-ghost btn-sm"
                style={{ gridColumn: 'span 6', fontSize: '11px', height: '24px', padding: '0 4px', marginTop: '4px' }}
              >
                Mặc định
              </button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={bgRef}>
          <button type="button" onClick={() => setShowBgColorPicker(!showBgColorPicker)} className="btn-toolbar" title="Màu nền chữ (Highlight)"><Highlighter size={15} /></button>
          {showBgColorPicker && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-200)',
                zIndex: 100,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '4px',
                padding: '10px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                width: '170px'
              }}
            >
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setMark('highlight', { color }).run()
                    setShowBgColorPicker(false)
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  title={color}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetMark('highlight').run()
                  setShowBgColorPicker(false)
                }}
                className="btn btn-ghost btn-sm"
                style={{ gridColumn: 'span 6', fontSize: '11px', height: '24px', padding: '0 4px', marginTop: '4px' }}
              >
                Mặc định
              </button>
            </div>
          )}
        </div>

        <div className="toolbar-separator" />

        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`btn-toolbar ${editor.isActive('bulletList') ? 'active' : ''}`} title="Danh sách không thứ tự"><List size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`btn-toolbar ${editor.isActive('orderedList') ? 'active' : ''}`} title="Danh sách số thứ tự"><ListOrdered size={15} /></button>

        <div className="toolbar-separator" />

        {/* Media, Links & Insertables */}
        <button type="button" onClick={openLinkModal} className={`btn-toolbar ${editor.isActive('link') ? 'active' : ''}`} title="Chèn liên kết"><LinkIcon size={15} /></button>
        <button type="button" onClick={openImageModal} className="btn-toolbar" title="Chèn hình ảnh"><ImageIcon size={15} /></button>
        <button type="button" onClick={openYoutubeModal} className="btn-toolbar" title="Nhúng video Youtube"><YoutubeIcon size={15} /></button>
        <button type="button" onClick={openPdfModal} className="btn-toolbar" title="Nhúng tài liệu PDF"><FileText size={15} /></button>
        <button type="button" onClick={addTable} className="btn-toolbar" title="Chèn bảng dữ liệu"><TableIcon size={15} /></button>
        {editor.isActive('table') && (
          <button type="button" onClick={deleteTable} className="btn-toolbar" title="Xóa bảng" style={{ color: 'var(--color-danger)' }}><Trash2 size={15} /></button>
        )}

        <div className="toolbar-separator" />

        {/* Emoji & Special Character & Search */}
        <button type="button" onClick={() => setActiveModal('emoji')} className="btn-toolbar" title="Chèn Emoji"><Smile size={15} /></button>
        <button type="button" onClick={() => setActiveModal('special-char')} className="btn-toolbar" title="Chèn ký tự đặc biệt" style={{ fontWeight: 800, fontSize: '14px', fontFamily: 'serif' }}>Ω</button>
        <button type="button" onClick={() => setActiveModal('search-replace')} className="btn-toolbar" title="Tìm kiếm & Thay thế"><Search size={15} /></button>

        <div className="toolbar-separator" />

        {/* Format Clear / Fullscreen / Actions */}
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="btn-toolbar" title="Xóa định dạng"><RemoveFormatting size={15} /></button>
        <button
          type="button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="btn-toolbar"
          title={isFullScreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
        >
          {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        {prevContent && (
          <>
            <div className="toolbar-separator" />
            <button
              type="button"
              onClick={handleUndoNormalize}
              className="btn-toolbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-navy)',
                gap: '4px',
                width: 'auto',
                padding: '0 8px',
                fontSize: '11px',
                fontWeight: 600,
              }}
              title="Hoàn tác nội dung trước khi chuẩn hóa"
            >
              <Undo size={13} />
              Hoàn tác chuẩn hóa
            </button>
          </>
        )}

        <div className="toolbar-separator" style={{ marginLeft: prevContent ? 'var(--space-1)' : 'auto' }} />

        <button
          type="button"
          onClick={handleNormalize}
          disabled={isNormalizing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
            color: 'var(--color-white)',
            border: 'none',
            cursor: isNormalizing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
          title="Tự động làm sạch định dạng rác và chuẩn hóa bài viết"
        >
          {isNormalizing ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Đang chuẩn hóa...
            </>
          ) : (
            <>
              <Sparkles size={12} />
              Chuẩn hóa
            </>
          )}
        </button>
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
        style={isFullScreen ? {
          padding: '24px',
          flex: 1,
          overflowY: 'auto',
          outline: 'none',
        } : {
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
              <span>Vần bản đã chọn: <strong style={{ color: 'var(--color-navy)' }}>{linkText}</strong></span>
            </div>
          )}

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
        icon={<Smile size={16} />}
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

      {/* ======== EMOJI MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'emoji'}
        title="Chèn biểu tượng cảm xúc (Emoji)"
        icon={<Smile size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
          {EMOJIS.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertText(emoji)}
              style={{
                fontSize: '22px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                transition: 'background 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover-bg-gray"
            >
              {emoji}
            </button>
          ))}
        </div>
      </EditorModal>

      {/* ======== SPECIAL CHARACTERS MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'special-char'}
        title="Chèn ký tự đặc biệt"
        icon={<span style={{ fontWeight: 800, fontFamily: 'serif' }}>Ω</span>}
        onClose={closeModal}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
          {SPECIAL_CHARS.map((char, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertText(char)}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                background: 'var(--color-gray-50)',
                border: '1px solid var(--color-gray-200)',
                cursor: 'pointer',
                padding: '8px 4px',
                borderRadius: '6px',
                transition: 'all 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover-bg-gray"
            >
              {char}
            </button>
          ))}
        </div>
      </EditorModal>

      {/* ======== SEARCH & REPLACE MODAL ======== */}
      <EditorModal
        isOpen={activeModal === 'search-replace'}
        title="Tìm kiếm & Thay thế"
        icon={<Search size={16} />}
        onClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ModalInput
            label="Tìm kiếm văn bản"
            value={findText}
            onChange={setFindText}
            placeholder="Nhập từ cần tìm..."
            icon={<Search size={14} />}
          />
          <ModalInput
            label="Thay thế bằng"
            value={replaceText}
            onChange={setReplaceText}
            placeholder="Nhập từ thay thế..."
            icon={<Type size={14} />}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="replace-all"
              checked={replaceAll}
              onChange={(e) => setReplaceAll(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="replace-all" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-gray-700)', cursor: 'pointer' }}>
              Thay thế tất cả các vị trí trùng khớp
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ fontSize: '13px' }}>
              Hủy
            </button>
            <button
              type="button"
              onClick={handleReplace}
              disabled={!findText}
              className="btn btn-primary"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <Check size={14} />
              Thay thế
            </button>
          </div>
        </div>
      </EditorModal>

      {/* ======== Inline styling helper ======== */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
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
          border: 1px solid transparent;
        }
        .btn-toolbar:hover {
          background: var(--color-gray-200);
          color: var(--color-gray-900);
          border-color: var(--color-gray-300);
        }
        .btn-toolbar.active {
          background: var(--color-navy);
          color: var(--color-gold);
          border-color: var(--color-navy-dark);
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
          padding: 6px 10px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: var(--color-gray-50);
        }
        .hover-bg-gray:hover {
          background: var(--color-gray-100) !important;
        }
      `}</style>
    </div>
  )
}
