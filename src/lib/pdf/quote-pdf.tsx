import React from "react"
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer"

// Register Poppins font with full Turkish character support
import path from "path"

const fontsDir = path.join(process.cwd(), "public", "fonts")

Font.register({
  family: "Poppins",
  fonts: [
    { src: path.join(fontsDir, "Poppins-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(fontsDir, "Poppins-Bold.ttf"), fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Poppins" },
  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, backgroundColor: "#1e293b", padding: 20, borderRadius: 4, color: "white" },
  headerLeft: {},
  headerRight: { textAlign: "right" },
  companyName: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 8, color: "#94a3b8", marginTop: 2 },
  quoteNumber: { fontSize: 14, fontWeight: "bold" },
  dateText: { fontSize: 8, color: "#94a3b8", marginTop: 2 },
  statusBadge: { marginTop: 4, backgroundColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-end" },
  statusText: { fontSize: 7, color: "white", fontWeight: "bold" },
  // Customer info
  infoSection: { flexDirection: "row", marginBottom: 20, gap: 20 },
  infoBox: { flex: 1, border: "1px solid #e2e8f0", borderRadius: 4, padding: 12 },
  infoLabel: { fontSize: 7, fontWeight: "bold", color: "#94a3b8", letterSpacing: 1, marginBottom: 6 },
  infoText: { fontSize: 9, marginBottom: 2 },
  infoBold: { fontSize: 9, fontWeight: "bold", marginBottom: 2 },
  // Table
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", paddingVertical: 6, paddingHorizontal: 4 },
  tableRow: { flexDirection: "row", borderBottom: "1px solid #f1f5f9", paddingVertical: 6, paddingHorizontal: 4, alignItems: "flex-start" },
  colNum: { width: 25 },
  colProduct: { flex: 1 },
  colQty: { width: 40, textAlign: "center" },
  colPrice: { width: 90, textAlign: "right" },
  colTotal: { width: 90, textAlign: "right" },
  thText: { fontSize: 8, fontWeight: "bold", color: "#475569" },
  cellText: { fontSize: 9 },
  cellBold: { fontSize: 9, fontWeight: "bold" },
  cellSub: { fontSize: 7, color: "#64748b", marginTop: 1 },
  configItem: { fontSize: 8, color: "#475569", marginTop: 2, paddingLeft: 12 },
  groupBox: { marginTop: 4, marginLeft: 12, padding: 6, backgroundColor: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0" },
  groupLabel: { fontSize: 6, fontWeight: "bold", color: "#94a3b8", letterSpacing: 0.5, marginBottom: 3 },
  groupOption: { fontSize: 8, color: "#475569", marginBottom: 1 },
  groupSelected: { fontSize: 8, fontWeight: "bold", color: "#1e293b", marginBottom: 1 },
  // Totals
  totalsSection: { alignItems: "flex-end", marginBottom: 20 },
  totalsBox: { width: 200 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottom: "1px solid #f1f5f9" },
  totalLabel: { fontSize: 9, color: "#64748b" },
  totalValue: { fontSize: 9, fontWeight: "bold" },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTop: "2px solid #cbd5e1", marginTop: 2 },
  grandTotalLabel: { fontSize: 11, fontWeight: "bold" },
  grandTotalValue: { fontSize: 12, fontWeight: "bold" },
  // Notes
  notesBox: { border: "1px solid #e2e8f0", borderRadius: 4, padding: 12, marginBottom: 20 },
  notesLabel: { fontSize: 7, fontWeight: "bold", color: "#94a3b8", letterSpacing: 1, marginBottom: 4 },
  notesText: { fontSize: 8, color: "#475569" },
  // Footer
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center" },
  footerText: { fontSize: 7, color: "#94a3b8" },
})

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

const statusLabels: Record<string, string> = {
  DRAFT: "Taslak", SENT: "Gönderildi", VIEWED: "Görüntülendi",
  APPROVED: "Onaylandı", REJECTED: "Reddedildi", REVISED: "Revize",
}

function fmt(n: number, s: string) {
  return `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`
}

interface ConfigItem {
  customName: string | null
  category: string | null
  quantity: number
  unitPrice: number
  isGroupOption: boolean
  groupName: string | null
  isSelected: boolean
  product: { name: string } | null
}

interface QuoteItem {
  customName: string | null
  description: string | null
  quantity: number
  unitPrice: number
  isOptional: boolean
  isConfig: boolean
  product: { name: string; sku: string } | null
  configItems: ConfigItem[]
}

export interface QuotePDFData {
  quoteNumber: string
  status: string
  currency: string
  displayMode: string
  projectName: string | null
  projectNumber: string | null
  vatRate: number
  discountPercent: number | null
  discountAmount: number | null
  totalAmount: number
  validUntil: Date | null
  publicNote: string | null
  createdAt: Date
  organization: { name: string; email: string | null; phone: string | null; address: string | null; city: string | null; taxNumber: string | null } | null
  contact: { firstName: string; lastName: string; email: string | null } | null
  createdBy: { name: string | null; surname: string | null; email: string | null }
  items: QuoteItem[]
}

export function QuotePDF({ quote, companyName }: { quote: QuotePDFData; companyName: string }) {
  const s = sym[quote.currency] || "$"
  const isRecipe = quote.displayMode === "RECIPE"

  const subtotal = quote.items.reduce((sum, item) => {
    if (item.isOptional) return sum
    let itemTotal = item.unitPrice * item.quantity
    if (item.isConfig) {
      itemTotal += item.configItems
        .filter((ci) => ci.isSelected)
        .reduce((acc, ci) => acc + ci.unitPrice * ci.quantity, 0)
    }
    return sum + itemTotal
  }, 0)

  const discountAmount = quote.discountPercent
    ? subtotal * (quote.discountPercent / 100)
    : (quote.discountAmount || 0)
  const afterDiscount = subtotal - discountAmount
  const vatAmount = afterDiscount * (quote.vatRate / 100)
  const grandTotal = afterDiscount + vatAmount

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.subtitle}>High Performance Computing</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
            <Text style={styles.dateText}>
              Tarih: {new Date(quote.createdAt).toLocaleDateString("tr-TR")}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{statusLabels[quote.status] || quote.status}</Text>
            </View>
          </View>
        </View>

        {/* Customer + Project Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>MÜŞTERİ</Text>
            {quote.contact && <Text style={styles.infoBold}>{quote.contact.firstName} {quote.contact.lastName}</Text>}
            {quote.organization && <Text style={styles.infoText}>{quote.organization.name}</Text>}
            {(quote.contact?.email || quote.organization?.email) && (
              <Text style={styles.infoText}>{quote.contact?.email || quote.organization?.email}</Text>
            )}
            {quote.organization?.phone && <Text style={styles.infoText}>{quote.organization.phone}</Text>}
            {quote.organization?.address && <Text style={styles.infoText}>{quote.organization.address}{quote.organization.city ? `, ${quote.organization.city}` : ""}</Text>}
            {quote.organization?.taxNumber && <Text style={styles.infoText}>VKN: {quote.organization.taxNumber}</Text>}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>PROJE BİLGİLERİ</Text>
            {quote.projectName && <Text style={styles.infoText}>Proje: {quote.projectName}</Text>}
            {quote.projectNumber && <Text style={styles.infoText}>Proje No: {quote.projectNumber}</Text>}
            <Text style={styles.infoText}>Sorumlu: {quote.createdBy.name} {quote.createdBy.surname}</Text>
            {quote.validUntil && <Text style={styles.infoText}>Geçerlilik: {new Date(quote.validUntil).toLocaleDateString("tr-TR")}</Text>}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colNum]}>#</Text>
            <Text style={[styles.thText, styles.colProduct]}>Ürün / Hizmet</Text>
            <Text style={[styles.thText, styles.colQty]}>Adet</Text>
            <Text style={[styles.thText, styles.colPrice]}>Birim Fiyat</Text>
            <Text style={[styles.thText, styles.colTotal]}>Toplam</Text>
          </View>

          {quote.items.map((item, idx) => {
            const configTotal = item.isConfig
              ? item.configItems.filter((ci) => ci.isSelected).reduce((acc, ci) => acc + ci.unitPrice * ci.quantity, 0)
              : 0
            const lineTotal = (item.unitPrice + configTotal) * item.quantity

            // Group config items
            const regularItems = item.configItems.filter((ci) => !ci.isGroupOption && ci.isSelected)
            const groupMap = new Map<string, ConfigItem[]>()
            const renderedGroups = new Set<string>()
            for (const ci of item.configItems) {
              if (ci.isGroupOption && ci.groupName) {
                const arr = groupMap.get(ci.groupName) || []
                arr.push(ci)
                groupMap.set(ci.groupName, arr)
              }
            }

            return (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <Text style={[styles.cellText, styles.colNum]}>{idx + 1}</Text>
                <View style={styles.colProduct}>
                  <Text style={styles.cellBold}>{item.customName || item.product?.name || "Ürün"}</Text>
                  {item.isOptional && <Text style={[styles.cellSub, { color: "#f97316" }]}>Opsiyonel</Text>}

                  {item.isConfig && (
                    <View>
                      {regularItems.map((ci, i) => (
                        <Text key={i} style={styles.configItem}>
                          {ci.category ? `${ci.category}: ` : ""}{ci.customName || ci.product?.name}
                          {ci.quantity > 1 ? ` x${ci.quantity}` : ""}
                          {!isRecipe ? `  ${fmt(ci.unitPrice * ci.quantity, s)}` : ""}
                        </Text>
                      ))}
                      {/* Group items - only show selected */}
                      {item.configItems.map((ci, i) => {
                        if (!ci.isGroupOption || !ci.groupName || renderedGroups.has(ci.groupName)) return null
                        renderedGroups.add(ci.groupName)
                        const options = groupMap.get(ci.groupName) || []
                        const selected = options.find((o) => o.isSelected) || options[0]
                        if (!selected) return null
                        return (
                          <Text key={i} style={styles.configItem}>
                            {selected.category ? `${selected.category}: ` : ""}{selected.customName || selected.product?.name}
                            {selected.quantity > 1 ? ` x${selected.quantity}` : ""}
                            {!isRecipe ? `  ${fmt(selected.unitPrice * selected.quantity, s)}` : ""}
                          </Text>
                        )
                      })}
                    </View>
                  )}
                </View>
                <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.cellText, styles.colPrice]}>
                  {item.isConfig ? fmt(item.unitPrice + configTotal, s) : fmt(item.unitPrice, s)}
                </Text>
                <Text style={[styles.cellBold, styles.colTotal]}>{fmt(lineTotal, s)}</Text>
              </View>
            )
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ara Toplam:</Text>
              <Text style={styles.totalValue}>{fmt(subtotal, s)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {quote.discountPercent ? `İndirim (%${quote.discountPercent}):` : "İndirim:"}
                </Text>
                <Text style={[styles.totalValue, { color: "#16a34a" }]}>-{fmt(discountAmount, s)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>KDV (%{quote.vatRate}):</Text>
              <Text style={styles.totalValue}>{fmt(vatAmount, s)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GENEL TOPLAM:</Text>
              <Text style={styles.grandTotalValue}>{fmt(grandTotal, s)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {quote.publicNote && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>NOT</Text>
            <Text style={styles.notesText}>{quote.publicNote}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          {quote.validUntil && (
            <Text style={styles.footerText}>
              Bu teklif {new Date(quote.validUntil).toLocaleDateString("tr-TR")} tarihine kadar geçerlidir.
            </Text>
          )}
          <Text style={styles.footerText}>{companyName} - High Performance Computing Solutions</Text>
        </View>
      </Page>
    </Document>
  )
}
