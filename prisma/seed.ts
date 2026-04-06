import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12)

  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@stuux.com" },
    update: {},
    create: {
      email: "admin@stuux.com",
      name: "Admin",
      surname: "STUUX",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  // Create employee users
  const employeePassword = await bcrypt.hash("employee123", 12)

  const employee1 = await prisma.user.upsert({
    where: { email: "ahmet@stuux.com" },
    update: {},
    create: {
      email: "ahmet@stuux.com",
      name: "Ahmet",
      surname: "Yılmaz",
      username: "ahmet",
      password: employeePassword,
      role: "EMPLOYEE",
      phone: "+90 532 100 0001",
    },
  })

  await prisma.user.upsert({
    where: { email: "elif@stuux.com" },
    update: {},
    create: {
      email: "elif@stuux.com",
      name: "Elif",
      surname: "Kaya",
      username: "elif",
      password: employeePassword,
      role: "EMPLOYEE",
      phone: "+90 532 100 0002",
    },
  })

  // Create organizations
  const org1 = await prisma.organization.upsert({
    where: { id: "seed-org-teknoloji" },
    update: {},
    create: {
      id: "seed-org-teknoloji",
      type: "COMPANY",
      source: "REFERRAL",
      status: "CUSTOMER",
      name: "Anadolu Teknoloji A.Ş.",
      taxOffice: "Ankara Kurumlar",
      taxNumber: "1234567890",
      email: "info@anadolutek.com",
      phone: "+90 312 200 0000",
      website: "https://anadolutek.com",
      address: "Mustafa Kemal Mah. 2120. Cad. No:5",
      district: "Çankaya",
      city: "Ankara",
      country: "Türkiye",
      notes: "GPU sunucu ve iş istasyonu müşterisi",
    },
  })

  const org2 = await prisma.organization.upsert({
    where: { id: "seed-org-medya" },
    update: {},
    create: {
      id: "seed-org-medya",
      type: "COMPANY",
      source: "WEBSITE",
      status: "ACTIVE",
      name: "İstanbul Medya Prodüksiyon Ltd.",
      taxOffice: "Beşiktaş VD",
      taxNumber: "9876543210",
      email: "info@istmedya.com",
      phone: "+90 212 300 0000",
      address: "Levent Mah. Büyükdere Cad. No:45 K:12",
      district: "Beşiktaş",
      city: "İstanbul",
      country: "Türkiye",
      notes: "Video prodüksiyon ekipmanları",
    },
  })

  const org3 = await prisma.organization.upsert({
    where: { id: "seed-org-uni" },
    update: {},
    create: {
      id: "seed-org-uni",
      type: "GOVERNMENT",
      source: "OTHER",
      status: "LEAD",
      name: "Boğaziçi Üniversitesi - Bilgisayar Mühendisliği",
      email: "cmpe@boun.edu.tr",
      phone: "+90 212 359 0000",
      address: "Bebek Mah. Rumelihisarüstü",
      district: "Sarıyer",
      city: "İstanbul",
      country: "Türkiye",
      notes: "HPC kümesi ve AI araştırma sunucuları talebi",
    },
  })

  await prisma.organization.upsert({
    where: { id: "seed-org-freelance" },
    update: {},
    create: {
      id: "seed-org-freelance",
      type: "INDIVIDUAL",
      source: "WEBSITE",
      status: "LEAD",
      name: "Mehmet Demir (Freelance)",
      email: "mehmet@demir.dev",
      phone: "+90 542 400 0000",
      city: "İzmir",
      country: "Türkiye",
      notes: "3D sanatçı, kişisel iş istasyonu arıyor",
    },
  })

  // Create contacts
  await prisma.contact.upsert({
    where: { id: "seed-contact-1" },
    update: {},
    create: {
      id: "seed-contact-1",
      title: "Bilgi Teknolojileri Müdürü",
      firstName: "Mustafa",
      lastName: "Özkan",
      email: "mustafa.ozkan@anadolutek.com",
      phone: "+90 532 200 0001",
      department: "BT",
      organizationId: org1.id,
    },
  })

  await prisma.contact.upsert({
    where: { id: "seed-contact-2" },
    update: {},
    create: {
      id: "seed-contact-2",
      title: "Satın Alma Uzmanı",
      firstName: "Zeynep",
      lastName: "Arslan",
      email: "zeynep.arslan@anadolutek.com",
      phone: "+90 532 200 0002",
      department: "Satın Alma",
      organizationId: org1.id,
    },
  })

  await prisma.contact.upsert({
    where: { id: "seed-contact-3" },
    update: {},
    create: {
      id: "seed-contact-3",
      title: "Yapımcı",
      firstName: "Can",
      lastName: "Yıldırım",
      email: "can@istmedya.com",
      phone: "+90 533 300 0001",
      department: "Prodüksiyon",
      organizationId: org2.id,
    },
  })

  await prisma.contact.upsert({
    where: { id: "seed-contact-4" },
    update: {},
    create: {
      id: "seed-contact-4",
      title: "Dr. Öğretim Üyesi",
      firstName: "Ayşe",
      lastName: "Koç",
      email: "ayse.koc@boun.edu.tr",
      phone: "+90 533 400 0001",
      department: "Bilgisayar Mühendisliği",
      organizationId: org3.id,
    },
  })

  // Create default settings
  const defaultSettings = [
    { key: "company_name", value: "STUUX", group: "general" },
    { key: "company_email", value: "info@stuux.com", group: "general" },
    { key: "default_quote_days", value: "10", group: "quote" },
    { key: "default_quote_notes", value: "Bu teklif belirtilen tarihler arasında geçerlidir.", group: "quote" },
    { key: "exchange_rate_source", value: "TCMB", group: "quote" },
    { key: "vat_rates", value: JSON.stringify([0, 1, 10, 20]), group: "quote" },
    { key: "default_vat_rate", value: "20", group: "quote" },
    { key: "default_currency", value: "USD", group: "quote" },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  // Create ticket categories
  const categories = [
    { name: "Donanım Arızası", nameEn: "Hardware Failure" },
    { name: "Yazılım Sorunu", nameEn: "Software Issue" },
    { name: "Garanti Talebi", nameEn: "Warranty Claim" },
    { name: "Kurulum Desteği", nameEn: "Installation Support" },
    { name: "Genel Bilgi", nameEn: "General Inquiry" },
  ]

  for (const cat of categories) {
    const existing = await prisma.ticketCategory.findFirst({ where: { name: cat.name } })
    if (!existing) {
      await prisma.ticketCategory.create({ data: cat })
    }
  }

  // Create solution categories
  const solutionCats = [
    {
      name: "Medya ve Eğlence", nameEn: "Media & Entertainment", slug: "medya-eglence", sortOrder: 0,
      children: [
        { name: "Fotoğraf Düzenleme", nameEn: "Photo Editing", slug: "fotograf-duzenleme", sortOrder: 0 },
        { name: "Video Düzenleme", nameEn: "Video Editing", slug: "video-duzenleme", sortOrder: 1 },
        { name: "3D Tasarım ve Animasyon", nameEn: "3D Design & Animation", slug: "3d-tasarim", sortOrder: 2 },
        { name: "Canlı Video Prodüksiyonu", nameEn: "Live Video Production", slug: "canli-video", sortOrder: 3 },
        { name: "Gerçek Zamanlı Motorlar", nameEn: "Real-Time Engines", slug: "gercek-zamanli-motorlar", sortOrder: 4 },
        { name: "Rendering", nameEn: "Rendering", slug: "rendering", sortOrder: 5 },
        { name: "Dijital Ses (DAW)", nameEn: "Digital Audio (DAW)", slug: "daw", sortOrder: 6 },
      ],
    },
    {
      name: "Mühendislik", nameEn: "Engineering", slug: "muhendislik", sortOrder: 1,
      children: [
        { name: "Mimari ve CAD", nameEn: "Architecture & CAD", slug: "mimari-cad", sortOrder: 0 },
        { name: "Görselleştirme", nameEn: "Visualization", slug: "gorsellestirme", sortOrder: 1 },
        { name: "Fotogrametri ve CBS", nameEn: "Photogrammetry & GIS", slug: "fotogrametri", sortOrder: 2 },
      ],
    },
    {
      name: "Yapay Zekâ & HPC", nameEn: "AI & HPC", slug: "ai-hpc", sortOrder: 2,
      children: [
        { name: "Yapay Zekâ Geliştirme", nameEn: "AI Development", slug: "ai-gelistirme", sortOrder: 0 },
        { name: "Yapay Zekâ Dağıtımı", nameEn: "AI Deployment", slug: "ai-dagitim", sortOrder: 1 },
        { name: "Yüksek Performanslı Hesaplama", nameEn: "HPC", slug: "hpc", sortOrder: 2 },
      ],
    },
    {
      name: "Yaşam Bilimleri", nameEn: "Life Sciences", slug: "yasam-bilimleri", sortOrder: 3,
      children: [],
    },
    {
      name: "Adli Bilişim", nameEn: "Digital Forensics", slug: "adli-bilisim", sortOrder: 4,
      children: [],
    },
  ]

  for (const parent of solutionCats) {
    const { children, ...parentData } = parent
    const existing = await prisma.solutionCategory.findUnique({ where: { slug: parentData.slug } })
    let parentId: string

    if (existing) {
      parentId = existing.id
    } else {
      const created = await prisma.solutionCategory.create({ data: parentData })
      parentId = created.id
    }

    for (const child of children) {
      const childExists = await prisma.solutionCategory.findUnique({ where: { slug: child.slug } })
      if (!childExists) {
        await prisma.solutionCategory.create({ data: { ...child, parentId } })
      }
    }
  }

  // Create solution pages per subcategory
  const solutionPages: Record<string, { title: string; slug: string; subtitle: string }[]> = {
    "fotograf-duzenleme": [
      { title: "Adobe Lightroom Classic", slug: "lightroom-classic", subtitle: "Toplu fotoğraf düzenleme ve katalog yönetimi için optimize edilmiş iş istasyonları" },
      { title: "Adobe Photoshop", slug: "photoshop", subtitle: "İleri düzey görsel düzenleme ve manipülasyon için yüksek performanslı sistemler" },
      { title: "Üretken Yapay Zekâ", slug: "uretken-yapay-zeka", subtitle: "AI destekli görsel oluşturma ve düzenleme iş akışları" },
    ],
    "video-duzenleme": [
      { title: "Adobe After Effects", slug: "after-effects", subtitle: "Motion graphics ve görsel efektler için GPU hızlandırmalı sistemler" },
      { title: "Adobe Premiere Pro", slug: "premiere-pro", subtitle: "Profesyonel video düzenleme için çok çekirdekli iş istasyonları" },
      { title: "DaVinci Resolve", slug: "davinci-resolve", subtitle: "Renk düzeltme, düzenleme ve Fusion VFX için optimize edilmiş sistemler" },
      { title: "Foundry Nuke", slug: "foundry-nuke", subtitle: "Film ve TV VFX compositing için yüksek performanslı iş istasyonları" },
    ],
    "3d-tasarim": [
      { title: "Autodesk 3ds Max", slug: "3ds-max", subtitle: "3D modelleme, animasyon ve rendering için profesyonel sistemler" },
      { title: "Autodesk Maya", slug: "maya", subtitle: "Film ve oyun için 3D animasyon iş istasyonları" },
      { title: "Blender", slug: "blender", subtitle: "Açık kaynak 3D üretim paketi için optimize edilmiş donanım" },
      { title: "Cinema 4D", slug: "cinema-4d", subtitle: "Motion design ve 3D modelleme iş akışları" },
      { title: "Houdini", slug: "houdini", subtitle: "Prosedürel efektler ve simülasyon için yüksek performans" },
      { title: "ZBrush", slug: "zbrush", subtitle: "Dijital heykel ve yüksek detay modelleme sistemleri" },
    ],
    "canli-video": [
      { title: "vMix", slug: "vmix", subtitle: "Canlı video prodüksiyonu ve streaming için optimize edilmiş sistemler" },
      { title: "Canlı Yayın (OBS)", slug: "obs-canli-yayin", subtitle: "OBS ve donanım encoder ile canlı yayın çözümleri" },
    ],
    "gercek-zamanli-motorlar": [
      { title: "Unity", slug: "unity", subtitle: "Oyun geliştirme ve gerçek zamanlı 3D uygulamalar" },
      { title: "Unreal Engine", slug: "unreal-engine", subtitle: "AAA oyun geliştirme ve sanal üretim iş istasyonları" },
      { title: "Sanal Üretim (Virtual Production)", slug: "sanal-uretim", subtitle: "LED duvar ve gerçek zamanlı film prodüksiyonu" },
    ],
    "rendering": [
      { title: "KeyShot", slug: "keyshot", subtitle: "Gerçek zamanlı ışın izleme ile ürün görselleştirme" },
      { title: "OctaneRender", slug: "octanerender", subtitle: "GPU tabanlı fiziksel render motoru için çoklu GPU sistemler" },
      { title: "Redshift", slug: "redshift", subtitle: "GPU hızlandırmalı prodüksiyon renderer" },
      { title: "V-Ray", slug: "v-ray", subtitle: "Endüstri standardı rendering çözümü için iş istasyonları" },
    ],
    "daw": [
      { title: "Ableton Live", slug: "ableton-live", subtitle: "Müzik prodüksiyonu ve performans için optimize edilmiş sistemler" },
      { title: "FL Studio", slug: "fl-studio", subtitle: "Dijital müzik üretimi iş istasyonları" },
      { title: "Pro Tools", slug: "pro-tools", subtitle: "Profesyonel ses kayıt ve düzenleme sistemleri" },
    ],
    "mimari-cad": [
      { title: "AutoCAD", slug: "autocad", subtitle: "2D/3D CAD tasarım ve çizim için ISV sertifikalı sistemler" },
      { title: "Autodesk Inventor", slug: "inventor", subtitle: "Mekanik tasarım ve mühendislik iş istasyonları" },
      { title: "Revit", slug: "revit", subtitle: "BIM tabanlı mimari tasarım için optimize edilmiş sistemler" },
      { title: "SOLIDWORKS", slug: "solidworks", subtitle: "3D mekanik tasarım ve simülasyon iş istasyonları" },
      { title: "SOLIDCAM", slug: "solidcam", subtitle: "CNC programlama ve CAM çözümleri" },
    ],
    "gorsellestirme": [
      { title: "Enscape", slug: "enscape", subtitle: "Gerçek zamanlı mimari görselleştirme" },
      { title: "Lumion", slug: "lumion", subtitle: "3D mimari canlandırma ve render" },
      { title: "Twinmotion", slug: "twinmotion", subtitle: "Unreal tabanlı gerçek zamanlı vizüalizasyon" },
      { title: "Substance 3D", slug: "substance-3d", subtitle: "3D materyal ve doku oluşturma" },
    ],
    "fotogrametri": [
      { title: "ArcGIS Pro", slug: "arcgis-pro", subtitle: "Coğrafi bilgi sistemleri ve mekansal analiz" },
      { title: "Metashape", slug: "metashape", subtitle: "Fotogrametrik işleme ve 3D model oluşturma" },
      { title: "Pix4D", slug: "pix4d", subtitle: "Drone haritalama ve fotogrametri yazılımı" },
      { title: "RealityScan", slug: "realityscan", subtitle: "3D tarama ve nokta bulutu işleme" },
    ],
    "ai-gelistirme": [
      { title: "PyTorch", slug: "pytorch", subtitle: "Esnek derin öğrenme framework'ü için GPU iş istasyonları" },
      { title: "TensorFlow", slug: "tensorflow", subtitle: "Google makine öğrenmesi platformu için optimize edilmiş sistemler" },
      { title: "JAX", slug: "jax", subtitle: "Yüksek performanslı sayısal hesaplama ve ML araştırma" },
    ],
    "ai-dagitim": [
      { title: "TensorRT & ONNX", slug: "tensorrt-onnx", subtitle: "Yapay zekâ model dağıtımı ve çıkarım optimizasyonu" },
      { title: "Hugging Face", slug: "hugging-face", subtitle: "LLM ve transformer modelleri için GPU sunucular" },
      { title: "AI Ölçeklendirme (Kubernetes)", slug: "ai-olceklendirme", subtitle: "Kubeflow, MLFlow ile kurumsal AI altyapısı" },
    ],
    "hpc": [
      { title: "Bilimsel Hesaplama", slug: "bilimsel-hesaplama", subtitle: "FEA, CFD ve paralel hesaplama iş istasyonları" },
      { title: "Veri Bilimi", slug: "veri-bilimi", subtitle: "Büyük veri analizi ve işleme sistemleri" },
    ],
  }

  const defaultSections = [
    { tabKey: "intro", tabLabel: "Giriş", sortOrder: 0 },
    { tabKey: "cpu", tabLabel: "İşlemci", sortOrder: 1 },
    { tabKey: "gpu", tabLabel: "GPU", sortOrder: 2 },
    { tabKey: "ram", tabLabel: "Bellek", sortOrder: 3 },
    { tabKey: "storage", tabLabel: "Depolama", sortOrder: 4 },
    { tabKey: "faq", tabLabel: "Sıkça Sorulan Sorular", sortOrder: 5 },
  ]

  for (const [catSlug, pages] of Object.entries(solutionPages)) {
    const category = await prisma.solutionCategory.findUnique({ where: { slug: catSlug } })
    if (!category) continue

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const exists = await prisma.solution.findUnique({ where: { slug: page.slug } })
      if (exists) continue

      const solution = await prisma.solution.create({
        data: {
          title: page.title,
          slug: page.slug,
          subtitle: page.subtitle,
          categoryId: category.id,
          sortOrder: i,
        },
      })

      await prisma.solutionSection.createMany({
        data: defaultSections.map((s) => ({ ...s, solutionId: solution.id })),
      })
    }
  }

  // ==========================================
  // PRODUCT CATEGORIES & PRODUCTS
  // ==========================================

  const productCats = [
    {
      name: "İş İstasyonları", nameEn: "Workstations", slug: "is-istasyonlari", sortOrder: 0,
      children: [
        { name: "Intel", slug: "ws-intel", sortOrder: 0 },
        { name: "AMD", slug: "ws-amd", sortOrder: 1 },
        { name: "Dual CPU", slug: "ws-dual", sortOrder: 2 },
      ],
    },
    {
      name: "GPU Sunucular", nameEn: "GPU Servers", slug: "gpu-sunucular", sortOrder: 1,
      children: [
        { name: "EPYC", slug: "gpu-epyc", sortOrder: 0 },
        { name: "Threadripper", slug: "gpu-threadripper", sortOrder: 1 },
        { name: "Xeon", slug: "gpu-xeon", sortOrder: 2 },
      ],
    },
    {
      name: "Mini İş İstasyonları", nameEn: "Mini Workstations", slug: "mini-is-istasyonlari", sortOrder: 2,
      children: [],
    },
    {
      name: "Depolama", nameEn: "Storage", slug: "depolama", sortOrder: 3,
      children: [
        { name: "TrueNAS", slug: "truenas", sortOrder: 0 },
      ],
    },
    {
      name: "Ağ Ekipmanları", nameEn: "Networking", slug: "ag-ekipmanlari", sortOrder: 4,
      children: [],
    },
    {
      name: "Bileşenler", nameEn: "Components", slug: "bilesenler", sortOrder: 5,
      children: [
        { name: "İşlemciler", slug: "islemciler", sortOrder: 0 },
        { name: "Ekran Kartları", slug: "ekran-kartlari", sortOrder: 1 },
        { name: "Bellek (RAM)", slug: "bellek-ram", sortOrder: 2 },
        { name: "NVMe SSD", slug: "nvme-ssd", sortOrder: 3 },
        { name: "SATA SSD", slug: "sata-ssd", sortOrder: 4 },
        { name: "HDD", slug: "hdd", sortOrder: 5 },
        { name: "Sıvı Soğutma", slug: "sivi-sogutma", sortOrder: 6 },
      ],
    },
  ]

  const catIdMap: Record<string, string> = {}

  for (const parent of productCats) {
    const { children, ...parentData } = parent
    let cat = await prisma.productCategory.findUnique({ where: { slug: parentData.slug } })
    if (!cat) cat = await prisma.productCategory.create({ data: parentData })
    catIdMap[parentData.slug] = cat.id

    for (const child of children) {
      let sub = await prisma.productCategory.findUnique({ where: { slug: child.slug } })
      if (!sub) sub = await prisma.productCategory.create({ data: { ...child, parentId: cat.id } })
      catIdMap[child.slug] = sub.id
    }
  }

  // Sample products
  const sampleProducts = [
    // İş İstasyonları - Intel
    {
      sku: "STX-WS-Z890-01", name: "Pixel Two Z890", nameEn: "Pixel Two Z890",
      slug: "pixel-two-z890", type: "CONFIGURABLE" as const,
      description: "Intel Core Ultra serisi işlemci ile dengeli tek çekirdek ve çok çekirdek performansı. İçerik üretimi, 3D tasarım ve yazılım geliştirme için ideal.",
      currency: "USD" as const, price: 4299, stock: 5, warrantyMonths: 36, weight: 14.5, dimensions: "52x23x50 cm",
      categorySlug: "ws-intel",
      specs: [
        { key: "İşlemci", value: "Intel Core Ultra 9 285K", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "24 Çekirdek / 24 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS ROG STRIX Z890-E", type: "TEXT" },
        { key: "Anakart Chipset", value: "Intel Z890", type: "TEXT" },
        { key: "Bellek (RAM)", value: "64 GB DDR5-6400", type: "TEXT" },
        { key: "Bellek Tipi", value: "DDR5 CUDIMM", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 5080 16GB", type: "TEXT" },
        { key: "Depolama (SSD)", value: "2 TB Samsung 990 Pro NVMe", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "850W 80+ Gold", type: "TEXT" },
        { key: "Kasa", value: "Fractal Design North XL", type: "TEXT" },
        { key: "Soğutma", value: "360mm AIO Sıvı Soğutma", type: "TEXT" },
        { key: "İşletim Sistemi", value: "Windows 11 Pro", type: "TEXT" },
        { key: "Arka Panel Bağlantıları", value: "2 x USB4 (40Gbps) Type-C\n5 x USB 10 Gbps (4 x Type-A + 1 x Type-C)\n1 x HDMI 2.1\n1 x 2.5Gb Ethernet\nWi-Fi 7 + Bluetooth 5.4", type: "TEXTAREA" },
      ],
    },
    {
      sku: "STX-WS-Z890-02", name: "Pixel Two Z890 Pro", nameEn: "Pixel Two Z890 Pro",
      slug: "pixel-two-z890-pro", type: "CONFIGURABLE" as const,
      description: "Intel Core Ultra 9 ile profesyonel içerik üretimi ve mühendislik iş yükleri için tasarlanmış üst segment iş istasyonu.",
      currency: "USD" as const, price: 7499, stock: 3, warrantyMonths: 36, weight: 16, dimensions: "55x25x52 cm",
      categorySlug: "ws-intel",
      specs: [
        { key: "İşlemci", value: "Intel Core Ultra 9 285K", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "24 Çekirdek / 24 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS ProArt Z890-Creator", type: "TEXT" },
        { key: "Bellek (RAM)", value: "128 GB DDR5-6400 ECC", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 5090 32GB", type: "TEXT" },
        { key: "Depolama (SSD)", value: "4 TB Samsung 990 Pro NVMe", type: "TEXT" },
        { key: "Depolama (HDD)", value: "—", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "1200W 80+ Platinum", type: "TEXT" },
        { key: "Kasa", value: "be quiet! Dark Base Pro 901", type: "TEXT" },
        { key: "Soğutma", value: "420mm AIO Sıvı Soğutma", type: "TEXT" },
        { key: "İşletim Sistemi", value: "Windows 11 Pro for Workstations", type: "TEXT" },
      ],
    },
    // İş İstasyonları - AMD
    {
      sku: "STX-WS-X870-01", name: "Pixel Two X870", nameEn: "Pixel Two X870",
      slug: "pixel-two-x870", type: "CONFIGURABLE" as const,
      description: "AMD Ryzen 9 ile 16 çekirdeğe kadar güçlü çok iş parçacıklı performans. Video düzenleme ve 3D render için optimize.",
      currency: "USD" as const, price: 3899, stock: 8, warrantyMonths: 36, weight: 13, dimensions: "50x22x48 cm",
      categorySlug: "ws-amd",
      specs: [
        { key: "İşlemci", value: "AMD Ryzen 9 9950X", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "16 Çekirdek / 32 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS ROG STRIX X870E-E", type: "TEXT" },
        { key: "Anakart Chipset", value: "AMD X870E", type: "TEXT" },
        { key: "Bellek (RAM)", value: "64 GB DDR5-6000", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 4080 SUPER 16GB", type: "TEXT" },
        { key: "Depolama (SSD)", value: "2 TB WD Black SN850X NVMe", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "850W 80+ Gold", type: "TEXT" },
        { key: "Kasa", value: "Fractal Design Torrent", type: "TEXT" },
        { key: "Soğutma", value: "Noctua NH-D15 Hava Soğutma", type: "TEXT" },
        { key: "İşletim Sistemi", value: "Windows 11 Pro", type: "TEXT" },
      ],
    },
    {
      sku: "STX-WS-TRX-01", name: "Designer C700W Threadripper", nameEn: "Designer C700W Threadripper",
      slug: "designer-c700w-threadripper", type: "CONFIGURABLE" as const,
      description: "AMD Threadripper PRO ile yüksek çekirdek sayısı ve çok sayıda PCIe hattı. Ağır iş yükleri ve profesyonel üretim için.",
      currency: "USD" as const, price: 12999, stock: 2, warrantyMonths: 36, weight: 22, dimensions: "60x30x58 cm",
      categorySlug: "ws-amd",
      specs: [
        { key: "İşlemci", value: "AMD Threadripper PRO 7975WX", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "32 Çekirdek / 64 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS Pro WS TRX50-SAGE", type: "TEXT" },
        { key: "Bellek (RAM)", value: "256 GB DDR5-5600 ECC RDIMM", type: "TEXT" },
        { key: "Bellek Slot Sayısı", value: "8 DIMM", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 6000 Ada 48GB", type: "TEXT" },
        { key: "Depolama (SSD)", value: "4 TB Samsung PM9A3 NVMe", type: "TEXT" },
        { key: "Depolama (HDD)", value: "8 TB Enterprise SATA", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "1600W 80+ Titanium", type: "TEXT" },
        { key: "Kasa", value: "Fractal Design Define 7 XL", type: "TEXT" },
        { key: "Soğutma", value: "Noctua NH-U14S TR5-SP6 + 6x 140mm Fan", type: "TEXT" },
        { key: "İşletim Sistemi", value: "Windows 11 Pro for Workstations / Ubuntu 24.04 LTS", type: "TEXT" },
      ],
    },
    // GPU Sunucular
    {
      sku: "STX-GPU-EPYC-7G", name: "GIGAS WS EPYC 7x GPU", nameEn: "GIGAS WS EPYC 7x GPU",
      slug: "gigas-ws-epyc-7gpu", type: "CONFIGURABLE" as const,
      description: "7 adet GPU ile üstün paralel işlem gücü. Derin öğrenme eğitimi, büyük dil modelleri ve bilimsel hesaplama için tasarlandı.",
      currency: "USD" as const, price: 89999, stock: 1, warrantyMonths: 36, weight: 45, dimensions: "80x48x18 cm (4U)",
      categorySlug: "gpu-epyc",
      specs: [
        { key: "İşlemci", value: "AMD EPYC 9654 (96 Çekirdek)", type: "TEXT" },
        { key: "GPU", value: "7x NVIDIA H100 SXM5 80GB", type: "TEXT" },
        { key: "GPU Toplam Bellek", value: "560 GB HBM3", type: "TEXT" },
        { key: "Bellek (RAM)", value: "1 TB DDR5-4800 ECC RDIMM", type: "TEXT" },
        { key: "NVMe Depolama", value: "8x 3.84 TB Samsung PM9A3 (RAID)", type: "TEXT" },
        { key: "Ağ (NIC)", value: "2x 100GbE QSFP28", type: "TEXT" },
        { key: "InfiniBand", value: "NVIDIA ConnectX-7 400Gb/s NDR", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "4x 3000W Redundant PSU", type: "TEXT" },
        { key: "Form Faktörü", value: "4U Rack Mount", type: "TEXT" },
        { key: "Soğutma", value: "Aktif Hava + Opsiyonel Sıvı Soğutma", type: "TEXT" },
      ],
    },
    {
      sku: "STX-GPU-TR-6G", name: "GIGAS WS Threadripper 6x GPU", nameEn: "GIGAS WS Threadripper 6x GPU",
      slug: "gigas-ws-threadripper-6gpu", type: "CONFIGURABLE" as const,
      description: "Threadripper PRO platformunda 6 GPU ile yüksek performanslı AI ve rendering iş yükü çözümü.",
      currency: "USD" as const, price: 54999, stock: 2, warrantyMonths: 36, weight: 38, dimensions: "75x44x18 cm (4U)",
      categorySlug: "gpu-threadripper",
      specs: [
        { key: "İşlemci", value: "AMD Threadripper PRO 7985WX (64 Çekirdek)", type: "TEXT" },
        { key: "GPU", value: "6x NVIDIA RTX 6000 Ada 48GB", type: "TEXT" },
        { key: "GPU Toplam Bellek", value: "288 GB GDDR6X", type: "TEXT" },
        { key: "Bellek (RAM)", value: "512 GB DDR5-5600 ECC RDIMM", type: "TEXT" },
        { key: "NVMe Depolama", value: "4x 7.68 TB U.2 NVMe", type: "TEXT" },
        { key: "Ağ (NIC)", value: "2x 25GbE SFP28", type: "TEXT" },
        { key: "Güç Kaynağı (PSU)", value: "2x 2400W Redundant PSU", type: "TEXT" },
        { key: "Form Faktörü", value: "4U Rack Mount / Tower", type: "TEXT" },
        { key: "Soğutma", value: "Aktif Hava Soğutma", type: "TEXT" },
      ],
    },
    // Mini İş İstasyonları
    {
      sku: "STX-MINI-Z890", name: "Mini Z890", nameEn: "Mini Z890",
      slug: "mini-z890", type: "CONFIGURABLE" as const,
      description: "Kompakt formda Intel performansı. Masa üstünde minimum yer kaplayarak profesyonel iş yüklerini kaldırır.",
      currency: "USD" as const, price: 2999, stock: 10, warrantyMonths: 24, weight: 5.5, dimensions: "35x15x30 cm",
      categorySlug: "mini-is-istasyonlari",
      specs: [
        { key: "İşlemci", value: "Intel Core Ultra 7 265K", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "20 Çekirdek / 20 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS ROG STRIX Z890-I", type: "TEXT" },
        { key: "Bellek (RAM)", value: "32 GB DDR5-6000", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 4070 Ti SUPER 16GB", type: "TEXT" },
        { key: "Depolama", value: "1 TB Samsung 990 Pro NVMe", type: "TEXT" },
        { key: "WiFi / Bluetooth", value: "Wi-Fi 7 + Bluetooth 5.4", type: "TEXT" },
        { key: "Güç Kaynağı", value: "750W SFX 80+ Gold", type: "TEXT" },
        { key: "Boyutlar", value: "35 x 15 x 30 cm", type: "TEXT" },
        { key: "Ağırlık", value: "5.5 kg", type: "TEXT" },
      ],
    },
    {
      sku: "STX-MINI-X870", name: "Mini X870", nameEn: "Mini X870",
      slug: "mini-x870", type: "CONFIGURABLE" as const,
      description: "Kompakt formda AMD performansı. Küçük ofisler ve stüdyolar için ideal.",
      currency: "USD" as const, price: 2799, stock: 10, warrantyMonths: 24, weight: 5.2, dimensions: "35x15x30 cm",
      categorySlug: "mini-is-istasyonlari",
      specs: [
        { key: "İşlemci", value: "AMD Ryzen 7 9800X3D", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "8 Çekirdek / 16 Thread", type: "TEXT" },
        { key: "Anakart", value: "ASUS ROG STRIX X870-I", type: "TEXT" },
        { key: "Bellek (RAM)", value: "32 GB DDR5-6000", type: "TEXT" },
        { key: "Ekran Kartı (GPU)", value: "NVIDIA RTX 4070 SUPER 12GB", type: "TEXT" },
        { key: "Depolama", value: "1 TB WD Black SN850X NVMe", type: "TEXT" },
        { key: "WiFi / Bluetooth", value: "Wi-Fi 7 + Bluetooth 5.4", type: "TEXT" },
        { key: "Güç Kaynağı", value: "750W SFX 80+ Gold", type: "TEXT" },
        { key: "Boyutlar", value: "35 x 15 x 30 cm", type: "TEXT" },
        { key: "Ağırlık", value: "5.2 kg", type: "TEXT" },
      ],
    },
    // Depolama
    {
      sku: "STX-NAS-F4", name: "TrueNAS F-Series F4", nameEn: "TrueNAS F-Series F4",
      slug: "truenas-f-series-f4", type: "STANDALONE" as const,
      description: "Yüksek performanslı all-flash NVMe depolama sistemi. Video prodüksiyon, veritabanı ve sanallaştırma iş yükleri için.",
      currency: "USD" as const, price: 18999, stock: 3, warrantyMonths: 60, weight: 20, dimensions: "48x44x9 cm (2U)",
      categorySlug: "truenas",
      specs: [
        { key: "İşlemci", value: "Intel Xeon Silver 4416+", type: "TEXT" },
        { key: "Bellek (RAM)", value: "128 GB DDR5 ECC RDIMM", type: "TEXT" },
        { key: "Disk Yuvası Sayısı", value: "24x U.2 NVMe", type: "TEXT" },
        { key: "Maks. Ham Kapasite", value: "368 TB", type: "TEXT" },
        { key: "Ağ Bağlantısı", value: "4x 25GbE SFP28", type: "TEXT" },
        { key: "Maks. Ağ Hızı", value: "100 Gb/s (LACP)", type: "TEXT" },
        { key: "İşletim Sistemi", value: "TrueNAS SCALE", type: "TEXT" },
        { key: "RAID Desteği", value: "ZFS (RAIDZ1/Z2/Z3, Mirror)", type: "TEXT" },
        { key: "Güç Kaynağı", value: "2x 1200W Redundant PSU", type: "TEXT" },
        { key: "Form Faktörü", value: "2U Rack Mount", type: "TEXT" },
      ],
    },
    // Ağ Ekipmanları
    {
      sku: "STX-SW-100G-32", name: "STUUX 100G Data Center Switch", nameEn: "100G Data Center Switch",
      slug: "100g-data-center-switch", type: "STANDALONE" as const,
      description: "32 portlu 100GbE veri merkezi anahtarı. Spine-leaf mimarileri ve HPC kümeleri için yüksek bant genişliği.",
      currency: "USD" as const, price: 24999, stock: 5, warrantyMonths: 60, weight: 12, dimensions: "44x44x4.4 cm (1U)",
      categorySlug: "ag-ekipmanlari",
      specs: [
        { key: "Port Sayısı", value: "32x QSFP28 100GbE", type: "TEXT" },
        { key: "Uplink Portu", value: "Breakout 4x25G destekli", type: "TEXT" },
        { key: "Switching Kapasitesi", value: "6.4 Tbps", type: "TEXT" },
        { key: "Forwarding Rate", value: "4.76 Bpps", type: "TEXT" },
        { key: "Layer", value: "L2/L3", type: "TEXT" },
        { key: "Yönetim", value: "CLI, REST API, SNMP, OpenConfig", type: "TEXT" },
        { key: "Form Faktörü", value: "1U Rack Mount", type: "TEXT" },
        { key: "Güç Tüketimi", value: "450W (max)", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - İŞLEMCİLER
    // ==========================================
    {
      sku: "CMP-CPU-9950X", name: "AMD Ryzen 9 9950X", nameEn: "AMD Ryzen 9 9950X",
      slug: "amd-ryzen-9-9950x", type: "COMPONENT" as const,
      description: "Zen 5 mimarisine sahip 16 çekirdekli en güçlü masaüstü işlemci. İçerik üretimi ve oyun için mükemmel.",
      currency: "USD" as const, price: 599, stock: 25, warrantyMonths: 36,
      categorySlug: "islemciler",
      specs: [
        { key: "Mimari", value: "Zen 5", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "16 / 32", type: "TEXT" },
        { key: "Baz Frekans", value: "4.3 GHz", type: "TEXT" },
        { key: "Boost Frekans", value: "5.7 GHz", type: "TEXT" },
        { key: "L3 Cache", value: "64 MB", type: "TEXT" },
        { key: "TDP", value: "170W", type: "TEXT" },
        { key: "Soket", value: "AM5", type: "TEXT" },
        { key: "Bellek Desteği", value: "DDR5-5600", type: "TEXT" },
        { key: "PCIe", value: "PCIe 5.0 (28 lanes)", type: "TEXT" },
        { key: "Entegre GPU", value: "AMD Radeon (RDNA 2)", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-CPU-285K", name: "Intel Core Ultra 9 285K", nameEn: "Intel Core Ultra 9 285K",
      slug: "intel-core-ultra-9-285k", type: "COMPONENT" as const,
      description: "Arrow Lake mimarisine sahip Intel'in en güçlü masaüstü işlemcisi. P-Core ve E-Core hibrit yapısı.",
      currency: "USD" as const, price: 589, stock: 20, warrantyMonths: 36,
      categorySlug: "islemciler",
      specs: [
        { key: "Mimari", value: "Arrow Lake", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "24 (8P + 16E) / 24", type: "TEXT" },
        { key: "P-Core Boost", value: "5.7 GHz", type: "TEXT" },
        { key: "E-Core Boost", value: "4.6 GHz", type: "TEXT" },
        { key: "L3 Cache", value: "36 MB", type: "TEXT" },
        { key: "TDP", value: "125W (PBP)", type: "TEXT" },
        { key: "Soket", value: "LGA 1851", type: "TEXT" },
        { key: "Bellek Desteği", value: "DDR5-6400 (CUDIMM)", type: "TEXT" },
        { key: "PCIe", value: "PCIe 5.0 + 4.0", type: "TEXT" },
        { key: "Entegre GPU", value: "Intel Arc (Xe-LPG)", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-CPU-7975WX", name: "AMD Threadripper PRO 7975WX", nameEn: "AMD Threadripper PRO 7975WX",
      slug: "amd-threadripper-pro-7975wx", type: "COMPONENT" as const,
      description: "32 çekirdekli profesyonel iş istasyonu işlemcisi. 8 kanal bellek ve 128 PCIe 5.0 hattı.",
      currency: "USD" as const, price: 3499, stock: 5, warrantyMonths: 36,
      categorySlug: "islemciler",
      specs: [
        { key: "Mimari", value: "Zen 4", type: "TEXT" },
        { key: "Çekirdek / Thread", value: "32 / 64", type: "TEXT" },
        { key: "Baz Frekans", value: "4.0 GHz", type: "TEXT" },
        { key: "Boost Frekans", value: "5.3 GHz", type: "TEXT" },
        { key: "L3 Cache", value: "128 MB", type: "TEXT" },
        { key: "TDP", value: "350W", type: "TEXT" },
        { key: "Soket", value: "sTR5 (sWRX90)", type: "TEXT" },
        { key: "Bellek Desteği", value: "8 Kanal DDR5-5200 ECC RDIMM", type: "TEXT" },
        { key: "PCIe", value: "PCIe 5.0 (128 lanes)", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - EKRAN KARTLARI
    // ==========================================
    {
      sku: "CMP-GPU-RTX5090", name: "NVIDIA GeForce RTX 5090 32GB", nameEn: "NVIDIA GeForce RTX 5090 32GB",
      slug: "nvidia-rtx-5090", type: "COMPONENT" as const,
      description: "Blackwell mimarisine sahip en güçlü tüketici GPU. 4K+ oyun, AI ve profesyonel üretim için.",
      currency: "USD" as const, price: 1999, stock: 8, warrantyMonths: 36,
      categorySlug: "ekran-kartlari",
      specs: [
        { key: "GPU Çipi", value: "NVIDIA GB202 (Blackwell)", type: "TEXT" },
        { key: "CUDA Core", value: "21760", type: "TEXT" },
        { key: "Tensor Core", value: "680 (5. Nesil)", type: "TEXT" },
        { key: "RT Core", value: "170 (4. Nesil)", type: "TEXT" },
        { key: "Bellek", value: "32 GB GDDR7", type: "TEXT" },
        { key: "Bellek Bant Genişliği", value: "1792 GB/s", type: "TEXT" },
        { key: "Boost Clock", value: "2407 MHz", type: "TEXT" },
        { key: "TDP", value: "575W", type: "TEXT" },
        { key: "Güç Konnektörü", value: "1x 16-pin (600W)", type: "TEXT" },
        { key: "PCIe", value: "PCIe 5.0 x16", type: "TEXT" },
        { key: "Slot Genişliği", value: "3.5 Slot", type: "TEXT" },
        { key: "Ekran Çıkışları", value: "3x DisplayPort 2.1 + 1x HDMI 2.1", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-GPU-RTX5080", name: "NVIDIA GeForce RTX 5080 16GB", nameEn: "NVIDIA GeForce RTX 5080 16GB",
      slug: "nvidia-rtx-5080", type: "COMPONENT" as const,
      description: "Blackwell mimarisinde üst-orta segment. 4K oyun ve içerik üretimi için ideal performans/fiyat dengesi.",
      currency: "USD" as const, price: 999, stock: 15, warrantyMonths: 36,
      categorySlug: "ekran-kartlari",
      specs: [
        { key: "GPU Çipi", value: "NVIDIA GB203 (Blackwell)", type: "TEXT" },
        { key: "CUDA Core", value: "10752", type: "TEXT" },
        { key: "Tensor Core", value: "336 (5. Nesil)", type: "TEXT" },
        { key: "RT Core", value: "84 (4. Nesil)", type: "TEXT" },
        { key: "Bellek", value: "16 GB GDDR7", type: "TEXT" },
        { key: "Bellek Bant Genişliği", value: "960 GB/s", type: "TEXT" },
        { key: "Boost Clock", value: "2617 MHz", type: "TEXT" },
        { key: "TDP", value: "360W", type: "TEXT" },
        { key: "Güç Konnektörü", value: "1x 16-pin (450W)", type: "TEXT" },
        { key: "PCIe", value: "PCIe 5.0 x16", type: "TEXT" },
        { key: "Slot Genişliği", value: "2.5 Slot", type: "TEXT" },
        { key: "Ekran Çıkışları", value: "3x DisplayPort 2.1 + 1x HDMI 2.1", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-GPU-RTX6000ADA", name: "NVIDIA RTX 6000 Ada 48GB", nameEn: "NVIDIA RTX 6000 Ada Generation 48GB",
      slug: "nvidia-rtx-6000-ada", type: "COMPONENT" as const,
      description: "Profesyonel iş istasyonu GPU. ISV sertifikalı, ECC bellek, 48GB VRAM ile büyük veri setleri ve CAD/CAM.",
      currency: "USD" as const, price: 6800, stock: 4, warrantyMonths: 60,
      categorySlug: "ekran-kartlari",
      specs: [
        { key: "GPU Çipi", value: "NVIDIA AD102 (Ada Lovelace)", type: "TEXT" },
        { key: "CUDA Core", value: "18176", type: "TEXT" },
        { key: "Tensor Core", value: "568 (4. Nesil)", type: "TEXT" },
        { key: "RT Core", value: "142 (3. Nesil)", type: "TEXT" },
        { key: "Bellek", value: "48 GB GDDR6 ECC", type: "TEXT" },
        { key: "Bellek Bant Genişliği", value: "960 GB/s", type: "TEXT" },
        { key: "TDP", value: "300W", type: "TEXT" },
        { key: "PCIe", value: "PCIe 4.0 x16", type: "TEXT" },
        { key: "Slot Genişliği", value: "2 Slot", type: "TEXT" },
        { key: "NVLink Desteği", value: "Evet (2x RTX 6000)", type: "TEXT" },
        { key: "Ekran Çıkışları", value: "4x DisplayPort 1.4a", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - BELLEK (RAM)
    // ==========================================
    {
      sku: "CMP-RAM-DDR5-32-6400", name: "Kingston Fury Beast DDR5-6400 32GB (2x16GB)", nameEn: "Kingston Fury Beast DDR5-6400 32GB Kit",
      slug: "kingston-fury-ddr5-6400-32gb", type: "COMPONENT" as const,
      description: "Yüksek frekanslı DDR5 masaüstü bellek kiti. XMP 3.0 profili ile kolay overclock.",
      currency: "USD" as const, price: 109, stock: 50, warrantyMonths: 120,
      categorySlug: "bellek-ram",
      specs: [
        { key: "Kapasite", value: "32 GB (2x 16 GB)", type: "TEXT" },
        { key: "Tip", value: "DDR5 DIMM", type: "TEXT" },
        { key: "Hız", value: "6400 MT/s", type: "TEXT" },
        { key: "Zamanlama", value: "CL32-39-39", type: "TEXT" },
        { key: "Voltaj", value: "1.40V", type: "TEXT" },
        { key: "XMP", value: "XMP 3.0", type: "TEXT" },
        { key: "Soğutucu", value: "Alüminyum Heat Spreader", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-RAM-DDR5-64-5600-ECC", name: "Samsung DDR5-5600 ECC RDIMM 64GB", nameEn: "Samsung DDR5-5600 ECC RDIMM 64GB",
      slug: "samsung-ddr5-5600-ecc-64gb", type: "COMPONENT" as const,
      description: "Sunucu ve iş istasyonu sınıfı ECC Registered bellek. Threadripper PRO ve EPYC platformları için.",
      currency: "USD" as const, price: 219, stock: 30, warrantyMonths: 120,
      categorySlug: "bellek-ram",
      specs: [
        { key: "Kapasite", value: "64 GB (1x 64 GB)", type: "TEXT" },
        { key: "Tip", value: "DDR5 RDIMM ECC", type: "TEXT" },
        { key: "Hız", value: "5600 MT/s", type: "TEXT" },
        { key: "Zamanlama", value: "CL46", type: "TEXT" },
        { key: "Voltaj", value: "1.10V", type: "TEXT" },
        { key: "ECC", value: "Evet (On-Die + Side-Band)", type: "TEXT" },
        { key: "Uyumlu Platformlar", value: "Threadripper PRO, EPYC, Xeon W", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - NVMe SSD
    // ==========================================
    {
      sku: "CMP-SSD-990PRO-2T", name: "Samsung 990 Pro 2TB NVMe", nameEn: "Samsung 990 Pro 2TB NVMe M.2",
      slug: "samsung-990-pro-2tb", type: "COMPONENT" as const,
      description: "PCIe 4.0 x4 NVMe SSD. 7450 MB/s okuma hızı ile oyun, içerik üretimi ve genel kullanım için üst segment.",
      currency: "USD" as const, price: 179, stock: 40, warrantyMonths: 60,
      categorySlug: "nvme-ssd",
      specs: [
        { key: "Kapasite", value: "2 TB", type: "TEXT" },
        { key: "Form Faktörü", value: "M.2 2280", type: "TEXT" },
        { key: "Arayüz", value: "PCIe 4.0 x4 NVMe 2.0", type: "TEXT" },
        { key: "Sıralı Okuma", value: "7.450 MB/s", type: "TEXT" },
        { key: "Sıralı Yazma", value: "6.900 MB/s", type: "TEXT" },
        { key: "Rastgele Okuma (IOPS)", value: "1.400K", type: "TEXT" },
        { key: "Rastgele Yazma (IOPS)", value: "1.550K", type: "TEXT" },
        { key: "TBW", value: "1.200 TB", type: "TEXT" },
        { key: "NAND Tipi", value: "Samsung V-NAND TLC", type: "TEXT" },
        { key: "Kontrolcü", value: "Samsung Pascal", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-SSD-T705-4T", name: "Corsair MP700 Pro SE 4TB NVMe", nameEn: "Corsair MP700 Pro SE 4TB PCIe 5.0",
      slug: "corsair-mp700-pro-se-4tb", type: "COMPONENT" as const,
      description: "PCIe 5.0 x4 NVMe SSD. 14.000 MB/s okuma hızı ile en yüksek performans sınıfı. Video düzenleme ve büyük veri setleri için.",
      currency: "USD" as const, price: 449, stock: 15, warrantyMonths: 60,
      categorySlug: "nvme-ssd",
      specs: [
        { key: "Kapasite", value: "4 TB", type: "TEXT" },
        { key: "Form Faktörü", value: "M.2 2280", type: "TEXT" },
        { key: "Arayüz", value: "PCIe 5.0 x4 NVMe 2.0", type: "TEXT" },
        { key: "Sıralı Okuma", value: "14.000 MB/s", type: "TEXT" },
        { key: "Sıralı Yazma", value: "11.800 MB/s", type: "TEXT" },
        { key: "TBW", value: "3.000 TB", type: "TEXT" },
        { key: "NAND Tipi", value: "3D TLC NAND", type: "TEXT" },
        { key: "Soğutucu", value: "Dahili Alüminyum Heatsink", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - SATA SSD
    // ==========================================
    {
      sku: "CMP-SSD-870EVO-4T", name: "Samsung 870 EVO 4TB SATA SSD", nameEn: "Samsung 870 EVO 4TB 2.5\" SATA",
      slug: "samsung-870-evo-4tb", type: "COMPONENT" as const,
      description: "Yüksek kapasiteli 2.5\" SATA SSD. Depolama, yedekleme ve NAS kullanımı için güvenilir performans.",
      currency: "USD" as const, price: 299, stock: 20, warrantyMonths: 60,
      categorySlug: "sata-ssd",
      specs: [
        { key: "Kapasite", value: "4 TB", type: "TEXT" },
        { key: "Form Faktörü", value: "2.5\" (7mm)", type: "TEXT" },
        { key: "Arayüz", value: "SATA III 6 Gbps", type: "TEXT" },
        { key: "Sıralı Okuma", value: "560 MB/s", type: "TEXT" },
        { key: "Sıralı Yazma", value: "530 MB/s", type: "TEXT" },
        { key: "TBW", value: "2.400 TB", type: "TEXT" },
        { key: "NAND Tipi", value: "Samsung V-NAND TLC", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - HDD
    // ==========================================
    {
      sku: "CMP-HDD-EXOS-20T", name: "Seagate Exos X20 20TB", nameEn: "Seagate Exos X20 20TB Enterprise HDD",
      slug: "seagate-exos-x20-20tb", type: "COMPONENT" as const,
      description: "Kurumsal sınıf 3.5\" sabit disk. 7200 RPM, 2.5M saat MTBF ile 7/24 veri merkezi kullanımı için tasarlandı.",
      currency: "USD" as const, price: 349, stock: 30, warrantyMonths: 60,
      categorySlug: "hdd",
      specs: [
        { key: "Kapasite", value: "20 TB", type: "TEXT" },
        { key: "Form Faktörü", value: "3.5\"", type: "TEXT" },
        { key: "Arayüz", value: "SATA III 6 Gbps", type: "TEXT" },
        { key: "Devir Hızı", value: "7200 RPM", type: "TEXT" },
        { key: "Önbellek", value: "256 MB", type: "TEXT" },
        { key: "Sürekli Veri Hızı", value: "285 MB/s", type: "TEXT" },
        { key: "MTBF", value: "2.500.000 saat", type: "TEXT" },
        { key: "İş Yükü", value: "550 TB/yıl", type: "TEXT" },
        { key: "Kullanım", value: "7/24 Veri Merkezi / NAS", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-HDD-WD-GOLD-18T", name: "WD Gold 18TB", nameEn: "Western Digital Gold 18TB Enterprise HDD",
      slug: "wd-gold-18tb", type: "COMPONENT" as const,
      description: "Enterprise sınıf 3.5\" sabit disk. HelioSeal teknolojisi ile düşük güç tüketimi ve yüksek dayanıklılık.",
      currency: "USD" as const, price: 319, stock: 25, warrantyMonths: 60,
      categorySlug: "hdd",
      specs: [
        { key: "Kapasite", value: "18 TB", type: "TEXT" },
        { key: "Form Faktörü", value: "3.5\"", type: "TEXT" },
        { key: "Arayüz", value: "SATA III 6 Gbps", type: "TEXT" },
        { key: "Devir Hızı", value: "7200 RPM", type: "TEXT" },
        { key: "Önbellek", value: "512 MB", type: "TEXT" },
        { key: "Sürekli Veri Hızı", value: "272 MB/s", type: "TEXT" },
        { key: "MTBF", value: "2.500.000 saat", type: "TEXT" },
        { key: "Teknoloji", value: "HelioSeal (Helyum Dolu)", type: "TEXT" },
      ],
    },

    // ==========================================
    // BİLEŞENLER - SIVI SOĞUTMA
    // ==========================================
    {
      sku: "CMP-AIO-X73", name: "NZXT Kraken X73 RGB 360mm", nameEn: "NZXT Kraken X73 RGB 360mm AIO",
      slug: "nzxt-kraken-x73-360mm", type: "COMPONENT" as const,
      description: "360mm AIO sıvı soğutma sistemi. Asetek 7. nesil pompa, LCD ekranlı pompa başlığı ve RGB fanlar.",
      currency: "USD" as const, price: 249, stock: 15, warrantyMonths: 72,
      categorySlug: "sivi-sogutma",
      specs: [
        { key: "Radyatör Boyutu", value: "360mm (3x 120mm)", type: "TEXT" },
        { key: "Fan Boyutu", value: "3x 120mm", type: "TEXT" },
        { key: "Fan Hızı", value: "500 ~ 2000 RPM", type: "TEXT" },
        { key: "Pompa", value: "Asetek 7. Nesil", type: "TEXT" },
        { key: "Pompa Başlığı", value: "1.54\" LCD Ekran", type: "TEXT" },
        { key: "Gürültü Seviyesi", value: "21 ~ 36 dBA", type: "TEXT" },
        { key: "Soket Desteği", value: "LGA 1851/1700/2066, AM5/AM4, sTR5", type: "TEXT" },
        { key: "Tüp Uzunluğu", value: "400mm", type: "TEXT" },
        { key: "Aydınlatma", value: "RGB (NZXT CAM kontrolü)", type: "TEXT" },
      ],
    },
    {
      sku: "CMP-AIO-NH-D15", name: "Noctua NH-D15 chromax.black", nameEn: "Noctua NH-D15 chromax.black Air Cooler",
      slug: "noctua-nh-d15-chromax", type: "COMPONENT" as const,
      description: "Çift kule hava soğutucusu. Sıvı soğutmaya rakip performans, sıfır arıza riski. Sessiz çalışma odaklı tasarım.",
      currency: "USD" as const, price: 119, stock: 20, warrantyMonths: 72,
      categorySlug: "sivi-sogutma",
      specs: [
        { key: "Tip", value: "Çift Kule Hava Soğutucu", type: "TEXT" },
        { key: "Fan", value: "2x NF-A15 PWM (140mm)", type: "TEXT" },
        { key: "Fan Hızı", value: "300 ~ 1500 RPM", type: "TEXT" },
        { key: "Isı Borusu", value: "6x Bakır Heat Pipe", type: "TEXT" },
        { key: "TDP Kapasitesi", value: "~250W", type: "TEXT" },
        { key: "Gürültü Seviyesi", value: "19.2 ~ 24.6 dBA", type: "TEXT" },
        { key: "Soket Desteği", value: "LGA 1851/1700, AM5/AM4", type: "TEXT" },
        { key: "Yükseklik", value: "165mm", type: "TEXT" },
        { key: "Renk", value: "Siyah (chromax.black)", type: "TEXT" },
      ],
    },
  ]

  for (const prod of sampleProducts) {
    const { categorySlug, specs, ...data } = prod
    const exists = await prisma.product.findUnique({ where: { slug: data.slug } })
    if (exists) continue

    await prisma.product.create({
      data: {
        ...data,
        categoryId: catIdMap[categorySlug] || undefined,
        specs: specs as never,
      },
    })
  }

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
