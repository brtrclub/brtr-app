"use client"

import { useState } from "react"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, UserPlus, Trash2 } from "lucide-react"
import Link from "next/link"

const learningFormats = [
  { id: "one-on-ones", label: "One-on-ones" },
  { id: "group-sessions", label: "Group sessions" },
  { id: "async-chat", label: "Async chat" },
  { id: "in-person", label: "In-person" },
]

const initialTeamMembers = [
  {
    id: "1",
    name: "Anirudh Moza",
    initials: "AM",
    color: "amber" as const,
    role: "Team Lead",
    focus: "Ads / Outbound",
    formats: ["one-on-ones", "group-sessions", "async-chat"],
    isLead: true,
  },
  {
    id: "2",
    name: "Steffi Emmanuel",
    initials: "SE",
    color: "copper" as const,
    role: "Product Marketing",
    focus: "PMM",
    formats: ["one-on-ones", "group-sessions", "async-chat"],
  },
  {
    id: "3",
    name: "Arpit Rawat",
    initials: "AR",
    color: "silver" as const,
    role: "Generalist",
    focus: "Growth",
    formats: ["one-on-ones", "group-sessions", "async-chat"],
  },
  {
    id: "4",
    name: "Rahul Kumar",
    initials: "RK",
    color: "amber" as const,
    role: "SEO",
    focus: "Organic",
    formats: ["one-on-ones", "async-chat"],
  },
]

function FormatTag({
  label,
  selected,
  onClick,
  small = false,
}: {
  label: string
  selected: boolean
  onClick?: () => void
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border transition-all",
        small ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
        selected
          ? "bg-[var(--gold-bg)] border-[var(--gold-border)] text-[var(--gold-text)] font-medium"
          : "bg-[var(--bg-white)] border-[var(--border-1)] text-[var(--text-2)] hover:border-[var(--gold-border)]"
      )}
    >
      {label}
    </button>
  )
}

export default function TeamPage() {
  const [expanded, setExpanded] = useState(true)
  const [teamFormats, setTeamFormats] = useState(["one-on-ones", "group-sessions", "async-chat"])
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)

  const toggleTeamFormat = (formatId: string) => {
    setTeamFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((f) => f !== formatId)
        : [...prev, formatId]
    )
  }

  const toggleMemberFormat = (memberId: string, formatId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              formats: member.formats.includes(formatId)
                ? member.formats.filter((f) => f !== formatId)
                : [...member.formats, formatId],
            }
          : member
      )
    )
  }

  const removeMember = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
            My team
          </h1>
          <p className="text-[var(--text-3)]">QuickReply.ai · {teamMembers.length} members</p>
        </div>
        <Link href="/settings">
          <Button variant="secondary" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Manage Team
          </Button>
        </Link>
      </div>

      {/* Team Card */}
      <div className="max-w-2xl mb-8">
        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-[var(--text-1)]">
                  QuickReply.ai
                </h3>
                <AvatarGroup max={4}>
                  {teamMembers.map((member) => (
                    <Avatar
                      key={member.name}
                      name={member.initials}
                      color={member.color}
                      size="xs"
                    />
                  ))}
                </AvatarGroup>
              </div>
              <span className="text-sm text-[var(--text-3)]">
                {teamMembers.length} members
              </span>
            </div>

            {/* Team-level formats */}
            <div className="mb-4">
              <p className="text-sm text-[var(--text-2)] mb-3">
                How should this team learn?
              </p>
              <div className="flex flex-wrap gap-2">
                {learningFormats.map((format) => (
                  <FormatTag
                    key={format.id}
                    label={format.label}
                    selected={teamFormats.includes(format.id)}
                    onClick={() => toggleTeamFormat(format.id)}
                  />
                ))}
              </div>
            </div>

            {/* Expand/Collapse for per-member customization */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-[var(--copper)] hover:text-[var(--copper-text)] transition-colors"
            >
              Customize per member
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Per-member customization */}
            {expanded && (
              <div className="mt-4 pt-4 border-t border-[var(--border-1)] space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <Avatar name={member.initials} color={member.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-1)]">
                          {member.name}
                        </span>
                        {member.isLead && (
                          <Badge variant="default" className="text-[10px] py-0">Lead</Badge>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-3)]">{member.role}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {learningFormats.slice(0, 3).map((format) => (
                        <FormatTag
                          key={format.id}
                          label={format.id === "one-on-ones" ? "1:1" : format.id === "group-sessions" ? "Group" : "Chat"}
                          selected={member.formats.includes(format.id)}
                          onClick={() => toggleMemberFormat(member.id, format.id)}
                          small
                        />
                      ))}
                    </div>
                    {!member.isLead && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1.5 rounded text-[var(--text-4)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Members Detail */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar name={member.initials} color={member.color} size="default" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--text-1)]">{member.name}</h3>
                    {member.isLead && (
                      <Badge variant="default" className="text-[10px] py-0">Lead</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-3)]">{member.role}</p>
                  <p className="text-xs text-[var(--text-4)]">{member.focus}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="flex justify-end">
        <Link href="/mentors">
          <Button size="lg" className="gap-2">
            Subscribe to mentors
            <span className="ml-1">→</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
