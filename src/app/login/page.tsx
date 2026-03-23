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
  const [isSubdomainLogin, setIsSubdomainLogin] = useState(false)

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
            setIsSubdomainLogin(true)
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

  // Company-specific subdomain login (e.g., quickreply.brtr.club)
  if (isSubdomainLogin && selectedCompany) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Company Branded Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-semibold font-[family-name:var(--font-brand)] brand-text">
                .brtr
              </span>
              <span className="text-[var(--text-4)]">x</span>
              {selectedCompany.logoUrl ? (
                <img
                  src={selectedCompany.logoUrl}
                  alt={selectedCompany.name}
                  className="h-8"
                />
              ) : (
                <span className="text-xl font-semibold text-[var(--text-1)]">
                  {selectedCompany.name}
                </span>
              )}
            </div>
            <p className="text-[var(--text-3)]">
              Sign in to your mentorship dashboard
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1"
                    autoFocus
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-[var(--text-4)] mt-6">
            Powered by{" "}
            <a href="https://brtr.club" className="text-[var(--copper)] hover:underline">
              brtr.club
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Main login page (app.brtr.club/login) - Simple login for any company user
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
          <p className="text-[var(--text-3)] mt-2">
            Mentorship for revenue teams
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                  autoFocus
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-[var(--text-4)] text-center mt-4">
              Contact your company admin if you need access
            </p>
          </CardContent>
        </Card>
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
