"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Eye, EyeOff, Globe2, Sun, Moon, Monitor, Check } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { setStoredTheme, useStoredTheme, applyTheme, type Theme, type Language } from "@/lib/preferences"
import { loginAdmin } from "@/lib/api"

const messages = {
  id: {
    welcome: "Selamat datang kembali",
    desc: "Masukkan kredensial Anda untuk mengakses panel admin",
    email: "Email",
    password: "Kata Sandi",
    signIn: "Masuk",
    signingIn: "Sedang masuk...",
    emailEmpty: "Email tidak boleh kosong",
    emailInvalid: "Format email tidak valid",
    passwordEmpty: "Kata sandi tidak boleh kosong",
    invalidCreds: "Email atau kata sandi tidak valid atau akun bukan admin/staff.",
    copyright: "Hak cipta dilindungi undang-undang.",
  },
  en: {
    welcome: "Welcome back",
    desc: "Enter your credentials to access the admin panel",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    emailEmpty: "Email cannot be empty",
    emailInvalid: "Invalid email format",
    passwordEmpty: "Password cannot be empty",
    invalidCreds: "Invalid email/password or account is not admin/staff.",
    copyright: "All rights reserved.",
  }
} as const

export default function LoginPage() {
  const router = useRouter()
  const { language, setLanguage } = useDashboardLanguage()
  const theme = useStoredTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  React.useEffect(() => {
    applyTheme(theme as Theme)
  }, [theme])

  const t = messages[language]

  const loginSchema = z.object({
    email: z.string().min(1, t.emailEmpty).email(t.emailInvalid),
    password: z.string().min(1, t.passwordEmpty),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const [isPending, startTransition] = React.useTransition()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginError, setLoginError] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    setLoginError("")
    startTransition(async () => {
      try {
        const { user } = await loginAdmin(data.email.trim().toLowerCase(), data.password)
        if (user.role !== "admin" && user.role !== "staff") {
          setLoginError(t.invalidCreds)
          return
        }
        router.push("/dashboard")
      } catch (error) {
        setLoginError(error instanceof Error ? error.message : t.invalidCreds)
      }
    })
  }

  return (
    <main suppressHydrationWarning className="relative grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top_left,var(--accent),transparent_35%),linear-gradient(135deg,var(--background),var(--secondary))] p-4">
      {/* Switchers at top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="icon" className="size-9 bg-background/50 backdrop-blur-sm border-border/60" />
          }>
            <Globe2 className="size-4" />
            <span className="sr-only">Toggle language</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <DropdownMenuRadioItem value="id">Indonesia</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switcher */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="icon" className="size-9 bg-background/50 backdrop-blur-sm border-border/60" />
            }>
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStoredTheme("light")} className="gap-2">
                <Sun className="size-4" /> Light
                {theme === "light" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStoredTheme("dark")} className="gap-2">
                <Moon className="size-4" /> Dark
                {theme === "dark" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStoredTheme("system")} className="gap-2">
                <Monitor className="size-4" /> System
                {theme === "system" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-2 block">
            <Image src="/tuneboss-logo.png" alt="TuneBoss Logo" width={180} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <p className="text-muted-foreground text-sm font-medium">Marketplace Admin Panel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t.welcome}</CardTitle>
            <CardDescription className="text-center">{t.desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t.email}</label>
                <Input
                  id="email"
                  type="text"
                  inputMode="email"
                  placeholder="admin@tuneboss.id"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t.password}</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 inline-flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              {loginError && (
                <p className="text-sm font-medium text-destructive text-center pt-2">{loginError}</p>
              )}

              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t.signingIn}
                  </>
                ) : (
                  t.signIn
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-sm text-muted-foreground/80">
        <p suppressHydrationWarning>&copy; {new Date().getFullYear()} TuneBoss. {t.copyright}</p>
      </div>
    </main>
  )
}
