import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight, MessageCircle, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * DaifuShowcase — 代付商品橱窗（Pass 5 · Block 4）
 * SEO 承接（产品名=搜索词）+ 微信转化（无价格，引流报价）。
 * 8 产品（AI 4 + Media 4）+ 第 9 格「更多 →」链 /services/daifu。
 * 每卡：单色 logo + 名 + 子档位 chip + sub + 单 CTA「微信咨询报价 →」(带 product UTM)。
 * 无 Stripe/结账。整站无价格。Server Component。data-driven。
 * ⚠ logo 现用单色字符占位；接真品牌 svg 时把 logo <span> 换 <Image>。
 */

const DAIFU_PRODUCTS = [
  // AI
  { slug: 'chatgpt',    name: 'ChatGPT',    mark: 'G', color: '#10a37f' },
  { slug: 'claude',     name: 'Claude',     mark: 'C', color: '#d97757' },
  { slug: 'cursor',     name: 'Cursor',     mark: '▲', color: '#0b1020' },
  { slug: 'midjourney', name: 'Midjourney', mark: 'M', color: '#1a1a2e' },
  // Media
  { slug: 'suno',       name: 'Suno',       mark: '♪', color: '#000000' },
  { slug: 'netflix',    name: 'Netflix',    mark: 'N', color: '#e50914' },
  { slug: 'spotify',    name: 'Spotify',    mark: 'S', color: '#1db954' },
  { slug: 'appleid',    name: 'Apple ID',   mark: '',  color: '#0b1020' },
] as const;

const CONTACT_HREF = (slug: string) =>
  `/contact?utm_source=home&utm_medium=daifu-card&utm_campaign=${slug}`;

const MORE_HREF =
  '/services/daifu?utm_source=home&utm_medium=daifu-more&utm_campaign=more';

export default function DaifuShowcase() {
  const t = useTranslations('HomePage.daifu');

  return (
    <section id="daifu" className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-11 max-w-2xl text-center">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DAIFU_PRODUCTS.map(({ slug, name, mark, color }) => {
            const tiers = t.raw(`products.${slug}.tiers`) as string[];
            return (
              <div
                key={slug}
                className="border-border-soft group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="grid size-11 place-items-center rounded-xl text-lg font-extrabold text-white"
                  style={{ backgroundColor: color }}
                >
                  {mark}
                </div>

                <h3 className="mt-4 text-base font-extrabold">{name}</h3>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tiers.map((tier) => (
                    <span
                      key={tier}
                      className="bg-bg-soft border-border-soft text-muted-foreground rounded-md border px-2 py-0.5 text-[11px] font-bold"
                    >
                      {tier}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground mt-3 flex-1 text-xs leading-relaxed">
                  {t(`products.${slug}.sub`)}
                </p>

                <Button
                  asChild
                  className="bg-wx-500 hover:bg-wx-600 active:bg-wx-700 mt-4 h-11 w-full rounded-xl text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(16,194,91,0.55)] transition-all hover:-translate-y-0.5"
                >
                  <LocaleLink href={CONTACT_HREF(slug)}>
                    <MessageCircle className="size-4" />
                    {t('cta')}
                  </LocaleLink>
                </Button>
                <p className="text-muted-foreground/70 mt-2 text-center text-[11px]">
                  {t('ctaSub')}
                </p>
              </div>
            );
          })}

          {/* 第 9 格：更多 */}
          <LocaleLink
            href={MORE_HREF}
            className="border-border-soft hover:border-brand-300 hover:bg-brand-50/40 group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-white p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1"
          >
            <span className="bg-brand-50 text-brand-600 group-hover:bg-brand-600 grid size-11 place-items-center rounded-xl transition-colors group-hover:text-white">
              <Plus className="size-5" />
            </span>
            <span className="text-sm font-extrabold">{t('more.title')}</span>
            <span className="text-muted-foreground text-xs">{t('more.sub')}</span>
            <span className="text-brand-600 inline-flex items-center gap-1 text-sm font-bold">
              {t('more.cta')}
              <ArrowRight className="size-3.5" />
            </span>
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
