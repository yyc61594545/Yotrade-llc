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
    title: '联系 YoTrade · 加微信 Easloyip · 跨境代办/代购/代付 | ' + t('title'),
    description:
      '加微信 Easloyip 直接咨询。代办(ITIN/LLC/银行/美卡)、代购(美亚/球鞋/欧美商品)、代付(ChatGPT/Claude/Cursor/Apple ID)一站式服务,30 分钟内反馈报价。',
    canonicalUrl: getUrlWithLocale('/contact', locale),
  });
}

export default async function ContactPage() {
  return (
    <Container className="py-12 md:py-16 px-4">
      <div className="mx-auto max-w-5xl space-y-12 pb-16">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            联系我们
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            代办 · 代购 · 代付 · 代刷 — 直接加我微信最快,30 分钟内反馈方案与报价。
          </p>
        </div>

        {/* WeChat hero — the primary funnel */}
        <WechatContact variant="primary" />

        {/* Secondary channels */}
        <div className="space-y-4">
          <div className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            其他联系方式
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="mailto:service@yotradellc.com"
              className="flex items-start gap-3 rounded-lg border p-5 hover:bg-accent transition-colors"
            >
              <Mail className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">邮箱</div>
                <div className="text-sm text-muted-foreground break-all">
                  service@yotradellc.com
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  适合发票/合同等正式沟通
                </div>
              </div>
            </a>

            <a
              href="https://x.com/yotradellc"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-lg border p-5 hover:bg-accent transition-colors"
            >
              <Twitter className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">X (Twitter)</div>
                <div className="text-sm text-muted-foreground">@yotradellc</div>
                <div className="text-xs text-muted-foreground mt-1">
                  看最新案例/政策动态
                </div>
              </div>
            </a>

            <div className="flex items-start gap-3 rounded-lg border p-5 bg-muted/30">
              <MessageSquare className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">表单留言</div>
                <div className="text-sm text-muted-foreground">
                  下方表单填写
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  适合资料较多/需要附件
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form (fallback channel) */}
        <div className="space-y-3">
          <div className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            表单留言(慢响应,优先加微信)
          </div>
          <ContactFormCard />
        </div>
      </div>
    </Container>
  );
}
