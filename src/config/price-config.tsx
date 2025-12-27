'use client';

import type { PricePlan } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 *
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * docs:
 * https://mksaas.com/docs/config/price
 *
 * @returns The price plans with translated content
 */
export function usePricePlans(): Record<string, PricePlan> {
  const t = useTranslations('PricePlans');
  const priceConfig = websiteConfig.price;
  const plans: Record<string, PricePlan> = {};

  // Add translated content to each plan
  if (priceConfig.plans.manual) {
    plans.manual = {
      ...priceConfig.plans.manual,
      name: t('manual.name'),
      description: t('manual.description'),
      features: [
        t('manual.features.feature-1'),
        t('manual.features.feature-2'),
        t('manual.features.feature-3'),
        t('manual.features.feature-4'),
        t('manual.features.feature-5'),
        t('manual.features.feature-6'),
        t('manual.features.feature-7'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.advanced) {
    plans.advanced = {
      ...priceConfig.plans.advanced,
      name: t('advanced.name'),
      description: t('advanced.description'),
      features: [
        t('advanced.features.feature-1'),
        t('advanced.features.feature-2'),
        t('advanced.features.feature-3'),
        t('advanced.features.feature-4'),
        t('advanced.features.feature-5'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.agency) {
    plans.agency = {
      ...priceConfig.plans.agency,
      name: t('agency.name'),
      description: t('agency.description'),
      features: [
        t('agency.features.feature-1'),
        t('agency.features.feature-2'),
        t('agency.features.feature-3'),
        t('agency.features.feature-4'),
        t('agency.features.feature-5'),
        t('agency.features.feature-6'),
        t('agency.features.feature-7'),
        t('agency.features.feature-8'),
        t('agency.features.feature-9'),
      ],
      limits: [],
    };
  }

  return plans;
}
