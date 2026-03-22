"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Phone, MessageCircle, Plus, ImageIcon } from "lucide-react"

const teamMembers = [
  { initials: "AM", name: "Anirudh Moza", color: "amber" as const },
  { initials: "SE", name: "Steffi Emmanuel", color: "copper" as const },
  { initials: "AR", name: "Arpit Rawat", color: "silver" as const },
  { initials: "RK", name: "Rahul Kumar", color: "amber" as const },
]

const mentor = {
  name: "Haider Ali",
  headline: "Revenue & Operations",
  company: "Shoops",
  bio: "Operations expert with experience at fast-growing D2C and B2B companies. Specializes in building scalable sales processes and revenue operations.",
  expertise: ["Revenue Operations", "Sales Strategy", "Process Optimization", "GTM"],
  status: "online" as "online" | "offline",
  photoUrl: null as string | null, // Set to image path when available
  assignedTo: ["AM", "SE", "AR", "RK"],
}

function MentorPhotoPlaceholder({ size = "lg" }: { size?: "lg" | "xl" }) {
  const sizeClasses = size === "xl" ? "h-24 w-24" : "h-14 w-14"
  const iconSize = size === "xl" ? "h-8 w-8" : "h-5 w-5"

  return (
    <div className={cn(
      "relative rounded-full bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border-1)] flex items-center justify-center",
      sizeClasses
    )}>
      <ImageIcon className={cn("text-[var(--text-4)]", iconSize)} />
      <span className="absolute -bottom-1 -right-1 text-xs bg-white px-1 rounded text-[var(--text-4)]">
        + Photo
      </span>
    </div>
  )
}

function MentorCard() {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Mentor Header with Photo */}
        <div className="p-6 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-white)]">
          <div className="flex items-start gap-5">
            {/* Photo Placeholder */}
            <div className="relative flex-shrink-0">
              {mentor.photoUrl ? (
                <Image
                  src={mentor.photoUrl}
                  alt={mentor.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <MentorPhotoPlaceholder size="xl" />
              )}
              <span
                className={cn(
                  "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white",
                  mentor.status === "online" && "bg-[var(--status-online)]",
                  mentor.status === "offline" && "bg-[var(--status-offline)]"
                )}
              />
            </div>

            {/* Mentor Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-[var(--text-1)]">{mentor.name}</h3>
                <Badge variant={mentor.status === "online" ? "success" : "secondary"}>
                  {mentor.status === "online" ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-sm text-[var(--text-2)] mb-3">
                {mentor.headline} · {mentor.company}
              </p>
              <p className="text-sm text-[var(--text-3)] mb-3">
                {mentor.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Members */}
        <div className="p-5 border-t border-[var(--border-1)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] mb-3">
            Working with
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AvatarGroup max={4}>
                {mentor.assignedTo.map((initials) => {
                  const member = teamMembers.find((m) => m.initials === initials)
                  return (
                    <Avatar
                      key={initials}
                      name={initials}
                      color={member?.color || "silver"}
                      size="sm"
                    />
                  )
                })}
              </AvatarGroup>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[var(--border-1)] text-[var(--text-4)] hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {showDropdown && (
                  <div className="absolute top-10 left-0 z-10 w-48 rounded-lg bg-white border border-[var(--border-1)] shadow-lg py-1">
                    {teamMembers.map((member) => (
                      <button
                        key={member.initials}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-elevated)]"
                      >
                        <Avatar name={member.initials} color={member.color} size="xs" />
                        {member.name}
                        {mentor.assignedTo.includes(member.initials) && (
                          <span className="ml-auto text-[var(--gold)]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                Book 1:1
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MentorsPage() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [invited, setInvited] = useState(false)

  const handleInvite = () => {
    if (inviteEmail) {
      setInvited(true)
      setTimeout(() => {
        setInvited(false)
        setInviteEmail("")
      }, 2000)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Your Mentor
        </h1>
        <p className="text-[var(--text-3)]">Matched for QuickReply.ai</p>
      </div>

      {/* Mentor Card */}
      <div className="max-w-3xl mb-8">
        <MentorCard />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-[var(--gold)]">4</p>
            <p className="text-sm text-[var(--text-3)]">Team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-[var(--copper)]">12</p>
            <p className="text-sm text-[var(--text-3)]">Sessions completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-[var(--silver)]">3</p>
            <p className="text-sm text-[var(--text-3)]">Active threads</p>
          </CardContent>
        </Card>
      </div>

      {/* Invite Your Own Advisor */}
      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--border-1)] text-[var(--text-4)]">
              <Plus className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text-1)]">
                Plug in your own advisor
              </h3>
              <p className="text-sm text-[var(--text-3)]">
                Invite them by email and we&apos;ll handle the rest
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="email"
                placeholder="advisor@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-64"
              />
              <Button
                variant="secondary"
                onClick={handleInvite}
                disabled={invited}
              >
                {invited ? "Sent ✓" : "Invite"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
