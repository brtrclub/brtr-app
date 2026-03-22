"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Compass,
  UsersRound,
  MessageCircle,
  Calendar,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mentors", label: "My mentors", icon: Users },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/team", label: "My team", icon: UsersRound },
  { href: "/sessions", label: "Sessions", icon: MessageCircle },
  { href: "/planning", label: "Planning", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
]

const teams = [
  { name: "QuickReply.ai", count: 4, color: "bg-[var(--gold)]" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-[var(--border-1)] bg-[var(--bg-elevated)]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold font-[family-name:var(--font-brand)] brand-text">
              .brtr
            </span>
            <span className="text-[var(--text-4)]">x</span>
            <span className="text-sm font-semibold text-[var(--text-1)]">
              QuickReply.ai
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--bg-white)] text-[var(--text-1)] shadow-sm"
                    : "text-[var(--text-2)] hover:bg-[var(--bg-white)] hover:text-[var(--text-1)]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Teams Section */}
        <div className="border-t border-[var(--border-1)] px-3 py-4">
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-4)]">
            Teams
          </h3>
          <div className="space-y-1">
            {teams.map((team) => (
              <Link
                key={team.name}
                href={`/team/${team.name.toLowerCase()}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--bg-white)] hover:text-[var(--text-1)]"
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", team.color)} />
                  {team.name}
                </div>
                <span className="text-[var(--text-4)]">{team.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
