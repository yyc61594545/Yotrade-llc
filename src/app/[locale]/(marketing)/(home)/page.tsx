import CallToActionSection from '@/components/blocks/calltoaction/calltoaction';
import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import Features2Section from '@/components/blocks/features/features2';
import Features3Section from '@/components/blocks/features/features3';
import HeroSection from '@/components/blocks/hero/hero';
import IntegrationSection from '@/components/blocks/integration/integration';
import Integration2Section from '@/components/blocks/integration/integration2';
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';
import PaymentSection from '@/components/blocks/payment/payment';
import DaifuShowcase from '@/components/blocks/daifu-showcase/daifu-showcase';
import PricingSection from '@/components/blocks/pricing/pricing';
import ServicesHero from '@/components/blocks/services-hero/services-hero';
import StatsSection from '@/components/blocks/stats/stats';
import TestimonialsSection from '@/components/blocks/testimonials/testimonials';
import TrustSection from '@/components/blocks/trust/trust-section';
import CrispChat from '@/components/layout/crisp-chat';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#metadata-api
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonicalUrl: getUrlWithLocale('', locale),
  });
}

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage(props: HomePageProps) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations('HomePage');

  return (
    <>
      <div className="flex flex-col">
        <HeroSection />

        {/* <LogoCloud /> */}

        {/* Hidden sections */}
        {/* <StatsSection /> */}

        {/* Pass 5 Block 2 — ServicesHero (主业三件套 + 代办进阶横幅) */}
        <ServicesHero />

        <IntegrationSection />

        {/* Pass 5 Block 1 — TrustSection (P0 信任区) */}
        <TrustSection />

        {/* Pass 5 Block 4 — DaifuShowcase (代付商品橱窗) */}
        <DaifuShowcase />

        <PaymentSection />

        {/* <FeaturesSection /> */}

        {/* <Features2Section /> */}

        {/* <Features3Section /> */}

        <Integration2Section />

        {/* <PricingSection /> */}

        {/* <FaqSection /> */}

        {/* <CallToActionSection /> */}

        <TestimonialsSection />

        <NewsletterCard />

        <CrispChat />
      </div>
    </>
  );
}
