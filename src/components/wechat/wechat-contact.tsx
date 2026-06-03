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
  Layers,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Shared WeChat contact component — single source of truth for the
 * Easloyip ID + QR code that appears across /contact, all service pages,
 * and the footer. Three sizes via variant.
 *
 * Why a shared component: every cross-border conversion ends in WeChat.
 * If the ID lives in one place, swapping it (or the QR) on rebrand is
 * one edit, not eight.
 */

const WECHAT_ID = 'Easloyip';
const QR_SRC = '/images/wechat-qr.jpg';
const QR_ALT = '加微信 Easloyip — YoTrade 跨境支付/代办/代购/代付一站式服务';

const DEFAULT_PERKS_COMPACT = [
  '30 分钟内反馈报价',
  '一对一咨询,免费业务梳理',
  '咨询免费不强推',
];

// primary 图标卡片化锚点（i18n key + 图标）
const PRIMARY_PERKS = [
  { icon: Clock, key: 'fast' },
  { icon: Compass, key: 'cheapest' },
  { icon: Layers, key: 'structure' },
  { icon: Users, key: 'community' },
  { icon: ShieldCheck, key: 'free' },
] as const;

const TRUST_BADGES = ['trustFree', 'trustFast', 'trustNoPush'] as const;

interface WechatContactProps {
  /**
   * primary: full hero on /contact — giant QR + ID + perks card grid
   * compact: card module for service pages — medium QR + 3 perks
   * inline: footer-style row — tiny QR + ID + copy
   */
  variant?: 'primary' | 'compact' | 'inline';
  /** Override the main heading. Default depends on variant. */
  title?: string;
  /** Override the supporting line. Default depends on variant. */
  subtitle?: string;
  /** Override the bullet list (primary / compact only). */
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
          <Image
            src={QR_SRC}
            alt={QR_ALT}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-muted-foreground">微信咨询</span>
          <button
            type="button"
            onClick={copy}
            className="text-sm font-medium hover:text-primary inline-flex items-center gap-1.5 group"
            aria-label="复制微信号"
          >
            {WECHAT_ID}
            {copied ? (
              <Check className="size-3.5 text-green-600" />
            ) : (
              <Copy className="size-3.5 opacity-50 group-hover:opacity-100" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- COMPACT (Service pages bottom) — 不动 ---
  if (variant === 'compact') {
    const list = perks ?? DEFAULT_PERKS_COMPACT;
    return (
      <Card
        className={cn(
          'border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-6 md:p-8',
          className
        )}
      >
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8 items-center">
          <div className="mx-auto md:mx-0 relative size-44 md:size-48 rounded-lg overflow-hidden border-2 border-primary/20 bg-white shadow-sm">
            <Image
              src={QR_SRC}
              alt={QR_ALT}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 176px, 192px"
            />
          </div>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mx-auto md:mx-0">
                <MessageCircle className="size-3.5" />
                <span>微信咨询 · 免费报价</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">
                {title ?? '扫码加微信,30 分钟内出方案'}
              </h3>
              {subtitle ? (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
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
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? '已复制' : `复制微信号 ${WECHAT_ID}`}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // --- PRIMARY (/contact hero) — 升级布局 v2 (Claude Design) ---
  const customPerks = perks;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-[0_24px_60px_-18px_rgba(11,16,32,0.18)] sm:p-9',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-[radial-gradient(circle,rgba(16,194,91,0.16),transparent_70%)]"
      />

      <div className="relative grid items-center gap-9 sm:grid-cols-[auto_1fr]">
        {/* QR：光环 + 浮动 */}
        <div className="relative mx-auto size-[212px] shrink-0">
          <div className="wx-qr-glow" aria-hidden />
          <div className="wx-qr-float relative size-[212px] rounded-2xl bg-white p-3.5 shadow-[0_14px_30px_-10px_rgba(7,161,82,0.35)]">
            <div className="relative size-full overflow-hidden rounded-lg">
              <Image
                src={QR_SRC}
                alt={QR_ALT}
                fill
                className="object-cover"
                sizes="212px"
                priority
              />
            </div>
          </div>
          <div className="text-wx-700 absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
            <Check className="size-3" /> {t('qrBadge')}
          </div>
        </div>

        {/* 文案 */}
        <div className="text-center sm:text-left">
          <span className="text-wx-700 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold">
            <QrCode className="size-3.5" /> {t('badge')}
          </span>
          <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight sm:text-[27px]">
            {title ?? t('heading')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm sm:mx-0 sm:text-base">
            {subtitle ?? t('description')}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <span className="text-wx-700 rounded-xl border-[1.5px] border-dashed border-emerald-400/70 bg-white px-4 py-2.5 font-mono text-lg font-extrabold tracking-wide">
              {WECHAT_ID}
            </span>
            <Button
              onClick={copy}
              variant="outline"
              className={cn(
                'h-[46px] gap-1.5 rounded-xl text-sm font-bold',
                copied && 'border-wx-500 text-wx-700 bg-emerald-50'
              )}
            >
              {copied ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? t('copied') : t('copyButton')}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {TRUST_BADGES.map((k) => (
              <span
                key={k}
                className="text-muted-foreground border-border-soft inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold"
              >
                <ShieldCheck className="text-wx-600 size-3.5" />
                {t(`trust.${k}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="mb-3.5 flex items-center gap-2.5">
          <h3 className="text-base font-extrabold">{t('perksTitle')}</h3>
          <span className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
        </div>

        {customPerks ? (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {customPerks.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckCircle2 className="text-wx-600 mt-0.5 size-5 shrink-0" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </div>
  );
}
