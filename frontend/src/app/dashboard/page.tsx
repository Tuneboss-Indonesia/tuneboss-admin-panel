"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { formatIDR } from "@/lib/mock-data"
import { getAdminOrders, getAdminSummary, type AdminOrder, type AdminSummary } from "@/lib/api"
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const messages = {
  id: {
    title: "Dashboard Utama",
    subtitle: "Ringkasan performa penjualan dan aktivitas toko TuneBoss Indonesia.",
    revenue: "Total Penjualan",
    orders: "Total Pesanan",
    products: "Produk Aktif",
    customers: "Total Pelanggan",
    fromLastMonth: "dari bulan lalu",
    recentOrders: "Pesanan Terbaru",
    recentOrdersDesc: "Daftar transaksi terbaru yang masuk ke sistem.",
    orderId: "ID Pesanan",
    customer: "Pelanggan",
    date: "Tanggal",
    status: "Status",
    total: "Total",
    viewAllOrders: "Lihat Semua Pesanan",
    quickActions: "Aksi Cepat & Status Sistem",
    quickActionsDesc: "Jalan pintas ke fitur utama dan status koneksi server.",
    addProduct: "Tambah Produk Baru",
    manageOrders: "Kelola Pesanan Masuk",
    serverStatus: "Status Server API",
    serverOnline: "Online (12ms)",
    databaseStatus: "Koneksi Database",
    databaseConnected: "Terhubung (PostgreSQL)",
    loading: "Memuat data dashboard...",
    loadFailed: "Gagal memuat data admin.",
    statusMap: {
      pending: "Menunggu",
      processing: "Diproses",
      paid: "Dibayar",
      fulfilled: "Selesai",
      cancelled: "Dibatalkan",
    },
  },
  en: {
    title: "Main Dashboard",
    subtitle: "Overview of sales performance and store activity for TuneBoss Indonesia.",
    revenue: "Total Revenue",
    orders: "Total Orders",
    products: "Active Products",
    customers: "Total Customers",
    fromLastMonth: "from last month",
    recentOrders: "Recent Orders",
    recentOrdersDesc: "Latest incoming transactions registered in the system.",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    status: "Status",
    total: "Total",
    viewAllOrders: "View All Orders",
    quickActions: "Quick Actions & System Status",
    quickActionsDesc: "Shortcuts to main features and server health status.",
    addProduct: "Add New Product",
    manageOrders: "Manage Incoming Orders",
    serverStatus: "API Server Status",
    serverOnline: "Online (12ms)",
    databaseStatus: "Database Connection",
    databaseConnected: "Connected (PostgreSQL)",
    loading: "Loading dashboard data...",
    loadFailed: "Failed to load admin data.",
    statusMap: {
      pending: "Pending",
      processing: "Processing",
      paid: "Paid",
      fulfilled: "Fulfilled",
      cancelled: "Cancelled",
    },
  },
} as const

function getStatusBadge(status: string, t: typeof messages.id | typeof messages.en) {
  const label = t.statusMap[status as keyof typeof t.statusMap] || status
  switch (status) {
    case "paid":
    case "fulfilled":
      return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">{label}</Badge>
    case "processing":
      return <Badge className="bg-primary/15 text-primary border-primary/30 font-medium">{label}</Badge>
    case "pending":
      return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium">{label}</Badge>
    case "cancelled":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 font-medium">{label}</Badge>
    default:
      return <Badge variant="outline">{label}</Badge>
  }
}

export default function DashboardPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]
  const [summary, setSummary] = React.useState<AdminSummary | null>(null)
  const [orders, setOrders] = React.useState<AdminOrder[]>([])
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    let ignore = false
    Promise.all([getAdminSummary(), getAdminOrders(5)])
      .then(([summaryResponse, ordersResponse]) => {
        if (ignore) return
        setSummary(summaryResponse.summary)
        setOrders(ordersResponse.orders)
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : t.loadFailed)
      })
    return () => { ignore = true }
  }, [t.loadFailed])

  const displaySummary = summary ?? {
    activeProducts: 0,
    cancelledOrders: 0,
    fulfilledOrders: 0,
    lowStockProducts: 0,
    paidOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-2">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          {!summary && !error ? <p className="text-sm text-muted-foreground">{t.loading}</p> : null}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.revenue}</CardTitle>
              <DollarSign className="size-6 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display tracking-tight">{formatIDR(displaySummary.revenue)}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="size-3.5" /> +12.5% <span className="text-muted-foreground font-normal">{t.fromLastMonth}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.orders}</CardTitle>
              <ShoppingBag className="size-6 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display tracking-tight">{displaySummary.totalOrders}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="size-3.5" /> +8.2% <span className="text-muted-foreground font-normal">{t.fromLastMonth}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.products}</CardTitle>
              <Package className="size-6 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display tracking-tight">{displaySummary.activeProducts} SKU</div>
              <p className="text-xs text-muted-foreground mt-1">
                TuneBoss ECU &amp; Sensors
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.customers}</CardTitle>
              <Users className="size-6 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display tracking-tight">{displaySummary.totalCustomers}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="size-3.5" /> +18 <span className="text-muted-foreground font-normal">bulan ini</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold">{t.recentOrders}</CardTitle>
              <CardDescription className="truncate">{t.recentOrdersDesc}</CardDescription>
            </div>
            <Link href="/orders" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground transition-all">
              {t.viewAllOrders}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[130px]">{t.orderId}</TableHead>
                    <TableHead>{t.customer}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead className="text-right">{t.total}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium font-mono text-xs">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.customer?.name ?? "-"}</span>
                          <span className="text-xs text-muted-foreground">{order.customer?.email ?? "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString(language === "en" ? "en-US" : "id-ID")}</TableCell>
                      <TableCell>{getStatusBadge(order.status, t)}</TableCell>
                      <TableCell className="text-right font-medium text-sm">{formatIDR(order.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
