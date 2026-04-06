"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, ImageIcon } from "lucide-react"
import { updateSettings } from "@/lib/actions/settings-actions"
import { toast } from "sonner"

interface LogoUploadProps {
  currentLogo?: string
}

export function LogoUpload({ currentLogo }: LogoUploadProps) {
  const [logo, setLogo] = useState(currentLogo || "")
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Yükleme başarısız")
        return
      }

      await updateSettings({ company_logo: data.url })
      setLogo(data.url)
      toast.success("Logo güncellendi")
    } catch {
      toast.error("Yükleme başarısız")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleRemove() {
    await updateSettings({ company_logo: "" })
    setLogo("")
    toast.success("Logo kaldırıldı")
  }

  return (
    <div className="space-y-2">
      <Label>Şirket Logosu</Label>
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
          {logo ? (
            <img src={logo} alt="Logo" className="max-h-16 max-w-36 object-contain" />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto mb-1 size-6 opacity-40" />
              <p className="text-[10px]">Logo yok</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 size-3" />
            {uploading ? "Yükleniyor..." : logo ? "Değiştir" : "Logo Yükle"}
          </Button>
          {logo && (
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={handleRemove}>
              <Trash2 className="mr-2 size-3" />
              Kaldır
            </Button>
          )}
          <p className="text-[11px] text-muted-foreground">SVG, PNG, JPG (maks. 2MB)</p>
        </div>
      </div>
    </div>
  )
}
