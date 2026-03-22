"use client"

import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="pl-[240px]">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
