import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-4xl font-semibold font-[family-name:var(--font-brand)] brand-text">
            .brtr
          </span>
          <p className="text-[var(--text-3)] mt-2">Mentorship Platform</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full px-6 py-4 rounded-xl bg-[var(--bg-white)] border border-[var(--border-1)] hover:border-[var(--gold-border)] transition-colors"
          >
            <p className="font-semibold text-[var(--text-1)]">Company Login</p>
            <p className="text-sm text-[var(--text-3)]">Sign in to your team dashboard</p>
          </Link>

          <Link
            href="/admin"
            className="block w-full px-6 py-4 rounded-xl bg-[var(--copper)] text-white hover:brightness-110 transition-all"
          >
            <p className="font-semibold">Admin Dashboard</p>
            <p className="text-sm text-white/80">Manage companies, mentors & users</p>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-[var(--text-4)] mt-12">
          Visit{" "}
          <a href="https://brtr.club" className="text-[var(--copper)] hover:underline">
            brtr.club
          </a>
          {" "}to learn more
        </p>
      </div>
    </div>
  )
}
