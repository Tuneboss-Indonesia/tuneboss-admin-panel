"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CreditCard, DollarSign, Calendar, ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const RevenueChart = dynamic(() => import('@/components/analytics/revenue-chart').then(mod => mod.RevenueChart), { ssr: false })
const CategoriesChart = dynamic(() => import('@/components/analytics/categories-chart').then(mod => mod.CategoriesChart), { ssr: false })
const TopProductsChart = dynamic(() => import('@/components/analytics/top-products-chart').then(mod => mod.TopProductsChart), { ssr: false })

const messages = {
  id: {
    title: "Analitik",
    subtitle: "Tinjauan performa bisnis dan penjualan TuneBoss.",
    revenue: "Total Pendapatan",
    revenueDesc: "+20.1% dari bulan lalu",
    orders: "Total Pesanan",
    ordersDesc: "+15% dari bulan lalu",
    customers: "Pelanggan Aktif",
    customersDesc: "+180 pengguna baru",
    conversion: "Tingkat Konversi",
    conversionDesc: "+1.2% dari bulan lalu",
    revenueChartTitle: "Tren Pendapatan",
    revenueChartDesc: "Pendapatan harian selama rentang waktu terpilih",
    topProductsTitle: "Produk Terlaris",
    topProductsDesc: "Berdasarkan jumlah penjualan",
    timeframe: "Rentang Waktu",
    thisYear: "Tahun Ini (2026)",
    lastYear: "Tahun Lalu (2025)",
    thisMonth: "Bulan Ini",
    refunds: "Pengembalian Dana",
    refundsDesc: "0.8% dari total pesanan",
    visitors: "Pengunjung Unik",
    visitorsDesc: "+5% dari bulan lalu",
    categoriesTitle: "Penjualan per Kategori",
    categoriesDesc: "Distribusi kategori teratas",
  },
  en: {
    title: "Analytics",
    subtitle: "Overview of TuneBoss business and sales performance.",
    revenue: "Total Revenue",
    revenueDesc: "+20.1% from last month",
    orders: "Total Orders",
    ordersDesc: "+15% from last month",
    customers: "Active Customers",
    customersDesc: "+180 new users",
    conversion: "Conversion Rate",
    conversionDesc: "+1.2% from last month",
    revenueChartTitle: "Revenue Trend",
    revenueChartDesc: "Daily revenue over the selected timeframe",
    topProductsTitle: "Top Products",
    topProductsDesc: "Based on sales volume",
    timeframe: "Timeframe",
    thisYear: "This Year (2026)",
    lastYear: "Last Year (2025)",
    thisMonth: "This Month",
    refunds: "Refunds",
    refundsDesc: "0.8% of total orders",
    visitors: "Unique Visitors",
    visitorsDesc: "+5% from last month",
    categoriesTitle: "Sales by Category",
    categoriesDesc: "Top category distribution",
  }
}

const revenueData = [
  { name: "1 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "5 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "10 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "15 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "20 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "25 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
  { name: "30 Jun", total: Math.floor(Math.random() * 5000000) + 1000000 },
]

const productData = [
  { name: "TuneBoss ECU", sales: 400 },
  { name: "Quick Shifter", sales: 300 },
  { name: "Shift Light", sales: 200 },
  { name: "Camshaft", sales: 278 },
  { name: "TPS Sensor", sales: 189 },
]

const categoryData = [
  { name: "Elektronik", value: 400, color: "var(--chart-1)" },
  { name: "Mesin", value: 300, color: "var(--chart-2)" },
  { name: "Aksesoris", value: 300, color: "var(--chart-3)" },
  { name: "Lainnya", value: 200, color: "var(--chart-4)" },
]

const revenueChartConfig = {
  total: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
}

const productChartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-2)",
  },
}

const categoryChartConfig = {
  value: {
    label: "Kategori",
  }
}

export default function AnalyticsPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]

  const [timeframe, setTimeframe] = React.useState("thisMonth")

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" className="w-[180px] justify-between">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t[timeframe as keyof typeof t] || t.timeframe}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup value={timeframe} onValueChange={setTimeframe}>
                  <DropdownMenuRadioItem value="thisMonth">{t.thisMonth}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="thisYear">{t.thisYear}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lastYear">{t.lastYear}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.revenue}
              </CardTitle>
              <DollarSign className="h-5 w-5 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 45.231.890</div>
              <p className="text-xs text-muted-foreground">
                {t.revenueDesc}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.orders}
              </CardTitle>
              <CreditCard className="h-5 w-5 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                {t.ordersDesc}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.customers}</CardTitle>
              <Users className="h-5 w-5 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                {t.customersDesc}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.conversion}</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3%</div>
              <p className="text-xs text-muted-foreground">
                {t.conversionDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 flex flex-col">
            <CardHeader>
              <CardTitle>{t.revenueChartTitle}</CardTitle>
              <CardDescription>{t.revenueChartDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
              <RevenueChart revenueData={revenueData} revenueChartConfig={revenueChartConfig} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle>{t.categoriesTitle}</CardTitle>
              <CardDescription>{t.categoriesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
              <CategoriesChart categoryData={categoryData} categoryChartConfig={categoryChartConfig} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>{t.topProductsTitle}</CardTitle>
              <CardDescription>{t.topProductsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
              <TopProductsChart productData={productData} productChartConfig={productChartConfig} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
