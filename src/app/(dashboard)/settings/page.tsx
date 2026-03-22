"use client"

import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Trash2, Linkedin, Check, UserPlus, X } from "lucide-react"

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  focus: string
  color: "amber" | "copper" | "silver"
  isLead?: boolean
}

// Team members state
const initialTeamMembers: TeamMember[] = [
  { id: "1", name: "Anirudh Moza", email: "anirudh@quickreply.ai", role: "Team Lead", focus: "Ads / Outbound", color: "amber", isLead: true },
  { id: "2", name: "Steffi Emmanuel", email: "steffi@quickreply.ai", role: "Product Marketing", focus: "PMM", color: "copper" },
  { id: "3", name: "Arpit Rawat", email: "arpit@quickreply.ai", role: "Generalist", focus: "Growth", color: "silver" },
  { id: "4", name: "Rahul Kumar", email: "rahul@quickreply.ai", role: "SEO", focus: "Organic", color: "amber" },
]

const initialMentor = {
  name: "Haider Ali",
  initials: "HA",
  email: "haider@brtr.club",
  headline: "Revenue & Operations",
  company: "Shoops",
  linkedIn: "",
  photoUrl: null as string | null,
  expertise: ["Revenue Operations", "Sales Strategy", "Process Optimization", "GTM"],
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function SettingsPage() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [mentor, setMentor] = useState(initialMentor)

  // New member form
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" })

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      const colors: Array<"amber" | "copper" | "silver"> = ["amber", "copper", "silver"]
      setTeamMembers([
        ...teamMembers,
        {
          id: Date.now().toString(),
          name: newMember.name,
          email: newMember.email,
          role: newMember.role,
          focus: newMember.role,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ])
      setNewMember({ name: "", email: "", role: "" })
      setShowAddMember(false)
    }
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  const clearMentorPhoto = () => {
    setMentor({ ...mentor, photoUrl: null })
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Settings
        </h1>
        <p className="text-[var(--text-3)]">Manage your team and mentors</p>
      </div>

      {/* Team Members Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-1)]">Team Members</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddMember(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Sales, Marketing"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <Card>
          <CardContent className="p-0 divide-y divide-[var(--border-1)]">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={getInitials(member.name)} color={member.color} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text-1)]">{member.name}</span>
                      {member.isLead && (
                        <Badge variant="default" className="text-[10px] py-0">Lead</Badge>
                      )}
                    </div>
                    <span className="text-sm text-[var(--text-3)]">{member.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[var(--text-3)]">{member.role}</span>
                  {!member.isLead && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 rounded-lg text-[var(--text-4)] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mentor Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">Mentor</h2>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6 mb-6">
              {/* Mentor Photo */}
              <div className="relative flex-shrink-0">
                {mentor.photoUrl ? (
                  <div className="relative">
                    <img
                      src={mentor.photoUrl}
                      alt={mentor.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <button
                      onClick={clearMentorPhoto}
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Avatar name={mentor.initials} color="silver" size="xl" />
                )}
              </div>

              {/* Mentor Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-1)]">{mentor.name}</h3>
                <p className="text-sm text-[var(--text-3)] mb-2">{mentor.headline} at {mentor.company}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Image URL */}
            <div className="pt-4 border-t border-[var(--border-1)] mb-4">
              <Label className="mb-2 block">Profile Photo URL</Label>
              <p className="text-sm text-[var(--text-3)] mb-3">
                Paste a direct image URL (right-click profile photo on LinkedIn → Copy image address)
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder="https://media.licdn.com/dms/image/..."
                  value={mentor.photoUrl || ""}
                  onChange={(e) => setMentor({ ...mentor, photoUrl: e.target.value || null })}
                  className="flex-1"
                />
                {mentor.photoUrl && (
                  <Button variant="secondary" onClick={clearMentorPhoto}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* LinkedIn Import */}
            <div className="pt-4 border-t border-[var(--border-1)]">
              <Label className="mb-2 block">LinkedIn Profile</Label>
              <p className="text-sm text-[var(--text-3)] mb-3">
                Link mentor&apos;s LinkedIn profile
              </p>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2]" />
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    value={mentor.linkedIn}
                    onChange={(e) => setMentor({ ...mentor, linkedIn: e.target.value })}
                    className="pl-10"
                  />
                </div>
                {mentor.linkedIn && (
                  <a
                    href={mentor.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                  >
                    View Profile
                  </a>
                )}
              </div>
              {mentor.linkedIn && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  LinkedIn profile linked
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">Organization</h2>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="org-name">Company Name</Label>
                <Input id="org-name" defaultValue="QuickReply.ai" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="org-industry">Industry</Label>
                <Input id="org-industry" defaultValue="SaaS" className="mt-1" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
