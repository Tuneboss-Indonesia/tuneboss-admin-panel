"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { mockOrders, formatIDR, type Order } from "@/lib/mock-data"
import { Search, ChevronDown, Clock, Loader2, CreditCard, CheckCircle2, XCircle, Filter, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const statusFlow = ["pending", "processing", "paid", "fulfilled", "cancelled"] as const
type OrderStatus = (typeof statusFlow)[number]

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="size-3.5" />,
  processing: <Loader2 className="size-3.5" />,
  paid: <CreditCard className="size-3.5" />,
  fulfilled: <CheckCircle2 className="size-3.5" />,
  cancelled: <XCircle className="size-3.5" />,
}

const messages = {
  id: {
    title: "Manajemen Pesanan",
    subtitle: "Pantau dan kelola seluruh transaksi masuk dari pembeli TuneBoss.",
    searchPlaceholder: "Cari ID Pesanan atau nama pembeli...",
    all: "Semua",
    pending: "Menunggu",
    processing: "Diproses",
    paid: "Dibayar",
    fulfilled: "Selesai",
    cancelled: "Dibatalkan",
    orderId: "ID Pesanan",
    customer: "Pelanggan",
    date: "Tanggal",
    items: "Item",
    total: "Total",
    status: "Status",
    actions: "Ubah Status",
    showing: "Menampilkan",
    of: "dari",
    orders: "pesanan",
    changeStatusTo: "Ubah ke",
    statusMap: {
      pending: "Menunggu Pembayaran",
      processing: "Sedang Diproses",
      paid: "Sudah Dibayar",
      fulfilled: "Selesai Dikirim",
      cancelled: "Dibatalkan",
    },
    prevPage: "Sebelumnya",
    nextPage: "Selanjutnya",
    page: "Halaman",
  },
  en: {
    title: "Orders Management",
    subtitle: "Monitor and manage all incoming transactions from TuneBoss customers.",
    searchPlaceholder: "Search Order ID or customer name...",
    all: "All",
    pending: "Pending",
    processing: "Processing",
    paid: "Paid",
    fulfilled: "Fulfilled",
    cancelled: "Cancelled",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    items: "Items",
    total: "Total",
    status: "Status",
    actions: "Change Status",
    showing: "Showing",
    of: "of",
    orders: "orders",
    changeStatusTo: "Change to",
    statusMap: {
      pending: "Awaiting Payment",
      processing: "Being Processed",
      paid: "Payment Confirmed",
      fulfilled: "Delivered & Completed",
      cancelled: "Cancelled",
    },
    prevPage: "Previous",
    nextPage: "Next",
    page: "Page",
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

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "pending": return "text-amber-600 dark:text-amber-400"
    case "processing": return "text-primary"
    case "paid": return "text-blue-600 dark:text-blue-400"
    case "fulfilled": return "text-emerald-600 dark:text-emerald-400"
    case "cancelled": return "text-destructive"
  }
}

export default function OrdersPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("ALL")
  const [ordersList, setOrdersList] = React.useState<Order[]>(mockOrders)
  
  const [page, setPage] = React.useState(1)
  const itemsPerPage = 10
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setPage(1)
  }

  const filteredOrders = React.useMemo(() => {
    return ordersList.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        selectedStatus === "ALL" || order.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus, ordersList])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleChangeStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const statusFilters = [
    { key: "ALL", label: t.all },
    { key: "pending", label: t.pending },
    { key: "processing", label: t.processing },
    { key: "paid", label: t.paid },
    { key: "fulfilled", label: t.fulfilled },
    { key: "cancelled", label: t.cancelled },
  ]

  const statusLabels: Record<OrderStatus, string> = {
    pending: t.pending,
    processing: t.processing,
    paid: t.paid,
    fulfilled: t.fulfilled,
    cancelled: t.cancelled,
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Filter and Table Card */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              {/* Search input */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 bg-background/50 border-border/60"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" size="sm" className="gap-2 text-xs font-medium shrink-0" />
                }>
                  <Filter className="size-3.5 text-muted-foreground" />
                  <span>{statusFilters.find((f) => f.key === selectedStatus)?.label || t.all}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuRadioGroup
                    value={selectedStatus}
                    onValueChange={(v) => handleStatusChange(v as string)}
                  >
                    {statusFilters.map((filter) => (
                      <DropdownMenuRadioItem key={filter.key} value={filter.key}>
                        {filter.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[140px]">{t.orderId}</TableHead>
                    <TableHead>{t.customer}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.items}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead className="text-right">{t.total}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs font-semibold text-primary">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.customerName}</span>
                          <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="text-xs">
                        <Dialog>
                          <DialogTrigger render={
                            <Button variant="outline" size="sm" className="h-7 text-[10px] px-2.5 font-medium bg-background/50">
                              <Package className="mr-1.5 size-3" />
                              Lihat {order.itemsCount} Item
                            </Button>
                          } />
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Detail Item Pesanan</DialogTitle>
                              <DialogDescription>
                                Daftar produk untuk pesanan {order.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-2 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                              {order.items?.map((item) => (
                                <div key={item.productName} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/50 bg-muted/10">
                                  <span className="text-sm text-foreground font-medium">
                                    {item.productName}
                                  </span>
                                  <span className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status, t)}</TableCell>
                      <TableCell className="text-right font-medium text-sm">{formatIDR(order.total)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs whitespace-nowrap" />
                          }>
                            {statusIcons[order.status as OrderStatus]}
                            <span>{statusLabels[order.status as OrderStatus]}</span>
                            <ChevronDown className="size-3 opacity-50" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {statusFlow.reduce<React.ReactNode[]>((acc, newStatus) => {
                              if (newStatus !== order.status) {
                                acc.push(
                                  <DropdownMenuItem
                                    key={newStatus}
                                    onClick={() => handleChangeStatus(order.id, newStatus)}
                                    className="gap-2.5 cursor-pointer"
                                  >
                                    <span className={getStatusColor(newStatus)}>
                                      {statusIcons[newStatus]}
                                    </span>
                                    <span>
                                      {t.changeStatusTo} <strong>{statusLabels[newStatus]}</strong>
                                    </span>
                                  </DropdownMenuItem>
                                )
                              }
                              return acc
                            }, [])}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Tidak ada pesanan yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>
                {t.showing} <strong className="text-foreground">{paginatedOrders.length}</strong> {t.of} <strong className="text-foreground">{filteredOrders.length}</strong> {t.orders}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
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
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="h-8 px-3 text-xs"
                >
                  {t.nextPage}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
