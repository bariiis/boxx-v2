"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ImagePlus,
  Star,
  Trash2,
  Upload,
  Loader2,
  GripVertical,
  X,
} from "lucide-react"
import {
  addProductImage,
  deleteProductImage,
  setHeroImage,
  reorderProductImages,
} from "@/lib/actions/product-actions"
import { toast } from "sonner"

interface ProductImage {
  id: string
  url: string
  alt: string | null
  sortOrder: number
}

interface ProductImageManagerProps {
  productId: string
  images: ProductImage[]
  heroImage: string | null
}

export function ProductImageManager({
  productId,
  images: initialImages,
  heroImage: initialHero,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [heroImage, setHeroImageState] = useState(initialHero)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        ["image/png", "image/jpeg", "image/webp"].includes(f.type)
      )

      if (fileArray.length === 0) {
        toast.error("Desteklenmeyen format. PNG, JPG veya WebP yükleyin.")
        return
      }

      setUploading(true)

      for (const file of fileArray) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: 5MB'dan büyük dosyalar yüklenemez`)
          continue
        }

        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("productId", productId)

          const res = await fetch("/api/upload/product-image", {
            method: "POST",
            body: formData,
          })

          if (!res.ok) {
            const err = await res.json()
            toast.error(err.error || "Yükleme başarısız")
            continue
          }

          const { url } = await res.json()
          const newImage = await addProductImage(productId, url, file.name)
          setImages((prev) => [...prev, newImage])
          toast.success(`${file.name} yüklendi`)
        } catch {
          toast.error(`${file.name} yüklenirken hata oluştu`)
        }
      }

      setUploading(false)
    },
    [productId]
  )

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const deleted = await deleteProductImage(deleteId)
      setImages((prev) => prev.filter((img) => img.id !== deleteId))
      if (heroImage === deleted.url) {
        setHeroImageState(null)
      }
      toast.success("Görsel silindi")
    } catch {
      toast.error("Silme başarıs��z")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  async function handleSetHero(url: string) {
    try {
      await setHeroImage(productId, url)
      setHeroImageState(url)
      toast.success("Kapak görseli güncellendi")
    } catch {
      toast.error("Güncelleme başarısız")
    }
  }

  function handleDragStart(index: number) {
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return

    const updated = [...images]
    const [moved] = updated.splice(draggedIdx, 1)
    updated.splice(index, 0, moved)
    setImages(updated)
    setDraggedIdx(index)
  }

  async function handleDragEnd() {
    if (draggedIdx === null) return
    setDraggedIdx(null)
    try {
      await reorderProductImages(
        productId,
        images.map((img) => img.id)
      )
    } catch {
      toast.error("Sıralama kaydedilemedi")
    }
  }

  function handleDropZone(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="size-5" />
          Ürün Görselleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDropZone}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="size-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {uploading
              ? "Yükleniyor..."
              : "Görselleri sürükleyin veya tıklayarak seçin"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WebP - Maks. 5MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) uploadFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, index) => {
              const isHero = heroImage === img.url

              return (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative aspect-square overflow-hidden rounded-lg border bg-muted ${
                    draggedIdx === index ? "opacity-50" : ""
                  } ${isHero ? "ring-2 ring-primary" : ""}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || "Ürün görseli"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Hero badge */}
                  {isHero && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      <Star className="size-3" />
                      Kapak
                    </div>
                  )}

                  {/* Drag handle */}
                  <div className="absolute left-2 top-2 rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="size-4 text-white" />
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {!isHero && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetHero(img.url)
                        }}
                      >
                        <Star className="mr-1 size-3" />
                        Kapak Yap
                      </Button>
                    )}
                    <Dialog
                      open={deleteId === img.id}
                      onOpenChange={(open) => !open && setDeleteId(null)}
                    >
                      <DialogTrigger
                        render={
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-7 w-7 shrink-0 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteId(img.id)
                            }}
                          />
                        }
                      >
                          <Trash2 className="size-3" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Görseli Sil</DialogTitle>
                          <DialogDescription>
                            Bu görseli silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                          >
                            İptal
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                          >
                            {deleting ? "Siliniyor..." : "Sil"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Henüz görsel eklenmemiş.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
