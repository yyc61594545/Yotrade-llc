import { WechatContact } from '@/components/wechat/wechat-contact';
import { useTranslations } from 'next-intl';

/**
 * WechatBand — 首页微信转化带（Pass 5 · Block 6）
 * 替换原 NewsletterCard。漏斗是微信不是邮件。
 * 墨夜底 + 绿色极光（呼应 Hero），居中标题，内嵌现有 compact 卡（浅卡浮墨夜=高级对比）。
 * compact 是全站单一真相源，这里不改它，只做容器。
 * 放置：中部一条 + footer 前一条（复用本组件）。
 * Server Component。复用 token，无新 keyframe（绿光为静态 radial-gradient）。
 */
export default function WechatBand() {
  const t = useTranslations('HomePage.wechatBand');

  return (
    <section
      id="wechat-band"
      className="bg-ink-900 relative isolate overflow-hidden px-4 py-20 text-white md:py-24"
    >
      {/* 静态极光，呼应 Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,194,91,0.35),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[15%] size-[360px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.4),transparent_70%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur">
            ● {t('eyebrow')}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-balance text-white/65 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <WechatContact variant="compact" />
      </div>
    </section>
  );
}
