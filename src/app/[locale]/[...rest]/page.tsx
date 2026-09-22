import { notFound } from 'next/navigation';

/**
 * Catching unknown routes
 *
 * all requests that are matched within the [locale] segment will render
 * the not-found page when an unknown route is encountered (e.g. /en/unknown).
 *
 * https://next-intl.dev/docs/environments/error-files#catching-unknown-routes
 *
 * 爬虫与垃圾请求产生的 404 全部命中这条兜底路由，动态渲染时每个 404 都要跑一次函数
 * （2026-09-22：Vercel Hobby Active CPU 90%）。force-static 让它首次生成后走缓存。
 */
export const dynamic = 'force-static';
export default function CatchAllPage() {
  notFound();
}
