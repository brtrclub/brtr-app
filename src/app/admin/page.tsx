"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Building2, Users, GraduationCap, ExternalLink, Plus } from "lucide-react"
import { Company, Mentor, User } from "@/lib/types"

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchData()
  }, [])

  const stats = [
    {
      label: "Companies",
      value: companies.length,
      icon: Building2,
      color: "var(--gold)",
      href: "/admin/companies",
    },
    {
      label: "Mentors",
      value: mentors.length,
      icon: GraduationCap,
      color: "var(--copper)",
      href: "/admin/mentors",
    },
    {
      label: "Users",
      value: users.filter((u) => u.role !== "super_admin").length,
      icon: Users,
      color: "var(--silver)",
      href: "/admin/users",
    },
  ]

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Admin Dashboard
        </h1>
        <p className="text-[var(--text-3)]">Manage all brtr.club companies and users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon
                    className="h-8 w-8"
                    style={{ color: stat.color }}
                  />
                  <span className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-3)]">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Companies List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-1)]">Companies</h2>
              <Link href="/admin/companies">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Company
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {companies.map((company) => {
                const companyUsers = users.filter((u) => u.companyId === company.id)
                const mentor = mentors.find((m) => m.assignedCompanies.includes(company.id))

                return (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)]"
                  >
                    <div className="flex items-center gap-3">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-[var(--gold)] flex items-center justify-center text-white font-semibold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--text-1)]">{company.name}</p>
                        <p className="text-xs text-[var(--text-3)]">
                          {companyUsers.length} users
                          {mentor && ` · Mentor: ${mentor.name}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard?company=${company.id}`} target="_blank">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}

              {companies.length === 0 && (
                <p className="text-sm text-[var(--text-3)] text-center py-4">
                  No companies yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-1)]">Recent Users</h2>
              <Link href="/admin/users">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {users
                .filter((u) => u.role !== "super_admin")
                .slice(0, 5)
                .map((user) => {
                  const company = companies.find((c) => c.id === user.companyId)

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={user.initials} color={user.color} size="sm" />
                        <div>
                          <p className="font-medium text-[var(--text-1)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-3)]">
                            {company?.name || "No company"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={user.role === "company_admin" ? "copper" : "secondary"}
                      >
                        {user.role === "company_admin" ? "Admin" : "User"}
                      </Badge>
                    </div>
                  )
                })}

              {users.filter((u) => u.role !== "super_admin").length === 0 && (
                <p className="text-sm text-[var(--text-3)] text-center py-4">
                  No users yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
