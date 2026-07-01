"use client"

import { SystemErrorScreen } from "@/components/system-error-screen"

export default function NotFound() {
  return (
    <SystemErrorScreen
      code="404"
      title="Page not found"
      description="The page you opened does not exist or has been moved."
      actionLabel="Back to dashboard"
    />
  )
}
