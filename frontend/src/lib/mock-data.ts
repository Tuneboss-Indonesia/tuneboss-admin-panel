export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "out_of_stock"
}

export interface OrderItem {
  productName: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  date: string
  status: "pending" | "processing" | "paid" | "fulfilled" | "cancelled"
  total: number
  itemsCount: number
  items: OrderItem[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  joinedDate: string
  status: "active" | "inactive"
}

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    sku: "TB-ECU-NMAX155",
    name: "TuneBoss ECU Yamaha NMAX 155 / Aerox 155 Connected",
    category: "ECU / ECM",
    price: 2850000,
    stock: 24,
    status: "active",
  },
  {
    id: "prod-2",
    sku: "TB-ECU-ZX25R",
    name: "TuneBoss Standalone ECU Kawasaki Ninja ZX-25R",
    category: "ECU / ECM",
    price: 6500000,
    stock: 8,
    status: "active",
  },
  {
    id: "prod-3",
    sku: "TB-SL-PRO",
    name: "TuneBoss ShiftLight Pro LED Indicator",
    category: "Accessories",
    price: 450000,
    stock: 45,
    status: "active",
  },
  {
    id: "prod-4",
    sku: "TB-QS-UNIV",
    name: "TuneBoss Quickshifter Sensor Universal (Road / Race)",
    category: "Sensors",
    price: 1250000,
    stock: 15,
    status: "active",
  },
  {
    id: "prod-5",
    sku: "TB-ECU-VSP150",
    name: "TuneBoss ECU Vespa Sprint / Primavera 150 i-Get",
    category: "ECU / ECM",
    price: 3200000,
    stock: 0,
    status: "out_of_stock",
  },
  {
    id: "prod-6",
    sku: "TB-CBL-DIAG",
    name: "TuneBoss USB Diagnostic Cable & Mapping Adapter",
    category: "Accessories",
    price: 350000,
    stock: 12,
    status: "active",
  },
]

export const mockOrders: Order[] = [
  {
    id: "ORD-2026-8841",
    customerName: "Budi Santoso",
    customerEmail: "budi.s@gmail.com",
    date: "01 Jul 2026, 14:30",
    status: "paid",
    total: 2850000,
    itemsCount: 1,
    items: [
      { productName: "TuneBoss ECU Yamaha NMAX 155", quantity: 1 }
    ]
  },
  {
    id: "ORD-2026-8840",
    customerName: "Rizky Ramadhan",
    customerEmail: "rizky.rama@yahoo.com",
    date: "01 Jul 2026, 11:15",
    status: "processing",
    total: 6950000,
    itemsCount: 2,
    items: [
      { productName: "TuneBoss Standalone ECU Kawasaki Ninja ZX-25R", quantity: 1 },
      { productName: "TuneBoss ShiftLight Pro LED Indicator", quantity: 1 }
    ]
  },
  {
    id: "ORD-2026-8839",
    customerName: "Hendra Wijaya",
    customerEmail: "hendra.w@outlook.com",
    date: "30 Jun 2026, 19:45",
    status: "fulfilled",
    total: 1250000,
    itemsCount: 1,
    items: [
      { productName: "TuneBoss Quickshifter Sensor Universal", quantity: 1 }
    ]
  },
  {
    id: "ORD-2026-8838",
    customerName: "Ahmad Fauzi",
    customerEmail: "fauzi.ahmad@mail.com",
    date: "30 Jun 2026, 16:20",
    status: "pending",
    total: 450000,
    itemsCount: 1,
    items: [
      { productName: "TuneBoss ShiftLight Pro LED Indicator", quantity: 1 }
    ]
  },
  {
    id: "ORD-2026-8837",
    customerName: "Deny Kurniawan",
    customerEmail: "deny.kurnia@gmail.com",
    date: "29 Jun 2026, 10:05",
    status: "cancelled",
    total: 3200000,
    itemsCount: 1,
    items: [
      { productName: "TuneBoss ECU Vespa Sprint / Primavera", quantity: 1 }
    ]
  },
]

export const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Budi Santoso",
    email: "budi.s@gmail.com",
    phone: "+62 812-3456-7890",
    totalOrders: 5,
    totalSpent: 14250000,
    joinedDate: "12 Jan 2026",
    status: "active",
  },
  {
    id: "CUST-002",
    name: "Rizky Ramadhan",
    email: "rizky.rama@yahoo.com",
    phone: "+62 857-1122-3344",
    totalOrders: 3,
    totalSpent: 8650000,
    joinedDate: "20 Feb 2026",
    status: "active",
  },
  {
    id: "CUST-003",
    name: "Hendra Wijaya",
    email: "hendra.w@outlook.com",
    phone: "+62 813-9988-7766",
    totalOrders: 8,
    totalSpent: 22400000,
    joinedDate: "05 Nov 2025",
    status: "active",
  },
  {
    id: "CUST-004",
    name: "Ahmad Fauzi",
    email: "fauzi.ahmad@mail.com",
    phone: "+62 819-5544-3322",
    totalOrders: 1,
    totalSpent: 450000,
    joinedDate: "28 Jun 2026",
    status: "active",
  },
  {
    id: "CUST-005",
    name: "Deny Kurniawan",
    email: "deny.kurnia@gmail.com",
    phone: "+62 821-4433-2211",
    totalOrders: 2,
    totalSpent: 3550000,
    joinedDate: "15 Apr 2026",
    status: "inactive",
  },
]

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatIDR(amount: number): string {
  return idrFormatter.format(amount)
}
