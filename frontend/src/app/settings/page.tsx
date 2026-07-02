"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { User, Mail, Lock, Save, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const messages = {
  id: {
    title: "Pengaturan Akun",
    subtitle: "Kelola profil administrator dan pengaturan keamanan Anda.",
    personalInfo: "Informasi Pribadi",
    personalInfoDesc: "Perbarui nama dan email akun Anda.",
    fullName: "Nama Lengkap",
    emailAddress: "Alamat Email",
    security: "Keamanan",
    securityDesc: "Ubah kata sandi untuk mengamankan akun Anda.",
    currentPassword: "Kata Sandi Saat Ini",
    newPassword: "Kata Sandi Baru",
    confirmPassword: "Konfirmasi Kata Sandi Baru",
    saveChanges: "Simpan Perubahan",
    saving: "Menyimpan...",
    saved: "Berhasil Disimpan",
    nameRequired: "Nama lengkap wajib diisi",
    emailRequired: "Email wajib diisi",
    emailInvalid: "Format email tidak valid",
    currentPasswordRequired: "Kata sandi saat ini wajib diisi",
    newPasswordMin: "Kata sandi baru minimal 8 karakter",
    passwordMismatch: "Konfirmasi kata sandi tidak cocok",
  },
  en: {
    title: "Account Settings",
    subtitle: "Manage your administrator profile and security settings.",
    personalInfo: "Personal Information",
    personalInfoDesc: "Update your account name and email.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    security: "Security",
    securityDesc: "Change your password to secure your account.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    saveChanges: "Save Changes",
    saving: "Saving...",
    saved: "Saved Successfully",
    nameRequired: "Full name is required",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email format",
    currentPasswordRequired: "Current password is required",
    newPasswordMin: "New password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
  },
} as const

// Creating schemas dynamically based on language translations
const getProfileSchema = (t: typeof messages.id | typeof messages.en) => z.object({
  name: z.string().min(1, t.nameRequired),
  email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
})

const getSecuritySchema = (t: typeof messages.id | typeof messages.en) => z.object({
  currentPassword: z.string().min(1, t.currentPasswordRequired),
  newPassword: z.string().min(8, t.newPasswordMin),
  confirmPassword: z.string().min(1, t.currentPasswordRequired),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t.passwordMismatch,
  path: ["confirmPassword"],
})

type FormStatus = { isSavingProfile: boolean; profileSaved: boolean; isSavingSecurity: boolean; securitySaved: boolean }
type FormAction =
  | { type: "savingProfile" }
  | { type: "savedProfile" }
  | { type: "clearSavedProfile" }
  | { type: "savingSecurity" }
  | { type: "savedSecurity" }
  | { type: "clearSavedSecurity" }

function formReducer(state: FormStatus, action: FormAction): FormStatus {
  switch (action.type) {
    case "savingProfile": return { ...state, isSavingProfile: true }
    case "savedProfile": return { ...state, isSavingProfile: false, profileSaved: true }
    case "clearSavedProfile": return { ...state, profileSaved: false }
    case "savingSecurity": return { ...state, isSavingSecurity: true }
    case "savedSecurity": return { ...state, isSavingSecurity: false, securitySaved: true }
    case "clearSavedSecurity": return { ...state, securitySaved: false }
  }
}

type PasswordVisibility = { current: boolean; new: boolean; confirm: boolean }
type PasswordAction =
  | { type: "toggleCurrent" }
  | { type: "toggleNew" }
  | { type: "toggleConfirm" }

function passwordReducer(state: PasswordVisibility, action: PasswordAction): PasswordVisibility {
  switch (action.type) {
    case "toggleCurrent": return { ...state, current: !state.current }
    case "toggleNew": return { ...state, new: !state.new }
    case "toggleConfirm": return { ...state, confirm: !state.confirm }
  }
}

export default function SettingsPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]

  const profileSchema = getProfileSchema(t)
  const securitySchema = getSecuritySchema(t)

  type ProfileFormValues = z.infer<typeof profileSchema>
  type SecurityFormValues = z.infer<typeof securitySchema>

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Admin TuneBoss",
      email: "admin@tuneboss.id",
    },
  })

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const [form, dispatch] = React.useReducer(formReducer, {
    isSavingProfile: false, profileSaved: false, isSavingSecurity: false, securitySaved: false,
  })

  const [passwords, passwordsDispatch] = React.useReducer(passwordReducer, {
    current: false, new: false, confirm: false,
  })

  const onSubmitProfile = () => {
    dispatch({ type: "savingProfile" })
    setTimeout(() => {
      dispatch({ type: "savedProfile" })
      setTimeout(() => dispatch({ type: "clearSavedProfile" }), 3000)
    }, 800)
  }

  const onSubmitSecurity = () => {
    dispatch({ type: "savingSecurity" })
    setTimeout(() => {
      dispatch({ type: "savedSecurity" })
      setTimeout(() => dispatch({ type: "clearSavedSecurity" }), 3000)
      resetSecurity()
    }, 800)
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Personal Info */}
          <Card className="border-border/60 shadow-sm overflow-hidden pt-0">
            <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
              <CardHeader className="bg-muted/20 border-b border-border/50 pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <User className="size-8 text-primary opacity-80 shrink-0" />
                  <div>
                    <CardTitle className="text-lg font-semibold">{t.personalInfo}</CardTitle>
                    <CardDescription>{t.personalInfoDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-foreground">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      className="pl-9 bg-background/50 border-border/60" 
                      aria-invalid={!!profileErrors.name}
                      {...registerProfile("name")} 
                    />
                  </div>
                  {profileErrors.name && <p className="text-sm font-medium text-destructive">{profileErrors.name.message}</p>}
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-foreground">{t.emailAddress}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                     <Input 
                       type="text" 
                       inputMode="email"
                      className="pl-9 bg-background/50 border-border/60" 
                      aria-invalid={!!profileErrors.email}
                      {...registerProfile("email")} 
                    />
                  </div>
                  {profileErrors.email && <p className="text-sm font-medium text-destructive">{profileErrors.email.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 p-4 justify-end">
                <Button type="submit" disabled={form.isSavingProfile} className="min-w-[140px]">
                  {form.isSavingProfile ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> {t.saving}</>
                  ) : form.profileSaved ? (
                    <><CheckCircle2 className="mr-2 size-4 text-emerald-300" /> {t.saved}</>
                  ) : (
                    <><Save className="mr-2 size-4" /> {t.saveChanges}</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security */}
          <Card className="border-border/60 shadow-sm overflow-hidden pt-0">
            <form onSubmit={handleSecuritySubmit(onSubmitSecurity)}>
              <CardHeader className="bg-muted/20 border-b border-border/50 pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Lock className="size-8 text-destructive opacity-80 shrink-0" />
                  <div>
                    <CardTitle className="text-lg font-semibold">{t.security}</CardTitle>
                    <CardDescription>{t.securityDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-foreground">{t.currentPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      type={passwords.current ? "text" : "password"}
                      placeholder="••••••••" 
                      className="pl-9 pr-10 bg-background/50 border-border/60 font-mono tracking-widest placeholder:tracking-normal" 
                      aria-invalid={!!securityErrors.currentPassword}
                      {...registerSecurity("currentPassword")} 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 inline-flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => passwordsDispatch({ type: "toggleCurrent" })}
                    >
                      {passwords.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {securityErrors.currentPassword && <p className="text-sm font-medium text-destructive">{securityErrors.currentPassword.message}</p>}
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-foreground">{t.newPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      type={passwords.new ? "text" : "password"}
                      placeholder="••••••••" 
                      className="pl-9 pr-10 bg-background/50 border-border/60 font-mono tracking-widest placeholder:tracking-normal" 
                      aria-invalid={!!securityErrors.newPassword}
                      {...registerSecurity("newPassword")} 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 inline-flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => passwordsDispatch({ type: "toggleNew" })}
                    >
                      {passwords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {securityErrors.newPassword && <p className="text-sm font-medium text-destructive">{securityErrors.newPassword.message}</p>}
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-foreground">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      type={passwords.confirm ? "text" : "password"}
                      placeholder="••••••••" 
                      className="pl-9 pr-10 bg-background/50 border-border/60 font-mono tracking-widest placeholder:tracking-normal" 
                      aria-invalid={!!securityErrors.confirmPassword}
                      {...registerSecurity("confirmPassword")} 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 inline-flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => passwordsDispatch({ type: "toggleConfirm" })}
                    >
                      {passwords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {securityErrors.confirmPassword && <p className="text-sm font-medium text-destructive">{securityErrors.confirmPassword.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 p-4 justify-end">
                <Button type="submit" disabled={form.isSavingSecurity} className="min-w-[140px]">
                  {form.isSavingSecurity ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> {t.saving}</>
                  ) : form.securitySaved ? (
                    <><CheckCircle2 className="mr-2 size-4 text-emerald-300" /> {t.saved}</>
                  ) : (
                    <><Save className="mr-2 size-4" /> {t.saveChanges}</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
