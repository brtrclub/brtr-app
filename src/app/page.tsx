"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="text-center">
        <span className="text-4xl font-semibold font-[family-name:var(--font-brand)] brand-text">
          .brtr
        </span>
        <p className="text-[var(--text-3)] mt-2">Redirecting...</p>
      </div>
    </div>
  )
}
