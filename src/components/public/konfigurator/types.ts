export type ComponentCategoryId =
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'storage-primary'
  | 'storage-secondary'
  | 'network'
  | 'psu'
  | 'cooling'
  | 'chassis'
  | 'os'
  | 'warranty';

export type ComponentRequirement = 'required' | 'optional';

export type RecommendationTone = 'recommended' | 'popular' | 'budget' | null;

export type StockStatus = 'available' | 'low' | 'out';

export interface ComponentSpec {
  label: string;
  value: string;
}

export interface ComponentCategory {
  id: ComponentCategoryId;
  label: string;
  shortDescription: string;
  icon: string;
  requirement: ComponentRequirement;
  allowNone?: boolean;
  helperTitle?: string;
  helperBody?: string;
}

export interface ComponentOption {
  id: string;
  categoryId: ComponentCategoryId;
  name: string;
  brand: string;
  description: string;
  specs: ComponentSpec[];
  priceDelta: number;
  absolutePrice: number;
  currency: string;
  powerDraw?: number;
  recommendation?: RecommendationTone;
  stock: StockStatus;
  imageUrl?: string;
  compatibilityTags: string[];
  requiresTags?: string[];
}

export interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  shortDescription: string;
  heroImageUrl: string;
  basePrice: number;
  currency: string;
  availableOptionIds: Record<ComponentCategoryId, string[]>;
  defaultSelection: Record<ComponentCategoryId, string | null>;
  maxPsuWatt: number;
  estimatedLeadTimeDays: [number, number];
}

export interface Selection {
  baseProductId: string;
  selections: Record<ComponentCategoryId, string | null>;
}

export type WarningSeverity = 'info' | 'warning' | 'error';

export interface CompatibilityWarning {
  id: string;
  categoryId: ComponentCategoryId;
  optionId: string;
  severity: WarningSeverity;
  message: string;
  suggestion?: string;
}

export interface PowerSummary {
  totalDraw: number;
  psuCapacity: number;
  utilizationPercent: number;
  status: 'ok' | 'high' | 'over';
}

export interface PricingSummary {
  basePrice: number;
  componentsDelta: number;
  warrantyDelta: number;
  subtotal: number;
  currency: string;
  monthlyInstallmentEstimate?: number;
}

export interface QuoteFormValues {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  note?: string;
}

export interface KonfiguratorProps {
  baseProducts: BaseProduct[];
  categories: ComponentCategory[];
  options: ComponentOption[];
  selection: Selection;
  activeCategoryId: ComponentCategoryId;
  warnings: CompatibilityWarning[];
  power: PowerSummary;
  pricing: PricingSummary;
  completionPercent: number;
  shareUrl?: string;

  /** Baz ürün değiştiğinde tetiklenir; seçimler varsayılana döner. */
  onSelectBaseProduct?: (baseProductId: string) => void;

  /** Sol panelde/mobil pill'de bir kategori seçildiğinde. */
  onSelectCategory?: (categoryId: ComponentCategoryId) => void;

  /** Orta panelde bir bileşen opsiyonu seçildiğinde. */
  onSelectOption?: (categoryId: ComponentCategoryId, optionId: string | null) => void;

  /** "Önerilen konfigürasyona sıfırla" linkinde. */
  onResetToRecommended?: () => void;

  /** "Teklif iste" aksiyonunda tetiklenir; form açılır veya doğrudan gönderilir. */
  onRequestQuote?: (values: QuoteFormValues) => void;

  /** "Paylaş" aksiyonunda tetiklenir (link kopyalama). */
  onShareConfiguration?: () => void;

  /** "PDF İndir" aksiyonunda tetiklenir. */
  onDownloadPdf?: () => void;

  /** "Karşılaştırmaya ekle" aksiyonunda tetiklenir. */
  onAddToCompare?: () => void;

  /** Uyumsuz seçeneklerin tooltip'inden gelen "öneri kabul" eylemi. */
  onAcceptSuggestion?: (warningId: string) => void;

  /** Özet panelde bir seçim satırına tıklama (kategoriye fokuslanır). */
  onFocusCategoryFromSummary?: (categoryId: ComponentCategoryId) => void;
}
