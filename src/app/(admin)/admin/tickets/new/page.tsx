import { getTicketCategories, getEmployeeList } from "@/lib/actions/ticket-actions"
import { TicketForm } from "@/components/admin/ticket-form"

export default async function NewTicketPage() {
  const [categories, employees] = await Promise.all([
    getTicketCategories(),
    getEmployeeList(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Destek Talebi</h1>
      <TicketForm categories={categories} employees={employees} />
    </div>
  )
}
