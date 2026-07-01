"use client"

import { ArrowLeft, Home, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

type SystemErrorScreenProps = {
  code?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  resetLabel?: string
  onReset?: () => void
}

export function SystemErrorScreen({
  code,
  title,
  description,
  actionLabel = "Kembali ke dashboard",
  actionHref = "/dashboard",
  resetLabel = "Coba lagi",
  onReset,
}: SystemErrorScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          {code && (
            <p className="text-7xl font-bold tracking-tight text-primary sm:text-8xl">
              {code}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onReset && (
            <Button type="button" onClick={onReset}>
              <RefreshCw className="size-4" />
              {resetLabel}
            </Button>
          )}
          <Button
            type="button"
            variant={onReset ? "outline" : "default"}
            onClick={() => {
              window.location.href = actionHref
            }}
          >
            {actionHref === "/dashboard" ? (
              <Home className="size-4" />
            ) : (
              <ArrowLeft className="size-4" />
            )}
            {actionLabel}
          </Button>
        </div>
      </div>
    </main>
  )
}
