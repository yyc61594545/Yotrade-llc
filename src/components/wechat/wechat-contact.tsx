'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, CheckCircle2, Copy, MessageCircle, QrCode } from 'lucide-react';
import Image from 'next/image';
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

const DEFAULT_PERKS_PRIMARY = [
  '30 分钟内反馈方案 + 报价,代办/代购/代付按需估价',
  '一对一咨询,直接告诉你最省钱的路径(哪怕是推荐手册版自助)',
  '免费业务结构梳理:适合自助/适合代办/适合代购代付,我们帮你选',
  '已成单客户专属社群,薅卡情报 + 5472 续费提醒长期推送',
  '咨询完全免费,不合适不强推,不绑架',
];

const DEFAULT_PERKS_COMPACT = [
  '30 分钟内反馈报价',
  '一对一咨询,免费业务梳理',
  '咨询免费不强推',
];

interface WechatContactProps {
  /**
   * primary: full hero on /contact — giant QR + ID + 5 perks
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

  // --- INLINE (Footer) -----------------------------------------------------
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

  // --- COMPACT (Service pages bottom) --------------------------------------
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
          {/* QR */}
          <div className="mx-auto md:mx-0 relative size-44 md:size-48 rounded-lg overflow-hidden border-2 border-primary/20 bg-white shadow-sm">
            <Image
              src={QR_SRC}
              alt={QR_ALT}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 176px, 192px"
            />
          </div>

          {/* Right column */}
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

  // --- PRIMARY (/contact hero) ---------------------------------------------
  const list = perks ?? DEFAULT_PERKS_PRIMARY;
  return (
    <Card
      className={cn(
        'border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-8 md:p-12',
        className
      )}
    >
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-12 items-center">
        {/* Big QR */}
        <div className="mx-auto md:mx-0 relative size-60 md:size-72 rounded-xl overflow-hidden border-4 border-primary/30 bg-white shadow-lg">
          <Image
            src={QR_SRC}
            alt={QR_ALT}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 240px, 288px"
            priority
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground mx-auto md:mx-0">
              <QrCode className="size-3.5" />
              <span>跨境业务首选沟通渠道</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title ?? '扫码加微信,30 分钟内出方案'}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {subtitle ??
                '中国跨境业务最终都靠微信成交。直接加我,免邮件、免表单、不绕弯。'}
            </p>
          </div>

          {/* Big ID + copy button */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center md:justify-start">
            <div className="rounded-lg border-2 border-dashed border-primary/40 bg-background px-4 py-3 font-mono text-lg md:text-xl font-semibold text-primary text-center min-w-[200px]">
              {WECHAT_ID}
            </div>
            <Button onClick={copy} size="lg" className="gap-2">
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? '已复制' : '复制微信号'}
            </Button>
          </div>

          {/* Perks */}
          <div className="space-y-2.5">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              加我微信你能得到什么
            </div>
            <ul className="space-y-2.5 text-left">
              {list.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
