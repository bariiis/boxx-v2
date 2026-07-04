import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Cpu,
  Download,
  FileText,
  GitCompareArrows,
  HardDrive,
  type LucideIcon,
  Lock,
  MemoryStick,
  Monitor,
  Network,
  Package,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import type {
  BaseProduct,
  ComponentCategory,
  ComponentCategoryId,
  ComponentOption,
  CompatibilityWarning,
  KonfiguratorProps,
  PowerSummary,
  PricingSummary,
  QuoteFormValues,
  RecommendationTone,
  Selection,
  WarningSeverity,
} from './types';

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Network,
  Zap,
  Snowflake,
  Package,
  Terminal,
  ShieldCheck,
};

const CURRENCY_FORMAT = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

function formatDelta(value: number) {
  if (value === 0) return 'Dahili';
  const sign = value > 0 ? '+' : '−';
  return `${sign}${CURRENCY_FORMAT.format(Math.abs(value))}`;
}

const RECOMMENDATION_STYLES: Record<Exclude<RecommendationTone, null>, { border: string; bg: string; text: string; label: string }> = {
  recommended: {
    border: 'border-teal-500/40',
    bg: 'bg-teal-500/10',
    text: 'text-teal-700 dark:text-teal-300',
    label: 'Önerilen',
  },
  popular: {
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
    text: 'text-orange-700 dark:text-orange-300',
    label: 'Popüler',
  },
  budget: {
    border: 'border-slate-400/40',
    bg: 'bg-slate-500/10',
    text: 'text-slate-700 dark:text-slate-200',
    label: 'Ekonomik',
  },
};

const SEVERITY_STYLES: Record<WarningSeverity, string> = {
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  error: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
};

export function Configurator({
  baseProducts,
  categories,
  options,
  selection,
  activeCategoryId,
  warnings,
  power,
  pricing,
  completionPercent,
  shareUrl,
  onSelectBaseProduct,
  onSelectCategory,
  onSelectOption,
  onResetToRecommended,
  onRequestQuote,
  onShareConfiguration,
  onDownloadPdf,
  onAddToCompare,
  onFocusCategoryFromSummary,
}: KonfiguratorProps) {
  const baseProduct =
    baseProducts.find((b) => b.id === selection.baseProductId) ?? baseProducts[0];
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const warningsByCategoryId = new Map<string, CompatibilityWarning[]>();
  const warningsByOptionId = new Map<string, CompatibilityWarning[]>();
  warnings.forEach((w) => {
    const cArr = warningsByCategoryId.get(w.categoryId) ?? [];
    cArr.push(w);
    warningsByCategoryId.set(w.categoryId, cArr);

    const oArr = warningsByOptionId.get(w.optionId) ?? [];
    oArr.push(w);
    warningsByOptionId.set(w.optionId, oArr);
  });

  const handleShare = () => {
    onShareConfiguration?.();
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2400);
  };

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <ContextBar
        baseProducts={baseProducts}
        activeBaseId={baseProduct.id}
        completionPercent={completionPercent}
        onSelectBase={(id) => onSelectBaseProduct?.(id)}
        onReset={() => onResetToRecommended?.()}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 py-8 md:py-10 lg:flex-row lg:items-start lg:gap-6">
          <CategoryAccordion
            categories={categories}
            options={options}
            baseProduct={baseProduct}
            selection={selection}
            activeCategoryId={activeCategoryId}
            warningsByCategoryId={warningsByCategoryId}
            warningsByOptionId={warningsByOptionId}
            onToggle={(id) => onSelectCategory?.(id)}
            onSelectOption={(catId, optId) => onSelectOption?.(catId, optId)}
          />

          <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0 lg:sticky lg:top-6">
            <BaseProductCard baseProduct={baseProduct} />
            <PowerCard power={power} />
            <SelectionList
              categories={categories}
              options={options}
              selection={selection}
              warnings={warnings}
              onFocus={(id) =>
                onFocusCategoryFromSummary?.(id) ?? onSelectCategory?.(id)
              }
            />
            <PricingCard
              pricing={pricing}
              leadTime={baseProduct.estimatedLeadTimeDays}
            />
            {!quoteOpen ? (
              <ActionButtons
                onRequestQuote={() => setQuoteOpen(true)}
                onShare={handleShare}
                onDownloadPdf={() => onDownloadPdf?.()}
                onAddToCompare={() => onAddToCompare?.()}
                shareToast={shareToast}
                shareUrl={shareUrl}
              />
            ) : (
              <QuoteForm
                onCancel={() => setQuoteOpen(false)}
                onSubmit={(values) => {
                  onRequestQuote?.(values);
                  setQuoteOpen(false);
                }}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Context bar                                                                 */
/* -------------------------------------------------------------------------- */

function ContextBar({
  baseProducts,
  activeBaseId,
  completionPercent,
  onSelectBase,
  onReset,
}: {
  baseProducts: BaseProduct[];
  activeBaseId: string;
  completionPercent: number;
  onSelectBase: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 90% 20%, rgba(249,115,22,0.16), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 pt-8 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-slate-500"
        >
          <span>Ana Sayfa</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-orange-600 dark:text-orange-400">Konfigüratör</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
                01 / Yapılandır
              </span>
            </div>
            <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Kendine özel kur
              <span className="text-orange-500">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Baz ürünü seç; akordeondan bileşen bileşen ilerle. Uyumsuz seçenekler otomatik kilitlenir, fiyat sağda canlı güncellenir.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-2 font-['Space_Grotesk'] text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Önerilen'e sıfırla
            </button>
            <div className="inline-flex items-center gap-3 border border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Tamamlanan
              </span>
              <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${Math.min(100, completionPercent)}%` }}
                />
              </div>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-slate-900 dark:text-white">
                {completionPercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 py-4 dark:border-slate-800">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Baz Ürün
          </span>
          {baseProducts.map((base) => {
            const isActive = base.id === activeBaseId;
            return (
              <button
                key={base.id}
                type="button"
                onClick={() => onSelectBase(base.id)}
                className={`inline-flex items-center gap-2 border px-3 py-1.5 font-['Space_Grotesk'] text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                {base.name}
                <span className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                  · {base.categoryName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Category accordion (left block)                                             */
/* -------------------------------------------------------------------------- */

function CategoryAccordion({
  categories,
  options,
  baseProduct,
  selection,
  activeCategoryId,
  warningsByCategoryId,
  warningsByOptionId,
  onToggle,
  onSelectOption,
}: {
  categories: ComponentCategory[];
  options: ComponentOption[];
  baseProduct: BaseProduct;
  selection: Selection;
  activeCategoryId: ComponentCategoryId;
  warningsByCategoryId: Map<string, CompatibilityWarning[]>;
  warningsByOptionId: Map<string, CompatibilityWarning[]>;
  onToggle: (id: ComponentCategoryId) => void;
  onSelectOption: (categoryId: ComponentCategoryId, optionId: string | null) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
          02 / Bileşenler
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {categories.length} kategori · akordeon
        </span>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {categories.map((category, idx) => {
          const isOpen = category.id === activeCategoryId;
          const Icon = CATEGORY_ICON[category.icon] ?? Sparkles;
          const selectedOptionId = selection.selections[category.id];
          const selectedOption = options.find((o) => o.id === selectedOptionId);
          const categoryWarnings = warningsByCategoryId.get(category.id) ?? [];
          const hasActionableWarning = categoryWarnings.some((w) => w.severity !== 'info');

          const availableIds = baseProduct.availableOptionIds[category.id] ?? [];
          const categoryOptions = availableIds
            .map((id) => options.find((o) => o.id === id))
            .filter((o): o is ComponentOption => Boolean(o));

          return (
            <div key={category.id} className={isOpen ? 'bg-orange-500/[0.03] dark:bg-orange-500/[0.04]' : ''}>
              <button
                type="button"
                onClick={() => onToggle(category.id)}
                aria-expanded={isOpen}
                className={`group relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors sm:gap-4 sm:px-5 ${
                  isOpen ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {isOpen && (
                  <span aria-hidden className="absolute left-0 top-0 h-full w-0.5 bg-orange-500" />
                )}
                <span className="hidden font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 sm:inline">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center border ${isOpen ? 'border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-['Space_Grotesk'] text-sm font-semibold sm:text-base ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {category.label}
                    </span>
                    <span className={`border px-1.5 py-0.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] ${
                      category.requirement === 'required'
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300'
                        : 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                    }`}>
                      {category.requirement === 'required' ? 'Zorunlu' : 'Opsiyonel'}
                    </span>
                    {hasActionableWarning && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-amber-500"
                        title="Uyumluluk uyarısı var"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 truncate font-['Inter'] text-xs text-slate-500">
                    {selectedOption ? selectedOption.name : category.shortDescription}
                  </div>
                </div>
                {selectedOption && (
                  <div className="hidden text-right md:block">
                    <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-slate-500">
                      Fark
                    </div>
                    <div className={`font-['Space_Grotesk'] text-sm font-semibold ${
                      selectedOption.priceDelta === 0
                        ? 'text-slate-500'
                        : selectedOption.priceDelta > 0
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-teal-600 dark:text-teal-300'
                    }`}>
                      {formatDelta(selectedOption.priceDelta)}
                    </div>
                  </div>
                )}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400 dark:text-slate-600'
                  }`}
                  strokeWidth={2}
                />
              </button>

              {isOpen && (
                <CategoryBody
                  category={category}
                  options={categoryOptions}
                  selectedOptionId={selectedOptionId ?? null}
                  warningsByOptionId={warningsByOptionId}
                  categoryWarnings={categoryWarnings}
                  baseProduct={baseProduct}
                  onSelectOption={(optId) => onSelectOption(category.id, optId)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category body (accordion content)                                           */
/* -------------------------------------------------------------------------- */

function CategoryBody({
  category,
  options,
  selectedOptionId,
  warningsByOptionId,
  categoryWarnings,
  baseProduct,
  onSelectOption,
}: {
  category: ComponentCategory;
  options: ComponentOption[];
  selectedOptionId: string | null;
  warningsByOptionId: Map<string, CompatibilityWarning[]>;
  categoryWarnings: CompatibilityWarning[];
  baseProduct: BaseProduct;
  onSelectOption: (optionId: string | null) => void;
}) {
  const [helperOpen, setHelperOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-4 pb-6 pt-4 dark:border-slate-800 sm:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {options.length} opsiyon · {baseProduct.name}
        </span>
        {category.helperTitle && (
          <>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setHelperOpen((v) => !v)}
              className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
            >
              <Sparkles className="h-3 w-3" />
              {category.helperTitle}
              <ChevronRight className={`h-3 w-3 transition-transform ${helperOpen ? 'rotate-90' : ''}`} />
            </button>
          </>
        )}
      </div>

      {helperOpen && category.helperBody && (
        <p className="max-w-3xl border-l-2 border-orange-500/40 bg-orange-500/[0.04] px-3 py-2 font-['Inter'] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {category.helperBody}
        </p>
      )}

      {categoryWarnings.length > 0 && (
        <ul className="flex flex-col gap-2">
          {categoryWarnings.map((w) => (
            <li
              key={w.id}
              className={`flex items-start gap-3 border px-4 py-3 ${SEVERITY_STYLES[w.severity]}`}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-['Inter'] text-sm font-medium">{w.message}</p>
                {w.suggestion && (
                  <p className="mt-0.5 font-['Inter'] text-xs opacity-80">Öneri: {w.suggestion}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = option.id === selectedOptionId;
          const warningsForOption = warningsByOptionId.get(option.id) ?? [];
          const hasBlockingWarning = warningsForOption.some((w) => w.severity === 'error');
          return (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={isSelected}
              disabled={hasBlockingWarning}
              warnings={warningsForOption}
              onSelect={() => onSelectOption(option.id)}
            />
          );
        })}
      </div>

      {category.allowNone && (
        <button
          type="button"
          onClick={() => onSelectOption(null)}
          className="inline-flex items-center gap-2 self-start font-['Space_Grotesk'] text-xs font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline dark:hover:text-white"
        >
          Bu kategoriyi geç (opsiyonel)
          <ArrowUpRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function OptionCard({
  option,
  isSelected,
  disabled,
  warnings,
  onSelect,
}: {
  option: ComponentOption;
  isSelected: boolean;
  disabled: boolean;
  warnings: CompatibilityWarning[];
  onSelect: () => void;
}) {
  const recommendation = option.recommendation ? RECOMMENDATION_STYLES[option.recommendation] : null;
  const stockTone =
    option.stock === 'available'
      ? 'text-teal-700 dark:text-teal-300'
      : option.stock === 'low'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-red-700 dark:text-red-300';
  const stockLabel =
    option.stock === 'available' ? 'Hazır' : option.stock === 'low' ? 'Stok az' : 'Tükendi';
  const infoWarnings = warnings.filter((w) => w.severity === 'info');
  const actionableWarnings = warnings.filter((w) => w.severity !== 'info');

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`group relative flex h-full flex-col gap-3 border bg-white p-5 text-left transition-colors dark:bg-slate-950 ${
        disabled
          ? 'cursor-not-allowed border-slate-200 opacity-50 dark:border-slate-800'
          : isSelected
            ? 'border-orange-500 outline outline-1 -outline-offset-2 outline-orange-500'
            : 'border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
              {option.brand}
            </span>
            {recommendation && (
              <span className={`border ${recommendation.border} ${recommendation.bg} px-1.5 py-0.5 font-['JetBrains_Mono'] text-[9px] font-semibold uppercase tracking-[0.2em] ${recommendation.text}`}>
                {recommendation.label}
              </span>
            )}
            {disabled && (
              <span className="inline-flex items-center gap-1 border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-['JetBrains_Mono'] text-[9px] font-semibold uppercase tracking-[0.2em] text-red-700 dark:text-red-300">
                <Lock className="h-2.5 w-2.5" />
                Uyumsuz
              </span>
            )}
          </div>
          <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-semibold leading-tight text-slate-900 dark:text-white">
            {option.name}
          </h3>
          <p className="mt-1 font-['Inter'] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {option.description}
          </p>
        </div>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
            isSelected
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'
          }`}
        >
          {isSelected && <CheckCircle2 className="h-4 w-4" />}
        </span>
      </div>

      {option.specs.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
          {option.specs.map((spec) => (
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
      )}

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <span className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${stockTone}`}>
            {stockLabel}
          </span>
          {option.powerDraw !== undefined && option.powerDraw > 0 && (
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              TDP {option.powerDraw} W
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Fark
          </div>
          <div className={`font-['Space_Grotesk'] text-lg font-bold ${
            option.priceDelta === 0
              ? 'text-slate-500'
              : option.priceDelta > 0
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-teal-600 dark:text-teal-300'
          }`}>
            {formatDelta(option.priceDelta)}
          </div>
        </div>
      </div>

      {(infoWarnings.length > 0 || actionableWarnings.length > 0) && (
        <ul className="flex flex-col gap-1 border-t border-slate-200 pt-3 dark:border-slate-800">
          {[...actionableWarnings, ...infoWarnings].map((w) => (
            <li
              key={w.id}
              className={`flex items-start gap-2 border px-2 py-1.5 ${SEVERITY_STYLES[w.severity]}`}
            >
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="font-['Inter'] text-xs leading-tight">
                {w.message}
                {w.suggestion && <span className="opacity-75"> — {w.suggestion}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary panel (right block)                                                 */
/* -------------------------------------------------------------------------- */

function BaseProductCard({ baseProduct }: { baseProduct: BaseProduct }) {
  return (
    <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
          Baz Ürün
        </span>
        <span className="ml-auto font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {baseProduct.slug.toUpperCase()}
        </span>
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-black">
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
        <Cpu className="h-20 w-20 text-slate-300 dark:text-slate-700" strokeWidth={0.8} />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {baseProduct.categoryName}
          </div>
          <div className="truncate font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
            {baseProduct.name}
          </div>
        </div>
      </div>
    </div>
  );
}

function PowerCard({ power }: { power: PowerSummary }) {
  const toneBar =
    power.status === 'over'
      ? 'bg-red-500'
      : power.status === 'high'
        ? 'bg-amber-500'
        : 'bg-teal-500';
  const toneText =
    power.status === 'over'
      ? 'text-red-700 dark:text-red-300'
      : power.status === 'high'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-teal-700 dark:text-teal-300';
  const pct = Math.min(100, power.utilizationPercent);

  return (
    <div className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-orange-500" />
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Güç Bütçesi
          </span>
        </div>
        <span className={`font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] ${toneText}`}>
          {power.status === 'over' ? 'Aşım' : power.status === 'high' ? 'Yüksek' : 'Uygun'}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-slate-900 dark:text-white">
            {power.totalDraw} W
          </div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            toplam çekim
          </div>
        </div>
        <div className="text-right">
          <div className="font-['Space_Grotesk'] text-sm font-semibold text-slate-600 dark:text-slate-300">
            {power.psuCapacity} W PSU
          </div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            kapasite
          </div>
        </div>
      </div>
      <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-900">
        <div className={`h-full transition-all ${toneBar}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
        <span>kullanım</span>
        <span>{power.utilizationPercent}%</span>
      </div>
    </div>
  );
}

function SelectionList({
  categories,
  options,
  selection,
  warnings,
  onFocus,
}: {
  categories: ComponentCategory[];
  options: ComponentOption[];
  selection: Selection;
  warnings: CompatibilityWarning[];
  onFocus: (id: ComponentCategoryId) => void;
}) {
  return (
    <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
          Seçimler
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {categories.length} kategori
        </span>
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {categories.map((category) => {
          const optId = selection.selections[category.id];
          const option = options.find((o) => o.id === optId);
          const hasWarn = warnings.some(
            (w) => w.categoryId === category.id && w.severity !== 'info',
          );
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onFocus(category.id)}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {category.label}
                    </span>
                    {hasWarn && (
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div className="mt-0.5 truncate font-['Inter'] text-xs font-medium text-slate-800 dark:text-slate-200">
                    {option ? option.name : 'Seçim yapılmadı'}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-['JetBrains_Mono'] text-[11px] font-semibold ${
                      option && option.priceDelta > 0
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {option ? formatDelta(option.priceDelta) : '—'}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PricingCard({
  pricing,
  leadTime,
}: {
  pricing: PricingSummary;
  leadTime: [number, number];
}) {
  return (
    <div className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
          Fiyat
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          KDV hariç
        </span>
      </div>
      <dl className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-['Inter'] text-xs text-slate-600 dark:text-slate-400">
          <dt>Baz Ürün</dt>
          <dd>{CURRENCY_FORMAT.format(pricing.basePrice)}</dd>
        </div>
        <div className="flex items-center justify-between font-['Inter'] text-xs text-slate-600 dark:text-slate-400">
          <dt>Bileşen farkı</dt>
          <dd>{pricing.componentsDelta >= 0 ? '+' : ''}{CURRENCY_FORMAT.format(pricing.componentsDelta)}</dd>
        </div>
        {pricing.warrantyDelta > 0 && (
          <div className="flex items-center justify-between font-['Inter'] text-xs text-slate-600 dark:text-slate-400">
            <dt>Garanti uzatma</dt>
            <dd>+{CURRENCY_FORMAT.format(pricing.warrantyDelta)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
        <div className="flex items-baseline justify-between">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Toplam
          </span>
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-orange-600 dark:text-orange-400">
            {CURRENCY_FORMAT.format(pricing.subtotal)}
          </span>
        </div>
        {pricing.monthlyInstallmentEstimate !== undefined && (
          <div className="mt-1 text-right font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
            veya 12 ay · {CURRENCY_FORMAT.format(pricing.monthlyInstallmentEstimate)}/ay
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          Tahmini teslim {leadTime[0]}-{leadTime[1]} iş günü
        </span>
      </div>
    </div>
  );
}

function ActionButtons({
  onRequestQuote,
  onShare,
  onDownloadPdf,
  onAddToCompare,
  shareToast,
  shareUrl,
}: {
  onRequestQuote: () => void;
  onShare: () => void;
  onDownloadPdf: () => void;
  onAddToCompare: () => void;
  shareToast: boolean;
  shareUrl?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onRequestQuote}
        className="inline-flex h-12 items-center justify-center gap-2 bg-orange-500 px-5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition-colors hover:bg-orange-600"
      >
        <FileText className="h-4 w-4" />
        Teklif İste
      </button>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex h-11 flex-col items-center justify-center gap-0.5 border border-slate-300 bg-white font-['Space_Grotesk'] text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          title={shareUrl}
        >
          <Copy className="h-3.5 w-3.5" />
          Paylaş
        </button>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex h-11 flex-col items-center justify-center gap-0.5 border border-slate-300 bg-white font-['Space_Grotesk'] text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          PDF
        </button>
        <button
          type="button"
          onClick={onAddToCompare}
          className="inline-flex h-11 flex-col items-center justify-center gap-0.5 border border-slate-300 bg-white font-['Space_Grotesk'] text-[11px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
          Karşılaştır
        </button>
      </div>
      {shareToast && (
        <div className="flex items-center gap-2 border border-teal-500/40 bg-teal-500/10 px-3 py-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Link panoya kopyalandı
        </div>
      )}
    </div>
  );
}

function QuoteForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (values: QuoteFormValues) => void;
}) {
  const [values, setValues] = useState<QuoteFormValues>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    note: '',
  });

  const update = <K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="flex flex-col gap-3 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">
          Teklif İste
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline dark:hover:text-white"
        >
          Vazgeç
        </button>
      </div>
      <Field
        label="Ad Soyad"
        required
        value={values.fullName}
        onChange={(v) => update('fullName', v)}
      />
      <Field
        label="E-posta"
        required
        type="email"
        value={values.email}
        onChange={(v) => update('email', v)}
      />
      <Field
        label="Telefon"
        required
        type="tel"
        value={values.phone}
        onChange={(v) => update('phone', v)}
      />
      <Field
        label="Kurum (opsiyonel)"
        value={values.organization ?? ''}
        onChange={(v) => update('organization', v)}
      />
      <label className="flex flex-col gap-1">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Not (opsiyonel)
        </span>
        <textarea
          rows={3}
          value={values.note}
          onChange={(e) => update('note', e.target.value)}
          className="resize-none border border-slate-300 bg-white px-3 py-2 font-['Inter'] text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Teslimat tercihi, özel gereksinim..."
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 bg-orange-500 px-5 font-['Space_Grotesk'] text-sm font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Teklifi Gönder
      </button>
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Konfigürasyon otomatik iliştirilir. 1 iş günü içinde taslak teklif e-postayla iletilir.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
        {required && <span className="text-orange-500"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 border border-slate-300 bg-white px-3 font-['Inter'] text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}
