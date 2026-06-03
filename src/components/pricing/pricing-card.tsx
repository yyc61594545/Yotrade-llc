'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMounted } from '@/hooks/use-mounted';
import { useLocalePathname } from '@/i18n/navigation';
import { formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import {
  type PaymentType,
  PaymentTypes,
  type PlanInterval,
  PlanIntervals,
  type Price,
  type PricePlan,
} from '@/payment/types';
import { CheckCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LoginWrapper } from '../auth/login-wrapper';
import { Badge } from '../ui/badge';
import { CheckoutButton } from './create-checkout-button';
import { PayPalCheckoutButton } from './paypal-button';

interface PricingCardProps {
  plan: PricePlan;
  interval?: PlanInterval;
  paymentType?: PaymentType;
  metadata?: Record<string, string>;
  className?: string;
  isCurrentPlan?: boolean;
}

function getPriceForPlan(
  plan: PricePlan,
  interval?: PlanInterval,
  paymentType?: PaymentType
): Price | undefined {
  if (plan.isFree) {
    return undefined;
  }
  return plan.prices.find((price) => {
    if (paymentType === PaymentTypes.ONE_TIME) {
      return price.type === PaymentTypes.ONE_TIME;
    }
    return (
      price.type === PaymentTypes.SUBSCRIPTION && price.interval === interval
    );
  });
}

/**
 * Pricing Card Component
 *
 * 视觉系统（Pass 3）：去掉橙/绿/蓝/紫四色彩虹，统一为
 *   · popular === true  → 墨夜深色推荐档（agency $699）
 *   · manual            → 最安静（soft 灰底）
 *   · advanced          → 标准白底（品牌蓝点缀）
 *   · site_building     → 旗舰白底（顶部蓝紫渐变条 + ✦ 角标）
 */
export function PricingCard({
  plan,
  interval,
  paymentType,
  metadata,
  className,
  isCurrentPlan = false,
}: PricingCardProps) {
  const t = useTranslations('PricingPage.PricingCard');
  const price = getPriceForPlan(plan, interval, paymentType);
  const currentUser = useCurrentUser();
  const currentPath = useLocalePathname();
  const mounted = useMounted();

  let formattedPrice = '';
  let priceLabel = '';
  if (plan.isFree) {
    formattedPrice = t('freePrice');
  } else if (price && price.amount > 0) {
    formattedPrice = formatPrice(price.amount, price.currency);
    if (interval === PlanIntervals.MONTH) {
      priceLabel = t('perMonth');
    } else if (interval === PlanIntervals.YEAR) {
      priceLabel = t('perYear');
    }
  } else {
    formattedPrice = t('notAvailable');
  }

  const isPaidPlan = !plan.isFree && !!price;
  const hasTrialPeriod = price?.trialPeriodDays && price.trialPeriodDays > 0;

  // ---- tier 判定（popular 优先） ----
  const isPopular = plan.popular === true;
  const isManual = plan.id === 'manual';
  const isAdvanced = plan.id === 'advanced';
  const isSiteBuilding = plan.id === 'site_building';

  // ---- 样式 token ----
  let cardStyles =
    'relative flex flex-col h-full rounded-2xl border transition-all duration-200';
  let titleClass = 'text-foreground';
  let priceClass = 'text-foreground';
  let priceSizeClass = 'text-5xl';
  let descClass = 'text-muted-foreground';
  let checkClass = 'text-brand-600';
  let dividerClass = 'border-border-soft';
  let featureTextClass = '';
  let subTextClass = 'text-muted-foreground';
  let buttonClass = 'bg-brand-600 hover:bg-brand-700 text-white';
  let smallBadgeText = '';
  let smallBadgeClass = 'bg-muted text-muted-foreground';

  if (isPopular) {
    cardStyles +=
      ' z-10 border-ink-700 bg-gradient-to-b from-ink-800 to-ink-900 text-white shadow-2xl shadow-ink-900/40 lg:-translate-y-2 lg:scale-[1.03]';
    titleClass = 'text-white';
    priceClass = 'text-brand-200';
    priceSizeClass = 'text-6xl';
    descClass = 'text-white/60';
    checkClass = 'text-wx-500';
    dividerClass = 'border-white/15';
    featureTextClass = 'text-white';
    subTextClass = 'text-white/55';
    buttonClass =
      'bg-wx-500 hover:bg-wx-600 active:bg-wx-700 text-white shadow-[0_12px_28px_-8px_rgba(16,194,91,0.6)]';
  } else if (isManual) {
    cardStyles += ' border-border-soft bg-bg-soft shadow-sm';
    checkClass = 'text-muted-foreground';
    buttonClass =
      'border border-input bg-white text-foreground hover:bg-muted shadow-none';
    smallBadgeText = t('manualBadge');
  } else if (isSiteBuilding) {
    cardStyles += ' border-brand-100 bg-white shadow-md';
    smallBadgeText = t('siteBuildingBadge');
    smallBadgeClass = 'bg-brand-50 text-brand-700';
  } else if (isAdvanced) {
    cardStyles += ' border-border-soft bg-white shadow-sm';
    smallBadgeText = t('advancedBadge');
  } else {
    cardStyles += ' border-border-soft bg-white shadow-sm';
  }

  return (
    <Card className={cn(cardStyles, className)}>
      {/* 旗舰：顶部蓝紫渐变条 */}
      {isSiteBuilding && (
        <div
          aria-hidden
          className="from-brand-600 absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r to-[#6d4dff]"
        />
      )}

      {/* 推荐档：绿色浮动徽章 */}
      {isPopular && (
        <div className="pricing-popular-float pricing-badge-glow bg-wx-500 absolute -top-3 left-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-white">
          {t('popularBadge')}
        </div>
      )}

      <CardHeader className="pb-6">
        <div className="mb-4 flex items-center gap-3">
          <h3 className={cn('text-xl font-bold', titleClass)}>{plan.name}</h3>
          {!isPopular && smallBadgeText && (
            <Badge
              variant="secondary"
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-normal',
                smallBadgeClass
              )}
            >
              {isSiteBuilding ? `✦ ${smallBadgeText}` : smallBadgeText}
            </Badge>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span
            className={cn('font-bold tracking-tight', priceSizeClass, priceClass)}
          >
            ${isPaidPlan ? price!.amount / 100 : 0}
          </span>
        </div>

        <CardDescription className={cn('mt-4 min-h-[48px] text-sm', descClass)}>
          {plan.description}
        </CardDescription>

        <div className="mt-6 flex flex-col gap-3">
          {currentUser ? (
            <>
              <CheckoutButton
                userId={currentUser.id}
                planId={plan.id}
                priceId={price?.priceId || ''}
                className={cn(
                  'h-12 w-full rounded-lg text-base font-medium shadow-sm transition-colors',
                  buttonClass
                )}
              >
                {t('getStartedFreeTrial')}
              </CheckoutButton>

              {isPaidPlan &&
                plan.prices.some((p) => p.type === PaymentTypes.ONE_TIME) && (
                  <div className="w-full">
                    <div className="relative flex items-center py-2">
                      <div
                        className={cn(
                          'flex-grow border-t',
                          isPopular ? 'border-white/15' : 'border-border-soft'
                        )}
                      />
                      <span
                        className={cn(
                          'mx-4 flex-shrink-0 text-xs uppercase',
                          isPopular ? 'text-white/40' : 'text-muted-foreground'
                        )}
                      >
                        {t('orPayWith') || 'Or pay with'}
                      </span>
                      <div
                        className={cn(
                          'flex-grow border-t',
                          isPopular ? 'border-white/15' : 'border-border-soft'
                        )}
                      />
                    </div>
                    <PayPalCheckoutButton
                      userId={currentUser.id}
                      planId={plan.id}
                      priceId={price?.priceId || ''}
                      amount={price?.amount ? price.amount / 100 : 0}
                      currency={price?.currency || 'USD'}
                    />
                  </div>
                )}
            </>
          ) : (
            <LoginWrapper mode="modal">
              <Button
                className={cn(
                  'h-12 w-full rounded-lg text-base font-medium shadow-sm transition-colors',
                  buttonClass
                )}
              >
                {t('getStartedFreeTrial')}
              </Button>
            </LoginWrapper>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <div className={cn('my-2 border-t border-dashed', dividerClass)} />

        <ul className="space-y-4">
          {plan.features?.map((featureRaw, i) => {
            const [mainText, subText] = featureRaw.split('||');
            return (
              <li
                key={i}
                className={cn('flex items-start gap-3 text-sm', featureTextClass)}
              >
                <CheckCircleIcon
                  className={cn('mt-0.5 size-5 shrink-0', checkClass)}
                />
                <div className="flex flex-col">
                  <span className="font-medium leading-tight">{mainText}</span>
                  {subText && (
                    <span className={cn('mt-0.5 text-xs', subTextClass)}>
                      {subText}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
