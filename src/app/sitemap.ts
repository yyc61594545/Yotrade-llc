import { websiteConfig } from '@/config/website';
import { getLocalePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { blogSource, categorySource, source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import type { Locale } from 'next-intl';
import { getBaseUrl } from '../lib/urls/urls';

type Href = Parameters<typeof getLocalePathname>[0]['href'];

/**
 * Fixed lastModified for pages that have no content date of their own.
 * Bump this when a static page is actually changed — never use `new Date()`
 * here, otherwise every URL claims to have changed on every crawl and search
 * engines learn to ignore the sitemap's dates entirely.
 */
const STATIC_LAST_MODIFIED = new Date('2026-09-21');

/**
 * static routes for sitemap, you may change the routes for your own
 *
 * Auth / waitlist pages are intentionally excluded: they carry no search value
 * and are marked noindex on the page itself.
 */
const staticRoutes: { href: Href; priority: number }[] = [
  { href: '/', priority: 1 },
  { href: '/services/daifu', priority: 0.9 },
  { href: '/services/daigou', priority: 0.9 },
  { href: '/services/daimai', priority: 0.9 },
  { href: '/services/daiban', priority: 0.9 },
  { href: '/services/travel', priority: 0.9 },
  { href: '/pricing', priority: 0.7 },
  { href: '/about', priority: 0.5 },
  { href: '/contact', priority: 0.6 },
  { href: '/changelog', priority: 0.3 },
  { href: '/privacy', priority: 0.2 },
  { href: '/terms', priority: 0.2 },
  { href: '/cookie', priority: 0.2 },
  ...(websiteConfig.blog.enable
    ? [{ href: '/blog' as Href, priority: 0.8 }]
    : []),
  ...(websiteConfig.docs.enable
    ? [{ href: '/docs' as Href, priority: 0.7 }]
    : []),
];

/**
 * Generate a sitemap for the website
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://github.com/javayhu/cnblocks/blob/main/app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = []; // final result

  // add static routes
  sitemapList.push(
    ...staticRoutes.flatMap(({ href, priority }) =>
      routing.locales.map((locale) => ({
        url: getUrl(href, locale),
        lastModified: STATIC_LAST_MODIFIED,
        priority,
        changeFrequency: 'weekly' as const,
      }))
    )
  );

  // add blog related routes if enabled
  if (websiteConfig.blog.enable) {
    // add categories (first page only; paginated list pages are thin and
    // reachable through in-site links, so they stay out of the sitemap)
    routing.locales.forEach((locale) => {
      const posts = blogSource
        .getPages(locale)
        .filter((post) => post.data.published);

      categorySource.getPages(locale).forEach((category) => {
        const postsInCategory = posts.filter((post) =>
          post.data.categories.some((cat) => cat === category.slugs[0])
        );
        // a category is only worth listing once it has content
        if (postsInCategory.length === 0) {
          return;
        }
        sitemapList.push({
          url: getUrl(`/blog/category/${category.slugs[0]}`, locale),
          lastModified: latestDate(postsInCategory.map((p) => p.data.date)),
          priority: 0.5,
          changeFrequency: 'weekly' as const,
        });
      });
    });

    // add posts (single post pages), dated by their frontmatter
    sitemapList.push(
      ...blogSource
        .getPages()
        .filter((post) => post.data.published)
        .flatMap((post) =>
          routing.locales
            .filter((locale) => post.locale === locale)
            .map((locale) => ({
              url: getUrl(`/blog/${post.slugs.join('/')}`, locale),
              lastModified: new Date(post.data.date),
              priority: 0.8,
              changeFrequency: 'monthly' as const,
            }))
        )
    );
  }

  // add docs related routes if enabled
  if (websiteConfig.docs.enable) {
    const docsParams = source.generateParams();
    sitemapList.push(
      ...docsParams
        // the docs root is already listed as a static route
        .filter((param) => param.slug.length > 0)
        .flatMap((param) =>
          routing.locales.map((locale) => ({
            url: getUrl(`/docs/${param.slug.join('/')}`, locale),
            lastModified: STATIC_LAST_MODIFIED,
            priority: 0.7,
            changeFrequency: 'monthly' as const,
          }))
        )
    );
  }

  // dedupe by URL — keep the first entry (static routes win over generated ones)
  const seen = new Set<string>();
  return sitemapList.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }
    seen.add(entry.url);
    return true;
  });
}

function latestDate(dates: string[]): Date {
  return new Date(
    dates.reduce((max, d) => (d > max ? d : max), dates[0] ?? '1970-01-01')
  );
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getLocalePathname({ locale, href });
  return getBaseUrl() + pathname;
}
