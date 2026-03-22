"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  X,
  Check,
  Users,
  GraduationCap,
} from "lucide-react"
import { Company, Mentor, User } from "@/lib/types"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    logoUrl: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [companiesRes, mentorsRes, usersRes] = await Promise.all([
        fetch("/api/admin/companies"),
        fetch("/api/admin/mentors"),
        fetch("/api/admin/users"),
      ])

      const companiesData = await companiesRes.json()
      const mentorsData = await mentorsRes.json()
      const usersData = await usersRes.json()

      setCompanies(companiesData.companies || [])
      setMentors(mentorsData.mentors || [])
      setUsers(usersData.users || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCompany() {
    if (!formData.name) return

    try {
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", industry: "", logoUrl: "" })
        setShowAddForm(false)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to add company:", error)
    }
  }

  async function handleUpdateCompany(id: string) {
    try {
      const response = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      })

      if (response.ok) {
        setEditingId(null)
        setFormData({ name: "", industry: "", logoUrl: "" })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to update company:", error)
    }
  }

  async function handleDeleteCompany(id: string) {
    if (!confirm("Are you sure? This will delete all users in this company.")) return

    try {
      const response = await fetch("/api/admin/companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete company:", error)
    }
  }

  function startEditing(company: Company) {
    setEditingId(company.id)
    setFormData({
      name: company.name,
      industry: company.industry,
      logoUrl: company.logoUrl || "",
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-[var(--text-3)]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
            Companies
          </h1>
          <p className="text-[var(--text-3)]">Manage all companies on brtr.club</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Add Company Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">
              Add New Company
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  placeholder="Company name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g. SaaS, E-commerce"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://..."
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ name: "", industry: "", logoUrl: "" })
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>Add Company</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companies List */}
      <div className="space-y-4">
        {companies.map((company) => {
          const companyUsers = users.filter((u) => u.companyId === company.id)
          const companyMentor = mentors.find((m) =>
            m.assignedCompanies.includes(company.id)
          )
          const isEditing = editingId === company.id

          return (
            <Card key={company.id}>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Company Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Industry</Label>
                        <Input
                          value={formData.industry}
                          onChange={(e) =>
                            setFormData({ ...formData, industry: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Logo URL</Label>
                        <Input
                          value={formData.logoUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, logoUrl: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(null)
                          setFormData({ name: "", industry: "", logoUrl: "" })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateCompany(company.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-[var(--gold)] flex items-center justify-center text-white text-xl font-semibold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-[var(--text-1)]">
                            {company.name}
                          </h3>
                          <Badge variant="secondary">{company.industry}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-3)]">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {companyUsers.length} users
                          </span>
                          {companyMentor && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {companyMentor.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/users?company=${company.id}`}>
                        <Button variant="secondary" size="sm" className="gap-1">
                          <Users className="h-4 w-4" />
                          Users
                        </Button>
                      </Link>
                      <Link
                        href={`/login?company=${company.slug}`}
                        target="_blank"
                      >
                        <Button variant="secondary" size="sm" className="gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(company)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {companies.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-[var(--text-3)]">No companies yet. Add your first company above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
