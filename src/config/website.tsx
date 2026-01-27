import { PaymentTypes, PlanIntervals } from '@/payment/types';
import type { WebsiteConfig } from '@/types';

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    theme: {
      defaultTheme: 'default',
      enableSwitch: false,
    },
    mode: {
      defaultMode: 'light', // User asked to hide dark mode, so force light mode? Or just disable switch? Assuming force light if they want to hide option.
      enableSwitch: false,
    },
  },
  metadata: {
    images: {
      ogImage: '/og.png',
      logoLight: '/yotradellc.jpg',
      logoDark: '/yotradellc.jpg',
    },
    social: {
      twitter: 'https://x.com/yotradellc?s=21&t=rfkcqWTjR_4B-VbmCex3HQ',
    },
  },
  features: {
    enableUpgradeCard: true,
    enableUpdateAvatar: true,
    enableAffonsoAffiliate: false,
    enablePromotekitAffiliate: false,
    enableDatafastRevenueTrack: false,
    enableCrispChat: process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true',
    enableTurnstileCaptcha: process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true',
  },
  routes: {
    defaultLoginRedirect: '/dashboard',
  },
  analytics: {
    enableVercelAnalytics: false,
    enableSpeedInsights: false,
  },
  auth: {
    enableGoogleLogin: true,
    enableGithubLogin: false,
    enableCredentialLogin: true,
  },
  i18n: {
    defaultLocale: 'zh',
    locales: {
      zh: {
        flag: '🇨🇳',
        name: '中文',
      },
    },
  },
  blog: {
    enable: true,
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  docs: {
    enable: true,
  },
  mail: {
    provider: 'resend',
    fromEmail: 'service@yotradellc.com',
    supportEmail: 'service@yotradellc.com',
  },
  newsletter: {
    enable: true,
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  storage: {
    enable: true,
    provider: 's3',
  },
  payment: {
    provider: 'stripe',
  },
  price: {
    plans: {
      manual: {
        id: 'manual',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: 'price_1Sk2RaRwixPtbtKMHuSgLAQL',
            amount: 5900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: true,
        popular: false,
        credits: {
          enable: false,
          amount: 0,
          expireDays: 30,
        },
      },
      advanced: {
        id: 'advanced',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: 'price_1Sk2SLRwixPtbtKMWWeMoOPR',
            amount: 29900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: true,
        popular: true, // Personal Agency seems to be the "middle" one, often popular
        credits: {
          enable: false,
          amount: 0,
          expireDays: 30,
        },
      },
      agency: {
        id: 'agency',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: 'price_1Sk2T0RwixPtbtKMolyFNy98',
            amount: 69900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: true,
        popular: false,
        credits: {
          enable: false,
          amount: 0,
          expireDays: 30,
        },
      },
      site_building: {
        id: 'site_building',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: 'price_site_building_placeholder',
            amount: 159900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: true,
        popular: false,
        credits: {
          enable: false,
          amount: 0,
          expireDays: 30,
        },
      },
    },
  },
  credits: {
    enableCredits: process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true',
    enablePackagesForFreePlan: false,
    registerGiftCredits: {
      enable: true,
      amount: 50,
      expireDays: 30,
    },
    packages: {
      basic: {
        id: 'basic',
        popular: false,
        amount: 100,
        expireDays: 30,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_BASIC!,
          amount: 990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
      standard: {
        id: 'standard',
        popular: true,
        amount: 200,
        expireDays: 30,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STANDARD!,
          amount: 1490,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
      premium: {
        id: 'premium',
        popular: false,
        amount: 500,
        expireDays: 30,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PREMIUM!,
          amount: 3990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
      enterprise: {
        id: 'enterprise',
        popular: false,
        amount: 1000,
        expireDays: 30,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_ENTERPRISE!,
          amount: 6990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
    },
  },
};
