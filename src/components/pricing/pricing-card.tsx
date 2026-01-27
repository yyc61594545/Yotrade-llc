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
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LoginWrapper } from '../auth/login-wrapper';
import { Badge } from '../ui/badge';
import { CheckoutButton } from './create-checkout-button';
import { PayPalCheckoutButton } from './paypal-button';

interface PricingCardProps {
  plan: PricePlan;
  interval?: PlanInterval; // 'month' or 'year'
  paymentType?: PaymentType; // 'subscription' or 'one_time'
  metadata?: Record<string, string>;
  className?: string;
  isCurrentPlan?: boolean;
}

/**
 * Get the appropriate price object for the selected interval and payment type
 * @param plan The price plan
 * @param interval The selected interval (month or year)
 * @param paymentType The payment type (SUBSCRIPTION or one_time)
 * @returns The price object or undefined if not found
 */
function getPriceForPlan(
  plan: PricePlan,
  interval?: PlanInterval,
  paymentType?: PaymentType
): Price | undefined {
  if (plan.isFree) {
    // Free plan has no price
    return undefined;
  }

  // non-free plans must have a price
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
 * Displays a single pricing plan with features and action button
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
  // console.log('pricing card, currentPath', currentPath);

  // generate formatted price and price label
  let formattedPrice = '';
  let priceLabel = '';
  if (plan.isFree) {
    formattedPrice = t('freePrice');
  } else if (price && price.amount > 0) {
    // price is available
    formattedPrice = formatPrice(price.amount, price.currency);
    if (interval === PlanIntervals.MONTH) {
      priceLabel = t('perMonth');
    } else if (interval === PlanIntervals.YEAR) {
      priceLabel = t('perYear');
    }
  } else {
    formattedPrice = t('notAvailable');
  }

  // check if plan is not free and has a price
  const isPaidPlan = !plan.isFree && !!price;
  // check if plan has a trial period, period is greater than 0
  const hasTrialPeriod = price?.trialPeriodDays && price.trialPeriodDays > 0;

  // Determine styles based on plan ID
  const isSiteBuilding = plan.id === 'site_building'; // Now "Site Building Agent Service" ($1999)

  let cardStyles = 'flex flex-col h-full rounded-2xl border-2 transition-all duration-200 bg-white dark:bg-card';
  let badgeText = '';
  let badgeStyles = '';
  // Colors for text/icons/buttons
  let themeColorText = 'text-primary';
  let themeColorBorder = 'border-border';
  let themeColorButton = 'bg-primary hover:bg-primary/90 text-primary-foreground'; // Default
  let shadowClass = '';

  if (isManual) {
    // Orange Theme
    cardStyles += ' border-orange-500 shadow-xl shadow-orange-100/50 dark:shadow-orange-900/20';
    badgeText = t('manualBadge');
    badgeStyles = 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    themeColorText = 'text-orange-500';
    themeColorBorder = 'border-orange-500';
    themeColorButton = 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';

  } else if (isAdvanced) {
    // Green Theme
    cardStyles += ' border-emerald-500 shadow-xl shadow-emerald-100/50 dark:shadow-emerald-900/20';
    badgeText = t('advancedBadge');
    badgeStyles = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
    themeColorText = 'text-emerald-500';
    themeColorBorder = 'border-emerald-500';
    themeColorButton = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500';

  } else if (isAgency) {
    // Blue Theme
    cardStyles += ' border-blue-500 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20';
    badgeText = t('agencyBadge');
    badgeStyles = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    themeColorText = 'text-blue-600'; // Match border roughly
    themeColorBorder = 'border-blue-500';
    themeColorButton = 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';

  } else if (isSiteBuilding) {
    // Purple Theme
    cardStyles += ' border-purple-500 shadow-xl shadow-purple-100/50 dark:shadow-purple-900/20';
    badgeText = ''; // No badge for now, or maybe "Full Service"? User provided screenshot shows no badge
    badgeStyles = 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    themeColorText = 'text-purple-600';
    themeColorBorder = 'border-purple-500';
    themeColorButton = 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600';

  } else {
    // Fallback
    cardStyles += ' border-border shadow-sm';
  }

  return (
    <Card className={cn(cardStyles, className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          {/* Title matches border color */}
          <h3 className={cn("text-xl font-bold", themeColorText)}>{plan.name}</h3>
          {(isManual || isAdvanced || isAgency) && (
            <Badge variant="secondary" className={cn("rounded-md px-2 py-0.5 text-xs font-normal", badgeStyles)}>
              {badgeText}
            </Badge>
          )}
        </div>

        {/* Price display */}
        <div className="flex items-baseline gap-1 mt-2">
          <span className={cn("text-5xl font-bold tracking-tight", themeColorText)}>
            ${isPaidPlan ? (price!.amount / 100) : 0}
          </span>
        </div>

        <CardDescription className="mt-4 text-sm text-muted-foreground min-h-[48px]">
          {plan.description}
        </CardDescription>

        {/* Action Button */}
        <div className="mt-6 flex flex-col gap-3">
          {currentUser ? (
            <>
              <CheckoutButton
                userId={currentUser.id}
                planId={plan.id}
                priceId={price?.priceId || ''}
                className={cn(
                  "w-full text-base font-medium h-12 rounded-lg transition-colors shadow-sm",
                  themeColorButton
                )}
              >
                {t('getStartedFreeTrial')}
              </CheckoutButton>

              {/* PayPal Button for One-Time Payments */}
              {isPaidPlan && (plan.prices.some(p => p.type === PaymentTypes.ONE_TIME)) && (
                <div className="w-full">
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">{t('orPayWith') || 'Or pay with'}</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
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
                  "w-full text-base font-medium h-12 rounded-lg transition-colors shadow-sm",
                  themeColorButton
                )}
              >
                {t('getStartedFreeTrial')}
              </Button>
            </LoginWrapper>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Divider */}
        <div className={cn("border-t border-dashed my-2", isManual || isAdvanced || isAgency ? themeColorBorder : "border-gray-200")} style={{ opacity: 0.3 }} />

        {/* Features list */}
        <ul className="space-y-4">
          {plan.features?.map((featureRaw, i) => {
            // Split feature string by '||'
            const [mainText, subText] = featureRaw.split('||');

            return (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircleIcon className={cn("size-5 shrink-0 mt-0.5", themeColorText)} />
                <div className="flex flex-col">
                  <span className="leading-tight font-medium">{mainText}</span>
                  {subText && (
                    <span className="text-xs text-muted-foreground mt-0.5">{subText}</span>
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
