"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { formatIDR } from "@/lib/mock-data"
import { getAdminCustomers, type AdminCustomer } from "@/lib/api"
import { Search, Mail, Phone, ShoppingBag, Calendar, User, CheckCircle2, XCircle } from "lucide-react"

const messages = {
  id: {
    title: "Daftar Pelanggan",
    subtitle: "Basis data pengguna dan riwayat belanja member TuneBoss Marketplace.",
    searchPlaceholder: "Cari nama, email, atau nomor HP...",
    customer: "Pelanggan",
    phone: "Nomor Telepon",
    orders: "Total Pesanan",
    spent: "Total Belanja",
    joined: "Bergabung",
    status: "Status",
    actions: "Aksi",
    active: "Terverifikasi",
    inactive: "Belum Verifikasi",
    showing: "Menampilkan",
    of: "dari",
    customersLabel: "pelanggan",
    viewDetail: "Lihat Detail & Profil",
    sendEmail: "Kirim Email",
    toggleStatus: "Ubah Status Akun",
    deleteCustomer: "Hapus Pelanggan",
    profileDetail: "Detail Profil Pelanggan",
    profileDesc: "Informasi lengkap akun dan rekapitulasi belanja member.",
    close: "Tutup",
    sendWhatsapp: "Hubungi WhatsApp",
    emailAddress: "Alamat Email",
    memberSince: "Member Sejak",
    accountStatus: "Status Akun",
    shoppingSummary: "Ringkasan Belanja",
    totalOrdersCount: "Total Transaksi",
    totalSpentAmount: "Total Pengeluaran",
    prevPage: "Sebelumnya",
    nextPage: "Selanjutnya",
    page: "Halaman",
  },
  en: {
    title: "Customers List",
    subtitle: "User database and shopping history of TuneBoss Marketplace members.",
    searchPlaceholder: "Search name, email, or phone number...",
    customer: "Customer",
    phone: "Phone Number",
    orders: "Total Orders",
    spent: "Total Spent",
    joined: "Joined",
    status: "Status",
    actions: "Actions",
    active: "Verified",
    inactive: "Unverified",
    showing: "Showing",
    of: "of",
    customersLabel: "customers",
    viewDetail: "View Detail & Profile",
    sendEmail: "Send Email",
    toggleStatus: "Toggle Account Status",
    deleteCustomer: "Delete Customer",
    profileDetail: "Customer Profile Detail",
    profileDesc: "Full account information and member shopping summary.",
    close: "Close",
    sendWhatsapp: "Contact WhatsApp",
    emailAddress: "Email Address",
    memberSince: "Member Since",
    accountStatus: "Account Status",
    shoppingSummary: "Shopping Summary",
    totalOrdersCount: "Total Transactions",
    totalSpentAmount: "Total Expenditure",
    prevPage: "Previous",
    nextPage: "Next",
    page: "Page",
  },
} as const

function formatDate(value: string, language: "id" | "en") {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { dateStyle: "medium" }).format(new Date(value))
}

export default function CustomersPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]
  const itemsPerPage = 10
  const [selectedCustomer, setSelectedCustomer] = React.useState<AdminCustomer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [customersList, setCustomersList] = React.useState<AdminCustomer[]>([])
  const [totalCustomers, setTotalCustomers] = React.useState(0)
  const [loadError, setLoadError] = React.useState("")

  const [state, dispatch] = React.useReducer(
    (state: { searchQuery: string, page: number }, action: { type: 'SET_SEARCH', payload: string } | { type: 'SET_PAGE', payload: number }) => {
      switch (action.type) {
        case 'SET_SEARCH': return { ...state, searchQuery: action.payload, page: 1 }
        case 'SET_PAGE': return { ...state, page: action.payload }
        default: return state
      }
    },
    { searchQuery: "", page: 1 }
  )

  const { searchQuery, page } = state

  React.useEffect(() => {
    let cancelled = false

    getAdminCustomers({ limit: itemsPerPage, offset: (page - 1) * itemsPerPage, q: searchQuery.trim() })
      .then(({ customers, pagination }) => {
        if (cancelled) return
        setCustomersList(customers)
        setTotalCustomers(pagination.total)
        setLoadError("")
      })
      .catch((error: Error) => {
        if (cancelled) return
        setCustomersList([])
        setTotalCustomers(0)
        setLoadError(error.message)
      })

    return () => {
      cancelled = true
    }
  }, [page, searchQuery])

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'SET_SEARCH', payload: value })
  }

  const totalPages = Math.ceil(totalCustomers / itemsPerPage)
  const paginatedCustomers = customersList



  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Card */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-background/50 border-border/60"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>{t.customer}</TableHead>
                    <TableHead>{t.phone}</TableHead>
                    <TableHead className="text-center">{t.orders}</TableHead>
                    <TableHead className="text-right">{t.spent}</TableHead>
                    <TableHead>{t.joined}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{customer.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="size-3" /> {customer.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="size-3 text-muted-foreground/80" />
                          {customer.phone}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono text-xs font-semibold">
                          <ShoppingBag className="size-3 mr-1 text-primary" />
                          {customer.totalOrders}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm text-foreground">
                        {formatIDR(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(customer.createdAt, language)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {customer.emailVerified ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
                            {t.active}
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground border-border font-medium">
                            {t.inactive}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setIsDetailOpen(true)
                          }}
                          className="h-7 text-[10px]"
                        >
                          {t.viewDetail}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {loadError || "Tidak ada pelanggan yang ditemukan."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>
                {t.showing} <strong className="text-foreground">{paginatedCustomers.length}</strong> {t.of} <strong className="text-foreground">{totalCustomers}</strong> {t.customersLabel}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, page - 1) })}
                  disabled={page === 1}
                  className="h-8 px-3 text-xs"
                >
                  {t.prevPage}
                </Button>
                <span className="px-2 font-medium">
                  {t.page} {page} / {Math.max(1, totalPages)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.min(totalPages, page + 1) })}
                  disabled={page === totalPages || totalPages === 0}
                  className="h-8 px-3 text-xs"
                >
                  {t.nextPage}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md">
            {selectedCustomer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    {t.profileDetail}
                  </DialogTitle>
                  <DialogDescription>{t.profileDesc}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-3">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border/50">
                    <Avatar className="size-14 border-2 border-primary/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCustomer.name)}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                        {selectedCustomer.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg">{selectedCustomer.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{selectedCustomer.id}</span>
                      <div className="mt-1">
                        {selectedCustomer.emailVerified ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            <CheckCircle2 className="size-3 mr-1" /> {t.active}
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground text-[10px]">
                            <XCircle className="size-3 mr-1" /> {t.inactive}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info List */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-md bg-background border border-border/50 space-y-1">
                      <span className="text-xs text-muted-foreground">{t.emailAddress}</span>
                      <p className="font-medium truncate" title={selectedCustomer.email}>{selectedCustomer.email}</p>
                    </div>
                    <div className="p-3 rounded-md bg-background border border-border/50 space-y-1">
                      <span className="text-xs text-muted-foreground">{t.phone}</span>
                      <p className="font-medium font-mono text-xs">{selectedCustomer.phone}</p>
                    </div>
                    <div className="p-3 rounded-md bg-background border border-border/50 space-y-1">
                      <span className="text-xs text-muted-foreground">{t.memberSince}</span>
                          <p className="font-medium">{formatDate(selectedCustomer.createdAt, language)}</p>
                    </div>
                    <div className="p-3 rounded-md bg-background border border-border/50 space-y-1">
                      <span className="text-xs text-muted-foreground">{t.accountStatus}</span>
                      <p className="font-semibold text-primary">{selectedCustomer.emailVerified ? t.active : t.inactive}</p>
                    </div>
                  </div>

                  {/* Shopping Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.shoppingSummary}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-md bg-primary/5 border border-primary/20 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground">{t.totalOrdersCount}</span>
                        <span className="text-xl font-bold font-display text-primary mt-1">{selectedCustomer.totalOrders} Pesanan</span>
                      </div>
                      <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground">{t.totalSpentAmount}</span>
                        <span className="text-lg font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">{formatIDR(selectedCustomer.totalSpent)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                    className="gap-2 text-xs text-emerald-600 hover:text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    <Phone className="size-3.5" />
                    {t.sendWhatsapp}
                  </Button>
                  <Button onClick={() => setIsDetailOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    {t.close}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
