"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthProvider, useAuth } from "@/context/auth-context"
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  LogOut,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/mentors", label: "Mentors", icon: GraduationCap },
  { href: "/admin/users", label: "Users", icon: Users },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Allow the login page to render without auth
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoading && !isLoginPage && (!user || user.role !== "super_admin")) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router, isLoginPage])

  // Show login page without the admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[var(--text-3)]">Loading...</p>
      </div>
    )
  }

  if (!user || user.role !== "super_admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-[var(--border-1)] bg-[var(--bg-elevated)]">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-[var(--border-1)]">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-semibold font-[family-name:var(--font-brand)] brand-text">
                .brtr
              </span>
              <span className="text-xs font-semibold text-[var(--copper)] bg-[var(--copper)]/10 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--copper)] text-white"
                      : "text-[var(--text-2)] hover:bg-[var(--bg-white)] hover:text-[var(--text-1)]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-[var(--border-1)] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#c08050] to-[#a06830] flex items-center justify-center text-white text-sm font-semibold">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-1)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-3)]">Super Admin</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout()
                router.push("/admin/login")
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-3)] hover:bg-[var(--bg-white)] hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[240px] min-h-screen">{children}</main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
