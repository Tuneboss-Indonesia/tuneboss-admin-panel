"use client"

import { SystemErrorScreen } from "@/components/system-error-screen"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <SystemErrorScreen
      code="500"
      title="Something went wrong"
      description="The system could not load this page. Try again, or return to the dashboard if the problem continues."
      resetLabel="Try again"
      onReset={reset}
      actionLabel="Back to dashboard"
    />
  )
}
