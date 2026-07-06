"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import Image from "next/image"
import Link from "next/link"
import { BackToTop } from "./back-to-top"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { getAdminMe } from "@/lib/api"
import { usePathname, useRouter } from "next/navigation"

const messages = {
  id: {
    copyright: "Hak cipta dilindungi undang-undang.",
  },
  en: {
    copyright: "All rights reserved.",
  }
} as const

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = useDashboardLanguage()
  const t = messages[language]
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    let ignore = false
    getAdminMe()
      .then(({ user }) => {
        if (!ignore && user.role !== "admin" && user.role !== "staff") router.replace("/login")
      })
      .catch(() => {
        if (!ignore && pathname !== "/login") router.replace("/login")
      })
    return () => { ignore = true }
  }, [pathname, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="md:hidden relative flex h-16 shrink-0 items-center border-b border-border/50 px-4 sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
          <SidebarTrigger />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/tuneboss-logo.png"
                alt="TuneBoss Logo"
                width={120}
                height={28}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:pt-6">
          {children}
        </div>
        <footer className="mt-auto py-6 text-center text-sm text-muted-foreground border-t border-border/10">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} TuneBoss. {t.copyright}</p>
        </footer>
        <BackToTop />
      </SidebarInset>
    </SidebarProvider>
  )
}
