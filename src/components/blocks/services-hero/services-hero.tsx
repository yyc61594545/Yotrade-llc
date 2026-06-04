import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Banknote,
  CreditCard,
  Landmark,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * ServicesHero — 首页主业三件套 + 代办进阶横幅（Pass 5 · Block 2）
 * 代付/代购/代刷 = 走量主业（3 大卡，代付墨夜+最热门）；代办 = 进阶横幅 demote。
 * CTA 全走微信成交：3 卡 → /contact 带 utm；代办 → /services/daiban。
 * Server Component。复用 token，无新 keyframe。
 *
 * 路由映射（user 可后续调整 MAIN_SERVICES.detailHref）：
 *   代付 → /services/daishua（实际 daishua 服务页内容 = AI 订阅代付）
 *   代购 → /services/daigou
 *   代刷 → /services/daimai（按语义就近映射，user 拍板可调整）
 */

const MAIN_SERVICES = [
  { slug: 'daifu',   icon: CreditCard,  dark: true,  hot: true,  detailHref: '/services/daishua' },
  { slug: 'daigou',  icon: ShoppingBag, dark: false, hot: false, detailHref: '/services/daigou' },
  { slug: 'daishua', icon: RefreshCw,   dark: false, hot: false, detailHref: '/services/daimai' },
] as const;

const CONTACT_HREF = (campaign: string) =>
  `/contact?utm_source=home&utm_medium=services-card&utm_campaign=${campaign}`;

const DAIBAN_HREF =
  '/services/daiban?utm_source=home&utm_medium=services-banner&utm_campaign=daiban';

export default function ServicesHero() {
  const t = useTranslations('HomePage.servicesHero');

  return (
    <section id="services-hero" className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* header */}
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

        {/* 主业三件套 */}
        <div className="grid gap-5 lg:grid-cols-3">
          {MAIN_SERVICES.map(({ slug, icon: Icon, dark, hot, detailHref }) => (
            <div
              key={slug}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-200 hover:-translate-y-1.5',
                dark
                  ? 'border-ink-700 from-ink-800 to-ink-900 bg-gradient-to-b text-white shadow-xl hover:shadow-2xl'
                  : 'border-border-soft bg-white shadow-sm hover:shadow-lg'
              )}
            >
              {dark && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[radial-gradient(circle,rgba(16,194,91,0.18),transparent_70%)]"
                />
              )}

              {hot && (
                <span className="bg-wx-500 absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-[0_8px_18px_-6px_rgba(16,194,91,0.6)]">
                  {t('hot')}
                </span>
              )}

              <div
                className={cn(
                  'relative mb-5 grid size-14 place-items-center rounded-2xl',
                  dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600'
                )}
              >
                <Icon className="size-7" />
              </div>

              <h3 className="relative text-2xl font-extrabold tracking-tight">
                {t(`items.${slug}.title`)}
              </h3>
              <p
                className={cn(
                  'relative mt-2.5 flex-1 text-sm leading-relaxed',
                  dark ? 'text-white/65' : 'text-muted-foreground'
                )}
              >
                {t(`items.${slug}.desc`)}
              </p>

              <div
                className={cn(
                  'relative mt-5 border-t border-dashed pt-4 text-sm font-bold',
                  dark
                    ? 'border-white/15 text-brand-200'
                    : 'border-border-soft text-foreground'
                )}
              >
                {t(`items.${slug}.highlight`)}
              </div>

              <Button
                asChild
                className="bg-wx-500 hover:bg-wx-600 active:bg-wx-700 mt-5 h-12 w-full rounded-xl text-base font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,194,91,0.55)] transition-all hover:-translate-y-0.5"
              >
                <LocaleLink href={CONTACT_HREF(slug)}>
                  <MessageCircle className="size-5" />
                  {t('cta')}
                </LocaleLink>
              </Button>

              <LocaleLink
                href={detailHref}
                className={cn(
                  'relative mt-3 inline-flex items-center justify-center gap-1 text-sm font-semibold transition-colors',
                  dark
                    ? 'text-white/70 hover:text-white'
                    : 'text-brand-600 hover:text-brand-700'
                )}
              >
                {t('detail')}
                <ArrowRight className="size-3.5" />
              </LocaleLink>
            </div>
          ))}
        </div>

        {/* 代办进阶横幅 */}
        <div className="border-brand-100 from-brand-50 mt-5 flex flex-wrap items-center gap-5 rounded-2xl border bg-gradient-to-r to-white px-7 py-6">
          <div className="bg-brand-600 grid size-14 shrink-0 place-items-center rounded-2xl text-white">
            <Landmark className="size-7" />
          </div>
          <div className="min-w-[240px] flex-1">
            <h4 className="flex flex-wrap items-center gap-2.5 text-lg font-extrabold">
              {t('daiban.title')}
              <span className="text-brand-700 border-brand-200 rounded-full border bg-white px-2.5 py-0.5 text-[11px] font-bold">
                {t('daiban.badge')}
              </span>
            </h4>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('daiban.desc')}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-extrabold">
            <Banknote className="text-brand-600 size-4" />
            {t('daiban.price')}
          </div>
          <Button
            asChild
            className="bg-brand-600 hover:bg-brand-700 h-11 shrink-0 rounded-xl px-5 font-bold text-white"
          >
            <LocaleLink href={DAIBAN_HREF}>
              {t('daiban.cta')}
              <ArrowRight className="size-4" />
            </LocaleLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
