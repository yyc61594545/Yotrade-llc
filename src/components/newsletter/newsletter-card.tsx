'use client';

import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { websiteConfig } from '@/config/website';
import { useTranslations } from 'next-intl';

export function NewsletterCard() {
  // show nothing if newsletter is disabled
  if (!websiteConfig.newsletter.enable) {
    return null;
  }

  const t = useTranslations('Newsletter');

  return (
    <div className="w-full p-16 rounded-lg bg-muted/50">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('subtitle')}
          </h2>
        </div>

        <NewsletterForm />
      </div>
    </div>
  );
}
