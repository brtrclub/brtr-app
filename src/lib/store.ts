// Simple in-memory store for demo purposes
// In production, this would be replaced with database calls

import { User, Company, Mentor, TeamMember } from "./types"

// Initial data
const initialCompanies: Company[] = [
  {
    id: "quickreply",
    name: "QuickReply.ai",
    slug: "quickreply",
    logoUrl: null,
    industry: "SaaS",
    createdAt: "2024-01-15",
  },
]

const initialMentors: Mentor[] = [
  {
    id: "haider",
    name: "Haider Ali",
    initials: "HA",
    email: "haider@brtr.club",
    headline: "Revenue & Operations",
    company: "Shoops",
    linkedIn: "https://www.linkedin.com/in/haider-alikhan/",
    photoUrl: null,
    expertise: ["Revenue Operations", "Sales Strategy", "Process Optimization", "GTM"],
    assignedCompanies: ["quickreply"],
  },
]

const initialUsers: User[] = [
  // Super Admin
  {
    id: "admin",
    username: "admin",
    password: "brtr2024", // Demo password
    name: "brtr Admin",
    email: "admin@brtr.club",
    role: "super_admin",
    companyId: null,
    initials: "BA",
    color: "copper",
  },
  // QuickReply.ai Admin
  {
    id: "qr-admin",
    username: "quickreply-admin",
    password: "qr2024",
    name: "QuickReply Admin",
    email: "admin@quickreply.ai",
    role: "company_admin",
    companyId: "quickreply",
    initials: "QA",
    color: "amber",
  },
  // QuickReply.ai Users
  {
    id: "anirudh",
    username: "anirudh",
    password: "anirudh123",
    name: "Anirudh Moza",
    email: "anirudh@quickreply.ai",
    role: "user",
    companyId: "quickreply",
    initials: "AM",
    color: "amber",
  },
  {
    id: "steffi",
    username: "steffi",
    password: "steffi123",
    name: "Steffi Emmanuel",
    email: "steffi@quickreply.ai",
    role: "user",
    companyId: "quickreply",
    initials: "SE",
    color: "copper",
  },
  {
    id: "arpit",
    username: "arpit",
    password: "arpit123",
    name: "Arpit Rawat",
    email: "arpit@quickreply.ai",
    role: "user",
    companyId: "quickreply",
    initials: "AR",
    color: "silver",
  },
  {
    id: "rahul",
    username: "rahul",
    password: "rahul123",
    name: "Rahul Kumar",
    email: "rahul@quickreply.ai",
    role: "user",
    companyId: "quickreply",
    initials: "RK",
    color: "amber",
  },
]

const initialTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    userId: "anirudh",
    companyId: "quickreply",
    name: "Anirudh Moza",
    initials: "AM",
    role: "Team Lead",
    focus: "Ads / Outbound",
    color: "amber",
    isLead: true,
  },
  {
    id: "tm-2",
    userId: "steffi",
    companyId: "quickreply",
    name: "Steffi Emmanuel",
    initials: "SE",
    role: "Product Marketing",
    focus: "PMM",
    color: "copper",
  },
  {
    id: "tm-3",
    userId: "arpit",
    companyId: "quickreply",
    name: "Arpit Rawat",
    initials: "AR",
    role: "Generalist",
    focus: "Growth",
    color: "silver",
  },
  {
    id: "tm-4",
    userId: "rahul",
    companyId: "quickreply",
    name: "Rahul Kumar",
    initials: "RK",
    role: "SEO",
    focus: "Organic",
    color: "amber",
  },
]

// Store class
class Store {
  companies: Company[] = [...initialCompanies]
  mentors: Mentor[] = [...initialMentors]
  users: User[] = [...initialUsers]
  teamMembers: TeamMember[] = [...initialTeamMembers]

  // Company methods
  getCompanies() {
    return this.companies
  }

  getCompany(id: string) {
    return this.companies.find((c) => c.id === id)
  }

  addCompany(company: Company) {
    this.companies.push(company)
  }

  updateCompany(id: string, data: Partial<Company>) {
    const index = this.companies.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...data }
    }
  }

  deleteCompany(id: string) {
    this.companies = this.companies.filter((c) => c.id !== id)
    // Also delete associated users and team members
    this.users = this.users.filter((u) => u.companyId !== id)
    this.teamMembers = this.teamMembers.filter((t) => t.companyId !== id)
  }

  // Mentor methods
  getMentors() {
    return this.mentors
  }

  getMentor(id: string) {
    return this.mentors.find((m) => m.id === id)
  }

  getMentorForCompany(companyId: string) {
    return this.mentors.find((m) => m.assignedCompanies.includes(companyId))
  }

  addMentor(mentor: Mentor) {
    this.mentors.push(mentor)
  }

  updateMentor(id: string, data: Partial<Mentor>) {
    const index = this.mentors.findIndex((m) => m.id === id)
    if (index !== -1) {
      this.mentors[index] = { ...this.mentors[index], ...data }
    }
  }

  deleteMentor(id: string) {
    this.mentors = this.mentors.filter((m) => m.id !== id)
  }

  // User methods
  getUsers() {
    return this.users
  }

  getUsersByCompany(companyId: string) {
    return this.users.filter((u) => u.companyId === companyId)
  }

  getUser(id: string) {
    return this.users.find((u) => u.id === id)
  }

  getUserByUsername(username: string) {
    return this.users.find((u) => u.username === username)
  }

  addUser(user: User) {
    this.users.push(user)
  }

  updateUser(id: string, data: Partial<User>) {
    const index = this.users.findIndex((u) => u.id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...data }
    }
  }

  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id)
    this.teamMembers = this.teamMembers.filter((t) => t.userId !== id)
  }

  // Team member methods
  getTeamMembers(companyId: string) {
    return this.teamMembers.filter((t) => t.companyId === companyId)
  }

  addTeamMember(member: TeamMember) {
    this.teamMembers.push(member)
  }

  updateTeamMember(id: string, data: Partial<TeamMember>) {
    const index = this.teamMembers.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.teamMembers[index] = { ...this.teamMembers[index], ...data }
    }
  }

  // Auth
  authenticate(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    )
    return user || null
  }
}

// Export singleton instance
export const store = new Store()
