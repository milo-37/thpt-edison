/**
 * Validation utilities - Kiểm tra dữ liệu đầu vào
 */

// Sanitize HTML để chống XSS
// Cho phép iframe từ các nguồn đáng tin cậy (YouTube, Google Drive, nội bộ)
export function sanitizeHtml(html: string): string {
  // Danh sách domain được phép sử dụng iframe
  const trustedIframeDomains = [
    'youtube.com',
    'youtube-nocookie.com',
    'www.youtube.com',
    'www.youtube-nocookie.com',
    'drive.google.com',
    'docs.google.com',
  ]

  // Bước 1: Tạm thời bảo vệ các iframe đáng tin cậy bằng placeholder
  const iframePlaceholders: string[] = []
  let protectedHtml = html.replace(
    /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
    (match) => {
      // Trích xuất src từ thẻ iframe
      const srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i)
      if (srcMatch) {
        const src = srcMatch[1]
        // Kiểm tra URL nội bộ (/uploads/...)
        const isInternalUpload = src.startsWith('/uploads/')
        // Kiểm tra domain tin cậy
        const isTrustedDomain = trustedIframeDomains.some((domain) => {
          try {
            const url = new URL(src)
            return url.hostname === domain || url.hostname.endsWith('.' + domain)
          } catch {
            return false
          }
        })

        if (isInternalUpload || isTrustedDomain) {
          const placeholderIndex = iframePlaceholders.length
          iframePlaceholders.push(match)
          return `__SAFE_IFRAME_${placeholderIndex}__`
        }
      }
      return '' // Loại bỏ iframe không đáng tin cậy
    }
  )

  // Bước 2: Cũng bảo vệ các iframe tự đóng (self-closing) đáng tin cậy
  protectedHtml = protectedHtml.replace(
    /<iframe\b[^>]*\/?\s*>/gi,
    (match) => {
      const srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i)
      if (srcMatch) {
        const src = srcMatch[1]
        const isInternalUpload = src.startsWith('/uploads/')
        const isTrustedDomain = trustedIframeDomains.some((domain) => {
          try {
            const url = new URL(src)
            return url.hostname === domain || url.hostname.endsWith('.' + domain)
          } catch {
            return false
          }
        })
        if (isInternalUpload || isTrustedDomain) {
          const placeholderIndex = iframePlaceholders.length
          iframePlaceholders.push(match)
          return `__SAFE_IFRAME_${placeholderIndex}__`
        }
      }
      return '' // Loại bỏ iframe không đáng tin cậy
    }
  )

  // Bước 3: Loại bỏ các thẻ nguy hiểm còn lại (script, object, embed, form, v.v.)
  const dangerousTags = /<\s*(script|object|embed|form|meta|link|style|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi
  const selfClosingDangerous = /<\s*(script|object|embed|form|meta|link|base)[^>]*\/?>/gi
  const eventHandlers = /\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
  const jsUrls = /javascript\s*:/gi

  let clean = protectedHtml
    .replace(dangerousTags, '')
    .replace(selfClosingDangerous, '')
    .replace(eventHandlers, '')
    .replace(jsUrls, '')

  // Bước 4: Khôi phục các iframe đáng tin cậy từ placeholder
  iframePlaceholders.forEach((iframe, index) => {
    clean = clean.replace(`__SAFE_IFRAME_${index}__`, iframe)
  })

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
