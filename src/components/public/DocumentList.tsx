'use client'

import { useState } from 'react'
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { formatFileSize, getFileIcon, formatDateVi } from '@/lib/validation'

interface DocumentProps {
  id: string
  title: string
  description: string | null
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
  downloadCount: number
  createdAt: string | Date
  category?: {
    name: string
  } | null
}

interface DocumentListProps {
  initialDocuments: DocumentProps[]
}

export default function DocumentList({ initialDocuments }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentProps[]>(initialDocuments)

  const handleDownload = async (id: string, filePath: string) => {
    try {
      // 1. Gọi API PATCH để tăng lượt tải lên
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'download' }),
      })

      if (res.ok) {
        const data = await res.json()
        // Cập nhật lại downloadCount trong state cục bộ
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === id ? { ...doc, downloadCount: data.downloadCount } : doc
          )
        )
      }
    } catch (err) {
      console.error('Tăng download count thất bại:', err)
    }

    // 2. Tiến hành tải tệp xuống trình duyệt bằng cách tạo thẻ a ảo
    const link = document.createElement('a')
    link.href = filePath
    link.download = filePath.substring(filePath.lastIndexOf('/') + 1)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (documents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-500)', border: '1px dashed var(--color-gray-300)', borderRadius: 'var(--radius-lg)' }}>
        <FileText size={36} style={{ margin: '0 auto var(--space-3) auto', opacity: 0.5 }} />
        <p>Kho tài liệu hiện chưa có tệp tin nào được đăng tải.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {documents.map((doc) => {
        const icon = getFileIcon(doc.fileType)
        return (
          <div
            key={doc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              background: 'var(--color-white)',
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-gray-100)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-base)'
            }}
            className="document-row"
          >
            {/* Cột Trái: Icon & Tên tài liệu */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-3xl)',
                  width: '50px',
                  height: '50px',
                  background: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-gray-800)', margin: 0 }}>
                  {doc.title}
                </h4>
                {doc.description && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0 }}>
                    {doc.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                  {doc.category && <span>Danh mục: {doc.category.name}</span>}
                  <span>Định dạng: {doc.fileType.toUpperCase()}</span>
                  <span>Dung lượng: {formatFileSize(doc.fileSize)}</span>
                  <span>Ngày đăng: {formatDateVi(doc.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Cột Phải: Lượt tải & Nút tải về */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ textAlign: 'right', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>
                <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--font-size-sm)' }}>
                  {doc.downloadCount}
                </span>
                <span>lượt tải</span>
              </div>
              
              <button
                onClick={() => handleDownload(doc.id, doc.filePath)}
                className="btn btn-primary"
                style={{ gap: 'var(--space-2)' }}
              >
                <Download size={16} />
                Tải xuống
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
