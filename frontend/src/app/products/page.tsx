"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDashboardLanguage } from "@/components/dashboard-language"
import { Search, Package, Edit, X, Filter, ChevronDown, Star, Upload, Plus } from "lucide-react"
import { type Product } from "@/lib/mock-data"
import { createAdminProduct, deleteAdminProduct, getAdminProductReviews, getAdminProducts, updateAdminProduct, type AdminProductReview } from "@/lib/api"
import { useForm, useWatch, type UseFormRegister, type UseFormHandleSubmit, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"

const messages = {
  id: {
    title: "Katalog Produk",
    subtitle: "Kelola katalog produk TuneBoss. Anda dapat menambahkan deskripsi, gambar, dan harga jual.",
    searchPlaceholder: "Cari nama atau SKU produk...",
    allCategories: "Semua Kategori",
    sku: "SKU",
    name: "Nama Produk",
    category: "Kategori",
    price: "Harga Jual",
    stock: "Stok",
    review: "Review",
    actions: "Aksi",
    active: "Aktif",
    outOfStock: "Habis",
    showing: "Menampilkan",
    of: "dari",
    products: "produk",
    editProduct: "Edit Produk",
    createProduct: "Tambah Produk",
    editProductDesc: "Tambahkan deskripsi, gambar, dan tentukan harga jual untuk produk ini agar tampil di marketplace.",
    description: "Deskripsi",
    descPlaceholder: "Tulis deskripsi produk untuk ditampilkan di toko...",
    sellingPrice: "Harga Jual (Rp)",
    pricePlaceholder: "Contoh: 2850000",
    productImages: "Gambar Produk",
    uploadImage: "Upload Gambar",
    addMore: "Tambah Lagi",
    save: "Simpan Perubahan",
    cancel: "Batal",
    deactivate: "Nonaktifkan",
    activate: "Aktifkan",
    delete: "Hapus",
    noImages: "Belum ada gambar. Upload gambar produk.",
    dragDrop: "Klik untuk upload gambar produk",
    acceptFormat: "Format: JPG, PNG, WebP (maks 5MB)",
    saved: "Tersimpan",
    invalidPrice: "Harga jual harus lebih dari 0",
    descRequired: "Deskripsi produk tidak boleh kosong",
    imageRequired: "Minimal 1 gambar produk harus diupload",
    prevPage: "Sebelumnya",
    nextPage: "Selanjutnya",
    page: "Halaman",
  },
  en: {
    title: "Product Catalog",
    subtitle: "Manage TuneBoss product catalog. You can add descriptions, images, and selling prices.",
    searchPlaceholder: "Search by product name or SKU...",
    allCategories: "All Categories",
    sku: "SKU",
    name: "Product Name",
    category: "Category",
    price: "Selling Price",
    stock: "Stock",
    review: "Review",
    actions: "Actions",
    active: "Active",
    outOfStock: "Out of Stock",
    showing: "Showing",
    of: "of",
    products: "products",
    editProduct: "Edit Product",
    createProduct: "Add Product",
    editProductDesc: "Add a description, images, and set the selling price for this product to display on the marketplace.",
    description: "Description",
    descPlaceholder: "Write product description to display on the store...",
    sellingPrice: "Selling Price (Rp)",
    pricePlaceholder: "Example: 2850000",
    productImages: "Product Images",
    uploadImage: "Upload Image",
    addMore: "Add More",
    save: "Save Changes",
    cancel: "Cancel",
    deactivate: "Deactivate",
    activate: "Activate",
    delete: "Delete",
    noImages: "No images yet. Upload product images.",
    dragDrop: "Click to upload product images",
    acceptFormat: "Format: JPG, PNG, WebP (max 5MB)",
    saved: "Saved",
    invalidPrice: "Selling price must be greater than 0",
    descRequired: "Product description cannot be empty",
    imageRequired: "At least 1 product image must be uploaded",
    prevPage: "Previous",
    nextPage: "Next",
    page: "Page",
  },
} as const

const productsIdrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function formatIDR(amount: number) {
  return productsIdrFormatter.format(amount)
}

const getProductSchema = (t: typeof messages.id | typeof messages.en) => z.object({
  description: z.string().min(1, t.descRequired),
  name: z.string().min(2),
  price: z.number().min(1, t.invalidPrice),
  images: z.array(z.string()),
  sku: z.string().min(2),
  stock: z.number().min(0),
})

type ProductFormValues = z.infer<ReturnType<typeof getProductSchema>>
type AdminProductRow = Product & { isActive: boolean }

function ProductReviewItem({ name, rating, text }: { name: string, rating: number, text: string }) {
  return (
    <div className="flex flex-col gap-2 py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <div className="flex items-center gap-0.5 text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn("size-3", star <= rating ? "fill-current" : "text-muted/30")} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-left leading-relaxed">{text}</p>
    </div>
  )
}

type EditProductDialogProps = {
  editingProduct: AdminProductRow | null
  setEditingProduct: (p: AdminProductRow | null) => void
  handleSubmit: UseFormHandleSubmit<ProductFormValues>
  onSubmit: (data: ProductFormValues) => void
  t: typeof messages.id | typeof messages.en
  register: UseFormRegister<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
  currentPriceWatcher: number | string
  formatIDR: (amount: number) => string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  editImages: string[]
  handleRemoveImage: (idx: number) => void
}

function EditProductDialog({
  editingProduct,
  setEditingProduct,
  handleSubmit,
  onSubmit,
  t,
  register,
  errors,
  currentPriceWatcher,
  formatIDR,
  fileInputRef,
  handleFileUpload,
  editImages,
  handleRemoveImage
}: EditProductDialogProps) {
  return (
    <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
      <DialogContent className="max-w-3xl w-[95vw] flex flex-col max-h-[85vh] p-0 overflow-hidden">
        {editingProduct && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b border-border/50">
              <DialogTitle className="flex items-center gap-2">
                <Edit className="size-5 text-primary" />
                {editingProduct.id ? t.editProduct : t.createProduct}
              </DialogTitle>
              <DialogDescription>{t.editProductDesc}</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Product identifier */}
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3 flex items-center gap-3">
                <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Package className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{editingProduct.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{editingProduct.sku} · {editingProduct.category}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t.name}</label>
                  <Input className="bg-background/50 border-border/60" aria-invalid={!!errors.name} {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t.sku}</label>
                  <Input className="bg-background/50 border-border/60 font-mono" aria-invalid={!!errors.sku} {...register("sku")} />
                  {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
                </div>
              </div>

              {/* Description - full width */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t.description}</label>
                <textarea
                  placeholder={t.descPlaceholder}
                  rows={4}
                  className="flex min-h-[100px] w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-y"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Selling Price - full width */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t.sellingPrice}</label>
                <Input
                  type="number"
                  placeholder={t.pricePlaceholder}
                  className="bg-background/50 border-border/60 font-mono"
                  aria-invalid={!!errors.price}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price ? (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                ) : (currentPriceWatcher && Number(currentPriceWatcher) > 0) ? (
                  <p className="text-xs text-muted-foreground">
                    Preview: <strong className="text-foreground">{formatIDR(Number(currentPriceWatcher))}</strong>
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t.stock}</label>
                <Input
                  type="number"
                  className="bg-background/50 border-border/60 font-mono"
                  aria-invalid={!!errors.stock}
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>

              {/* Product Images - full width */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t.productImages}</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  aria-label="Upload product images"
                />

                {editImages.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-2">
                      {editImages.map((url: string, idx: number) => (
                        <div key={url} className="relative group aspect-square rounded-md border border-border/50 overflow-hidden bg-muted/30">
                          <>
                            <Image
                              src={url}
                              alt={`Product ${idx + 1}`}
                              fill
                              sizes="150px"
                              unoptimized
                              className="object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = ""
                                ;(e.target as HTMLImageElement).alt = "Error"
                                ;(e.target as HTMLImageElement).className = "size-full flex items-center justify-center bg-destructive/10 text-destructive text-xs"
                              }}
                            />
                          </>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs"
                    >
                      <Upload className="size-3.5" />
                      {t.addMore}
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-border/60 p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <Upload className="size-7 mx-auto mb-2 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                    <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{t.dragDrop}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{t.acceptFormat}</p>
                  </button>
                )}
                {errors.images && (
                  <p className="text-xs text-destructive mt-1">{errors.images.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="m-0 px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-row justify-end gap-2 shrink-0 rounded-b-xl">
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)} className="text-xs">
                {t.cancel}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5">
                {t.save}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function ProductsPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]

  const [state, dispatch] = React.useReducer(
    (state: { searchQuery: string, selectedCategory: string, page: number }, action: { type: 'SET_SEARCH', payload: string } | { type: 'SET_CATEGORY', payload: string } | { type: 'SET_PAGE', payload: number }) => {
      switch (action.type) {
        case 'SET_SEARCH': return { ...state, searchQuery: action.payload, page: 1 }
        case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload, page: 1 }
        case 'SET_PAGE': return { ...state, page: action.payload }
        default: return state
      }
    },
    { searchQuery: "", selectedCategory: "ALL", page: 1 }
  )
  const { searchQuery, selectedCategory, page } = state
  const itemsPerPage = 10

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'SET_SEARCH', payload: value })
  }
  const handleCategoryChange = (value: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: value })
  }
  
  const [editingProduct, setEditingProduct] = React.useState<AdminProductRow | null>(null)
  const [products, setProducts] = React.useState<AdminProductRow[]>([])
  const [reviewsByProduct, setReviewsByProduct] = React.useState<Record<string, AdminProductReview[]>>({})
  const [loadError, setLoadError] = React.useState("")
  
  // Custom states for images (file upload based)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Local form-only image previews; backend accepts remote image URLs only.
  const [extras, setExtras] = React.useState<Record<string, { description?: string, price?: number, images: string[] }>>({})

  React.useEffect(() => {
    let ignore = false
    getAdminProducts()
      .then((response) => {
        if (ignore) return
        setProducts(response.products.map((product) => ({
          category: product.brand,
          id: product.id,
          isActive: product.isActive,
          name: product.name,
          price: product.priceValue,
          sku: product.sku,
          status: !product.isActive ? "inactive" : product.stock <= 0 ? "out_of_stock" : "active",
          stock: product.stock,
        })))
        setExtras(Object.fromEntries(response.products.map((product) => [product.id, { description: product.description, images: product.images || [], price: product.priceValue }])))
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Gagal memuat produk"))
    return () => { ignore = true }
  }, [])

  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const productSchema = getProductSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
      description: "",
      name: "",
      price: 0,
      sku: "",
      stock: 0,
    }
  })

  const currentPriceWatcher = useWatch({ control, name: "price" })
  const editImages = useWatch({ control, name: "images" }) ?? []

  const handleEdit = (product: AdminProductRow) => {
    setEditingProduct(product)
    const existingExtras = extras[product.id]
    
    reset({
      description: existingExtras?.description || "",
      name: product.name,
      price: existingExtras?.price || product.price,
      images: existingExtras?.images || [],
      sku: product.sku,
      stock: product.stock,
    })
  }

  const handleCreate = () => {
    const product = { category: "TuneBoss", id: "", isActive: true, name: "", price: 0, sku: "", status: "active", stock: 0 } as AdminProductRow
    setEditingProduct(product)
    reset({ description: "", images: [], name: "", price: 0, sku: "", stock: 0 })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newUrls: string[] = []
    Array.from(files).forEach((file) => {
      newUrls.push(URL.createObjectURL(file))
    })
    setValue("images", [...editImages, ...newUrls], { shouldValidate: true })
    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const handleRemoveImage = (idx: number) => {
    const removed = editImages[idx]
    if (removed && removed.startsWith("blob:")) URL.revokeObjectURL(removed)
    setValue("images", editImages.filter((_, i) => i !== idx), { shouldValidate: true })
  }

  const onSubmit = (data: ProductFormValues) => {
    if (!editingProduct) return
    const remoteImages = editImages.filter((image) => /^https?:\/\//.test(image))
    const request = editingProduct.id
      ? updateAdminProduct(editingProduct.id, { description: data.description, images: remoteImages.length ? remoteImages : undefined, name: data.name, price: data.price, sku: data.sku, stock: data.stock })
      : createAdminProduct({ description: data.description, images: remoteImages.length ? remoteImages : undefined, isActive: true, name: data.name, price: data.price, sku: data.sku, stock: data.stock })

    request
      .then((response) => {
        const nextProduct: AdminProductRow = {
          category: response.product.brand,
          id: response.product.id,
          isActive: response.product.isActive,
          name: response.product.name,
          price: response.product.priceValue,
          sku: response.product.sku,
          status: !response.product.isActive ? "inactive" : response.product.stock <= 0 ? "out_of_stock" : "active",
          stock: response.product.stock,
        }
        setExtras((prev) => ({ ...prev, [response.product.id]: { description: response.product.description, images: response.product.images || [], price: response.product.priceValue } }))
        setProducts((prev) => editingProduct.id ? prev.map((product) => product.id === editingProduct.id ? nextProduct : product) : [nextProduct, ...prev])
        setEditingProduct(null)
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Gagal menyimpan produk"))
  }

  const handleToggleActive = (product: AdminProductRow) => {
    updateAdminProduct(product.id, { isActive: !product.isActive })
      .then(({ product: updated }) => {
        setProducts((prev) => prev.map((item) => item.id === product.id ? {
          ...item,
          isActive: updated.isActive,
          status: !updated.isActive ? "inactive" : updated.stock <= 0 ? "out_of_stock" : "active",
        } : item))
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Gagal mengubah status produk"))
  }

  const handleDelete = (product: AdminProductRow) => {
    if (!confirm(`Hapus produk ${product.name}?`)) return
    deleteAdminProduct(product.id)
      .then(() => setProducts((prev) => prev.filter((item) => item.id !== product.id)))
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Gagal menghapus produk"))
  }

  const loadReviews = (productId: string) => {
    getAdminProductReviews(productId)
      .then(({ reviews }) => setReviewsByProduct((prev) => ({ ...prev, [productId]: reviews })))
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Gagal memuat review"))
  }

  const getDisplayPrice = (product: Product) => {
    return extras[product.id]?.price || product.price
  }

  const hasExtras = (productId: string) => {
    const e = extras[productId]
    return e && (e.description || e.images.length > 0)
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          {loadError ? <p className="text-sm font-medium text-destructive">{loadError}</p> : null}
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
                  <Button variant="outline" size="sm" className="gap-2 text-xs font-medium shrink-0">
                    <Filter className="size-3.5 text-muted-foreground" />
                    <span>{selectedCategory === "ALL" ? t.allCategories : selectedCategory}</span>
                    <ChevronDown className="size-3 opacity-50" />
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuRadioGroup
                    value={selectedCategory}
                    onValueChange={(v) => handleCategoryChange(v as string)}
                  >
                    {categories.map((cat) => (
                      <DropdownMenuRadioItem key={cat} value={cat}>
                        {cat === "ALL" ? t.allCategories : cat}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-2 text-xs font-medium shrink-0" onClick={handleCreate}>
                <Plus className="size-3.5 text-muted-foreground" />
                {t.createProduct}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[140px]">{t.sku}</TableHead>
                    <TableHead>{t.name}</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{t.price}</TableHead>
                    <TableHead className="text-center">{t.stock}</TableHead>
                    <TableHead>{t.review}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => {
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs font-medium text-muted-foreground">{product.sku}</TableCell>
                      <TableCell className="font-medium text-sm max-w-[280px]">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {extras[product.id]?.images?.length ? (
                              <>
                                <Image
                                  src={extras[product.id].images[0]}
                                  alt="Product preview"
                                  fill
                                  sizes="32px"
                                  unoptimized
                                  className="object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src = ""
                                    ;(e.target as HTMLImageElement).alt = "!"
                                    ;(e.target as HTMLImageElement).className = "size-8 rounded flex items-center justify-center bg-destructive/10 text-destructive text-[10px]"
                                  }}
                                />
                              </>
                            ) : (
                              <Package className="size-4" />
                            )}
                          </div>
                          <div className="truncate flex flex-col gap-0.5">
                            <span className="truncate">{product.name}</span>
                            {hasExtras(product.id) && (
                              <span className="text-[10px] text-primary/80 font-medium">Diperbarui</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{product.category}</TableCell>
                      <TableCell className="font-medium">{formatIDR(getDisplayPrice(product))}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-muted border border-border/50">
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger render={
                            <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 font-medium bg-background/50" onClick={() => loadReviews(product.id)}>
                              Lihat Review
                            </Button>
                          } />
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Review Produk</DialogTitle>
                              <DialogDescription>
                                Ulasan dari pelanggan untuk {product.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-2 flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                              {(reviewsByProduct[product.id] || []).map((review) => (
                                <ProductReviewItem key={review.id} name={review.authorName} rating={review.rating} text={review.quote} />
                              ))}
                              {(reviewsByProduct[product.id] || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Belum ada review.</p>
                              ) : null}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleToggleActive(product)} className="h-8 text-xs">
                            {product.isActive ? t.deactivate : t.activate}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product)} className="h-8 text-xs text-destructive hover:text-destructive">
                            {t.delete}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="h-8 gap-1 text-xs">
                            <Edit className="size-3.5" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Tidak ada produk yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>
                {t.showing} <strong className="text-foreground">{paginatedProducts.length}</strong> {t.of} <strong className="text-foreground">{filteredProducts.length}</strong> {t.products}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, state.page - 1) })}
                  disabled={state.page === 1}
                  className="h-8 px-3 text-xs"
                >
                  {t.prevPage}
                </Button>
                <span className="px-2 font-medium">
                  {t.page} {state.page} / {Math.max(1, totalPages)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.min(totalPages, state.page + 1) })}
                  disabled={state.page === totalPages || totalPages === 0}
                  className="h-8 px-3 text-xs"
                >
                  {t.nextPage}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <EditProductDialog
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          t={t}
          register={register}
          errors={errors}
          currentPriceWatcher={currentPriceWatcher}
          formatIDR={formatIDR}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          editImages={editImages}
          handleRemoveImage={handleRemoveImage}
        />
      </div>
    </AdminLayout>
  )
}
