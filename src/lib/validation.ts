/**
 * Validation utilities - Kiểm tra dữ liệu đầu vào
 */

// Sanitize HTML để chống XSS
export function sanitizeHtml(html: string): string {
  // Loại bỏ các thẻ script, iframe, object, embed, form
  const dangerousTags = /<\s*(script|iframe|object|embed|form|meta|link|style|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi
  const selfClosingDangerous = /<\s*(script|iframe|object|embed|form|meta|link|base)[^>]*\/?>/gi
  const eventHandlers = /\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
  const jsUrls = /javascript\s*:/gi

  let clean = html
    .replace(dangerousTags, '')
    .replace(selfClosingDangerous, '')
    .replace(eventHandlers, '')
    .replace(jsUrls, '')

  return clean
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone (Vietnam format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
  return phoneRegex.test(phone.replace(/[\s.-]/g, ''))
}

// Validate password strength
export function isStrongPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 chữ hoa' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 chữ thường' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 1 chữ số' }
  }
  return { valid: true }
}

// Tạo slug từ tiếng Việt
export function createSlug(text: string): string {
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  }

  let slug = text.toLowerCase()
  
  // Replace Vietnamese chars
  for (const [vn, en] of Object.entries(vietnameseMap)) {
    slug = slug.replace(new RegExp(vn, 'g'), en)
  }

  // Replace uppercase Vietnamese
  const upperMap: Record<string, string> = {}
  for (const [vn, en] of Object.entries(vietnameseMap)) {
    upperMap[vn.toUpperCase()] = en
  }
  for (const [vn, en] of Object.entries(upperMap)) {
    slug = slug.replace(new RegExp(vn, 'g'), en)
  }

  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-')          // Thay khoảng trắng bằng -
    .replace(/-+/g, '-')           // Loại bỏ dấu - thừa
    .replace(/^-|-$/g, '')         // Loại bỏ - đầu/cuối

  return slug
}

// Validate required fields
export function validateRequired(data: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    const value = data[field]
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      return `Trường "${field}" là bắt buộc`
    }
  }
  return null
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Strip HTML tags để tạo excerpt
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

// Format date tiếng Việt
export function formatDateVi(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTimeVi(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Lấy icon tương ứng với loại file
 */
export function getFileIcon(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'xls':
    case 'xlsx':
      return '📊'
    default:
      return '📎'
  }
}

/**
 * Format dung lượng file
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
