"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { QuoteStatus, Currency, DisplayMode } from "@/generated/prisma"

export async function getQuotes({
  search = "",
  page = 1,
  limit = 20,
  status,
}: {
  search?: string
  page?: number
  limit?: number
  status?: QuoteStatus
} = {}) {
  await requireStaff()
  const where = {
    ...(search && {
      OR: [
        { quoteNumber: { contains: search, mode: "insensitive" as const } },
        { projectName: { contains: search, mode: "insensitive" as const } },
        { organization: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(status && { status }),
  }

  const [quotes, total] = await Promise.all([
    db.quote.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, name: true, surname: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.quote.count({ where }),
  ])

  return { quotes, total, totalPages: Math.ceil(total / limit) }
}

export async function getQuote(id: string) {
  await requireStaff()
  return db.quote.findUnique({
    where: { id },
    include: {
      organization: true,
      contact: true,
      createdBy: { select: { id: true, name: true, surname: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, price: true, stock: true } },
          configItems: {
            include: {
              product: { select: { id: true, name: true, sku: true, price: true, stock: true } },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      versions: { orderBy: { version: "desc" } },
    },
  })
}

export async function getQuoteByToken(token: string) {
  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    include: {
      organization: true,
      contact: true,
      createdBy: { select: { name: true, surname: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, sku: true } },
          configItems: {
            include: { product: { select: { name: true, sku: true } } },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  // Mark as viewed
  if (quote && !quote.viewedAt) {
    await db.quote.update({
      where: { id: quote.id },
      data: { viewedAt: new Date(), status: quote.status === "SENT" ? "VIEWED" : quote.status },
    })
  }

  return quote
}

async function generateQuoteNumber() {
  const year = new Date().getFullYear()
  const prefix = `STX-${year}-`
  const lastQuote = await db.quote.findFirst({
    where: { quoteNumber: { startsWith: prefix } },
    orderBy: { quoteNumber: "desc" },
  })
  const lastNum = lastQuote ? parseInt(lastQuote.quoteNumber.replace(prefix, "")) : 0
  return `${prefix}${String(lastNum + 1).padStart(4, "0")}`
}

export async function createQuote(data: {
  organizationId?: string
  contactId?: string
  createdById: string
  currency?: Currency
  displayMode?: DisplayMode
  projectName?: string
  projectNumber?: string
  vatRate?: number
  discountPercent?: number
  discountAmount?: number
  validUntil?: string
  publicNote?: string
  internalNote?: string
}) {
  await requireStaff()
  const quoteNumber = await generateQuoteNumber()
  const validUntil = data.validUntil ? new Date(data.validUntil) : undefined

  const quote = await db.quote.create({
    data: {
      quoteNumber,
      organizationId: data.organizationId || undefined,
      contactId: data.contactId || undefined,
      createdById: data.createdById,
      currency: data.currency || "USD",
      displayMode: data.displayMode || "DETAILED",
      projectName: data.projectName || undefined,
      projectNumber: data.projectNumber || undefined,
      vatRate: data.vatRate ?? 20,
      discountPercent: data.discountPercent || undefined,
      discountAmount: data.discountAmount || undefined,
      validUntil,
      publicNote: data.publicNote || undefined,
      internalNote: data.internalNote || undefined,
    },
  })
  revalidatePath("/admin/quotes")
  return quote
}

async function saveQuoteVersion(quoteId: string) {
  const quote = await db.quote.findUnique({
    where: { id: quoteId },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true } },
          configItems: {
            include: { product: { select: { name: true, sku: true } } },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  })
  if (!quote) return

  const snapshot = {
    currency: quote.currency,
    displayMode: quote.displayMode,
    vatRate: quote.vatRate,
    discountPercent: quote.discountPercent,
    discountAmount: quote.discountAmount,
    totalAmount: quote.totalAmount,
    items: quote.items.map((item) => ({
      name: item.customName || item.product?.name || "Ürün",
      sku: item.product?.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      isOptional: item.isOptional,
      isConfig: item.isConfig,
      configItems: item.configItems.map((ci) => ({
        name: ci.customName || ci.product?.name,
        category: ci.category,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        isSelected: ci.isSelected,
        isGroupOption: ci.isGroupOption,
        groupName: ci.groupName,
      })),
    })),
  }

  await db.quoteVersion.create({
    data: {
      quoteId,
      version: quote.version,
      snapshot: snapshot as never,
    },
  })

  // Increment version
  await db.quote.update({
    where: { id: quoteId },
    data: { version: quote.version + 1 },
  })
}

export async function updateQuote(
  id: string,
  data: {
    organizationId?: string | null
    contactId?: string | null
    currency?: Currency
    displayMode?: DisplayMode
    projectName?: string
    projectNumber?: string
    vatRate?: number
    discountPercent?: number | null
    discountAmount?: number | null
    validUntil?: string | null
    publicNote?: string
    internalNote?: string
    status?: QuoteStatus
  }
) {
  await requireStaff()
  const updateData: Record<string, unknown> = { ...data }
  if (data.validUntil) updateData.validUntil = new Date(data.validUntil)
  if (data.validUntil === null) updateData.validUntil = null

  // Save version snapshot before significant changes
  if (data.status === "SENT" || data.status === "REVISED" || data.currency) {
    await saveQuoteVersion(id)
  }

  if (data.status === "SENT") {
    updateData.sentAt = new Date()
    // Send email notification
    sendQuoteEmail(id).catch(() => {})
  }
  if (data.status === "APPROVED") updateData.approvedAt = new Date()
  if (data.status === "REJECTED") updateData.rejectedAt = new Date()

  // If currency changed, convert all item prices
  if (data.currency) {
    const currentQuote = await db.quote.findUnique({ where: { id }, select: { currency: true } })
    if (currentQuote && currentQuote.currency !== data.currency) {
      await convertQuotePrices(id, currentQuote.currency, data.currency)
    }
  }

  const quote = await db.quote.update({ where: { id }, data: updateData })
  if (data.currency) await recalculateQuoteTotal(id)
  revalidatePath("/admin/quotes")
  revalidatePath(`/admin/quotes/${id}`)
  return quote
}

async function convertQuotePrices(quoteId: string, fromCurrency: Currency, toCurrency: Currency) {
  // Get exchange rates from DB (latest) or fetch from TCMB
  const rate = await getConversionRate(fromCurrency, toCurrency)
  if (!rate || rate === 1) return

  // Update all quote items
  const items = await db.quoteItem.findMany({
    where: { quoteId },
    include: { configItems: true },
  })

  for (const item of items) {
    await db.quoteItem.update({
      where: { id: item.id },
      data: { unitPrice: Math.round(item.unitPrice * rate * 100) / 100 },
    })
    for (const ci of item.configItems) {
      await db.quoteConfigItem.update({
        where: { id: ci.id },
        data: { unitPrice: Math.round(ci.unitPrice * rate * 100) / 100 },
      })
    }
  }
}

async function getConversionRate(from: Currency, to: Currency): Promise<number> {
  if (from === to) return 1

  // Get TRY rates for both currencies
  // Logic: convert from -> TRY -> to
  // TRY rates stored as "1 USD = X TRY"
  const rates = await db.exchangeRate.findMany({
    where: { source: "TCMB" },
    orderBy: { date: "desc" },
    take: 10,
  })

  // Build rate map: currency -> TRY sell rate
  const tryRates: Record<string, number> = { TRY: 1 }
  for (const r of rates) {
    if (!tryRates[r.currency]) {
      tryRates[r.currency] = r.sellRate
    }
  }

  // If we don't have rates, try fetching from TCMB
  if (!tryRates[from] || !tryRates[to]) {
    try {
      const { fetchTCMBRates } = await import("@/lib/exchange-rates")
      const tcmbRates = await fetchTCMBRates()
      for (const r of tcmbRates) {
        tryRates[r.code] = r.sellRate

        // Save to DB for future use
        await db.exchangeRate.create({
          data: {
            currency: r.code as Currency,
            buyRate: r.buyRate,
            sellRate: r.sellRate,
            source: "TCMB",
          },
        }).catch(() => {}) // ignore duplicates
      }
    } catch {
      // TCMB fetch failed, can't convert
      return 1
    }
  }

  const fromRate = tryRates[from] // 1 FROM = X TRY
  const toRate = tryRates[to]     // 1 TO = Y TRY

  if (!fromRate || !toRate) return 1

  // from -> TRY -> to: amount * fromRate / toRate
  return fromRate / toRate
}

export async function deleteQuote(id: string) {
  await requireStaff()
  await db.quote.delete({ where: { id } })
  revalidatePath("/admin/quotes")
}

// ==========================================
// QUOTE ITEMS
// ==========================================

export async function addQuoteItem(data: {
  quoteId: string
  productId?: string
  customName?: string
  description?: string
  quantity?: number
  unitPrice: number
  isOptional?: boolean
  isConfig?: boolean
  sortOrder?: number
}) {
  await requireStaff()
  const item = await db.quoteItem.create({ data })
  await recalculateQuoteTotal(data.quoteId)
  revalidatePath(`/admin/quotes/${data.quoteId}`)
  return item
}

export async function updateQuoteItem(
  id: string,
  quoteId: string,
  data: {
    customName?: string
    description?: string
    quantity?: number
    unitPrice?: number
    isOptional?: boolean
    sortOrder?: number
  }
) {
  await requireStaff()
  const item = await db.quoteItem.update({ where: { id }, data })
  await recalculateQuoteTotal(quoteId)
  revalidatePath(`/admin/quotes/${quoteId}`)
  return item
}

export async function removeQuoteItem(id: string, quoteId: string) {
  await requireStaff()
  await db.quoteItem.delete({ where: { id } })
  await recalculateQuoteTotal(quoteId)
  revalidatePath(`/admin/quotes/${quoteId}`)
}

// ==========================================
// QUOTE CONFIG ITEMS
// ==========================================

export async function addQuoteConfigItem(data: {
  quoteItemId: string
  productId?: string
  customName?: string
  category?: string
  quantity?: number
  unitPrice: number
  isGroupOption?: boolean
  groupName?: string
  isSelected?: boolean
  sortOrder?: number
}) {
  await requireStaff()
  const item = await db.quoteConfigItem.create({ data })
  const quoteItem = await db.quoteItem.findUnique({ where: { id: data.quoteItemId } })
  if (quoteItem) await recalculateQuoteTotal(quoteItem.quoteId)
  return item
}

export async function updateQuoteConfigItem(
  id: string,
  data: {
    customName?: string
    category?: string
    quantity?: number
    unitPrice?: number
    isGroupOption?: boolean
    groupName?: string
    isSelected?: boolean
  }
) {
  await requireStaff()
  const item = await db.quoteConfigItem.update({ where: { id }, data })
  const quoteItem = await db.quoteItem.findUnique({ where: { id: item.quoteItemId } })
  if (quoteItem) await recalculateQuoteTotal(quoteItem.quoteId)
  return item
}

export async function removeQuoteConfigItem(id: string) {
  await requireStaff()
  const configItem = await db.quoteConfigItem.findUnique({
    where: { id },
    include: { quoteItem: { select: { quoteId: true } } },
  })
  await db.quoteConfigItem.delete({ where: { id } })
  if (configItem) await recalculateQuoteTotal(configItem.quoteItem.quoteId)
}

export async function reorderQuoteItems(quoteId: string, itemIds: string[]) {
  await requireStaff()
  await db.$transaction(
    itemIds.map((id, index) =>
      db.quoteItem.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath(`/admin/quotes/${quoteId}`)
}

export async function reorderQuoteConfigItems(quoteItemId: string, configItemIds: string[]) {
  await requireStaff()
  await db.$transaction(
    configItemIds.map((id, index) =>
      db.quoteConfigItem.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  const quoteItem = await db.quoteItem.findUnique({ where: { id: quoteItemId }, select: { quoteId: true } })
  if (quoteItem) revalidatePath(`/admin/quotes/${quoteItem.quoteId}`)
}

// ==========================================
// RECALCULATE
// ==========================================

async function recalculateQuoteTotal(quoteId: string) {
  const items = await db.quoteItem.findMany({
    where: { quoteId },
    include: { configItems: true },
  })

  let total = 0
  for (const item of items) {
    if (item.isOptional) continue
    if (item.isConfig) {
      const configTotal = item.configItems
        .filter((ci) => ci.isSelected)
        .reduce((sum, ci) => sum + ci.unitPrice * ci.quantity, 0)
      total += (item.unitPrice + configTotal) * item.quantity
    } else {
      total += item.unitPrice * item.quantity
    }
  }

  const quote = await db.quote.findUnique({ where: { id: quoteId } })
  if (quote) {
    if (quote.discountPercent) {
      total = total * (1 - quote.discountPercent / 100)
    } else if (quote.discountAmount) {
      total = total - quote.discountAmount
    }
  }

  await db.quote.update({
    where: { id: quoteId },
    data: { totalAmount: Math.max(0, total) },
  })
}

// ==========================================
// QUOTE ACTIONS (STATUS)
// ==========================================

export async function approveQuote(token: string) {
  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
          configItems: {
            include: { product: { select: { id: true, name: true, sku: true } } },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  })
  if (!quote) return null

  // Check stock availability before approving
  const stockErrors: string[] = []
  for (const item of quote.items) {
    if (item.productId) {
      const product = await db.product.findUnique({ where: { id: item.productId }, select: { name: true, stock: true } })
      if (product && product.stock < item.quantity) {
        stockErrors.push(`${product.name}: ${product.stock} stokta, ${item.quantity} gerekli`)
      }
    }
    if (item.isConfig) {
      for (const ci of item.configItems.filter((c) => c.isSelected && c.productId)) {
        const product = await db.product.findUnique({ where: { id: ci.productId! }, select: { name: true, stock: true } })
        const needed = ci.quantity * item.quantity
        if (product && product.stock < needed) {
          stockErrors.push(`${product.name}: ${product.stock} stokta, ${needed} gerekli`)
        }
      }
    }
  }
  if (stockErrors.length > 0) {
    throw new Error(`Yetersiz stok:\n${stockErrors.join("\n")}`)
  }

  // Update quote status
  await db.quote.update({
    where: { id: quote.id },
    data: { status: "APPROVED", approvedAt: new Date() },
  })

  // Generate order number
  const year = new Date().getFullYear()
  const prefix = `SIP-${year}-`
  const lastOrder = await db.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
  })
  const lastNum = lastOrder ? parseInt(lastOrder.orderNumber.replace(prefix, "")) : 0
  const orderNumber = `${prefix}${String(lastNum + 1).padStart(4, "0")}`

  const vatAmount = quote.totalAmount * (quote.vatRate / 100)

  // Create order from quote
  const order = await db.order.create({
    data: {
      orderNumber,
      quoteId: quote.id,
      organizationId: quote.organizationId,
      contactId: quote.contactId,
      currency: quote.currency,
      totalAmount: quote.totalAmount,
      vatAmount,
      vatRate: quote.vatRate,
      status: "PENDING",
    },
  })

  // Create order items + decrease stock
  for (const item of quote.items) {
    const configSummary = item.isConfig
      ? item.configItems
          .filter((ci) => ci.isSelected)
          .map((ci) => ({
            name: ci.customName || ci.product?.name || "",
            quantity: ci.quantity,
            unitPrice: ci.unitPrice,
          }))
      : undefined

    await db.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        name: item.customName || item.product?.name || "Ürün",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        configuration: configSummary ? (configSummary as never) : undefined,
      },
    })

    // Decrease stock for main product
    if (item.productId) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }).catch(() => {})
    }

    // Decrease stock for config items
    if (item.isConfig) {
      for (const ci of item.configItems.filter((c) => c.isSelected && c.productId)) {
        await db.product.update({
          where: { id: ci.productId! },
          data: { stock: { decrement: ci.quantity * item.quantity } },
        }).catch(() => {})
      }
    }
  }

  // Generate serial numbers for each product item
  for (const item of quote.items) {
    if (!item.productId) continue

    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { name: true, warrantyMonths: true },
    })
    if (!product) continue

    const warrantyEnd = new Date()
    warrantyEnd.setMonth(warrantyEnd.getMonth() + (product.warrantyMonths || 24))

    // Config summary for the serial number
    const configText = item.isConfig
      ? item.configItems
          .filter((ci) => ci.isSelected)
          .map((ci) => `${ci.category || ""}: ${ci.customName || ci.product?.name || ""} x${ci.quantity}`)
          .filter(Boolean)
          .join("\n")
      : undefined

    // Generate one serial per quantity
    for (let q = 0; q < item.quantity; q++) {
      const snPrefix = "SN"
      const timestamp = Date.now().toString(36).toUpperCase()
      const random = Math.random().toString(36).substring(2, 6).toUpperCase()
      const serialNumber = `${snPrefix}-${timestamp}-${random}`

      await db.serialNumber.create({
        data: {
          serialNumber,
          productId: item.productId,
          organizationId: quote.organizationId,
          contactId: quote.contactId,
          orderId: order.id,
          warrantyStart: new Date(),
          warrantyEnd,
          configuration: configText,
          notes: `Sipariş: ${order.orderNumber} | Teklif: ${quote.quoteNumber}`,
        },
      })
    }
  }

  revalidatePath("/admin/orders")
  revalidatePath("/admin/products")
  revalidatePath("/admin/serial-numbers")

  // Send order confirmation email
  sendOrderConfirmationEmail(order.id).catch(() => {})

  return order
}

export async function rejectQuote(token: string) {
  const quote = await db.quote.findUnique({ where: { publicToken: token } })
  if (!quote) return null
  return db.quote.update({
    where: { id: quote.id },
    data: { status: "REJECTED", rejectedAt: new Date() },
  })
}

export async function selectGroupOption(token: string, configItemId: string) {
  // Find the config item and its group
  const item = await db.quoteConfigItem.findUnique({
    where: { id: configItemId },
    include: { quoteItem: { include: { quote: true } } },
  })
  if (!item || !item.groupName || item.quoteItem.quote.publicToken !== token) return null

  // Deselect all items in the same group, select this one
  const siblings = await db.quoteConfigItem.findMany({
    where: { quoteItemId: item.quoteItemId, groupName: item.groupName, isGroupOption: true },
  })

  await db.$transaction(
    siblings.map((s) =>
      db.quoteConfigItem.update({
        where: { id: s.id },
        data: { isSelected: s.id === configItemId },
      })
    )
  )

  // Recalculate
  await recalculateQuoteTotal(item.quoteItem.quoteId)
  return true
}

export async function cloneQuote(id: string, userId: string) {
  await requireStaff()
  const original = await getQuote(id)
  if (!original) return null

  const quoteNumber = await generateQuoteNumber()
  const clone = await db.quote.create({
    data: {
      quoteNumber,
      status: "DRAFT",
      currency: original.currency,
      displayMode: original.displayMode,
      projectName: original.projectName,
      projectNumber: original.projectNumber,
      vatRate: original.vatRate,
      discountPercent: original.discountPercent,
      discountAmount: original.discountAmount,
      publicNote: original.publicNote,
      internalNote: original.internalNote,
      organizationId: original.organizationId,
      contactId: original.contactId,
      createdById: userId,
      totalAmount: original.totalAmount,
    },
  })

  // Clone items
  for (const item of original.items) {
    const newItem = await db.quoteItem.create({
      data: {
        quoteId: clone.id,
        productId: item.productId,
        customName: item.customName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        isOptional: item.isOptional,
        isConfig: item.isConfig,
        sortOrder: item.sortOrder,
      },
    })
    // Clone config items
    for (const ci of item.configItems) {
      await db.quoteConfigItem.create({
        data: {
          quoteItemId: newItem.id,
          productId: ci.productId,
          customName: ci.customName,
          category: ci.category,
          quantity: ci.quantity,
          unitPrice: ci.unitPrice,
          isGroupOption: ci.isGroupOption,
          groupName: ci.groupName,
          isSelected: ci.isSelected,
          sortOrder: ci.sortOrder,
        },
      })
    }
  }

  revalidatePath("/admin/quotes")
  return clone
}

// ==========================================
// EMAIL NOTIFICATIONS
// ==========================================

async function sendQuoteEmail(quoteId: string) {
  const quote = await db.quote.findUnique({
    where: { id: quoteId },
    include: {
      organization: true,
      contact: true,
      createdBy: { select: { id: true } },
    },
  })
  if (!quote) return

  const recipientEmail = quote.contact?.email || quote.organization?.email
  if (!recipientEmail) return

  const customerName = quote.contact
    ? `${quote.contact.firstName} ${quote.contact.lastName}`
    : quote.organization?.name || "Müşteri"

  const settings = await db.setting.findUnique({ where: { key: "company_name" } })
  const companyName = settings?.value || "STUUX"

  const { sendEmail, quoteEmailTemplate } = await import("@/lib/email")
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/quote/${quote.publicToken}`

  await sendEmail(
    {
      to: recipientEmail,
      subject: `${companyName} - Teklif ${quote.quoteNumber}`,
      html: quoteEmailTemplate({
        quoteNumber: quote.quoteNumber,
        companyName,
        customerName,
        projectName: quote.projectName || undefined,
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        publicUrl,
      }),
    },
    quote.createdBy.id
  )
}

export async function sendOrderConfirmationEmail(orderId: string) {
  await requireStaff()
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      organization: true,
      contact: true,
    },
  })
  if (!order) return

  const recipientEmail = order.contact?.email || order.organization?.email
  if (!recipientEmail) return

  const customerName = order.contact
    ? `${order.contact.firstName} ${order.contact.lastName}`
    : order.organization?.name || "Müşteri"

  const settings = await db.setting.findUnique({ where: { key: "company_name" } })
  const companyName = settings?.value || "STUUX"

  const { sendEmail, orderConfirmationTemplate } = await import("@/lib/email")

  await sendEmail({
    to: recipientEmail,
    subject: `${companyName} - Sipariş Onayı ${order.orderNumber}`,
    html: orderConfirmationTemplate({
      orderNumber: order.orderNumber,
      companyName,
      customerName,
      totalAmount: order.totalAmount + order.vatAmount,
      currency: order.currency,
    }),
  })
}
