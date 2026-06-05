// ==================== POST ====================

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  thumbnail?: string | null
  status: 'draft' | 'pending' | 'published' | 'rejected'
  metaTitle?: string | null
  metaDescription?: string | null
  isFeatured: boolean
  isPinned: boolean
  viewCount: number
  rejectionNote?: string | null
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  categoryId?: string | null
  author?: User
  category?: Category | null
  tags?: Tag[]
  attachments?: Attachment[]
}

// ==================== USER ====================

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'reviewer'
  avatar?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ==================== CATEGORY ====================

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  order: number
  createdAt: string
  _count?: { posts: number; documents: number }
}

// ==================== TAG ====================

export interface Tag {
  id: string
  name: string
  slug: string
}

// ==================== DOCUMENT ====================

export interface Document {
  id: string
  title: string
  description?: string | null
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
  isVisible: boolean
  downloadCount: number
  createdAt: string
  categoryId?: string | null
  category?: Category | null
}

// ==================== ALBUM & PHOTO ====================

export interface Album {
  id: string
  title: string
  description?: string | null
  coverImage?: string | null
  createdAt: string
  photos?: Photo[]
  _count?: { photos: number }
}

export interface Photo {
  id: string
  filePath: string
  caption?: string | null
  order: number
  createdAt: string
  albumId: string
}

// ==================== ATTACHMENT ====================

export interface Attachment {
  id: string
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
  postId: string
}

// ==================== CONTACT ====================

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  isRead: boolean
  isHandled: boolean
  createdAt: string
}

// ==================== EVENT ====================

export interface Event {
  id: string
  title: string
  description?: string | null
  startDate: string
  endDate?: string | null
  location?: string | null
  createdAt: string
}

// ==================== ACTIVITY LOG ====================

export interface ActivityLog {
  id: string
  action: string
  entity: string
  entityId?: string | null
  details?: string | null
  createdAt: string
  userId: string
  user?: User
}

// ==================== API RESPONSE ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ==================== DASHBOARD STATS ====================

export interface DashboardStats {
  totalPosts: number
  totalDocuments: number
  totalContacts: number
  totalUsers: number
  pendingPosts: number
  unreadContacts: number
  recentPosts: Post[]
  recentContacts: Contact[]
  recentActivities: ActivityLog[]
}
