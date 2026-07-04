import { ArrowUpRight, Search, Sparkles, X } from 'lucide-react';
import type {
  DifficultyLevel,
  Solution,
  SolutionAccent,
  SolutionCategory,
} from './types';

export interface SolutionListProps {
  category: SolutionCategory;
  solutions: Solution[];
  totalInCategory: number;
  searchQuery: string;
  difficultyLabels: Record<DifficultyLevel, string>;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  onSelectSolution?: (solutionSlug: string) => void;
  onBackToIndex?: () => void;
}

const ACCENT_STYLES: Record<
  SolutionAccent,
  { text: string; halo: string; border: string; bg: string }
> = {
  orange: {
    text: 'text-orange-600 dark:text-orange-400',
    halo:
      'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(249,115,22,0.20), transparent 55%)',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-300',
    halo:
      'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(20,184,166,0.22), transparent 55%)',
    border: 'border-teal-500/40',
    bg: 'bg-teal-500/10',
  },
  sky: {
    text: 'text-sky-600 dark:text-sky-300',
    halo:
      'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(56,189,248,0.22), transparent 55%)',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
  },
  violet: {
    text: 'text-violet-600 dark:text-violet-300',
    halo:
      'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(139,92,246,0.22), transparent 55%)',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
  },
  slate: {
    text: 'text-slate-700 dark:text-slate-200',
    halo:
      'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(148,163,184,0.18), transparent 55%)',
    border: 'border-slate-400/40',
    bg: 'bg-slate-500/10',
  },
};

const DIFFICULTY_TONES: Record<DifficultyLevel, string> = {
  giris: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300',
  profesyonel: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  kurumsal: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
};

const CURRENCY_FORMAT = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export function SolutionList({
  category,
  solutions,
  totalInCategory,
  searchQuery,
  difficultyLabels,
  onSearchChange,
  onClearSearch,
  onSelectSolution,
  onBackToIndex,
}: SolutionListProps) {
  const accent = ACCENT_STYLES[category.accent];
  const isEmpty = solutions.length === 0;

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <ListHeader
        category={category}
        totalInCategory={totalInCategory}
        resultCount={solutions.length}
        searchQuery={searchQuery}
        accent={accent}
        onSearchChange={onSearchChange}
        onBackToIndex={onBackToIndex}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-10 lg:py-14">
          {isEmpty ? (
            <EmptyState
              searchQuery={searchQuery}
              onClearSearch={onClearSearch}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  accent={accent}
                  difficultyLabel={difficultyLabels[solution.difficulty]}
                  onSelect={() => onSelectSolution?.(solution.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ListHeader({
  category,
  totalInCategory,
  resultCount,
  searchQuery,
  accent,
  onSearchChange,
  onBackToIndex,
}: {
  category: SolutionCategory;
  totalInCategory: number;
  resultCount: number;
  searchQuery: string;
  accent: { text: string; halo: string; border: string; bg: string };
  onSearchChange?: (query: string) => void;
  onBackToIndex?: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: accent.halo }}
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

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-slate-500"
        >
          <span>Ana Sayfa</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <button
            type="button"
            onClick={onBackToIndex}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Çözümler
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className={accent.text}>{category.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
                Kategori
              </span>
            </div>
            <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-bold leading-[0.98] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[4rem]">
              {category.name}
              <span className="text-orange-500">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {category.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {category.keywords.map((kw) => (
                <span
                  key={kw}
                  className={`border ${accent.border} ${accent.bg} px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${accent.text}`}
                >
                  {kw}
                </span>
              ))}
            </div>
            <div className="mt-8 inline-flex items-center gap-px border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              <div className="flex flex-col gap-0.5 bg-white px-4 py-2.5 dark:bg-slate-950">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">
                  {resultCount}
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  eşleşen
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-white px-4 py-2.5 dark:bg-slate-950">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">
                  {totalInCategory}
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  toplam
                </span>
              </div>
            </div>
          </div>

          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <label className="group relative flex items-center border border-slate-300 bg-white transition-colors focus-within:border-orange-500 dark:border-slate-700 dark:bg-slate-900/70">
              <span className="pointer-events-none flex h-12 w-12 items-center justify-center font-['JetBrains_Mono'] text-xs font-medium text-orange-600 dark:text-orange-400">
                &gt;_
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="bu kategoride ara..."
                className="min-w-0 flex-1 bg-transparent py-3.5 pr-4 font-['JetBrains_Mono'] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Ara"
                className="flex h-12 w-12 items-center justify-center border-l border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 hover:text-orange-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </label>
          </form>
        </div>
      </div>
    </section>
  );
}

function SolutionCard({
  solution,
  accent,
  difficultyLabel,
  onSelect,
}: {
  solution: Solution;
  accent: { text: string; halo: string; border: string; bg: string };
  difficultyLabel: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex h-full flex-col gap-4 border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600`}
    >
      <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-black">
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
        <Sparkles className={`relative h-12 w-12 ${accent.text}`} strokeWidth={1.2} />
        <div className="absolute left-3 top-3">
          <span
            className={`border px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${
              DIFFICULTY_TONES[solution.difficulty]
            }`}
          >
            {difficultyLabel}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-700">
          {solution.slug.toUpperCase()}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-['Space_Grotesk'] text-xl font-semibold leading-tight text-slate-900 transition-colors group-hover:${accent.text} dark:text-white`}
        >
          {solution.name}
        </h3>
        <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-900 dark:text-slate-600 dark:group-hover:text-white" />
      </div>

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
        <div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Başlangıç
          </div>
          <div className={`font-['Space_Grotesk'] text-lg font-bold ${accent.text}`}>
            {CURRENCY_FORMAT.format(solution.priceFrom)}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 font-['Space_Grotesk'] text-xs font-semibold text-slate-700 transition-colors group-hover:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:group-hover:border-slate-500">
          Detay
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

function EmptyState({
  searchQuery,
  onClearSearch,
}: {
  searchQuery: string;
  onClearSearch?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-14 w-14 items-center justify-center border border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-['Space_Grotesk'] text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
        Aradığın senaryoya uyan çözüm yok
      </h3>
      <p className="mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {searchQuery
          ? `"${searchQuery}" için sonuç bulamadık.`
          : 'Bu kategoride şu an bir çözüm yok.'}{' '}
        Farklı bir kelime dene veya aramayı temizle.
      </p>
      {onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-6 inline-flex h-11 items-center gap-2 bg-orange-500 px-5 font-['Space_Grotesk'] text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <X className="h-4 w-4" />
          Aramayı Temizle
        </button>
      )}
    </div>
  );
}
