"use client"

import * as React from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboardLanguage } from "@/components/dashboard-language"
import {
  Upload,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Star,
  Palette,
  MessageSquareQuote,
  Monitor,
  FileImage,
  FileVideo,
  Search,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAdminContent, updateAdminContent, uploadAdminFile } from "@/lib/api"

const messages = {
  id: {
    title: "Konten Toko",
    subtitle: "Kelola tampilan hero banner dan testimoni yang muncul di halaman marketplace.",
    heroBanner: "Hero Banner",
    heroBannerDesc: "Upload gambar atau video yang tampil di bagian atas halaman utama dan halaman produk.",
    homeHero: "Hero Halaman Utama",
    productsHero: "Hero Halaman Produk",
    image: "Gambar",
    video: "Video",
    uploadImage: "Upload Gambar",
    uploadVideo: "Upload Video",
    changeFile: "Ganti File",
    removeFile: "Hapus",
    preview: "Preview",
    noMedia: "Belum ada media. Upload gambar atau video.",
    dragDrop: "Drag & drop atau klik untuk upload",
    acceptImage: "Format: JPG, PNG, WebP (maks 5MB)",
    acceptVideo: "Format: MP4, WebM (maks 50MB)",
    testimonials: "Testimoni Pilihan",
    testimonialsDesc: "Pilih dari review pelanggan yang sudah ada untuk ditampilkan di halaman utama.",
    searchReview: "Cari review berdasarkan nama atau komentar...",
    selected: "Terpilih",
    allReviews: "Semua Review",
    selectedOnly: "Terpilih Saja",
    visible: "Tampil",
    hidden: "Tersembunyi",
    selectAll: "Pilih Semua",
    deselectAll: "Batal Semua",
    save: "Simpan Perubahan",
    saving: "Menyimpan...",
    saved: "Berhasil Disimpan",
    product: "Produk",
    homeHeroRequired: "Hero Halaman Utama belum diupload",
    productsHeroRequired: "Hero Halaman Produk belum diupload",
    minTestimonials: "Pilih setidaknya 1 testimoni untuk ditampilkan",
    allRatings: "Semua Rating",
    stars: "Bintang",
  },
  en: {
    title: "Store Content",
    subtitle: "Manage hero banners and testimonials displayed on the marketplace pages.",
    heroBanner: "Hero Banner",
    heroBannerDesc: "Upload images or videos displayed at the top of the home page and products page.",
    homeHero: "Home Page Hero",
    productsHero: "Products Page Hero",
    image: "Image",
    video: "Video",
    uploadImage: "Upload Image",
    uploadVideo: "Upload Video",
    changeFile: "Change File",
    removeFile: "Remove",
    preview: "Preview",
    noMedia: "No media yet. Upload an image or video.",
    dragDrop: "Drag & drop or click to upload",
    acceptImage: "Format: JPG, PNG, WebP (max 5MB)",
    acceptVideo: "Format: MP4, WebM (max 50MB)",
    testimonials: "Featured Testimonials",
    testimonialsDesc: "Pick from existing customer reviews to display on the home page.",
    searchReview: "Search reviews by name or comment...",
    selected: "Selected",
    allReviews: "All Reviews",
    selectedOnly: "Selected Only",
    visible: "Visible",
    hidden: "Hidden",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    save: "Save Changes",
    saving: "Saving...",
    saved: "Saved Successfully",
    product: "Product",
    homeHeroRequired: "Home Page Hero is required",
    productsHeroRequired: "Products Page Hero is required",
    minTestimonials: "Select at least 1 testimonial to display",
    allRatings: "All Ratings",
    stars: "Stars",
  },
} as const

const getContentSchema = (t: typeof messages.id | typeof messages.en) => z.object({
  homeHero: z.string().min(1, t.homeHeroRequired),
  productsHero: z.string().min(1, t.productsHeroRequired),
  selectedTestimonials: z.array(z.string()).min(1, t.minTestimonials),
})

type HeroBanner = {
  mediaType: "image" | "video"
  file: File | null
  previewUrl: string
  fileName: string
}

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  product: string
  selected: boolean
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`size-3 ${s <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
)

const handleFileUpload = (
  setHero: React.Dispatch<React.SetStateAction<HeroBanner>>,
  mediaType: "image" | "video"
) => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = mediaType === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setHero({ mediaType, file, previewUrl, fileName: file.name })
  }
  input.click()
}

const removeHeroFile = (setHero: React.Dispatch<React.SetStateAction<HeroBanner>>) => {
  setHero((prev) => {
    if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl)
    return { ...prev, file: null, previewUrl: "", fileName: "" }
  })
}

function mediaTypeFromUrl(url: string): "image" | "video" {
  return /\.(mp4|webm)(\?|$)/i.test(url) ? "video" : "image"
}

const HeroBannerCard = ({
  t,
  label,
  hero,
  setHero,
  errors,
}: {
  t: typeof messages.id | typeof messages.en
  label: string
  hero: HeroBanner
  setHero: React.Dispatch<React.SetStateAction<HeroBanner>>
  errors: { homeHero?: string, productsHero?: string }
}) => (
  <div className="space-y-3 rounded-lg border border-border/50 p-4 bg-background/50">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
      <div className="flex items-center gap-1 rounded-md border border-border/50 p-0.5">
        <button
          type="button"
          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${hero.mediaType === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => {
            removeHeroFile(setHero)
            setHero((p) => ({ ...p, mediaType: "image" }))
          }}
        >
          {t.image}
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${hero.mediaType === "video" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => {
            removeHeroFile(setHero)
            setHero((p) => ({ ...p, mediaType: "video" }))
          }}
        >
          {t.video}
        </button>
      </div>
    </div>

    {/* Upload / Preview */}
    {hero.previewUrl ? (
      <div className="space-y-2">
        <div className="rounded-md border border-border/50 overflow-hidden bg-muted/20 aspect-[21/9] relative">
          {hero.mediaType === "image" ? (
            <>
              <Image src={hero.previewUrl} alt="Hero preview" fill sizes="100vw" unoptimized className="object-cover" />
            </>
          ) : (
            <video src={hero.previewUrl} className="size-full object-cover" controls aria-label="Hero video preview">
              <track kind="captions" src="" label="English" />
            </video>
          )}
          <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] uppercase">
            {t.preview}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{hero.fileName}</span>
          <div className="flex gap-1.5">
            <Button type="button" variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={() => handleFileUpload(setHero, hero.mediaType)}>
              <Upload className="size-3" />
              {t.changeFile}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 text-[11px] text-destructive hover:text-destructive gap-1" onClick={() => removeHeroFile(setHero)}>
              <X className="size-3" />
              {t.removeFile}
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => handleFileUpload(setHero, hero.mediaType)}
        className="w-full rounded-lg border-2 border-dashed border-border/60 p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group"
      >
        {hero.mediaType === "image" ? (
          <FileImage className="size-8 mx-auto mb-2 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        ) : (
          <FileVideo className="size-8 mx-auto mb-2 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        )}
        <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{t.dragDrop}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {hero.mediaType === "image" ? t.acceptImage : t.acceptVideo}
        </p>
      </button>
    )}
    {errors[label === t.homeHero ? "homeHero" : "productsHero"] && (
      <p className="text-xs text-destructive font-medium mt-1">
        {errors[label === t.homeHero ? "homeHero" : "productsHero"]}
      </p>
    )}
  </div>
)

export default function ContentPage() {
  const { language } = useDashboardLanguage()
  const t = messages[language]

  type State = {
    homeHero: HeroBanner
    productsHero: HeroBanner
    reviews: Review[]
    searchQuery: string
    filterMode: "all" | "selected"
    ratingFilter: number
    saving: boolean
    saved: boolean
    errors: { homeHero?: string, productsHero?: string, selectedTestimonials?: string }
  }

  const [state, setState] = React.useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    {
      homeHero: { mediaType: "image", file: null, previewUrl: "", fileName: "" },
      productsHero: { mediaType: "image", file: null, previewUrl: "", fileName: "" },
      reviews: [],
      searchQuery: "",
      filterMode: "all",
      ratingFilter: 0,
      saving: false,
      saved: false,
      errors: {}
    }
  )

  const { homeHero, productsHero, reviews, searchQuery, filterMode, ratingFilter, saving, saved, errors } = state

  const setHomeHero = (val: HeroBanner | ((prev: HeroBanner) => HeroBanner)) => setState({ homeHero: typeof val === 'function' ? val(state.homeHero) : val })
  const setProductsHero = (val: HeroBanner | ((prev: HeroBanner) => HeroBanner)) => setState({ productsHero: typeof val === 'function' ? val(state.productsHero) : val })
  const setReviews = (val: Review[] | ((prev: Review[]) => Review[])) => setState({ reviews: typeof val === 'function' ? val(state.reviews) : val })
  const setSearchQuery = (val: string | ((prev: string) => string)) => setState({ searchQuery: typeof val === 'function' ? val(state.searchQuery) : val })
  const setFilterMode = (val: "all" | "selected" | ((prev: "all" | "selected") => "all" | "selected")) => setState({ filterMode: typeof val === 'function' ? val(state.filterMode) : val })
  const setRatingFilter = (val: number | ((prev: number) => number)) => setState({ ratingFilter: typeof val === 'function' ? val(state.ratingFilter) : val })
  const setSaving = (val: boolean | ((prev: boolean) => boolean)) => setState({ saving: typeof val === 'function' ? val(state.saving) : val })
  const setSaved = (val: boolean | ((prev: boolean) => boolean)) => setState({ saved: typeof val === 'function' ? val(state.saved) : val })
  const setErrors = (val: { homeHero?: string, productsHero?: string, selectedTestimonials?: string } | ((prev: { homeHero?: string, productsHero?: string, selectedTestimonials?: string }) => { homeHero?: string, productsHero?: string, selectedTestimonials?: string })) => setState({ errors: typeof val === 'function' ? val(state.errors) : val })

  const contentSchema = getContentSchema(t)

  React.useEffect(() => {
    let cancelled = false
    getAdminContent()
      .then(({ content, reviews }) => {
        if (cancelled) return
        setState({
          homeHero: { file: null, fileName: content.homeHero ? content.homeHero.split("/").pop() || content.homeHero : "", mediaType: mediaTypeFromUrl(content.homeHero), previewUrl: content.homeHero },
          productsHero: { file: null, fileName: content.productsHero ? content.productsHero.split("/").pop() || content.productsHero : "", mediaType: mediaTypeFromUrl(content.productsHero), previewUrl: content.productsHero },
          reviews,
        })
      })
      .catch(() => {
        if (!cancelled) setReviews([])
      })
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    const selectedIds = reviews.reduce<string[]>((acc, r) => {
      if (r.selected) acc.push(r.id)
      return acc
    }, [])
    const result = contentSchema.safeParse({
      homeHero: homeHero.previewUrl,
      productsHero: productsHero.previewUrl,
      selectedTestimonials: selectedIds,
    })

    if (!result.success) {
      const formatted = result.error.format()
      setErrors({
        homeHero: formatted.homeHero?._errors[0],
        productsHero: formatted.productsHero?._errors[0],
        selectedTestimonials: formatted.selectedTestimonials?._errors[0],
      })
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const [homeUpload, productsUpload] = await Promise.all([
        homeHero.file ? uploadAdminFile(homeHero.file) : Promise.resolve({ url: homeHero.previewUrl }),
        productsHero.file ? uploadAdminFile(productsHero.file) : Promise.resolve({ url: productsHero.previewUrl }),
      ])
      const saved = await updateAdminContent({ homeHero: homeUpload.url, productsHero: productsUpload.url, selectedTestimonials: selectedIds })
      setHomeHero((prev) => ({ ...prev, file: null, previewUrl: homeUpload.url }))
      setProductsHero((prev) => ({ ...prev, file: null, previewUrl: productsUpload.url }))
      setReviews(saved.reviews.length ? saved.reviews : reviews)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload gagal"
      setErrors({ homeHero: message })
    } finally {
      setSaving(false)
    }
  }

  const toggleReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)))
  }

  const selectedCount = reviews.filter((r) => r.selected).length

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSelected = filterMode === "all" || r.selected
    const matchesRating = ratingFilter === 0 || r.rating === ratingFilter
    
    return matchesSearch && matchesSelected && matchesRating
  })



  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="size-7 text-primary" />
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* Hero Banner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="size-5 text-primary" />
              {t.heroBanner}
            </CardTitle>
            <CardDescription>{t.heroBannerDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HeroBannerCard t={t} label={t.homeHero} hero={homeHero} setHero={setHomeHero} errors={errors} />
              <HeroBannerCard t={t} label={t.productsHero} hero={productsHero} setHero={setProductsHero} errors={errors} />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquareQuote className="size-5 text-primary" />
                  {t.testimonials}
                </CardTitle>
                <CardDescription>{t.testimonialsDesc}</CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {selectedCount} {t.selected}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchReview}
                  className="pl-8 bg-background/50 border-border/60 text-xs h-8"
                />
              </div>
              
              <div className="flex gap-2 items-center justify-between sm:justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="outline" size="sm" className="h-8 text-xs font-normal bg-background/50 border-border/60 justify-between min-w-[130px]" />
                  }>
                    {ratingFilter === 0 ? t.allRatings : `${ratingFilter} ${t.stars}`}
                    <ChevronDown className="size-3.5 opacity-50 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[130px] min-w-[130px]">
                    <DropdownMenuItem onClick={() => setRatingFilter(0)} className="text-xs cursor-pointer">{t.allRatings}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRatingFilter(5)} className="text-xs cursor-pointer">5 {t.stars}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRatingFilter(4)} className="text-xs cursor-pointer">4 {t.stars}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRatingFilter(3)} className="text-xs cursor-pointer">3 {t.stars}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRatingFilter(2)} className="text-xs cursor-pointer">2 {t.stars}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRatingFilter(1)} className="text-xs cursor-pointer">1 {t.stars}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1 rounded-md border border-border/50 p-0.5 shrink-0">
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterMode === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setFilterMode("all")}
                  >
                    {t.allReviews}
                  </button>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterMode === "selected" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setFilterMode("selected")}
                  >
                    {t.selectedOnly}
                  </button>
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredReviews.map((review, index) => (
                <button
                  key={`${review.id}-${index}`}
                  type="button"
                  onClick={() => toggleReview(review.id)}
                  className={`w-full text-left flex items-start gap-3 rounded-lg border p-3 transition-all cursor-pointer ${
                    review.selected
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/50 bg-background/50 hover:border-border"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <input 
                      type="checkbox"
                      checked={review.selected}
                      onChange={() => toggleReview(review.id)}
                      className="size-4 cursor-pointer accent-primary border-border"
                      onClick={(e) => e.stopPropagation()} // Prevent double toggle
                      aria-label={`Pilih review dari ${review.name}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{review.name}</span>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                    <p className="text-[10px] text-muted-foreground/60">{t.product}: {review.product}</p>
                  </div>
                </button>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Tidak ada review yang ditemukan.
                </div>
              )}
            </div>
            {errors.selectedTestimonials && (
              <p className="text-xs text-destructive font-medium mt-2">
                {errors.selectedTestimonials}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="gap-2 min-w-[180px]"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.saving}
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="size-4" />
                {t.saved}
              </>
            ) : (
              <>
                <Save className="size-4" />
                {t.save}
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
