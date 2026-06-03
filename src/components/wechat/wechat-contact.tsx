'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

const WECHAT_ID = 'Easloyip';
const QR_SRC = '/images/wechat-qr.jpg';
const QR_ALT = '加微信 Easloyip — YoTrade 跨境支付/代办/代购/代付一站式服务';

// ← 换成你的实际图片路径
const WHATSAPP_QR = '/images/whatsapp-qr.png';
const WHATSAPP_ALT = 'YoTrade WhatsApp 二维码';
const TELEGRAM_QR = '/images/telegram-qr.png';
const TELEGRAM_ALT = 'YoTrade Telegram 二维码';

const DEFAULT_PERKS_COMPACT = [
  '30 分钟内反馈报价',
  '一对一咨询,免费业务梳理',
  '咨询免费不强推',
];

// primary 三渠道并排（WeChat 主 + WhatsApp / Telegram 副）
const CHANNELS = [
  { src: QR_SRC, alt: QR_ALT, label: '微信 WeChat', sub: '国内首选 · 成交主渠道', dotClass: 'bg-wx-600', primary: true },
  { src: WHATSAPP_QR, alt: WHATSAPP_ALT, label: 'WhatsApp', sub: '海外用户首选', dotClass: 'bg-[#25D366]', primary: false },
  { src: TELEGRAM_QR, alt: TELEGRAM_ALT, label: 'Telegram', sub: '隐私 / 频道动态', dotClass: 'bg-[#229ED9]', primary: false },
];

// primary 锚点卡片（4 张）
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
  perks?: string[];
  className?: string;
}

export function WechatContact({
  variant = 'primary',
  title,
  subtitle,
  perks,
  className,
}: WechatContactProps) {
  const t = useTranslations('WechatContact');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      toast.success('微信号已复制', {
        description: `打开微信 → 添加好友 → 粘贴 ${WECHAT_ID}`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('复制失败,请手动复制: ' + WECHAT_ID);
    }
  };

  // --- INLINE (Footer) — 不动 ---
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative size-12 shrink-0 rounded-md overflow-hidden border bg-white">
          <Image src={QR_SRC} alt={QR_ALT} fill className="object-cover" sizes="48px" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-muted-foreground">微信咨询</span>
          <button type="button" onClick={copy}
            className="text-sm font-medium hover:text-primary inline-flex items-center gap-1.5 group">
            {WECHAT_ID}
            {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5 opacity-50 group-hover:opacity-100" />}
          </button>
        </div>
      </div>
    );
  }

  // --- COMPACT (Service pages bottom) — 不动 ---
  if (variant === 'compact') {
    const list = perks ?? DEFAULT_PERKS_COMPACT;
    return (
      <Card className={cn('border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-6 md:p-8', className)}>
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8 items-center">
          <div className="mx-auto md:mx-0 relative size-44 md:size-48 rounded-lg overflow-hidden border-2 border-primary/20 bg-white shadow-sm">
            <Image src={QR_SRC} alt={QR_ALT} fill className="object-cover" sizes="(max-width: 768px) 176px, 192px" />
          </div>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mx-auto md:mx-0">
                <MessageCircle className="size-3.5" />
                <span>微信咨询 · 免费报价</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">{title ?? '扫码加微信,30 分钟内出方案'}</h3>
              {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <ul className="space-y-2 text-sm text-left max-w-md mx-auto md:mx-0">
              {list.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2 mx-auto md:mx-0">
              <Button onClick={copy} size="lg" className="gap-2">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? '已复制' : `复制微信号 ${WECHAT_ID}`}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // --- PRIMARY (/contact) — 三码并排重排 ---
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

      {/* 标题区（居中） */}
      <div className="relative mx-auto mb-8 max-w-xl text-center">
        <span className="text-wx-700 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold">
          <QrCode className="size-3.5" /> {t('badge')}
        </span>
        <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight sm:text-[28px]">
          {title ?? t('heading')}
        </h2>
      </div>

      {/* 三码并排 */}
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
            <div className={cn('relative size-[150px] overflow-hidden rounded-xl bg-white', ch.primary && 'wx-qr-float')}>
              <Image src={ch.src} alt={ch.alt} fill className="object-cover" sizes="150px" priority={ch.primary} />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-extrabold">
              <span className={cn('size-2.5 rounded-full', ch.dotClass)} />
              {ch.label}
            </div>
            <span className="text-muted-foreground -mt-2 text-xs">{ch.sub}</span>
          </div>
        ))}
      </div>

      {/* 锚点标题（居中 · 放大 · 绿色下划条） */}
      <div className="relative mb-5 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight">{t('perksTitle')}</h3>
        <span className="from-wx-500 to-brand-500 mx-auto mt-2.5 block h-[3px] w-12 rounded-full bg-gradient-to-r" />
      </div>

      {/* 4 锚点卡片 */}
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
              <h4 className="text-sm font-extrabold">{t(`perks.${key}.title`)}</h4>
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{t(`perks.${key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
