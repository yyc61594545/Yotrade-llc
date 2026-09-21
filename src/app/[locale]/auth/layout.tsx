import BackButtonSmall from '@/components/shared/back-button-small';

// 登录/后台页依赖 useSearchParams 与 session，保持动态渲染；
// 其余 [locale] 路由（首页/博客/服务页）已改为构建时静态生成。
export const dynamic = 'force-dynamic';

/**
 * auth layout is different from other public layouts,
 * so auth directory is not put in (public) directory.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <BackButtonSmall className="absolute top-6 left-6" />
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
