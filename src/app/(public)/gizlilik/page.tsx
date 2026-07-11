import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | STUUX",
  description: "STUUX gizlilik politikası — kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
}

export default function GizlilikPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Gizlilik Politikası</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          STUUX olarak ziyaretçilerimizin ve müşterilerimizin gizliliğine önem veriyoruz.
          Bu politika, web sitemizi kullandığınızda hangi verilerin toplandığını ve bu
          verilerin nasıl kullanıldığını açıklar.
        </p>
        <h2>Toplanan Veriler</h2>
        <ul>
          <li>İletişim ve teklif formları aracılığıyla paylaştığınız ad, e-posta, telefon ve firma bilgileri</li>
          <li>Destek talepleri kapsamında ilettiğiniz mesajlar ve ekler</li>
          <li>Sipariş ve teklif süreçlerinde gerekli fatura ve teslimat bilgileri</li>
        </ul>
        <h2>Verilerin Kullanımı</h2>
        <p>
          Toplanan veriler yalnızca taleplerinizi yanıtlamak, teklif hazırlamak, sipariş ve
          destek süreçlerini yürütmek amacıyla kullanılır. Verileriniz üçüncü taraflarla
          pazarlama amaçlı paylaşılmaz.
        </p>
        <h2>Veri Güvenliği</h2>
        <p>
          Verileriniz güvenli sunucularda saklanır ve yetkisiz erişime karşı teknik ve
          idari tedbirlerle korunur.
        </p>
        <h2>İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için{" "}
          <a href="mailto:info@stuux.com">info@stuux.com</a> adresinden bize ulaşabilirsiniz.
        </p>
      </div>
    </div>
  )
}
