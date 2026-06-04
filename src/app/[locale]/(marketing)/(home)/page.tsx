import CrispChat from '@/components/layout/crisp-chat';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// ── Pass 5 首页 blocks（按确认节奏排列）──────────────────────────────
import HeroSection from '@/components/blocks/hero/hero';                       // 墨夜
import ServicesHero from '@/components/blocks/services-hero/services-hero';    // 白
import TrustSection from '@/components/blocks/trust/trust-section';            // 浅灰
import DaifuShowcase from '@/components/blocks/daifu-showcase/daifu-showcase'; // 白
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';             // 浅灰
import PaymentSection from '@/components/blocks/payment/payment';              // 白
import WechatBand from '@/components/blocks/wechat-band/wechat-band';          // 墨夜
import BlogStrip from '@/components/blocks/blog-strip/blog-strip';             // 白
import TestimonialsSection from '@/components/blocks/testimonials/testimonials'; // 浅灰

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

export default async function HomePage(_props: HomePageProps) {
  return (
    <div className="flex flex-col">
      {/* 1 · 墨夜 */}
      <HeroSection />
      {/* 2 · 白 — 主业三件套 + 代办横幅 */}
      <ServicesHero />
      {/* 3 · 浅灰 — P0 信任区 */}
      <TrustSection />
      {/* 4 · 白 — 代付商品橱窗 */}
      <DaifuShowcase />
      {/* 5 · 浅灰 — 代购品牌带 */}
      <LogoCloud />
      {/* 6 · 白 — 安全支付信任条 */}
      <PaymentSection />
      {/* 7 · 墨夜 — 微信转化带（替换 NewsletterCard） */}
      <WechatBand />
      {/* 8 · 白 — 最新 3 篇真实博客 */}
      <BlogStrip />
      {/* 9 · 浅灰 — 闲鱼真实评价精选 */}
      <TestimonialsSection />

      <CrispChat />
    </div>
  );
}
