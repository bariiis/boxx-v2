"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/actions/order-actions"
import { toast } from "sonner"
import type { OrderStatus } from "@/generated/prisma"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Beklemede", variant: "outline" },
  PROCESSING: { label: "Hazırlanıyor", variant: "default" },
  SHIPPED: { label: "Kargoda", variant: "secondary" },
  DELIVERED: { label: "Teslim Edildi", variant: "default" },
  CANCELLED: { label: "İptal", variant: "destructive" },
}

export function OrderStatusManager({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleChange(status: string) {
    setLoading(true)
    try {
      await updateOrderStatus(orderId, status as OrderStatus)
      toast.success("Durum güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-40 h-8">
        <SelectValue>
          <Badge variant={statusConfig[currentStatus]?.variant || "outline"}>
            {statusConfig[currentStatus]?.label || currentStatus}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([value, config]) => (
          <SelectItem key={value} value={value}>
            <Badge variant={config.variant}>{config.label}</Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
