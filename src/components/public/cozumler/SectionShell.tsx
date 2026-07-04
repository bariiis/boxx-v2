import type { ReactNode } from 'react';

export function SectionShell({
  label,
  eyebrow,
  title,
  subtitle,
  children,
  kicker,
}: {
  label: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  kicker?: ReactNode;
  children: ReactNode;
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
