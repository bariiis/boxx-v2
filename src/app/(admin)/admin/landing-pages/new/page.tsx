import { LandingCreateForm } from "@/components/admin/landing-create-form"

export default function NewLandingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yeni Landing Page</h1>
        <p className="text-sm text-muted-foreground">
          Ürün için özel bir landing sayfası oluşturun
        </p>
      </div>
      <LandingCreateForm />
    </div>
  )
}
