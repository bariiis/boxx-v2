import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  Brain,
  Cpu,
  FileText,
  Film,
  HardDrive,
  Headset,
  type LucideIcon,
  Network,
  Quote,
  Ruler,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import type {
  AnaSayfaProps,
  HomeAccent,
  HomeBrandValue,
  HomeCategoryCard,
  HomeCtaTile,
  HomeCustomerLogo,
  HomeDifficultyLevel,
  HomeHero,
  HomeProductCard,
  HomeSolutionCard,
  HomeSuccessMetric,
  HomeTestimonial,
} from './types';

const CURRENCY_FORMAT = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const ICON_MAP: Record<string, LucideIcon> = {
  Boxes,
  Server,
  HardDrive,
  Network,
  Brain,
  Film,
  Ruler,
  Cpu,
  Award,
  Wrench,
  ShieldCheck,
  Headset,
  FileText,
  Sparkles,
};

const ACCENT_STYLES: Record<
  HomeAccent,
  { text: string; halo: string; border: string; bg: string; solid: string; hoverSolid: string }
> = {
  orange: {
    text: 'text-orange-600 dark:text-orange-400',
    halo:
      'radial-gradient(circle at 70% 30%, rgba(249,115,22,0.22), transparent 55%)',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
    solid: 'bg-orange-500',
    hoverSolid: 'hover:bg-orange-600',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-300',
    halo:
      'radial-gradient(circle at 70% 30%, rgba(20,184,166,0.22), transparent 55%)',
    border: 'border-teal-500/40',
    bg: 'bg-teal-500/10',
    solid: 'bg-teal-500',
    hoverSolid: 'hover:bg-teal-600',
  },
  sky: {
    text: 'text-sky-600 dark:text-sky-300',
    halo:
      'radial-gradient(circle at 70% 30%, rgba(56,189,248,0.22), transparent 55%)',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
    solid: 'bg-sky-500',
    hoverSolid: 'hover:bg-sky-600',
  },
  violet: {
    text: 'text-violet-600 dark:text-violet-300',
    halo:
      'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.22), transparent 55%)',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    solid: 'bg-violet-500',
    hoverSolid: 'hover:bg-violet-600',
  },
  slate: {
    text: 'text-slate-700 dark:text-slate-200',
    halo:
      'radial-gradient(circle at 70% 30%, rgba(148,163,184,0.2), transparent 55%)',
    border: 'border-slate-400/40',
    bg: 'bg-slate-500/10',
    solid: 'bg-slate-900',
    hoverSolid: 'hover:bg-slate-800',
  },
};

const DIFFICULTY_TONES: Record<HomeDifficultyLevel, string> = {
  giris: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300',
  profesyonel: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  kurumsal: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
};

export function Home({
  hero,
  featuredCategories,
  featuredSolutions,
  featuredProducts,
  successMetrics,
  brandValues,
  customerLogos,
  testimonials,
  ctaTiles,
  difficultyLabels,
  onPrimaryHeroCta,
  onSecondaryHeroCta,
  onSelectCategory,
  onSelectSolution,
  onSelectProduct,
  onViewAllProducts,
  onSelectCustomer,
  onSelectCtaTile,
}: AnaSayfaProps) {
  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Hero
        hero={hero}
        onPrimary={() => onPrimaryHeroCta?.(hero.primaryCtaHref)}
        onSecondary={() => onSecondaryHeroCta?.(hero.secondaryCtaHref)}
      />

      <HomeSection
        label="02"
        eyebrow="Kategoriler"
        title="Donanımı odaklayarak başla"
        subtitle="Dört ana kategori. Her biri iş yüküne göre optimize edilmiş donanım ailesini temsil eder."
      >
        <div className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={idx}
              total={featuredCategories.length}
              onSelect={() => onSelectCategory?.(category.slug)}
            />
          ))}
        </div>
      </HomeSection>

      <SuccessMetrics metrics={successMetrics} />

      <HomeSection
        label="04"
        eyebrow="Öne çıkan çözümler"
        title="Senaryona göre hazırlanmış"
        subtitle="En çok konuşulan dört kullanım senaryosu. Mimari, yazılım ve donanım bütünleşik gelir."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredSolutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              difficultyLabel={difficultyLabels[solution.difficulty]}
              onSelect={() => onSelectSolution?.(solution.slug)}
            />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        label="05"
        eyebrow="Öne çıkan ürünler"
        title="Stüdyodan veri merkezine"
        subtitle="Katalogumuzdaki öne çıkan üç model — her biri üretim ortamlarında test edildi."
        kicker={
          <button
            type="button"
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 font-['Space_Grotesk'] text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Tüm ürünleri gör
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => onSelectProduct?.(product.slug)}
            />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        label="06"
        eyebrow="Neden BOXX"
        title="Bir donanım değil, bir hizmet"
        subtitle="Yalnızca kasayı değil, üretim ortamının kurulumunu ve destek sürecini de birlikte planlıyoruz."
      >
        <div className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {brandValues.map((value, idx) => (
            <BrandValueCard key={value.id} value={value} index={idx} />
          ))}
        </div>
      </HomeSection>

      <CustomerStrip logos={customerLogos} onSelect={onSelectCustomer} />

      <TestimonialBlock testimonials={testimonials} />

      <CtaGrid tiles={ctaTiles} onSelect={onSelectCtaTile} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section shell                                                               */
/* -------------------------------------------------------------------------- */

function HomeSection({
  label,
  eyebrow,
  title,
  subtitle,
  kicker,
  children,
}: {
  label: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  kicker?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between lg:py-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
                {label} / {eyebrow}
              </span>
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
          </div>
          {(subtitle || kicker) && (
            <div className="flex flex-col items-start gap-3 sm:items-end">
              {kicker}
              {subtitle && (
                <p className="max-w-sm font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-right">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="pb-16 lg:pb-20">{children}</div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

function Hero({
  hero,
  onPrimary,
  onSecondary,
}: {
  hero: HomeHero;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(249,115,22,0.22), transparent 55%), radial-gradient(ellipse 55% 45% at 10% 90%, rgba(20,184,166,0.14), transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.04] dark:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
                01 / {hero.eyebrow}
              </span>
            </div>

            <h1 className="mt-8 font-['Space_Grotesk'] text-5xl font-bold leading-[0.92] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[6rem]">
              {hero.headline}
              <br />
              <span className="text-slate-400 dark:text-slate-500">
                {hero.headlineHighlight}
              </span>
              <span className="text-orange-500">.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              {hero.tagline}
            </p>

            <div
              className="flex flex-wrap gap-3"
              style={{ marginTop: 40, marginBottom: 50 }}
            >
              <button
                type="button"
                onClick={onPrimary}
                className="inline-flex h-12 items-center gap-2 bg-orange-500 px-6 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition-colors hover:bg-orange-600"
              >
                {hero.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onSecondary}
                className="inline-flex h-12 items-center gap-2 border border-slate-300 bg-white px-6 font-['Space_Grotesk'] text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <Wrench className="h-4 w-4" />
                {hero.secondaryCtaLabel}
              </button>
            </div>

            <div style={{ marginBottom: 50 }} className="block">
              <div className="inline-flex flex-wrap items-center gap-px border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
                {hero.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-1 bg-white px-4 py-3 dark:bg-slate-950 sm:px-5"
                  >
                    <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HeroVisual sku={hero.productSku} productName={hero.productName} />
        </div>
      </div>
    </section>
  );
}

function HeroVisual({ sku, productName }: { sku: string; productName: string }) {
  return (
    <div className="relative border border-slate-200 dark:border-slate-800">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.1] dark:hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #0f172a 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.1] dark:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 70% 30%, rgba(249,115,22,0.28), transparent 55%), radial-gradient(circle at 30% 70%, rgba(20,184,166,0.15), transparent 55%)',
          }}
        />

        <div className="absolute left-4 top-4 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          01 / {productName}
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-orange-500" />
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {sku}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu
            className="h-52 w-52 text-slate-300 dark:text-slate-700"
            strokeWidth={0.6}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-700">
            boxx.tr / v3
          </div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            render · hero
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800">
        {[
          { label: 'CPU', value: 'Xeon W-3495X' },
          { label: 'GPU', value: '2x RTX 6000 Ada' },
          { label: 'ECC', value: '256 GB' },
        ].map((spec) => (
          <div
            key={spec.label}
            className="bg-white px-3 py-2.5 dark:bg-slate-950"
          >
            <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-slate-500">
              {spec.label}
            </div>
            <div className="mt-1 truncate font-['Inter'] text-xs font-medium text-slate-800 dark:text-slate-200">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category card                                                               */
/* -------------------------------------------------------------------------- */

function CategoryCard({
  category,
  index,
  total,
  onSelect,
}: {
  category: HomeCategoryCard;
  index: number;
  total: number;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[category.icon] ?? Sparkles;
  const accent = ACCENT_STYLES[category.accent];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-full flex-col gap-4 bg-white p-6 text-left transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-orange-600 dark:text-slate-600 dark:group-hover:text-orange-400" />
      </div>

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: accent.halo }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] dark:hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #0f172a 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.08] dark:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)',
          }}
        />
        <Icon className={`relative h-16 w-16 ${accent.text}`} strokeWidth={1} />
      </div>

      <div>
        <h3 className="font-['Space_Grotesk'] text-xl font-bold leading-tight text-slate-900 dark:text-white">
          {category.name}
        </h3>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
          {category.shortDescription}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
        <span className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] ${accent.text}`}>
          {category.productCount} model
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          kata logova
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Success metrics                                                             */
/* -------------------------------------------------------------------------- */

function SuccessMetrics({ metrics }: { metrics: HomeSuccessMetric[] }) {
  return (
    <HomeSection
      label="03"
      eyebrow="Başarı metrikleri"
      title="Operasyonda ölçülen sayılar"
      subtitle="Ölçülebilir kurumsal teslimat — son bir yılın kısa özeti."
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:grid-cols-4 lg:divide-y-0">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col gap-2 bg-white p-6 dark:bg-slate-950"
          >
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
              {metric.label}
            </div>
            <div className="font-['Space_Grotesk'] text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              {metric.value}
            </div>
            <p className="font-['Inter'] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {metric.caption}
            </p>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}

/* -------------------------------------------------------------------------- */
/* Solution card                                                               */
/* -------------------------------------------------------------------------- */

function SolutionCard({
  solution,
  difficultyLabel,
  onSelect,
}: {
  solution: HomeSolutionCard;
  difficultyLabel: string;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[solution.icon] ?? Sparkles;
  const accent = ACCENT_STYLES[solution.accent];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full flex-col gap-4 border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
    >
      <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: accent.halo }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] dark:hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #0f172a 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.08] dark:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)',
          }}
        />
        <Icon className={`relative h-12 w-12 ${accent.text}`} strokeWidth={1.2} />
        <div className="absolute left-3 top-3">
          <span
            className={`border px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${
              DIFFICULTY_TONES[solution.difficulty]
            }`}
          >
            {difficultyLabel}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {solution.categoryName}
          </div>
          <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-semibold leading-tight text-slate-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
            {solution.name}
          </h3>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-orange-600 dark:text-slate-600 dark:group-hover:text-orange-400" />
      </div>

      <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
        {solution.shortDescription}
      </p>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Product card                                                                */
/* -------------------------------------------------------------------------- */

function ProductCard({
  product,
  onSelect,
}: {
  product: HomeProductCard;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[product.icon] ?? Cpu;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full flex-col gap-4 border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
    >
      <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] dark:hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #0f172a 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.08] dark:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 70% 30%, rgba(249,115,22,0.18), transparent 55%)',
          }}
        />
        <Icon className="relative h-16 w-16 text-slate-300 dark:text-slate-700" strokeWidth={0.8} />
        {product.isNew && (
          <span className="absolute left-3 top-3 border border-teal-500/40 bg-teal-500/10 px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
            Yeni
          </span>
        )}
        <div className="absolute bottom-2 left-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-700">
          {product.slug.toUpperCase()}
        </div>
      </div>

      <div>
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {product.categoryName}
        </div>
        <h3 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold leading-tight text-slate-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
          {product.name}
        </h3>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
          {product.shortDescription}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        {product.summarySpecs.slice(0, 4).map((spec) => (
          <div key={spec.label} className="min-w-0">
            <dt className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {spec.label}
            </dt>
            <dd className="mt-0.5 truncate font-['Inter'] text-xs font-medium text-slate-800 dark:text-slate-200">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Başlangıç
          </div>
          <div className="font-['Space_Grotesk'] text-lg font-bold text-orange-600 dark:text-orange-400">
            {CURRENCY_FORMAT.format(product.priceFrom)}
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {product.useCaseNames.slice(0, 2).map((uc) => (
            <span
              key={uc}
              className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
            >
              {uc}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Brand value card                                                            */
/* -------------------------------------------------------------------------- */

function BrandValueCard({
  value,
  index,
}: {
  value: HomeBrandValue;
  index: number;
}) {
  const Icon = ICON_MAP[value.icon] ?? Sparkles;

  return (
    <div className="flex flex-col gap-3 bg-white p-6 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center border border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          06.{index + 1}
        </span>
      </div>
      <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-white">
        {value.title}
      </h3>
      <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {value.description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Customer strip                                                              */
/* -------------------------------------------------------------------------- */

function LogoPlaceholder({ name, seed }: { name: string; seed: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const wordmark = name.toUpperCase();
  const shape = seed % 4;

  return (
    <svg
      viewBox="0 0 180 48"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-full text-slate-400 transition-colors group-hover:text-slate-900 dark:text-slate-600 dark:group-hover:text-white"
      role="img"
      aria-hidden
    >
      <g fill="currentColor">
        {shape === 0 && (
          <rect x="0" y="6" width="36" height="36" rx="2" fillOpacity="0.15" />
        )}
        {shape === 1 && (
          <circle cx="18" cy="24" r="18" fillOpacity="0.15" />
        )}
        {shape === 2 && (
          <polygon
            points="18,4 36,24 18,44 0,24"
            fillOpacity="0.15"
          />
        )}
        {shape === 3 && (
          <>
            <rect x="0" y="18" width="36" height="12" fillOpacity="0.15" />
            <rect x="12" y="6" width="12" height="36" fillOpacity="0.15" />
          </>
        )}
        <text
          x="18"
          y="30"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700"
          fontSize="14"
          letterSpacing="0.5"
        >
          {initials}
        </text>
        <text
          x="46"
          y="30"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="600"
          fontSize="12"
          letterSpacing="2"
        >
          {wordmark}
        </text>
      </g>
    </svg>
  );
}

function CustomerStrip({
  logos,
  onSelect,
}: {
  logos: HomeCustomerLogo[];
  onSelect?: (customerId: string) => void;
}) {
  return (
    <HomeSection
      label="07"
      eyebrow="Müşterilerimiz"
      title="Birlikte üreten kurumlar"
      subtitle="Stüdyolardan üniversitelere, mühendislikten savunma sanayiine."
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border border-slate-200 dark:divide-slate-800 dark:border-slate-800 sm:grid-cols-4">
        {logos.map((logo, idx) => (
          <button
            key={logo.id}
            type="button"
            onClick={() => onSelect?.(logo.id)}
            aria-label={logo.name}
            className="group flex aspect-[3/2] items-center justify-center bg-white px-6 transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
          >
            <LogoPlaceholder name={logo.name} seed={idx} />
          </button>
        ))}
      </div>
    </HomeSection>
  );
}

/* -------------------------------------------------------------------------- */
/* Testimonial block                                                           */
/* -------------------------------------------------------------------------- */

function TestimonialBlock({
  testimonials,
}: {
  testimonials: HomeTestimonial[];
}) {
  const lead = testimonials.find((t) => t.size === 'lead') ?? testimonials[0];
  const small = testimonials.filter((t) => t !== lead);

  return (
    <section className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between lg:py-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-teal-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-teal-700 dark:text-teal-300">
                08 / Müşteri sesi
              </span>
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Üretimde işleyen sözler
            </h2>
          </div>
        </div>
        <div className="grid gap-4 pb-16 lg:grid-cols-[1.3fr_1fr] lg:pb-20">
          {lead && <TestimonialLead testimonial={lead} />}
          <div className="flex flex-col gap-4">
            {small.map((t) => (
              <TestimonialSmall key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialLead({ testimonial }: { testimonial: HomeTestimonial }) {
  return (
    <article className="flex h-full flex-col gap-6 border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 lg:p-10">
      <Quote className="h-8 w-8 text-orange-500" strokeWidth={1.4} />
      <blockquote className="font-['Space_Grotesk'] text-2xl font-semibold leading-snug text-slate-900 dark:text-white sm:text-3xl">
        "{testimonial.quote}"
      </blockquote>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-6 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div>
          <div className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
            {testimonial.authorName}
          </div>
          <div className="mt-0.5 font-['Inter'] text-xs text-slate-600 dark:text-slate-400">
            {testimonial.authorRole} · {testimonial.organization}
          </div>
          <div className="mt-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {testimonial.industry}
          </div>
        </div>
        {testimonial.metric && (
          <div className="text-right">
            <div className="font-['Space_Grotesk'] text-3xl font-bold text-orange-600 dark:text-orange-400">
              {testimonial.metric}
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {testimonial.metricLabel}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function TestimonialSmall({ testimonial }: { testimonial: HomeTestimonial }) {
  return (
    <article className="flex h-full flex-col gap-4 border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <Quote className="h-5 w-5 text-teal-600 dark:text-teal-400" strokeWidth={1.5} />
      <blockquote className="font-['Space_Grotesk'] text-base font-medium leading-snug text-slate-800 dark:text-slate-100">
        "{testimonial.quote}"
      </blockquote>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="min-w-0">
          <div className="truncate font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
            {testimonial.authorName}
          </div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {testimonial.organization}
          </div>
        </div>
        {testimonial.metric && (
          <div className="text-right">
            <div className="font-['Space_Grotesk'] text-xl font-bold text-teal-600 dark:text-teal-400">
              {testimonial.metric}
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {testimonial.metricLabel}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* CTA grid                                                                    */
/* -------------------------------------------------------------------------- */

function CtaGrid({
  tiles,
  onSelect,
}: {
  tiles: HomeCtaTile[];
  onSelect?: (id: string, href: string) => void;
}) {
  return (
    <HomeSection
      label="09"
      eyebrow="Sıradaki adım"
      title="Hazırsan seçeneği sen belirle"
      subtitle="Yapılandırma aracıyla başla, online teklif iste veya uzmanla görüş — üçü de senin hızında."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((tile) => (
          <CtaTile key={tile.id} tile={tile} onSelect={() => onSelect?.(tile.id, tile.ctaHref)} />
        ))}
      </div>
    </HomeSection>
  );
}

function CtaTile({
  tile,
  onSelect,
}: {
  tile: HomeCtaTile;
  onSelect: () => void;
}) {
  const accent = ACCENT_STYLES[tile.accent];
  const Icon = ICON_MAP[tile.icon] ?? Wrench;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-full flex-col gap-4 border border-slate-200 bg-white p-6 text-left transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70" style={{ background: accent.halo }} />
      <div className="relative flex items-center justify-between">
        <span className={`inline-flex h-11 w-11 items-center justify-center border ${accent.border} ${accent.bg} ${accent.text}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] ${accent.text}`}>
          {tile.eyebrow}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col gap-3">
        <h3 className="font-['Space_Grotesk'] text-2xl font-bold leading-tight text-slate-900 dark:text-white">
          {tile.title}
        </h3>
        <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {tile.description}
        </p>
      </div>
      <div className="relative mt-auto inline-flex items-center gap-2 border-t border-slate-200 pt-4 font-['Space_Grotesk'] text-sm font-semibold text-slate-900 transition-colors group-hover:text-orange-600 dark:border-slate-800 dark:text-white dark:group-hover:text-orange-400">
        {tile.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}
