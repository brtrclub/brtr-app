import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { value: "4", label: "ACTIVE MEMBERS" },
  { value: "12", label: "SESSIONS THIS MONTH" },
  { value: "78%", label: "AVG. CONFIDENCE" },
]

const members = [
  {
    name: "Anirudh Moza",
    initials: "AM",
    role: "Team Lead",
    focus: "Ads / Outbound",
    color: "amber" as const,
    sessions: 4,
    questions: 8,
    topics: [
      { name: "Outbound", status: "confident" },
      { name: "Paid Ads", status: "improving" },
      { name: "Lead Scoring", status: "focus" },
    ],
    note: "Strong on outbound execution. Exploring paid ads optimization next.",
    mentor: "Haider Ali",
  },
  {
    name: "Steffi Emmanuel",
    initials: "SE",
    role: "Product Marketing",
    focus: "PMM",
    color: "copper" as const,
    sessions: 3,
    questions: 6,
    topics: [
      { name: "Positioning", status: "improving" },
      { name: "Messaging", status: "confident" },
      { name: "Competitive Intel", status: "focus" },
    ],
    note: "Great instincts on positioning. Needs deeper competitor analysis.",
    mentor: "Haider Ali",
  },
  {
    name: "Arpit Rawat",
    initials: "AR",
    role: "Generalist",
    focus: "Growth",
    color: "silver" as const,
    sessions: 2,
    questions: 4,
    topics: [
      { name: "Growth Loops", status: "improving" },
      { name: "Analytics", status: "focus" },
    ],
    note: "Quick learner. Exploring growth frameworks across multiple channels.",
    mentor: "Haider Ali",
  },
  {
    name: "Rahul Kumar",
    initials: "RK",
    role: "SEO",
    focus: "Organic",
    color: "amber" as const,
    sessions: 3,
    questions: 7,
    topics: [
      { name: "Technical SEO", status: "confident" },
      { name: "Content Strategy", status: "improving" },
      { name: "Link Building", status: "focus" },
    ],
    note: "Solid technical foundation. Building content flywheel strategy.",
    mentor: "Haider Ali",
  },
]

function TopicBadge({ name, status }: { name: string; status: string }) {
  const statusIcons = {
    improving: "↑",
    confident: "★",
    focus: "△",
  }
  const icon = statusIcons[status as keyof typeof statusIcons] || ""

  return (
    <Badge
      variant={
        status === "improving"
          ? "default"
          : status === "confident"
          ? "copper"
          : "outline"
      }
      className="gap-1"
    >
      {icon} {name}
    </Badge>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Team Insights
        </h1>
        <p className="text-[var(--text-3)]">QuickReply.ai · Last 30 days</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-[var(--gold)] font-[family-name:var(--font-spartan)]">
                {stat.value}
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-4)] mt-2">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Cards */}
      <div className="space-y-4">
        {members.map((member) => (
          <Card key={member.name}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar name={member.initials} color={member.color} size="lg" />
                  <div>
                    <h3 className="font-semibold text-[var(--text-1)]">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[var(--text-3)]">
                      {member.role} · {member.focus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--text-3)]">
                  <span>{member.sessions} sessions</span>
                  <span>{member.questions} questions</span>
                  <button className="text-[var(--text-4)] hover:text-[var(--text-2)]">
                    ▼
                  </button>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {member.topics.map((topic) => (
                  <TopicBadge
                    key={topic.name}
                    name={topic.name}
                    status={topic.status}
                  />
                ))}
              </div>

              {/* Coaching Note */}
              <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
                <p className="text-sm text-[var(--text-2)] italic">
                  &ldquo;{member.note}&rdquo;
                  <span className="text-[var(--text-4)] not-italic ml-2">
                    - {member.mentor}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
