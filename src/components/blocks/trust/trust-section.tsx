import { ShieldCheck, Zap, Check, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * TrustSection — 首页 P0 信任区（Pass 5）
 * 失去闲鱼背书后由网站自己重建信任：真实闲鱼信用 + 担保 + 3 步流程 + 覆盖。
 * 无交互 → Server Component。复用 token，无新 keyframe。
 */

const COVERAGE_CHIPS = [
  '广东', '北京', '上海', '浙江', '江苏', '加拿大', '香港', '韩国', '吉布提',
];

const STAT_KEYS = ['l6', 'rate', 'reviews', 'coverage'] as const;
const GUARANTEE_KEYS = ['payshua', 'gou', 'presale'] as const;
const STEP_KEYS = ['ask', 'quote', 'deliver'] as const;

export default function TrustSection() {
  const t = useTranslations('HomePage.trust');

  return (
    <section id="trust" className="bg-bg-soft px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-brand-600 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="bg-brand-500 h-px w-5" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-3 text-balance md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_KEYS.map((k) => {
            const isL6 = k === 'l6';
            return (
              <div
                key={k}
                className="border-border-soft rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div
                  className={`flex items-center gap-2 text-4xl font-extrabold leading-none tracking-tight ${
                    isL6 ? 'text-wx-700' : 'text-brand-700'
                  }`}
                >
                  {isL6 && <span className="text-3xl">🏆</span>}
                  <span>
                    {t(`stats.${k}.value`)}
                    <span className="text-muted-foreground/60 text-lg">
                      {t(`stats.${k}.unit`)}
                    </span>
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold">
                  {t(`stats.${k}.label`)}
                </div>
                <div className="text-muted-foreground/80 mt-1 text-xs">
                  {t(`stats.${k}.meta`)}
                </div>
              </div>
            );
          })}
        </div>

        {/* guarantees + steps */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* guarantees */}
          <div className="border-border-soft rounded-2xl border bg-white p-7 shadow-sm md:p-8">
            <h3 className="mb-5 flex items-center gap-2.5 text-lg font-extrabold">
              <span className="text-wx-600 grid size-7 place-items-center rounded-lg bg-emerald-50">
                <ShieldCheck className="size-4" />
              </span>
              {t('guarantee.title')}
            </h3>
            <div className="grid gap-3.5">
              {GUARANTEE_KEYS.map((k) => (
                <div key={k} className="flex gap-3 text-sm">
                  <Check className="text-wx-600 mt-0.5 size-5 shrink-0" />
                  <span>
                    <b className="font-bold">{t(`guarantee.${k}.label`)}</b>
                    {t(`guarantee.${k}.text`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* steps */}
          <div className="border-border-soft rounded-2xl border bg-white p-7 shadow-sm md:p-8">
            <h3 className="mb-5 flex items-center gap-2.5 text-lg font-extrabold">
              <span className="text-brand-600 grid size-7 place-items-center rounded-lg bg-blue-50">
                <Zap className="size-4" />
              </span>
              {t('steps.title')}
            </h3>
            <ol className="relative">
              {STEP_KEYS.map((k, i) => {
                const last = i === STEP_KEYS.length - 1;
                return (
                  <li key={k} className="relative flex gap-4 pb-5 last:pb-0">
                    {!last && (
                      <span
                        aria-hidden
                        className="from-brand-200 absolute left-[18px] top-11 h-[calc(100%-2.5rem)] w-0.5 bg-gradient-to-b to-transparent"
                      />
                    )}
                    <span
                      className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-xl font-extrabold text-white ${
                        last
                          ? 'bg-wx-500 shadow-[0_8px_18px_-6px_rgba(16,194,91,0.5)]'
                          : 'bg-brand-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-[15px] font-extrabold">
                        {t(`steps.${k}.title`)}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t(`steps.${k}.text`)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* coverage */}
        <div className="border-border-soft mt-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-white px-6 py-5 shadow-sm md:px-7">
          <Globe className="text-brand-600 size-6 shrink-0" />
          <div className="min-w-[200px] flex-1">
            <b className="font-extrabold">{t('coverage.title')}</b>
            <p className="text-muted-foreground text-sm">{t('coverage.text')}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COVERAGE_CHIPS.map((c) => (
              <span
                key={c}
                className="bg-bg-soft border-border-soft text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-semibold"
              >
                {c}
              </span>
            ))}
            <span className="bg-bg-soft border-border-soft text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-semibold">
              …
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
