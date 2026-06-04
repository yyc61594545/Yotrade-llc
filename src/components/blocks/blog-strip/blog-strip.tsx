import { LocaleLink } from '@/i18n/navigation';
import { blogSource } from '@/lib/source';
import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

/**
 * BlogStrip — 首页博客引流位（Pass 5 · Block 7）
 * 真实 Fumadocs：blogSource.getPages(locale) 按 date 倒序取最新 3 篇。
 * 每卡 cover（缺失→brand 渐变占位）+ 标题 + 日期 + 简介 + 阅读全文。UTM 区分。
 * 白底。async Server Component。卡片风格同 Block 4/5。
 *
 * 集成修正（针对本仓库的 Fumadocs 封装）：
 * - 用 blogSource (baseUrl '/blog'),不是 source (那个是 docs)
 * - frontmatter category 字段实际是 categories: string[] → 取 [0] 做 fallback
 * - slug 优先用 page.slugs.join('/') (baseUrl 之后的部分，无 locale 前缀)
 */

type AnyPage = {
  url?: string;
  slugs?: string[];
  locale?: string;
  data: Record<string, unknown>;
};

function getMeta(page: AnyPage) {
  const d = page.data ?? {};
  const date = (d.date ?? d.publishedAt ?? d.published) as string | undefined;
  const cover = (d.cover ?? d.image ?? d.thumbnail) as string | undefined;
  const categoriesArr = Array.isArray(d.categories) ? (d.categories as string[]) : [];
  const category = (d.category as string | undefined) ?? categoriesArr[0] ?? '';
  const slug =
    page.slugs?.join('/') ??
    page.url?.replace(/^\/?(en\/|zh\/)?blog\/?/, '') ??
    '';
  return {
    title: d.title as string,
    description: (d.description as string) ?? '',
    category,
    date,
    cover,
    slug,
  };
}

const POST_HREF = (slug: string) =>
  `/blog/${slug}?utm_source=home&utm_medium=blog-strip&utm_campaign=${slug}`;
const ALL_HREF =
  '/blog?utm_source=home&utm_medium=blog-strip&utm_campaign=all';

export default async function BlogStrip() {
  const t = await getTranslations('HomePage.blog');
  const locale = await getLocale();

  // Fumadocs Page<DocOut<ZodObject<...>>>[] has zero overlap with our minimal
  // AnyPage shape, so TS requires a double-cast via unknown.
  const pages = (blogSource.getPages(locale) as unknown as AnyPage[]) ?? [];
  const latest = pages
    .map(getMeta)
    .filter((p) => p.title)
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 3);

  if (latest.length === 0) return null;

  const fmtDate = (d?: string) =>
    d
      ? new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(d))
      : '';

  return (
    <section id="blog" className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-11 flex flex-col items-center text-center">
          <span className="text-brand-600 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="bg-brand-500 h-px w-5" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-balance md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((p) => (
            <LocaleLink
              key={p.slug}
              href={POST_HREF(p.slug)}
              className="border-border-soft group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {p.cover ? (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="from-brand-600 to-brand-900 flex size-full items-center justify-center bg-gradient-to-br">
                    <span className="px-6 text-center text-lg font-extrabold leading-tight text-white/90">
                      {p.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                {p.category && (
                  <span className="text-brand-600 text-xs font-bold uppercase tracking-[0.06em]">
                    {p.category}
                  </span>
                )}
                <h3 className="mt-2 line-clamp-2 text-[16.5px] font-extrabold leading-snug">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 flex-1 text-sm">
                    {p.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-muted-foreground/80 text-xs font-medium">
                    {fmtDate(p.date)}
                  </span>
                  <span className="text-brand-600 inline-flex items-center gap-1 text-sm font-bold">
                    {t('ctaDetail')}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </LocaleLink>
          ))}
        </div>

        <div className="mt-10 text-center">
          <LocaleLink
            href={ALL_HREF}
            className="border-border-soft hover:border-brand-300 text-foreground inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {t('ctaAll')}
            <ArrowRight className="size-4" />
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
