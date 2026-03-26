// src/types/index.ts
// TypeScript type definitions

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  email: string
  phone?: string
  photoUrl?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  features: string[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  description: string
  imageUrl?: string
  technologies: string[]
  clientName?: string
  projectUrl?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl?: string
  author?: string
  readTime?: string
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QuoteRequest {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget?: string
  description: string
  status: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
  source: string
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PortalUser {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  role: 'client' | 'admin'
  isActive: boolean
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
  progress: number
  startDate?: Date
  endDate?: Date
  budget?: number
  currency: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  description: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidDate?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatbotLead {
  id: string
  name: string
  email: string
  phone?: string
  projectDescription?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  createdAt: Date
  updatedAt: Date
}
