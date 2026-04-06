import { OrganizationForm } from "@/components/admin/organization-form"

export default function NewOrganizationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Organizasyon</h1>
      <OrganizationForm />
    </div>
  )
}
