import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';

// 登录/后台页依赖 useSearchParams 与 session，保持动态渲染；
// 其余 [locale] 路由（首页/博客/服务页）已改为构建时静态生成。
export const dynamic = 'force-dynamic';

/**
 * inspired by dashboard-01
 * https://ui.shadcn.com/blocks
 */
export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
