export type SolutionView = 'index' | 'list' | 'detail';

export type SolutionAccent = 'orange' | 'teal' | 'sky' | 'violet' | 'slate';

export type DifficultyLevel = 'giris' | 'profesyonel' | 'kurumsal';

export type ConfigurationTier = 'entry' | 'pro' | 'max';

export type WhitepaperType = 'whitepaper' | 'reference-architecture' | 'roi' | 'datasheet';

export interface SolutionCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: SolutionAccent;
  solutionCount: number;
  heroImageUrl: string;
  keywords: string[];
}

export interface SolutionHighlight {
  label: string;
  value: string;
}

export interface SolutionProblem {
  title: string;
  bullets: string[];
}

export interface RecommendedConfiguration {
  id: string;
  tier: ConfigurationTier;
  name: string;
  description: string;
  productSlug: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  priceFrom: number;
  isRecommended?: boolean;
  highlights: string[];
}

export interface ArchitectureStep {
  id: string;
  order: number;
  label: string;
  icon: string;
  description: string;
}

export interface SolutionBenchmark {
  id: string;
  label: string;
  unit: string;
  score: number;
  baselineLabel?: string;
  baselineScore?: number;
  note?: string;
}

export interface SolutionCaseStudy {
  id: string;
  customerName: string;
  industry: string;
  quote: string;
  metric: string;
  metricLabel: string;
  href: string;
}

export interface SolutionCustomer {
  id: string;
  name: string;
  logoUrl: string;
}

export interface SolutionWhitepaper {
  id: string;
  label: string;
  type: WhitepaperType;
  fileSize: string;
  href: string;
  description?: string;
}

export interface SolutionDetail {
  tagline: string;
  priceFrom: number;
  currency: string;
  problem: SolutionProblem;
  answer: SolutionProblem;
  configurations: RecommendedConfiguration[];
  architectureSteps: ArchitectureStep[];
  architectureNote?: string;
  benchmarks: SolutionBenchmark[];
  caseStudies: SolutionCaseStudy[];
  customers: SolutionCustomer[];
  whitepapers: SolutionWhitepaper[];
  relatedProductSlugs: string[];
  catalogFilterSlug?: string;
}

export interface Solution {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  longDescription: string;
  difficulty: DifficultyLevel;
  popularity: number;
  isFeatured: boolean;
  heroImageUrl: string;
  highlights: SolutionHighlight[];
  priceFrom: number;
  currency: string;
  detail?: SolutionDetail;
}

export interface IndustryPreset {
  id: string;
  label: string;
  description: string;
  categoryIds: string[];
}

export interface CozumlerProps {
  view: SolutionView;
  categories: SolutionCategory[];
  solutions: Solution[];
  featuredSolutions: Solution[];
  industryPresets: IndustryPreset[];
  difficultyLabels: Record<DifficultyLevel, string>;
  tierLabels: Record<ConfigurationTier, string>;
  selectedCategoryId?: string | null;
  selectedSolution?: Solution | null;
  selectedConfigurationId?: string | null;
  searchQuery?: string;

  /** Kullanıcı bir kategori kartına tıkladığında tetiklenir. */
  onSelectCategory?: (categoryId: string) => void;

  /** Kullanıcı bir çözüm kartına tıkladığında detay görünümüne geçiş için tetiklenir. */
  onSelectSolution?: (solutionSlug: string) => void;

  /** Liste görünümünde arama kutusu her değiştiğinde tetiklenir. */
  onSearchChange?: (query: string) => void;

  /** Kullanıcı endüstri preset'lerinden birini seçtiğinde tetiklenir. */
  onSelectIndustryPreset?: (presetId: string) => void;

  /** Detay sayfasında bir konfigürasyon kartı seçildiğinde tetiklenir. */
  onSelectConfiguration?: (configurationId: string) => void;

  /** "Bu senaryo için yapılandır" CTA'sı — konfigüratöre önceden yüklenmiş olarak geçer. */
  onStartConfigurator?: (solutionSlug: string, configurationId?: string) => void;

  /** "Teklif İste" aksiyonunda tetiklenir. */
  onRequestQuote?: (solutionSlug: string, configurationId?: string) => void;

  /** "Uzmanla Görüş" aksiyonunda tetiklenir (randevu formu veya arama). */
  onBookExpert?: (solutionSlug: string) => void;

  /** Whitepaper / referans mimarisi / datasheet indirme tıklandığında tetiklenir. */
  onDownloadWhitepaper?: (solutionSlug: string, whitepaperId: string) => void;

  /** Vaka çalışması kartına tıklandığında tetiklenir. */
  onOpenCaseStudy?: (caseStudyId: string) => void;

  /** İlgili ürün kartına tıklandığında ilgili ürün detay/yapılandır sayfasına götürür. */
  onOpenProduct?: (productSlug: string) => void;

  /** "Bu çözüm için ürünleri gör" linkiyle katalog listesine filtreli dönüşte tetiklenir. */
  onOpenCatalogFilter?: (catalogFilterSlug: string) => void;

  /** Boş sonuç durumunda "filtreyi temizle" CTA'sında tetiklenir. */
  onClearSearch?: () => void;
}
