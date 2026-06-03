import { ContactFormCard } from '@/components/contact/contact-form-card';
import Container from '@/components/layout/container';
import { WechatContact } from '@/components/wechat/wechat-contact';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { Mail, MessageSquare, Twitter } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title:
      '联系 YoTrade · 加微信 Easloyip · 跨境代办/代购/代付 | ' + t('title'),
    description:
      '加微信 Easloyip 直接咨询。代办(ITIN/LLC/银行/美卡)、代购(美亚/球鞋/欧美商品)、代付(ChatGPT/Claude/Cursor/Apple ID)一站式服务,30 分钟内反馈报价。',
    canonicalUrl: getUrlWithLocale('/contact', locale),
  });
}

export default async function ContactPage() {
  const t = await getTranslations('ContactPage');

  const channels = [
    {
      icon: Mail,
      title: t('channels.email.title'),
      value: t('channels.email.value'),
      note: t('channels.email.note'),
      href: 'mailto:service@yotradellc.com',
    },
    {
      icon: Twitter,
      title: t('channels.twitter.title'),
      value: t('channels.twitter.value'),
      note: t('channels.twitter.note'),
      href: 'https://x.com/yotradellc',
    },
    {
      icon: MessageSquare,
      title: t('channels.form.title'),
      value: t('channels.form.value'),
      note: t('channels.form.note'),
      href: undefined,
    },
  ];

  // Note: pt-24 from Claude Design's draft removed — current navbar is sticky
  // (src/components/layout/navbar.tsx), not fixed, so no top padding needed.
  return (
    <Container className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl space-y-14 pb-16">
        {/* 标题 */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* 微信主卡（primary variant 已升级布局） */}
        <WechatContact variant="primary" />

        {/* 其他联系方式（次级图标卡片） */}
        <div className="space-y-4">
          <div className="text-muted-foreground text-center text-xs font-semibold uppercase tracking-[0.12em]">
            {t('otherChannels')}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {channels.map(({ icon: Icon, title, value, note, href }) => {
              const inner = (
                <>
                  <div className="bg-bg-soft text-brand-600 grid size-9 shrink-0 place-items-center rounded-[10px]">
                    <Icon className="size-[18px]" />
                  </div>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-muted-foreground text-sm break-all">
                      {value}
                    </div>
                    <div className="text-muted-foreground/80 mt-1 text-xs">
                      {note}
                    </div>
                  </div>
                </>
              );
              const cls =
                'border-border-soft hover:border-brand-500 flex items-start gap-3 rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm';
              return href ? (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <div key={title} className={`${cls} bg-muted/30`}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        {/* 表单留言（慢响应，优先加微信） */}
        <div className="space-y-3">
          <div className="text-muted-foreground text-center text-xs font-semibold uppercase tracking-[0.12em]">
            {t('formSectionLabel')}
          </div>
          <ContactFormCard />
        </div>
      </div>
    </Container>
  );
}
