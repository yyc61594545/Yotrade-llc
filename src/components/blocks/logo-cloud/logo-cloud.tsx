import { useTranslations } from 'next-intl';

/**
 * LogoCloud — 代购品牌带（Pass 5 · Block 5）
 * LogoCloud → 单行无缝自动滚动 marquee。浅灰底。
 * 灰度 logo 占位 hover 上色；reduced-motion → paused（见 globals）。
 * Server Component。data-driven：加品牌只动 BRANDS。
 * ⚠ logo 现用单色字符占位；接真实 svg/png 时把 <span class=mark> 换 <Image>，
 *   保留外层 grayscale group-hover/chip:grayscale-0。
 */

const BRANDS = [
  { key: 'amazon',     mark: 'a',  color: '#ff9900' },
  { key: 'nike',       mark: '✔',  color: '#0b1020' },
  { key: 'uniqlo',     mark: 'UQ', color: '#e60012' },
  { key: 'adidas',     mark: '▲',  color: '#0b1020' },
  { key: 'coach',      mark: 'C',  color: '#5b3a29' },
  { key: 'toysrus',    mark: 'R',  color: '#00a651' },
  { key: 'meitun',     mark: '囤', color: '#ff6f91' },
  { key: 'traderjoes', mark: 'TJ', color: '#d0021b' },
] as const;

function BrandChip({ mark, color, label }: { mark: string; color: string; label: string }) {
  return (
    <div className="border-border-soft group/chip flex h-[72px] min-w-[170px] items-center justify-center gap-2.5 rounded-xl border bg-white px-6 shadow-sm">
      <span
        className="grid size-8 place-items-center rounded-lg text-sm font-extrabold text-white grayscale transition-all duration-200 group-hover/chip:grayscale-0"
        style={{ backgroundColor: color }}
      >
        {mark}
      </span>
      <span className="text-muted-foreground group-hover/chip:text-foreground text-base font-extrabold transition-colors">
        {label}
      </span>
    </div>
  );
}

export default function LogoCloud() {
  const t = useTranslations('HomePage.brands');

  return (
    <section id="brands" className="bg-bg-soft px-4 py-14 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="text-brand-600 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="bg-brand-500 h-px w-5" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight md:text-3xl">
            {t('title')}
          </h2>
        </div>

        {/* 两份 BRANDS 拼接，平移 -50% 无缝循环 */}
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex w-max gap-4">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <BrandChip key={`${b.key}-${i}`} mark={b.mark} color={b.color} label={t(`items.${b.key}`)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
