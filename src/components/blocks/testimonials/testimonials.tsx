import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * TestimonialsSection — 闲鱼真实评价精选（Pass 5 · Block 8 收尾）
 * 取代 mksaas 默认 12 条假评价。6 条 masonry，第 1 条墨夜精选大字。
 * 浅灰底。Server Component。
 * ⚠ 评价正文现为示意占位 —— 上线请用闲鱼真实评价截选替换 i18n。
 */

const TESTIMONIAL_KEYS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const;

export default function TestimonialsSection() {
  const t = useTranslations('HomePage.testimonials');

  return (
    <section id="testimonials" className="bg-bg-soft px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-11 flex flex-col items-center text-center">
          <span className="text-brand-600 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="bg-brand-500 h-px w-5" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-balance md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {TESTIMONIAL_KEYS.map((k, i) => {
            const featured = i === 0;
            const name = t(`items.${k}.name`);
            const initial = name.trim().charAt(0);
            return (
              <figure
                key={k}
                className={cn(
                  'break-inside-avoid rounded-2xl border p-6 shadow-sm',
                  featured
                    ? 'border-ink-700 from-ink-800 to-ink-900 bg-gradient-to-br text-white'
                    : 'border-border-soft bg-white'
                )}
              >
                <div className="mb-3 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>

                <blockquote
                  className={cn(
                    featured ? 'text-lg font-bold leading-relaxed' : 'text-sm leading-relaxed'
                  )}
                >
                  “{t(`items.${k}.quote`)}”
                </blockquote>

                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold',
                      featured
                        ? 'bg-white/10 text-white'
                        : 'bg-bg-soft text-muted-foreground border-border-soft border'
                    )}
                  >
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold">{name}</div>
                    <div className={cn('text-xs', featured ? 'text-white/55' : 'text-muted-foreground')}>
                      {t(`items.${k}.meta`)}
                    </div>
                  </div>
                  {!featured && (
                    <span className="text-wx-700 ml-auto shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold">
                      {t('badge')}
                    </span>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
