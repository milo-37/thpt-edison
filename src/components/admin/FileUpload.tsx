'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatFileSize, getFileIcon } from '@/lib/validation'

interface FileUploadProps {
  onUploadSuccess: (file: { filePath: string; fileName: string; fileSize: number; fileType: string }) => void
  type: 'image' | 'document'
  subDir: 'images' | 'documents' | 'thumbnails'
  value?: string // URL file hiện tại nếu có
  fileName?: string // Tên file gốc hiện tại nếu có
  label?: string
}

export default function FileUpload({
  onUploadSuccess,
  type,
  subDir,
  value = '',
  fileName = '',
  label = 'Kéo thả tệp tin hoặc click để chọn tệp',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [currentFileUrl, setCurrentFileUrl] = useState(value)
  const [currentFileName, setCurrentFileName] = useState(fileName)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentFileUrl(value)
    if (!value) {
      setCurrentFileName('')
    }
  }, [value])

  useEffect(() => {
    setCurrentFileName(fileName)
  }, [fileName])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('subDir', subDir)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Tải file lên thất bại')
      }

      const uploaded = data.file
      setCurrentFileUrl(uploaded.filePath)
      setCurrentFileName(uploaded.fileName)
      onUploadSuccess(uploaded)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Lỗi kết nối khi tải file')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setCurrentFileUrl('')
    setCurrentFileName('')
    onUploadSuccess({ filePath: '', fileName: '', fileSize: 0, fileType: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {/* Upload Zone */}
      {!currentFileUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          style={{
            border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
            background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--color-gray-50)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            position: 'relative'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            style={{ display: 'none' }}
            accept={type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx'}
          />

          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', fontWeight: 500 }}>Đang tải tệp lên...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Upload size={32} style={{ color: 'var(--color-gray-400)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                {label}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>
                {type === 'image' ? 'JPG, PNG, WEBP, GIF tối đa 5MB' : 'PDF, Word, Excel tối đa 20MB'}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* File Preview */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            border: '1px solid var(--color-success)',
            background: 'rgba(16, 185, 129, 0.03)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', overflow: 'hidden' }}>
            {type === 'image' ? (
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', flexShrink: 0 }}>
                <img src={currentFileUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize: 'var(--font-size-2xl)', width: '48px', height: '48px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                📄
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentFileName || currentFileUrl.substring(currentFileUrl.lastIndexOf('/') + 1)}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-success-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                Đã tải lên thành công
              </span>
            </div>
          </div>

          <button
            onClick={handleRemoveFile}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  )
}
