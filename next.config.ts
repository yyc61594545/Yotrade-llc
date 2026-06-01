import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * 301 redirects for URLs that were deleted or renamed during cleanup, so
 * Google's discovered-URL set stops showing 404s and any inbound links
 * land somewhere useful instead of dying.
 *
 * Each entry has two variants because the site uses next-intl with
 * localePrefix: 'as-needed' — the default zh locale serves URLs both
 * with and without the /zh prefix, and Google may have indexed either.
 */
const RENAMED_STRIPE_GUIDE_OLD = '/blog/香港银行卡开通 Stripe 完整指南zh';
const RENAMED_STRIPE_GUIDE_NEW = '/blog/香港银行卡开通 Stripe 完整指南';

const DELETED_DEMO_SLUGS = [
  'comparisons',
  'fumadocs',
  'internationalization',
  'manual-installation',
  'markdown',
  'premium',
  'search',
  'theme',
];

const DELETED_CATEGORY_SLUGS = ['news', 'product'];

function buildRedirects() {
  const out: { source: string; destination: string; permanent: boolean }[] =
    [];

  // 1) Renamed real article: redirect old (broken-locale-suffix) slug to
  //    the corrected one so its index/backlink equity is preserved.
  out.push({
    source: RENAMED_STRIPE_GUIDE_OLD,
    destination: RENAMED_STRIPE_GUIDE_NEW,
    permanent: true,
  });
  out.push({
    source: `/zh${RENAMED_STRIPE_GUIDE_OLD}`,
    destination: RENAMED_STRIPE_GUIDE_NEW,
    permanent: true,
  });

  // 2) Deleted mksaas template demo posts → blog index.
  for (const slug of DELETED_DEMO_SLUGS) {
    out.push({
      source: `/blog/${slug}`,
      destination: '/blog',
      permanent: true,
    });
    out.push({
      source: `/zh/blog/${slug}`,
      destination: '/blog',
      permanent: true,
    });
  }

  // 3) Deleted orphan categories → blog index.
  for (const cat of DELETED_CATEGORY_SLUGS) {
    out.push({
      source: `/blog/category/${cat}`,
      destination: '/blog',
      permanent: true,
    });
    out.push({
      source: `/zh/blog/category/${cat}`,
      destination: '/blog',
      permanent: true,
    });
  }

  return out;
}

/**
 * https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  // Docker standalone output
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),

  /* config options here */
  devIndicators: false,

  async redirects() {
    return buildRedirects();
  },

  // https://nextjs.org/docs/architecture/nextjs-compiler#remove-console
  // Remove all console.* calls in production only
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    // https://vercel.com/docs/image-optimization/managing-image-optimization-costs#minimizing-image-optimization-costs
    // https://nextjs.org/docs/app/api-reference/components/image#unoptimized
    // vercel has limits on image optimization, 1000 images per month
    unoptimized: process.env.DISABLE_IMAGE_OPTIMIZATION === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
      },
      {
        protocol: 'https',
        hostname: 'service.firecrawl.dev',
      },
    ],
  },
};

/**
 * You can specify the path to the request config file or use the default one (@/i18n/request.ts)
 *
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#next-config
 */
const withNextIntl = createNextIntlPlugin();

/**
 * https://fumadocs.dev/docs/ui/manual-installation
 * https://fumadocs.dev/docs/mdx/plugin
 */
const withMDX = createMDX();

export default withMDX(withNextIntl(nextConfig));
