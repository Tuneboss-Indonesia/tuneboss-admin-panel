// Shared display types kept for compatibility with existing UI imports.
// Runtime data comes from the marketplace API.
export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "out_of_stock"
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
