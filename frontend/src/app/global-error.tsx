"use client"

import "./globals.css"
import { Geist } from "next/font/google"

import { SystemErrorScreen } from "@/components/system-error-screen"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={`h-full antialiased font-sans ${geist.variable}`}>
      <body className="min-h-full font-sans">
        <SystemErrorScreen
          code="500"
          title="System error"
          description="The admin app could not load. Try again, or return to the dashboard once the system recovers."
          resetLabel="Try again"
          onReset={reset}
          actionLabel="Back to dashboard"
        />
      </body>
    </html>
  )
}
