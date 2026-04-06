import { getSpecPresets } from "@/lib/actions/spec-preset-actions"
import { SpecPresetManager } from "@/components/admin/spec-preset-manager"

export default async function PresetsPage() {
  const presets = await getSpecPresets()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Spec Presetleri</h1>
        <p className="mt-1 text-muted-foreground">
          Ürün teknik özellik şablonlarını yönetin. Her preset, ürün oluştururken yüklenebilir.
        </p>
      </div>
      <SpecPresetManager presets={presets} />
    </div>
  )
}
