"use client"

import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Play, Pause, Mic, Send, Users, LogIn, Video } from "lucide-react"

// All messages from the team (Admin view) - both sides have voice notes
const allMessages = [
  {
    id: 1,
    type: "question",
    author: "Anirudh Moza",
    initials: "AM",
    color: "amber" as const,
    time: "10:02 AM",
    isVoice: true,
    duration: "0:42",
    speed: "1.5x",
    transcription:
      "I've completely exhausted my Apollo list for fintech mid-market. Sales Nav is giving me the same people. Where else do I pull data from?",
  },
  {
    id: 2,
    type: "answer",
    author: "Haider Ali",
    initials: "HA",
    color: "silver" as const,
    time: "10:14 AM",
    isVoice: true,
    duration: "1:23",
    transcription:
      'Apollo + Nav will always overlap. Try Crunchbase for recently funded fintechs. Filter Series A/B, last 6 months. Then scrape their hiring pages for "head of revenue" or "sales ops" listings. If they\'re hiring, they\'re scaling. That\'s your buying signal, not the contact database.',
  },
  {
    id: 3,
    type: "question",
    author: "Steffi Emmanuel",
    initials: "SE",
    color: "copper" as const,
    time: "10:18 AM",
    isVoice: true,
    duration: "0:35",
    transcription: "For product marketing, how do we position QuickReply against competitors who have bigger budgets? What's worked for you?",
  },
  {
    id: 4,
    type: "answer",
    author: "Haider Ali",
    initials: "HA",
    color: "silver" as const,
    time: "10:26 AM",
    isVoice: true,
    duration: "0:58",
    transcription:
      "Don't compete on features or budget. Compete on specificity. Pick one use case you absolutely nail, like WhatsApp automation for D2C brands, and own that narrative completely. Your competitors are trying to be everything. You be the best at one thing.",
  },
  {
    id: 5,
    type: "question",
    author: "Rahul Kumar",
    initials: "RK",
    color: "amber" as const,
    time: "10:32 AM",
    isVoice: true,
    duration: "0:28",
    transcription: "What SEO strategies have you seen work best for B2B SaaS? Should we focus on bottom-funnel keywords or build topical authority first?",
  },
  {
    id: 6,
    type: "answer",
    author: "Haider Ali",
    initials: "HA",
    color: "silver" as const,
    time: "10:40 AM",
    isVoice: true,
    duration: "1:05",
    transcription:
      "For early-stage SaaS, bottom-funnel first. Capture the 3% who are ready to buy now. Build pages for 'best [your category] tools', '[competitor] alternatives', and pricing comparison content. Topical authority is a long game. Play it once you have revenue.",
  },
]

const teamMembers = [
  { name: "Anirudh Moza", initials: "AM", color: "amber" as const, role: "Team Lead", unread: 0 },
  { name: "Steffi Emmanuel", initials: "SE", color: "copper" as const, role: "Product Marketing", unread: 1 },
  { name: "Arpit Rawat", initials: "AR", color: "silver" as const, role: "Generalist", unread: 0 },
  { name: "Rahul Kumar", initials: "RK", color: "amber" as const, role: "SEO", unread: 2 },
]

function WaveformBars({ playing, isFromMentor }: { playing: boolean; isFromMentor?: boolean }) {
  const bars = Array.from({ length: 24 }, (_, i) => {
    const heights = [12, 18, 24, 16, 28, 14, 22, 18, 26, 12, 20, 24, 16, 28, 18, 22, 14, 26, 20, 12, 18, 24, 16, 20]
    return heights[i]
  })

  return (
    <div className="flex items-center gap-[2px] h-8">
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-full transition-all",
            playing
              ? i < 12
                ? isFromMentor ? "bg-[var(--silver)]" : "bg-[var(--gold)]"
                : "bg-[var(--border-1)]"
              : "bg-[var(--border-1)]"
          )}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}

function VoiceMessage({
  duration,
  speed,
  transcription,
  isFromMentor,
}: {
  duration: string
  speed?: string
  transcription: string | null
  isFromMentor?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="space-y-2">
      <div className={cn(
        "inline-flex items-center gap-3 rounded-full px-4 py-3",
        isFromMentor ? "bg-[var(--bg-white)] border border-[var(--border-1)]" : "bg-[var(--bg-elevated)]"
      )}>
        <button
          onClick={() => setPlaying(!playing)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-white)] shadow-sm hover:shadow transition-shadow"
        >
          {playing ? (
            <Pause className="h-4 w-4 text-[var(--text-1)]" />
          ) : (
            <Play className="h-4 w-4 text-[var(--text-1)] ml-0.5" />
          )}
        </button>
        <WaveformBars playing={playing} isFromMentor={isFromMentor} />
        <span className="text-sm font-medium text-[var(--text-1)]">{duration}</span>
        {speed && (
          <span className="text-xs text-[var(--text-3)] bg-[var(--bg-white)] px-2 py-1 rounded">
            {speed}
          </span>
        )}
      </div>
      {transcription && (
        <div className="flex items-start gap-2 text-sm text-[var(--text-2)]">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider shrink-0">
            Transcribed
          </Badge>
          <p className="leading-relaxed">{transcription}</p>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: (typeof allMessages)[0] }) {
  const isAnswer = message.type === "answer"

  return (
    <div className={cn("flex gap-4", isAnswer && "justify-end")}>
      {!isAnswer && (
        <Avatar name={message.initials} color={message.color} size="default" />
      )}
      <div className={cn("max-w-2xl", isAnswer && "text-right")}>
        <div className="flex items-center gap-2 mb-2">
          {isAnswer && <span className="text-xs text-[var(--text-4)]">{message.time}</span>}
          <span className="font-medium text-[var(--text-1)]">{message.author}</span>
          {isAnswer && <Badge variant="secondary" className="text-[10px]">Mentor</Badge>}
          {!isAnswer && <span className="text-xs text-[var(--text-4)]">{message.time}</span>}
        </div>
        <VoiceMessage
          duration={message.duration!}
          speed={message.speed}
          transcription={message.transcription!}
          isFromMentor={isAnswer}
        />
      </div>
      {isAnswer && (
        <Avatar name={message.initials} color={message.color} size="default" />
      )}
    </div>
  )
}

export default function SessionsPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const filteredMessages = selectedMember
    ? allMessages.filter(m => m.initials === selectedMember || m.type === "answer")
    : allMessages

  const handleJoinChat = () => {
    setHasJoined(true)
    setShowJoinModal(false)
  }

  return (
    <div className="flex h-screen">
      {/* Team Members Sidebar (Admin View) */}
      <div className="w-72 border-r border-[var(--border-1)] bg-[var(--bg-elevated)] flex flex-col">
        <div className="p-4 border-b border-[var(--border-1)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-1)]">
            <Users className="h-4 w-4" />
            Admin View
          </div>
          <p className="text-xs text-[var(--text-3)] mt-1">Viewing all team conversations</p>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <button
            onClick={() => setSelectedMember(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-2",
              !selectedMember
                ? "bg-[var(--gold-bg)] border border-[var(--gold-border)]"
                : "hover:bg-[var(--bg-white)]"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-white text-sm font-semibold">
              All
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-[var(--text-1)]">All Conversations</p>
              <p className="text-xs text-[var(--text-3)]">6 messages</p>
            </div>
          </button>

          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] px-3 py-2">
            Team Members
          </p>

          {teamMembers.map((member) => (
            <button
              key={member.initials}
              onClick={() => setSelectedMember(member.initials)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                selectedMember === member.initials
                  ? "bg-[var(--gold-bg)] border border-[var(--gold-border)]"
                  : "hover:bg-[var(--bg-white)]"
              )}
            >
              <Avatar name={member.initials} color={member.color} size="sm" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-[var(--text-1)] truncate">{member.name}</p>
                <p className="text-xs text-[var(--text-3)]">{member.role}</p>
              </div>
              {member.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--copper)] text-white text-xs">
                  {member.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Admin Join Button */}
        <div className="p-3 border-t border-[var(--border-1)]">
          {!hasJoined ? (
            <Button
              onClick={() => setShowJoinModal(true)}
              variant="secondary"
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              Join Conversation
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              You're in the conversation
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-1)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
                AMA with Haider Ali
              </h1>
              <Badge variant="success" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-[var(--status-online)] animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-3)] mt-1">
              {selectedMember
                ? `Viewing ${teamMembers.find(m => m.initials === selectedMember)?.name}'s conversation`
                : "Viewing all team conversations (Admin)"}
            </p>
          </div>
          {hasJoined && (
            <Button variant="secondary" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Start Video Call
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Admin message if joined */}
          {hasJoined && (
            <div className="flex gap-4 justify-end">
              <div className="max-w-2xl text-right">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="text-xs text-[var(--text-4)]">Just now</span>
                  <span className="font-medium text-[var(--text-1)]">You (Admin)</span>
                  <Badge variant="copper" className="text-[10px]">Founder</Badge>
                </div>
                <div className="rounded-2xl p-4 bg-[var(--copper)] text-white text-left">
                  <p className="leading-relaxed">Hey team! Great discussion. I wanted to add some context from our recent customer calls...</p>
                </div>
              </div>
              <Avatar name="AD" color="copper" size="default" />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-[var(--border-1)] bg-[var(--bg-white)]">
          <div className="flex items-center gap-4 max-w-4xl mx-auto">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--copper)] text-white hover:brightness-110 transition-all">
              <Mic className="h-5 w-5" />
            </button>
            <span className="text-xs text-[var(--text-4)]">Fn</span>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={hasJoined ? "Type a message as admin..." : "or type a question..."}
                className="w-full h-12 px-4 rounded-full border border-[var(--border-1)] bg-[var(--bg-elevated)] text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--copper)] text-white hover:brightness-110">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-[var(--text-1)] mb-2">
                Join this conversation?
              </h2>
              <p className="text-sm text-[var(--text-3)] mb-6">
                As an admin/founder, you can join this AMA session to add context, answer questions, or provide insights to your team.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJoinChat} className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Join Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
