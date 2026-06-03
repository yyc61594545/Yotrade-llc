'use client';

import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const transitionVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  },
};

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const linkIntroduction = '/contact';
  const linkPrimary = '/contact';
  const linkSecondary = '/services/daiban';

  return (
    <main
      id="hero"
      className="bg-ink-900 relative isolate overflow-hidden text-white"
    >
      {/* 极光：纯 CSS · aria-hidden · reduced-motion 静态 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="hero-aurora-orb hero-orb-blue" />
        <span className="hero-aurora-orb hero-orb-violet" />
        <span className="hero-aurora-orb hero-orb-green" />
        <div className="hero-grid absolute inset-0" />
        <div className="to-ink-900 absolute inset-0 bg-gradient-to-b from-transparent via-transparent" />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center">
            <AnimatedGroup variants={transitionVariants}>
              <LocaleLink
                href={linkIntroduction}
                className="group mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 pl-4 text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                <span className="text-sm">{t('introduction')}</span>
                <div className="size-6 overflow-hidden rounded-full bg-white/10 duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </LocaleLink>
            </AnimatedGroup>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="font-bricolage-grotesque mt-8 text-balance text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:mt-12 xl:text-[5rem]"
            >
              {t('title')}
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/70 sm:text-lg"
            >
              {t('description')}
            </TextEffect>

            <AnimatedGroup
              variants={transitionVariants}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-wx-500 hover:bg-wx-600 active:bg-wx-700 ring-wx-500/20 cta-breath h-14 w-full rounded-2xl px-8 text-lg font-bold text-white ring-4 shadow-[0_16px_40px_-10px_rgba(16,194,91,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-10px_rgba(16,194,91,0.8)] active:translate-y-0 active:scale-[0.985] sm:w-auto"
              >
                <LocaleLink href={linkPrimary}>
                  <MessageCircle className="size-6" />
                  {t('primary')}
                </LocaleLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-2xl border-white/20 bg-white/5 px-8 text-lg text-white backdrop-blur transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <LocaleLink href={linkSecondary}>
                  {t('secondary')}
                  <ArrowRight className="size-5" />
                </LocaleLink>
              </Button>
            </AnimatedGroup>
          </div>
        </div>
      </section>
    </main>
  );
}
