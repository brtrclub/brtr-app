"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

const topicFilters = [
  { id: "aio", label: "AIO", abbr: "AIO", color: "gold" },
  { id: "discovery", label: "Discovery", abbr: "DC", color: "copper" },
  { id: "pipeline", label: "Pipeline", abbr: "PH", color: "copper" },
  { id: "objections", label: "Objections", abbr: "OH", color: "silver" },
  { id: "ai-agents", label: "AI Agents", abbr: "AI", color: "silver" },
  { id: "workflows", label: "Workflows", abbr: "WF", color: "silver" },
  { id: "cold-write", label: "Cold Write", abbr: "CW", color: "silver" },
  { id: "negotiation", label: "Negotiation", abbr: "NE", color: "silver" },
]

const contentItems = [
  {
    id: 1,
    type: "Reel",
    topic: "aio",
    thumbnail: "bg-gradient-to-br from-[#f5f1ea] to-[#e8e4dc]",
  },
  {
    id: 2,
    type: "Carousel",
    count: 5,
    topic: "discovery",
    thumbnail: "bg-gradient-to-br from-[#f7f4ee] to-[#ece7df]",
  },
  {
    id: 3,
    type: "Post",
    topic: "pipeline",
    thumbnail: "bg-gradient-to-br from-[#fafaf8] to-[#f0ece5]",
  },
]

function TopicCircle({
  abbr,
  label,
  color,
  selected,
  onClick,
}: {
  abbr: string
  label: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold transition-all",
          selected
            ? color === "gold"
              ? "bg-[var(--gold)] text-white"
              : color === "copper"
              ? "bg-[var(--copper)] text-white"
              : "bg-[var(--silver)] text-white"
            : "bg-[var(--bg-white)] border-2 border-[var(--border-1)] text-[var(--text-2)]",
          !selected && "hover:border-[var(--gold-border)]"
        )}
      >
        {abbr}
      </div>
      <span className="text-xs text-[var(--text-3)]">{label}</span>
    </button>
  )
}

function ContentCard({
  type,
  count,
  thumbnail,
}: {
  type: string
  count?: number
  thumbnail: string
}) {
  return (
    <div className={cn("relative aspect-[4/5] rounded-lg overflow-hidden", thumbnail)}>
      <div className="absolute inset-0 flex items-center justify-center">
        {type === "Reel" && (
          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors">
            <Play className="h-6 w-6 text-[var(--text-1)] ml-1" />
          </button>
        )}
      </div>
      <div className="absolute top-3 right-3">
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          {type}
          {count && ` · ${count}`}
        </Badge>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["aio"])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Content Feed
        </h1>
        <p className="text-[var(--text-3)]">Curated for your topics</p>
      </div>

      {/* Topic Filters */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {topicFilters.map((topic) => (
          <TopicCircle
            key={topic.id}
            abbr={topic.abbr}
            label={topic.label}
            color={topic.color}
            selected={selectedTopics.includes(topic.id)}
            onClick={() => toggleTopic(topic.id)}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {contentItems.map((item) => (
          <ContentCard
            key={item.id}
            type={item.type}
            count={item.count}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </div>
  )
}
