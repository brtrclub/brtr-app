"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { Company } from "@/lib/types"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const companySlug = searchParams.get("company")

  const { login, user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === "super_admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/admin/companies")
        const data = await response.json()
        setCompanies(data.companies || [])

        if (companySlug) {
          const company = data.companies.find(
            (c: Company) => c.slug === companySlug || c.id === companySlug
          )
          if (company) {
            setSelectedCompany(company)
          }
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error)
      }
    }

    fetchCompanies()
  }, [companySlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        // The useEffect will handle redirect
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-semibold font-[family-name:var(--font-brand)] brand-text">
              .brtr
            </span>
          </Link>
          {selectedCompany && (
            <p className="text-[var(--text-3)] mt-2">
              Signing in to {selectedCompany.name}
            </p>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Tab Toggle */}
            <div className="flex rounded-lg bg-[var(--bg-elevated)] p-1 mb-6">
              <button
                onClick={() => setIsAdminLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isAdminLogin
                    ? "bg-[var(--bg-white)] text-[var(--text-1)] shadow-sm"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                Company Login
              </button>
              <button
                onClick={() => setIsAdminLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  isAdminLogin
                    ? "bg-[var(--bg-white)] text-[var(--text-1)] shadow-sm"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAdminLogin && (
                <div>
                  <Label>Select Company</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-white)] text-[var(--text-1)] mt-1"
                    value={selectedCompany?.id || ""}
                    onChange={(e) => {
                      const company = companies.find((c) => c.id === e.target.value)
                      setSelectedCompany(company || null)
                    }}
                  >
                    <option value="">Choose a company...</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || (!isAdminLogin && !selectedCompany)}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {isAdminLogin && (
              <p className="text-xs text-[var(--text-4)] text-center mt-4">
                Admin access for brtr.club platform owners
              </p>
            )}
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 text-center text-sm text-[var(--text-3)]">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs">
            <p>Super Admin: <code className="bg-[var(--bg-elevated)] px-1 rounded">admin</code> / <code className="bg-[var(--bg-elevated)] px-1 rounded">brtr2024</code></p>
            <p>QuickReply Admin: <code className="bg-[var(--bg-elevated)] px-1 rounded">quickreply-admin</code> / <code className="bg-[var(--bg-elevated)] px-1 rounded">qr2024</code></p>
            <p>User: <code className="bg-[var(--bg-elevated)] px-1 rounded">anirudh</code> / <code className="bg-[var(--bg-elevated)] px-1 rounded">anirudh123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <p className="text-[var(--text-3)]">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthProvider>
  )
}
