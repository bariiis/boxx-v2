import {
  ArrowUpRight,
  Brain,
  Building2,
  Cpu,
  Film,
  FlaskConical,
  type LucideIcon,
  Projector,
  Ruler,
  Search,
  Server,
  Sparkles,
} from 'lucide-react';
import type {
  IndustryPreset,
  Solution,
  SolutionAccent,
  SolutionCategory,
} from './types';
import { SectionShell } from './SectionShell';

export interface CategoryIndexProps {
  categories: SolutionCategory[];
  featuredSolutions: Solution[];
  industryPresets: IndustryPreset[];
  onSelectCategory?: (categoryId: string) => void;
  onSelectSolution?: (solutionSlug: string) => void;
  onSelectIndustryPreset?: (presetId: string) => void;
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Brain,
  Film,
  Ruler,
  Server,
  Cpu,
};

const INDUSTRY_ICON_ORDER: LucideIcon[] = [Projector, Ruler, FlaskConical, Building2];

const ACCENT_STYLES: Record<
  SolutionAccent,
  {
    halo: string;
    text: string;
    border: string;
    bgTint: string;
    ring: string;
  }
> = {
  orange: {
    halo: 'radial-gradient(circle at 70% 30%, rgba(249,115,22,0.25), transparent 55%)',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/40',
    bgTint: 'bg-orange-500/10',
    ring: 'hover:border-orange-500/60',
  },
  teal: {
    halo: 'radial-gradient(circle at 70% 30%, rgba(20,184,166,0.25), transparent 55%)',
    text: 'text-teal-600 dark:text-teal-300',
    border: 'border-teal-500/40',
    bgTint: 'bg-teal-500/10',
    ring: 'hover:border-teal-500/60',
  },
  sky: {
    halo: 'radial-gradient(circle at 70% 30%, rgba(56,189,248,0.22), transparent 55%)',
    text: 'text-sky-600 dark:text-sky-300',
    border: 'border-sky-500/40',
    bgTint: 'bg-sky-500/10',
    ring: 'hover:border-sky-500/60',
  },
  violet: {
    halo: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.22), transparent 55%)',
    text: 'text-violet-600 dark:text-violet-300',
    border: 'border-violet-500/40',
    bgTint: 'bg-violet-500/10',
    ring: 'hover:border-violet-500/60',
  },
  slate: {
    halo: 'radial-gradient(circle at 70% 30%, rgba(148,163,184,0.2), transparent 55%)',
    text: 'text-slate-700 dark:text-slate-200',
    border: 'border-slate-400/40',
    bgTint: 'bg-slate-500/10',
    ring: 'hover:border-slate-500/60',
  },
};

const CURRENCY_FORMAT = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export function CategoryIndex({
  categories,
  featuredSolutions,
  industryPresets,
  onSelectCategory,
  onSelectSolution,
  onSelectIndustryPreset,
}: CategoryIndexProps) {
  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <IndexHero totalCategories={categories.length} totalSolutions={featuredSolutions.length} />

      <SectionShell
        label="02"
        eyebrow="Kategoriler"
        title="İş yüküne göre başla"
        subtitle="Dört ana senaryo. Her biri donanım, yazılım ve hizmet katmanını birlikte kurgular."
      >
        <div className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={idx}
              total={categories.length}
              onSelect={() => onSelectCategory?.(category.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        label="03"
        eyebrow="Öne çıkan çözümler"
        title="Üretimdeki senaryolar"
        subtitle="Her kategoriden en çok konuşulan çözüm — hızlı keşif için."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredSolutions.map((solution) => (
            <FeaturedSolutionCard
              key={solution.id}
              solution={solution}
              accent={
                categories.find((c) => c.id === solution.categoryId)?.accent ?? 'orange'
              }
              onSelect={() => onSelectSolution?.(solution.slug)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        label="04"
        eyebrow="Yardım şeridi"
        title="Senin için uygun çözümü bul"
        subtitle="Sektör veya role bir kez tıkla; doğru kategori sayfasına yönlendir."
      >
        <div className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {industryPresets.map((preset, idx) => {
            const Icon = INDUSTRY_ICON_ORDER[idx % INDUSTRY_ICON_ORDER.length];
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectIndustryPreset?.(preset.id)}
                className="group flex flex-col gap-3 bg-white p-6 text-left transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-slate-50 text-orange-600 transition-colors group-hover:border-orange-500/60 dark:border-slate-800 dark:bg-slate-900 dark:text-orange-400">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-orange-600 dark:text-slate-600 dark:group-hover:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-900 dark:text-white">
                    {preset.label}
                  </h3>
                  <p className="mt-1 font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}

function IndexHero({
  totalCategories,
  totalSolutions,
}: {
  totalCategories: number;
  totalSolutions: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 90% 15%, rgba(249,115,22,0.20), transparent 55%), radial-gradient(ellipse 45% 40% at 5% 85%, rgba(20,184,166,0.12), transparent 55%)',
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
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-slate-500"
        >
          <span>Ana Sayfa</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-orange-600 dark:text-orange-400">Çözümler</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
                01 / Çözümler
              </span>
            </div>
            <h1 className="mt-6 font-['Space_Grotesk'] text-5xl font-bold leading-[0.95] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[5rem]">
              Senaryoya
              <br />
              <span className="text-slate-400 dark:text-slate-500">özel kurulmuş</span>
              <span className="text-orange-500">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              AI eğitiminden render farmına, kurumsal mühendislikten veri merkezine —{' '}
              <span className="text-slate-900 dark:text-slate-200">
                donanımı, yazılımı ve hizmeti
              </span>{' '}
              birlikte kurguluyoruz.
            </p>
            <div className="mt-10 inline-flex items-center gap-px border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              <div className="flex flex-col gap-0.5 bg-white px-4 py-3 dark:bg-slate-950">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 dark:text-white">
                  {totalCategories}
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  kategori
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-white px-4 py-3 dark:bg-slate-950">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 dark:text-white">
                  {totalSolutions}+
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  senaryo
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-white px-4 py-3 dark:bg-slate-950">
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 dark:text-white">
                  120+
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  yerinde kurulum
                </span>
              </div>
            </div>
          </div>

          <IndexHeroVisual />
        </div>
      </div>
    </section>
  );
}

function IndexHeroVisual() {
  return (
    <div className="relative hidden aspect-[4/5] overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black lg:block">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1] dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.1] dark:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.25), transparent 55%), radial-gradient(circle at 70% 70%, rgba(20,184,166,0.20), transparent 55%)',
        }}
      />

      <div className="absolute left-4 top-4 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
        matrix / cozumler
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 bg-orange-500" />
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          live
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          {[Brain, Film, Ruler, Server].map((Icon, idx) => (
            <div
              key={idx}
              className="flex h-20 w-20 items-center justify-center border border-slate-200 bg-white/70 text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400"
            >
              <Icon className="h-9 w-9" strokeWidth={1} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-700">
          boxx.tr / cozumler
        </div>
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          4 senaryo · 12+ paket
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  index,
  total,
  onSelect,
}: {
  category: SolutionCategory;
  index: number;
  total: number;
  onSelect: () => void;
}) {
  const Icon = CATEGORY_ICON[category.icon] ?? Sparkles;
  const accent = ACCENT_STYLES[category.accent];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex h-full flex-col gap-4 bg-white p-6 text-left transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <ArrowUpRight
          className={`h-4 w-4 text-slate-400 transition-colors group-hover:${accent.text} dark:text-slate-600`}
        />
      </div>

      <div
        className="relative flex aspect-[4/3] items-center justify-center border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: accent.halo }}
        />
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
        <Icon
          className={`relative h-16 w-16 ${accent.text}`}
          strokeWidth={1}
        />
      </div>

      <div>
        <h3 className="font-['Space_Grotesk'] text-xl font-bold leading-tight text-slate-900 dark:text-white">
          {category.name}
        </h3>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {category.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {category.keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className={`border ${accent.border} ${accent.bgTint} px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${accent.text}`}
            >
              {kw}
            </span>
          ))}
        </div>
        <span className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${accent.text}`}>
          {category.solutionCount} senaryo
        </span>
      </div>
    </button>
  );
}

function FeaturedSolutionCard({
  solution,
  accent,
  onSelect,
}: {
  solution: Solution;
  accent: SolutionAccent;
  onSelect: () => void;
}) {
  const accentStyle = ACCENT_STYLES[accent];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex h-full flex-col gap-4 border border-slate-200 bg-white p-5 text-left transition-colors ${accentStyle.ring} dark:border-slate-800 dark:bg-slate-950`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {solution.categoryName}
        </span>
        <ArrowUpRight className={`h-4 w-4 text-slate-400 transition-colors group-hover:${accentStyle.text} dark:text-slate-600`} />
      </div>

      <h3 className={`font-['Space_Grotesk'] text-xl font-semibold leading-tight text-slate-900 transition-colors group-hover:${accentStyle.text} dark:text-white`}>
        {solution.name}
      </h3>

      <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
        {solution.shortDescription}
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        {solution.highlights.slice(0, 4).map((h) => (
          <div key={h.label} className="min-w-0">
            <dt className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {h.label}
            </dt>
            <dd className="mt-0.5 truncate font-['Inter'] text-xs font-medium text-slate-800 dark:text-slate-200">
              {h.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        {solution.priceFrom > 0 ? (
          <div>
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Başlangıç
            </div>
            <div className={`font-['Space_Grotesk'] text-lg font-bold ${accentStyle.text}`}>
              {CURRENCY_FORMAT.format(solution.priceFrom)}
            </div>
          </div>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 font-['Space_Grotesk'] text-xs font-semibold text-slate-500">
          <Search className="h-3 w-3" /> Detaya git
        </span>
      </div>
    </button>
  );
}
