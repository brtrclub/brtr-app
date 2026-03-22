// Core types for the brtr.club platform

export type UserRole = "super_admin" | "company_admin" | "user"

export interface User {
  id: string
  username: string
  password: string // In production, this would be hashed
  name: string
  email: string
  role: UserRole
  companyId: string | null // null for super_admin
  photoUrl?: string | null
  initials: string
  color: "amber" | "copper" | "silver"
}

export interface Company {
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  industry: string
  createdAt: string
}

export interface Mentor {
  id: string
  name: string
  initials: string
  email: string
  headline: string
  company: string
  linkedIn: string
  photoUrl: string | null
  expertise: string[]
  assignedCompanies: string[] // company IDs
}

export interface TeamMember {
  id: string
  userId: string
  companyId: string
  name: string
  initials: string
  role: string
  focus: string
  color: "amber" | "copper" | "silver"
  photoUrl?: string | null
  isLead?: boolean
}
