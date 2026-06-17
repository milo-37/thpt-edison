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
      <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
        <FileText size={36} style={{ margin: '0 auto var(--space-3) auto', opacity: 0.5, color: '#6366f1' }} />
        <p>Kho tài liệu hiện chưa có tệp tin nào được đăng tải.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <style>{`
        .document-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          padding: 20px 24px;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.01);
          transition: all 0.25s ease;
        }
        .document-row:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.05);
          background: #ffffff;
        }
        .download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 700;
          font-size: 13px;
          color: white;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }
        .download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(99, 102, 241, 0.25);
          opacity: 0.95;
        }
      `}</style>
      {documents.map((doc) => {
        const icon = getFileIcon(doc.fileType)
        return (
          <div
            key={doc.id}
            className="document-row"
          >
            {/* Cột Trái: Icon & Tên tài liệu */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-3xl)',
                  width: '50px',
                  height: '50px',
                  background: 'rgba(99, 102, 241, 0.06)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1'
                }}
              >
                {icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
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
                <span style={{ display: 'block', fontWeight: 800, color: 'var(--color-navy)', fontSize: 'var(--font-size-sm)' }}>
                  {doc.downloadCount}
                </span>
                <span>lượt tải</span>
              </div>
              
              <button
                onClick={() => handleDownload(doc.id, doc.filePath)}
                className="download-btn"
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
