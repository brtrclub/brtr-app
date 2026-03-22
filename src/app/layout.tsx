import type { Metadata } from "next"
import { Plus_Jakarta_Sans, League_Spartan } from "next/font/google"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const leagueSpartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "brtr - Mentorship for Revenue Teams",
  description: "Subscription-based mentorship platform for go-to-market teams",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
