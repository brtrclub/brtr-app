"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const recommendedTopics = [
  "AIO (AI Optimization)",
  "AI Agents",
  "Building Workflows",
  "Objection Handling",
  "Discovery Calls",
  "Pipeline Hygiene",
]

const topicActivities: Record<string, string[]> = {
  "AIO (AI Optimization)": ["1:1 with mentor", "Async reading"],
  "AI Agents": ["Group session", "Workshop"],
  "Building Workflows": ["1:1 with mentor", "Hands-on exercise"],
  "Objection Handling": ["Role-play session", "Async reading"],
  "Discovery Calls": ["1:1 with mentor", "Call review"],
  "Pipeline Hygiene": ["Async reading", "Audit session"],
}

type WeekData = {
  topic: string | null
}

export default function PlanningPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([
    { topic: "AIO (AI Optimization)" },
    { topic: null },
    { topic: null },
    { topic: null },
  ])
  const [submitted, setSubmitted] = useState(false)

  const plannedCount = weeks.filter((w) => w.topic !== null).length

  const assignTopic = (weekIndex: number, topic: string) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex] = { topic }
    setWeeks(newWeeks)
  }

  const removeTopic = (weekIndex: number) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex] = { topic: null }
    setWeeks(newWeeks)
  }

  const handleSubmit = () => {
    if (plannedCount > 0) {
      setSubmitted(true)
    }
  }

  const isTopicUsed = (topic: string) => {
    return weeks.some((w) => w.topic === topic)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] font-[family-name:var(--font-spartan)]">
          Learning Path
        </h1>
        <p className="text-[var(--text-3)]">for Anirudh Moza · QuickReply.ai</p>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
          Design your personal curriculum
        </h2>
        <p className="text-[var(--text-2)]">
          Assign a topic to each week, or pick from our recommendations
        </p>
      </div>

      {/* Recommended Topics */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] mb-3">
          Recommended Topics
        </p>
        <div className="flex flex-wrap gap-2">
          {recommendedTopics.map((topic) => (
            <button
              key={topic}
              disabled={isTopicUsed(topic)}
              onClick={() => {
                const firstEmptyWeek = weeks.findIndex((w) => w.topic === null)
                if (firstEmptyWeek !== -1) {
                  assignTopic(firstEmptyWeek, topic)
                }
              }}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-all",
                isTopicUsed(topic)
                  ? "bg-[var(--bg-elevated)] border-[var(--border-1)] text-[var(--text-4)] cursor-not-allowed"
                  : "bg-[var(--bg-white)] border-[var(--border-1)] text-[var(--text-2)] hover:border-[var(--gold-border)] hover:text-[var(--gold-text)]"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-4 mb-8">
        {weeks.map((week, index) => (
          <div key={index} className="flex items-center gap-6">
            <span className="w-20 text-sm font-semibold uppercase tracking-wider text-[var(--text-4)]">
              Week {index + 1}
            </span>
            {week.topic ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--gold-bg)] border border-[var(--gold-border)] rounded-full">
                  <span className="text-sm font-medium text-[var(--gold-text)]">
                    {week.topic}
                  </span>
                  <button
                    onClick={() => removeTopic(index)}
                    className="text-[var(--gold-text)] hover:text-[var(--gold)]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {index === 0 && (
                  <Badge variant="default">Recommended</Badge>
                )}
                <div className="flex gap-2">
                  {topicActivities[week.topic]?.map((activity) => (
                    <Badge key={activity} variant="secondary">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  const firstUnused = recommendedTopics.find((t) => !isTopicUsed(t))
                  if (firstUnused) {
                    assignTopic(index, firstUnused)
                  }
                }}
                className="px-4 py-2 rounded-full border border-dashed border-[var(--border-1)] text-sm text-[var(--text-3)] hover:border-[var(--gold-border)] hover:text-[var(--gold-text)] transition-colors"
              >
                Pick a topic
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-[var(--border-1)]">
        <span className="text-sm text-[var(--copper)]">
          {plannedCount} of 4 weeks planned
        </span>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={plannedCount === 0 || submitted}
          className="gap-2"
        >
          {submitted ? (
            <>Submitted ✓</>
          ) : (
            <>
              Submit for approval
              <span>→</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
