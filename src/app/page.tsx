import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border-1)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold font-[family-name:var(--font-brand)] brand-text">
              .brtr
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--copper)] text-white hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-[var(--text-1)] font-[family-name:var(--font-spartan)] mb-6">
          Mentorship for
          <br />
          <span className="brand-text">Revenue Teams</span>
        </h1>
        <p className="text-xl text-[var(--text-2)] max-w-2xl mx-auto mb-10">
          Subscribe your team to expert mentors. Get 1:1 coaching, group sessions,
          and async support to accelerate your go-to-market skills.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 text-base font-semibold rounded-lg bg-[var(--copper)] text-white hover:brightness-110 transition-all"
          >
            Start Free Trial
          </Link>
          <Link
            href="/explore"
            className="px-8 py-3 text-base font-semibold rounded-lg border border-[var(--border-1)] text-[var(--text-1)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            Explore Mentors
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--bg-white)] border border-[var(--border-1)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--gold-bg)] flex items-center justify-center mb-4">
              <span className="text-2xl">1:1</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
              Personal Coaching
            </h3>
            <p className="text-[var(--text-3)]">
              Weekly 1:1 sessions with mentors who have been there, done that.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--bg-white)] border border-[var(--border-1)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--copper)]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">Q&A</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
              Async Voice Notes
            </h3>
            <p className="text-[var(--text-3)]">
              Drop questions anytime. Get thoughtful responses within 24 hours.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--bg-white)] border border-[var(--border-1)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--silver)]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">Team</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
              Group Sessions
            </h3>
            <p className="text-[var(--text-3)]">
              Learn together with cohort-based workshops and AMAs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--copper)] to-[#8a5020] p-12 text-center text-white">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-spartan)] mb-4">
            Ready to level up your team?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join companies like QuickReply.ai who are investing in their people.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-base font-semibold rounded-lg bg-white text-[var(--copper)] hover:bg-white/90 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-1)] mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm text-[var(--text-3)]">
            2024 brtr.club. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-sm text-[var(--text-3)]">
            <Link href="/login" className="hover:text-[var(--text-1)]">Sign In</Link>
            <Link href="/admin" className="hover:text-[var(--text-1)]">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
