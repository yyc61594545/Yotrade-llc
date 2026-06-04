import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * PaymentSection — 安全支付信任条（Pass 5 · Block 3）
 * 原 6 张大卡 → 一行「安全支付」信任条。
 * 核心 3 种：支付宝 / 微信 / USDT（USDT 提前，海外信任度高），其余补充。
 * 视觉：灰度 logo 占位（单色方块），hover 上色。
 * Server Component。复用 token，无新 keyframe/依赖。
 * ⚠ 用真实 logo 时把 <span 占位方块> 换成 <Image>，
 *   保留 className 的 grayscale group-hover:grayscale-0 即可。
 */

const METHODS = [
  { key: 'alipay', mark: '支', color: '#1296db', core: true },
  { key: 'wechat', mark: '微', color: '#10c25b', core: true },
  { key: 'usdt',   mark: '₮',  color: '#26a17b', core: true },
  { key: 'applepay',   mark: '', color: '#0b1020', core: false },
  { key: 'googlepay',  mark: 'G', color: '#4285f4', core: false },
  { key: 'creditcard', mark: '卡', color: '#635bff', core: false },
] as const;

export default function PaymentSection() {
  const t = useTranslations('HomePage.payment');

  return (
    <section id="payment" className="px-4 py-12 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="border-border-soft flex flex-col items-center gap-5 rounded-2xl border bg-white px-6 py-6 shadow-sm md:flex-row md:gap-7 md:px-8">
          {/* 左：标签 */}
          <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-sm font-bold">
            <ShieldCheck className="text-wx-600 size-5" />
            {t('title')}
          </div>

          {/* 分隔线（仅桌面） */}
          <div className="bg-border-soft hidden h-8 w-px shrink-0 md:block" />

          {/* 右：方式 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            {METHODS.map(({ key, mark, color, core }) => (
              <span
                key={key}
                className="group border-border-soft hover:border-foreground/20 flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2 text-sm font-bold transition-colors"
              >
                {/* logo 占位：默认灰，hover 上色（grayscale 工具类响应 group-hover，bg 颜色走 inline-style） */}
                <span
                  className="grid size-6 place-items-center rounded-md text-xs font-extrabold text-white grayscale transition-all duration-200 group-hover:grayscale-0"
                  style={{ backgroundColor: color }}
                >
                  {mark}
                </span>
                <span className={core ? 'text-foreground' : 'text-muted-foreground'}>
                  {t(`items.${key}`)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
