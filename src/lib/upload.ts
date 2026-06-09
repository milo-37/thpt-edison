import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { createHash } from 'crypto'

// Các loại file được phép upload
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']

// Giới hạn dung lượng
const MAX_IMAGE_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || '5242880') // 5MB
const MAX_DOCUMENT_SIZE = parseInt(process.env.MAX_DOCUMENT_SIZE || '20971520') // 20MB

// Các extension nguy hiểm không được phép
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.vbs', '.js', '.ws', '.wsf',
  '.scr', '.pif', '.msi', '.msp', '.mst', '.cpl', '.hta', '.inf',
  '.ins', '.isp', '.jse', '.lnk', '.reg', '.rgs', '.sct', '.shb',
  '.shs', '.vbe', '.vb', '.wsc', '.wsh', '.php', '.asp', '.aspx',
  '.jsp', '.cgi', '.py', '.pl', '.sh', '.ps1',
]

export interface UploadResult {
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
}

/**
 * Xác thực file upload
 */
export function validateFile(
  file: File,
  type: 'image' | 'document'
): { valid: boolean; error?: string } {
  const ext = path.extname(file.name).toLowerCase()
  
  // Kiểm tra extension nguy hiểm
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Loại file không được phép upload' }
  }

  if (type === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Chỉ chấp nhận file ảnh JPG, PNG, WEBP, GIF' }
    }
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return { valid: false, error: 'Định dạng file ảnh không hợp lệ' }
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: `Dung lượng ảnh tối đa ${MAX_IMAGE_SIZE / 1024 / 1024}MB` }
    }
  } else {
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return { valid: false, error: 'Chỉ chấp nhận file PDF, DOC, DOCX, XLS, XLSX' }
    }
    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(ext)) {
      return { valid: false, error: 'Định dạng file tài liệu không hợp lệ' }
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      return { valid: false, error: `Dung lượng tài liệu tối đa ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB` }
    }
  }

  return { valid: true }
}

/**
 * Lưu file vào thư mục uploads
 */
export async function saveFile(
  file: File,
  subDir: 'images' | 'documents' | 'thumbnails'
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir)
  
  // Tạo thư mục nếu chưa có
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Đọc file buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Tính mã hash SHA-256 từ nội dung file để phát hiện tệp trùng lặp
  const hash = createHash('sha256').update(buffer).digest('hex')
  const ext = path.extname(file.name).toLowerCase()
  const uniqueName = `${hash}${ext}`
  const filePath = path.join(uploadDir, uniqueName)

  // Chỉ ghi file lên ổ đĩa nếu file chưa tồn tại
  if (!existsSync(filePath)) {
    await writeFile(filePath, buffer)
  }

  return {
    filePath: `/uploads/${subDir}/${uniqueName}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: ext.replace('.', ''),
  }
}

