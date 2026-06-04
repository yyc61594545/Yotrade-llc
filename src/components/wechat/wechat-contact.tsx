import { cn } from '@/lib/utils';
import { Clock, Compass, QrCode, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * WechatContact — 三渠道 QR 模块,跨页面统一视觉契约。
 *
 * 三个 variant 都是「三码并排」(微信 / WhatsApp / Telegram),只是尺寸不同:
 * - primary: /contact 全尺寸 (150px QR + 文案 + perksTitle + 4 perks)
 * - compact: 服务页底部 中等 (120px QR + 文案 + 4 perks,无 perksTitle 分隔条)
 * - inline:  Footer 紧凑 (64px QR × 3 横排 + 小 label,无文案)
 *
 * 全 Server Component (无 useState / event handler / 复制按钮)。
 */

const WECHAT_QR_SRC = '/images/wechat-qr.jpg';
const WECHAT_QR_ALT = '加微信 Easloyip — YoTrade 跨境支付/代办/代购/代付一站式服务';
const WHATSAPP_QR_SRC = '/images/whatsapp-qr.png';
const WHATSAPP_QR_ALT = 'YoTrade WhatsApp 二维码';
const TELEGRAM_QR_SRC = '/images/telegram-qr.png';
const TELEGRAM_QR_ALT = 'YoTrade Telegram 二维码';

const CHANNELS = [
  {
    src: WECHAT_QR_SRC,
    alt: WECHAT_QR_ALT,
    label: '微信 WeChat',
    sub: '国内首选 · 成交主渠道',
    dotClass: 'bg-wx-600',
    primary: true,
  },
  {
    src: WHATSAPP_QR_SRC,
    alt: WHATSAPP_QR_ALT,
    label: 'WhatsApp',
    sub: '海外用户首选',
    dotClass: 'bg-[#25D366]',
    primary: false,
  },
  {
    src: TELEGRAM_QR_SRC,
    alt: TELEGRAM_QR_ALT,
    label: 'Telegram',
    sub: '隐私 / 频道动态',
    dotClass: 'bg-[#229ED9]',
    primary: false,
  },
] as const;

const PRIMARY_PERKS = [
  { icon: Clock, key: 'fast' },
  { icon: Compass, key: 'path' },
  { icon: Users, key: 'community' },
  { icon: ShieldCheck, key: 'free' },
] as const;

interface WechatContactProps {
  variant?: 'primary' | 'compact' | 'inline';
  title?: string;
  subtitle?: string;
  /** @deprecated Pass 5 后 perks 走 i18n,此 prop 保留向后兼容但忽略。 */
  perks?: string[];
  className?: string;
}

export function WechatContact({
  variant = 'primary',
  title,
  subtitle,
  className,
}: WechatContactProps) {
  const t = useTranslations('WechatContact');

  // --- INLINE (Footer) — 紧凑横排三码 ---
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-start gap-3', className)}>
        {CHANNELS.map((ch) => (
          <div key={ch.label} className="flex flex-col items-center gap-1">
            <div className="border-border-soft relative size-16 overflow-hidden rounded-lg border bg-white p-0.5">
              <Image
                src={ch.src}
                alt={ch.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <span className="text-muted-foreground text-[10px] font-medium">
              {ch.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // --- COMPACT (服务页底部) — 中等三码 ---
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-[0_20px_50px_-18px_rgba(11,16,32,0.15)] sm:p-8',
          className
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,194,91,0.12),transparent_70%)]"
        />

        {/* header */}
        <div className="relative mx-auto mb-6 max-w-lg text-center">
          <span className="text-wx-700 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold">
            <QrCode className="size-3.5" /> {t('badge')}
          </span>
          <h3 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
            {title ?? t('heading')}
          </h3>
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
          )}
        </div>

        {/* 三码并排 — 中等尺寸 */}
        <div className="relative mb-6 flex flex-wrap justify-center gap-3">
          {CHANNELS.map((ch) => (
            <div
              key={ch.label}
              className={cn(
                'flex w-[170px] max-w-[240px] flex-col items-center gap-2.5 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md max-sm:w-full',
                ch.primary
                  ? 'border-emerald-200 ring-1 ring-emerald-200 shadow-[0_12px_28px_-12px_rgba(7,161,82,0.4)]'
                  : 'border-border-soft'
              )}
            >
              <div
                className={cn(
                  'relative size-[120px] overflow-hidden rounded-lg bg-white',
                  ch.primary && 'wx-qr-float'
                )}
              >
                <Image
                  src={ch.src}
                  alt={ch.alt}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                <span className={cn('size-2 rounded-full', ch.dotClass)} />
                {ch.label}
              </div>
              <span className="text-muted-foreground text-[10px]">{ch.sub}</span>
            </div>
          ))}
        </div>

        {/* 4 perks 网格 */}
        <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRIMARY_PERKS.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="border-border-soft group flex gap-2.5 rounded-lg border bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
            >
              <div className="text-wx-700 grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50">
                <Icon className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold">
                  {t(`perks.${key}.title`)}
                </h4>
                <p className="text-muted-foreground mt-0.5 text-[10px] leading-relaxed">
                  {t(`perks.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- PRIMARY (/contact) — Full 三码 ---
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-[0_24px_60px_-18px_rgba(11,16,32,0.18)] sm:p-10',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,194,91,0.12),transparent_70%)]"
      />

      {/* 标题区(居中) */}
      <div className="relative mx-auto mb-8 max-w-xl text-center">
        <span className="text-wx-700 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold">
          <QrCode className="size-3.5" /> {t('badge')}
        </span>
        <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight sm:text-[28px]">
          {title ?? t('heading')}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* 三码并排 — Full 尺寸 */}
      <div className="relative mb-8 flex flex-wrap justify-center gap-4">
        {CHANNELS.map((ch) => (
          <div
            key={ch.label}
            className={cn(
              'flex w-[204px] max-w-[280px] flex-col items-center gap-3.5 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md max-sm:w-full',
              ch.primary
                ? 'border-emerald-200 ring-1 ring-emerald-200 shadow-[0_16px_36px_-14px_rgba(7,161,82,0.4)]'
                : 'border-border-soft'
            )}
          >
            <div
              className={cn(
                'relative size-[150px] overflow-hidden rounded-xl bg-white',
                ch.primary && 'wx-qr-float'
              )}
            >
              <Image
                src={ch.src}
                alt={ch.alt}
                fill
                className="object-cover"
                sizes="150px"
                priority={ch.primary}
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-extrabold">
              <span className={cn('size-2.5 rounded-full', ch.dotClass)} />
              {ch.label}
            </div>
            <span className="text-muted-foreground -mt-2 text-xs">{ch.sub}</span>
          </div>
        ))}
      </div>

      {/* perksTitle 分隔条 */}
      <div className="relative mb-5 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight">
          {t('perksTitle')}
        </h3>
        <span className="from-wx-500 to-brand-500 mx-auto mt-2.5 block h-[3px] w-12 rounded-full bg-gradient-to-r" />
      </div>

      {/* 4 perks 网格 */}
      <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRIMARY_PERKS.map(({ icon: Icon, key }) => (
          <div
            key={key}
            className="border-border-soft group flex gap-3 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="text-wx-700 grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50">
              <Icon className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold">
                {t(`perks.${key}.title`)}
              </h4>
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                {t(`perks.${key}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
