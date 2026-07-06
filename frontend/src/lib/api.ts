export const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "")

export type AdminUser = {
  email: string
  emailVerified: boolean
  id: string
  name: string
  phone: string
  role: "admin" | "staff" | "customer"
}

export type AdminSummary = {
  activeProducts: number
  cancelledOrders: number
  fulfilledOrders: number
  lowStockProducts: number
  paidOrders: number
  pendingOrders: number
  revenue: number
  totalCustomers: number
  totalOrders: number
  totalProducts: number
}

export type AdminOrder = {
  createdAt: string
  customer: { email: string; id: string; name: string; phone: string } | null
  id: string
  items: Array<{ id: string; name: string; quantity: number; unitPrice: number }>
  status: "pending" | "paid" | "fulfilled" | "cancelled" | "draft"
  total: number
}

export type AdminProduct = {
  brand: string
  description: string
  id: string
  image: string
  images?: string[]
  imageUrl: string | null
  name: string
  price: string
  priceValue: number
  sku: string
  slug: string
  stock: number
}

export type AdminCustomer = {
  createdAt: string
  email: string
  emailVerified: boolean
  id: string
  name: string
  phone: string
  totalOrders: number
  totalSpent: number
  updatedAt: string
}

export type Pagination = {
  limit: number
  offset: number
  total: number
}

export type AdminAnalytics = {
  categories: Array<{ color: string; name: string; value: number }>
  conversion: number
  customers: number
  orders: number
  revenue: Array<{ name: string; total: number }>
  totalRevenue: number
  topProducts: Array<{ name: string; sales: number }>
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || data.error || "Request failed")
  return data as T
}

export function loginAdmin(email: string, password: string) {
  return apiRequest<{ user: AdminUser }>("/auth/login", {
    body: JSON.stringify({ email, password }),
    method: "POST",
  })
}

export function getAdminMe() {
  return apiRequest<{ user: AdminUser }>("/auth/me")
}

export function getAdminSummary() {
  return apiRequest<{ summary: AdminSummary }>("/admin/summary")
}

export function getAdminAnalytics(timeframe: "thisMonth" | "thisYear" | "lastYear") {
  return apiRequest<{ analytics: AdminAnalytics }>(`/admin/analytics?timeframe=${timeframe}`)
}

export function getAdminOrders(limit = 5) {
  return apiRequest<{ orders: AdminOrder[] }>(`/admin/orders?limit=${limit}`)
}

export function getAdminProducts() {
  return apiRequest<{ products: AdminProduct[] }>("/admin/products?limit=100")
}

export function getAdminCustomers({ limit, offset, q }: { limit: number; offset: number; q?: string }) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (q) params.set("q", q)
  return apiRequest<{ customers: AdminCustomer[]; pagination: Pagination }>(`/admin/customers?${params}`)
}

export function updateAdminProduct(id: string, input: { description: string; images?: string[]; price: number }) {
  return apiRequest<{ product: AdminProduct }>(`/admin/products/${id}`, {
    body: JSON.stringify(input),
    method: "PATCH",
  })
}

export function updateAdminOrderStatus(id: string, status: AdminOrder["status"]) {
  return apiRequest<{ order: AdminOrder }>(`/admin/orders/${id}/status`, {
    body: JSON.stringify({ status }),
    method: "PATCH",
  })
}
