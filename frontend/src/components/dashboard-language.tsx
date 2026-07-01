"use client"

import { createContext, use, useMemo } from "react"
import { type Language, setStoredLanguage, useStoredLanguage } from "@/lib/preferences"

const DashboardLanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
} | null>(null)

export function DashboardLanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const language = useStoredLanguage() as Language
  const contextValue = useMemo(() => ({ language, setLanguage: setStoredLanguage }), [language])

  return (
    <DashboardLanguageContext value={contextValue}>
      {children}
    </DashboardLanguageContext>
  )
}

export function useDashboardLanguage() {
  const context = use(DashboardLanguageContext)
  if (!context) throw new Error("useDashboardLanguage must be used inside DashboardLanguageProvider")
  return context
}
