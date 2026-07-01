"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Globe2,
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
  BarChart3
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { applyTheme, setStoredTheme, type Theme, useStoredTheme } from "@/lib/preferences"

const navKeys = [
  ["dashboard", "/dashboard", LayoutDashboard],
  ["analytics", "/analytics", BarChart3],
  ["products", "/products", Package],
  ["orders", "/orders", ShoppingCart],
  ["customers", "/customers", Users],
  ["content", "/content", Palette],
] as const

const messages = {
  id: {
    mainMenu: "Menu Utama",
    dashboard: "Dashboard",
    analytics: "Analitik",
    products: "Produk",
    categories: "Kategori",
    orders: "Pesanan",
    inventory: "Inventaris",
    customers: "Pelanggan",
    content: "Konten Toko",
    settings: "Pengaturan",
    logout: "Keluar",
    language: "Bahasa",
    theme: "Tema",
    light: "Terang",
    dark: "Gelap",
    system: "Sistem",
  },
  en: {
    mainMenu: "Main Menu",
    dashboard: "Dashboard",
    analytics: "Analytics",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    inventory: "Inventory",
    customers: "Customers",
    content: "Store Content",
    settings: "Settings",
    logout: "Logout",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
} as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const theme = useStoredTheme() as Theme
  const { language, setLanguage } = useDashboardLanguage()
  const t = messages[language]

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="h-16 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0 py-0 border-b border-border/50">
        <Link href="/" className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
          <Image
            src="/tuneboss-logo.png"
            alt="TuneBoss Logo"
            width={130}
            height={32}
            priority
            className="h-8 w-auto object-contain max-w-[130px]"
          />
        </Link>
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.mainMenu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navKeys.map(([key, url, Icon]) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton tooltip={t[key]} render={<Link href={url} />}>
                    <Icon />
                    <span>{t[key]}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton tooltip={t.language} />}>
                <Globe2 />
                <span>{t.language}</span>
                <span className="ml-auto text-xs font-bold uppercase text-primary">{language}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" side="right" align="start">
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={(value) => setLanguage(value as "id" | "en")}
                >
                  <DropdownMenuRadioItem value="id">Indonesia</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton tooltip={t.theme} />}>
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>{t.theme}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44" side="right" align="start">
                {([["light", t.light, Sun], ["dark", t.dark, Moon], ["system", t.system, Monitor]] as const).map(([value, label, Icon]) => (
                  <DropdownMenuItem key={value} className="gap-3 py-2" onClick={() => setStoredTheme(value)}>
                    <Icon className="size-4" /> 
                    <span>{label}</span>
                    {theme === value && <Check className="ml-auto size-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t.settings} render={<Link href="/settings" />}>
              <Settings />
              <span>{t.settings}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t.logout} className="text-red-500 hover:text-red-600">
              <LogOut />
              <span>{t.logout}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
