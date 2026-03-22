"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Building2,
  Shield,
  User as UserIcon,
} from "lucide-react"
import { Company, User } from "@/lib/types"

export default function UsersPage() {
  const searchParams = useSearchParams()
  const companyFilter = searchParams.get("company")

  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user" as "company_admin" | "user",
    companyId: companyFilter || "",
    jobRole: "",
    focus: "",
    photoUrl: "",
    isLead: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [usersRes, companiesRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/companies"),
      ])

      const usersData = await usersRes.json()
      const companiesData = await companiesRes.json()

      setUsers(usersData.users || [])
      setCompanies(companiesData.companies || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddUser() {
    if (!formData.name || !formData.username || !formData.password || !formData.companyId) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        resetForm()
        setShowAddForm(false)
        fetchData()
      } else {
        alert(data.error || "Failed to create user")
      }
    } catch (error) {
      console.error("Failed to add user:", error)
    }
  }

  async function handleUpdateUser(id: string) {
    try {
      const updateData: Record<string, unknown> = {
        id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        photoUrl: formData.photoUrl || null,
      }

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setEditingId(null)
        resetForm()
        fetchData()
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  function startEditing(user: User) {
    setEditingId(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "", // Don't show password
      role: user.role as "company_admin" | "user",
      companyId: user.companyId || "",
      jobRole: "",
      focus: "",
      photoUrl: user.photoUrl || "",
      isLead: false,
    })
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "user",
      companyId: companyFilter || "",
      jobRole: "",
      focus: "",
      photoUrl: "",
      isLead: false,
    })
  }

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (u.role === "super_admin") return false // Don't show super admin
    if (companyFilter) return u.companyId === companyFilter
    return true
  })

  const selectedCompany = companyFilter
    ? companies.find((c) => c.id === companyFilter)
    : null

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
            Users
            {selectedCompany && (
              <span className="text-[var(--text-3)] font-normal ml-2">
                - {selectedCompany.name}
              </span>
            )}
          </h1>
          <p className="text-[var(--text-3)]">
            {companyFilter ? "Manage users for this company" : "Manage all platform users"}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">
              Create New User Account
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-white)] text-[var(--text-1)]"
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  >
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Role</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-white)] text-[var(--text-1)]"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "company_admin" | "user" })
                    }
                  >
                    <option value="user">User</option>
                    <option value="company_admin">Company Admin</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Role</Label>
                  <Input
                    placeholder="e.g. Marketing, Sales"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Focus Area</Label>
                  <Input
                    placeholder="e.g. Outbound, SEO"
                    value={formData.focus}
                    onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Photo URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLead"
                  checked={formData.isLead}
                  onChange={(e) => setFormData({ ...formData, isLead: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isLead" className="mb-0">Team Lead</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const company = companies.find((c) => c.id === user.companyId)
          const isEditing = editingId === user.id

          return (
            <Card key={user.id}>
              <CardContent className="p-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>New Password (leave blank to keep)</Label>
                        <Input
                          type="password"
                          placeholder="New password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Photo URL</Label>
                        <Input
                          value={formData.photoUrl}
                          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <select
                          className="w-full h-10 px-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-white)]"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value as "company_admin" | "user" })
                          }
                        >
                          <option value="user">User</option>
                          <option value="company_admin">Company Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(null)
                          resetForm()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateUser(user.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar name={user.initials} color={user.color} size="sm" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--text-1)]">{user.name}</span>
                          {user.role === "company_admin" && (
                            <Badge variant="copper" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-3)]">
                          <span>@{user.username}</span>
                          {company && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {company.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditing(user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
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

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-[var(--text-3)]">No users found. Add your first user above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
