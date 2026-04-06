import { EmployeeForm } from "@/components/admin/employee-form"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Çalışan</h1>
      <EmployeeForm />
    </div>
  )
}
