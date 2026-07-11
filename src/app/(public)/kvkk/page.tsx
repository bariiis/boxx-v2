import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | STUUX",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında STUUX aydınlatma metni.",
}

export default function KvkkPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">KVKK Aydınlatma Metni</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca STUUX,
          veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan kapsamda işlemektedir.
        </p>
        <h2>İşlenen Kişisel Veriler</h2>
        <ul>
          <li>Kimlik ve iletişim bilgileri (ad soyad, e-posta, telefon)</li>
          <li>Firma ve fatura bilgileri</li>
          <li>Talep ve destek kayıtları</li>
        </ul>
        <h2>İşleme Amaçları</h2>
        <p>
          Kişisel verileriniz; teklif ve satış süreçlerinin yürütülmesi, destek hizmetlerinin
          sağlanması, yasal yükümlülüklerin yerine getirilmesi ve iletişim faaliyetlerinin
          sürdürülmesi amaçlarıyla işlenmektedir.
        </p>
        <h2>Aktarım</h2>
        <p>
          Verileriniz, yalnızca hizmetin sağlanması için gerekli olduğu ölçüde (kargo,
          ödeme kuruluşları, yasal merciler) ve KVKK&apos;nın 8. ve 9. maddelerine uygun
          şekilde aktarılabilir.
        </p>
        <h2>Haklarınız</h2>
        <p>
          KVKK&apos;nın 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme,
          düzeltilmesini veya silinmesini talep etme ve işlemeye itiraz etme haklarına
          sahipsiniz. Taleplerinizi{" "}
          <a href="mailto:info@stuux.com">info@stuux.com</a> adresine iletebilirsiniz.
        </p>
      </div>
    </div>
  )
}
