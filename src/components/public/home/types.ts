export type HomeAccent = 'orange' | 'teal' | 'sky' | 'violet' | 'slate';

export type HomeDifficultyLevel = 'giris' | 'profesyonel' | 'kurumsal';

export interface HomeHeroStat {
  label: string;
  value: string;
}

export interface HomeHero {
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  tagline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  productSku: string;
  productName: string;
  stats: HomeHeroStat[];
}

export interface HomeCategoryCard {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
  productCount: number;
  accent: HomeAccent;
}

export interface HomeSuccessMetric {
  id: string;
  label: string;
  value: string;
  caption: string;
}

export interface HomeSolutionCard {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  shortDescription: string;
  accent: HomeAccent;
  difficulty: HomeDifficultyLevel;
  icon: string;
}

export interface HomeProductSpec {
  label: string;
  value: string;
}

export interface HomeProductCard {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  shortDescription: string;
  priceFrom: number;
  currency: string;
  isNew: boolean;
  icon: string;
  summarySpecs: HomeProductSpec[];
  useCaseNames: string[];
}

export interface HomeBrandValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomeCustomerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface HomeTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  organization: string;
  industry: string;
  metric?: string;
  metricLabel?: string;
  size: 'lead' | 'small';
}

export interface HomeCtaTile {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  ctaLabel: string;
  ctaHref: string;
  accent: HomeAccent;
  action: 'configurator' | 'quote' | 'support';
}

export interface AnaSayfaProps {
  hero: HomeHero;
  featuredCategories: HomeCategoryCard[];
  featuredSolutions: HomeSolutionCard[];
  featuredProducts: HomeProductCard[];
  successMetrics: HomeSuccessMetric[];
  brandValues: HomeBrandValue[];
  customerLogos: HomeCustomerLogo[];
  testimonials: HomeTestimonial[];
  ctaTiles: HomeCtaTile[];
  difficultyLabels: Record<HomeDifficultyLevel, string>;

  /** Hero birincil CTA tıklamasında tetiklenir. */
  onPrimaryHeroCta?: (href: string) => void;

  /** Hero ikincil CTA tıklamasında tetiklenir. */
  onSecondaryHeroCta?: (href: string) => void;

  /** Bir kategori kartına tıklandığında tetiklenir. */
  onSelectCategory?: (categorySlug: string) => void;

  /** Bir çözüm kartına tıklandığında tetiklenir. */
  onSelectSolution?: (solutionSlug: string) => void;

  /** Bir ürün kartına tıklandığında tetiklenir. */
  onSelectProduct?: (productSlug: string) => void;

  /** "Tüm ürünleri gör" linkinde tetiklenir. */
  onViewAllProducts?: () => void;

  /** Müşteri logosu üzerine tıklandığında tetiklenir (opsiyonel). */
  onSelectCustomer?: (customerId: string) => void;

  /** Alt CTA kartlarından birine tıklandığında tetiklenir. */
  onSelectCtaTile?: (ctaId: string, href: string) => void;
}
