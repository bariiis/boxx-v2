import { SerialNumberForm } from "@/components/admin/serial-number-form"

export default function NewSerialNumberPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Seri No</h1>
      <SerialNumberForm />
    </div>
  )
}
