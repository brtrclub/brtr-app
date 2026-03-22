"use client"

import { useState, useEffect } from "react"
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
  Linkedin,
} from "lucide-react"
import { Company, Mentor } from "@/lib/types"

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    headline: "",
    company: "",
    linkedIn: "",
    photoUrl: "",
    expertise: "",
    assignedCompanies: [] as string[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [mentorsRes, companiesRes] = await Promise.all([
        fetch("/api/admin/mentors"),
        fetch("/api/admin/companies"),
      ])

      const mentorsData = await mentorsRes.json()
      const companiesData = await companiesRes.json()

      setMentors(mentorsData.mentors || [])
      setCompanies(companiesData.companies || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMentor() {
    if (!formData.name || !formData.email) return

    try {
      const response = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: formData.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        resetForm()
        setShowAddForm(false)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to add mentor:", error)
    }
  }

  async function handleUpdateMentor(id: string) {
    try {
      const response = await fetch("/api/admin/mentors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...formData,
          expertise: formData.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        setEditingId(null)
        resetForm()
        fetchData()
      }
    } catch (error) {
      console.error("Failed to update mentor:", error)
    }
  }

  async function handleDeleteMentor(id: string) {
    if (!confirm("Are you sure you want to delete this mentor?")) return

    try {
      const response = await fetch("/api/admin/mentors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete mentor:", error)
    }
  }

  function startEditing(mentor: Mentor) {
    setEditingId(mentor.id)
    setFormData({
      name: mentor.name,
      email: mentor.email,
      headline: mentor.headline,
      company: mentor.company,
      linkedIn: mentor.linkedIn,
      photoUrl: mentor.photoUrl || "",
      expertise: mentor.expertise.join(", "),
      assignedCompanies: mentor.assignedCompanies,
    })
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      headline: "",
      company: "",
      linkedIn: "",
      photoUrl: "",
      expertise: "",
      assignedCompanies: [],
    })
  }

  function toggleCompanyAssignment(companyId: string) {
    setFormData((prev) => ({
      ...prev,
      assignedCompanies: prev.assignedCompanies.includes(companyId)
        ? prev.assignedCompanies.filter((c) => c !== companyId)
        : [...prev.assignedCompanies, companyId],
    }))
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-[var(--text-3)]">Loading...</p>
      </div>
    )
  }

  const MentorForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
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
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Headline</Label>
          <Input
            placeholder="e.g. Revenue & Operations"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          />
        </div>
        <div>
          <Label>Company</Label>
          <Input
            placeholder="Current company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>LinkedIn URL</Label>
          <Input
            placeholder="https://linkedin.com/in/..."
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
          />
        </div>
        <div>
          <Label>Photo URL</Label>
          <Input
            placeholder="https://..."
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Expertise (comma-separated)</Label>
        <Input
          placeholder="Revenue Operations, Sales Strategy, GTM"
          value={formData.expertise}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-2 block">Assigned Companies</Label>
        <div className="flex flex-wrap gap-2">
          {companies.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => toggleCompanyAssignment(company.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                formData.assignedCompanies.includes(company.id)
                  ? "bg-[var(--gold-bg)] border-[var(--gold-border)] text-[var(--gold-text)]"
                  : "bg-[var(--bg-white)] border-[var(--border-1)] text-[var(--text-2)] hover:border-[var(--gold-border)]"
              }`}
            >
              {company.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setShowAddForm(false)
            setEditingId(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
            Mentors
          </h1>
          <p className="text-[var(--text-3)]">Manage mentors and their assignments</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Mentor
        </Button>
      </div>

      {/* Add Mentor Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">
              Add New Mentor
            </h3>
            <MentorForm onSubmit={handleAddMentor} submitLabel="Add Mentor" />
          </CardContent>
        </Card>
      )}

      {/* Mentors List */}
      <div className="space-y-4">
        {mentors.map((mentor) => {
          const isEditing = editingId === mentor.id
          const assignedCompanyNames = mentor.assignedCompanies
            .map((id) => companies.find((c) => c.id === id)?.name)
            .filter(Boolean)

          return (
            <Card key={mentor.id}>
              <CardContent className="p-6">
                {isEditing ? (
                  <MentorForm
                    onSubmit={() => handleUpdateMentor(mentor.id)}
                    submitLabel="Save Changes"
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {mentor.photoUrl ? (
                        <img
                          src={mentor.photoUrl}
                          alt={mentor.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar name={mentor.initials} color="silver" size="xl" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-[var(--text-1)]">
                            {mentor.name}
                          </h3>
                          {mentor.linkedIn && (
                            <a
                              href={mentor.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0A66C2] hover:opacity-80"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-3)] mb-2">
                          {mentor.headline} at {mentor.company}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-3)]">
                          <Building2 className="h-4 w-4" />
                          {assignedCompanyNames.length > 0
                            ? assignedCompanyNames.join(", ")
                            : "No companies assigned"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(mentor)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteMentor(mentor.id)}
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

        {mentors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-[var(--text-3)]">No mentors yet. Add your first mentor above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
