// Centralized status badge colors for the admin panel

export const quoteStatusConfig: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Taslak", class: "bg-gray-100 text-gray-700" },
  SENT: { label: "Gönderildi", class: "bg-blue-100 text-blue-700" },
  VIEWED: { label: "Görüntülendi", class: "bg-purple-100 text-purple-700" },
  APPROVED: { label: "Onaylandı", class: "bg-green-100 text-green-700" },
  REJECTED: { label: "Reddedildi", class: "bg-red-100 text-red-700" },
  REVISED: { label: "Revize", class: "bg-orange-100 text-orange-700" },
}

export const orderStatusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Beklemede", class: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Hazırlanıyor", class: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Kargoda", class: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Teslim Edildi", class: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal", class: "bg-red-100 text-red-700" },
}

export const ticketStatusConfig: Record<string, { label: string; class: string }> = {
  OPEN: { label: "Açık", class: "bg-blue-100 text-blue-700" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", class: "bg-amber-100 text-amber-700" },
  RESOLVED: { label: "Çözüldü", class: "bg-green-100 text-green-700" },
  CLOSED: { label: "Kapatıldı", class: "bg-gray-100 text-gray-700" },
}

export const ticketPriorityConfig: Record<string, { label: string; class: string }> = {
  LOW: { label: "Düşük", class: "bg-gray-100 text-gray-600" },
  NORMAL: { label: "Normal", class: "bg-blue-100 text-blue-600" },
  HIGH: { label: "Yüksek", class: "bg-orange-100 text-orange-700" },
  URGENT: { label: "Acil", class: "bg-red-100 text-red-700" },
}

export const orgStatusConfig: Record<string, { label: string; class: string }> = {
  LEAD: { label: "Aday", class: "bg-yellow-100 text-yellow-700" },
  ACTIVE: { label: "Aktif", class: "bg-green-100 text-green-700" },
  PASSIVE: { label: "Pasif", class: "bg-gray-100 text-gray-600" },
  CUSTOMER: { label: "Müşteri", class: "bg-blue-100 text-blue-700" },
}

export function StatusBadge({ config, status }: { config: Record<string, { label: string; class: string }>; status: string }) {
  const st = config[status]
  if (!st) return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">{status}</span>
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.class}`}>{st.label}</span>
}
