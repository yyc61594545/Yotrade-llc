import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/layout/container';
import { WechatContact } from '@/components/wechat/wechat-contact';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl, getUrlWithLocale } from '@/lib/urls/urls';
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  MessageCircle,
  Music,
  Palette,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'AI 订阅 / 海外 SaaS 代刷 | ChatGPT / Claude / Cursor | YoTrade',
    description:
      '没美卡也能用 ChatGPT Plus / Claude Pro+Max / Cursor / Midjourney / Suno。专属账号、自有美卡链路、不与他人共享号池,稳定不封号。一对一代刷,7×24 售后。',
    canonicalUrl: getUrlWithLocale('/services/daishua', locale),
  });
}

const CATEGORIES = [
  {
    icon: Brain,
    title: 'AI 大模型订阅',
    items: ['ChatGPT Plus / Pro / Team', 'Claude Pro / Max 5x / Max 20x', 'Google Gemini Advanced', 'Perplexity Pro'],
  },
  {
    icon: Code2,
    title: 'AI 编程工具',
    items: ['Cursor Pro / Business', 'GitHub Copilot Pro / Business', 'Windsurf Pro', 'JetBrains AI Pro'],
  },
  {
    icon: Palette,
    title: '创作 / 设计工具',
    items: ['Midjourney Basic / Standard / Pro', 'Runway Standard / Pro', 'Adobe Creative Cloud', 'Figma Professional'],
  },
  {
    icon: Music,
    title: '音视频订阅',
    items: ['Suno Pro / Premier', 'ElevenLabs', 'YouTube Premium', 'Netflix / Spotify 切区'],
  },
];

const PROCESS = [
  { step: '01', title: '免费咨询报价', desc: '微信发产品名称 + 套餐档位,我们 10 分钟内回报市场价(通常加价 15–30%)。' },
  { step: '02', title: '你创建账号', desc: '所有订阅注册在你自己邮箱下,密码你自己掌握。我们只用代刷链路完成支付。' },
  { step: '03', title: '远程代刷上车', desc: '通过自有美卡 + 美国地址 + 干净 IP 配置完成订阅,通常 5–30 分钟到账。' },
  { step: '04', title: '7×24 售后保障', desc: '订阅周期内被风控 / 强制下车,免费补刷;价格调整不收差价。' },
];

const FAQS = [
  {
    q: '账号是我自己的吗?会不会被风控封号?',
    a: '账号 100% 在你自己邮箱下注册、密码你自己控制。我们用自有美卡 + 干净美国 IP 完成支付,不共享号池,这是和"号池代刷"最大的区别。正常使用基本不会触发风控;万一被强制下车,周期内免费补刷。',
  },
  {
    q: '为什么不直接买代刷站的便宜账号?',
    a: '便宜账号通常是号池模式:一张卡刷上百个账户、共享登录信息。OpenAI / Anthropic / Cursor 都在批量识别号池并集中封号。我们这种"一对一代刷"贵 20–50%,但你的账号档案是干净的。',
  },
  {
    q: '需要把密码或登录方式发给你们吗?',
    a: '只需要远程代刷阶段(几分钟)的临时访问。我们通常只需要你的邮箱接收验证码,不索取你的主密码。如果服务需要长期账号绑定(如 ChatGPT Team 邀请),会用最小权限方式处理。',
  },
  {
    q: 'Claude Pro / Max 国内能用代刷上吗?',
    a: '可以。Anthropic 不开放中国大陆和香港订阅,但用我们的美国身份链路可以稳定开通。Max 5x / 20x 也都可以。这是国内用户用上 Claude 最稳的两条路之一(另一条是自己建美国身份链路,见博客 ITIN 指南)。',
  },
  {
    q: '能不能开发票?',
    a: '人民币付款支持开"咨询服务费"普通发票。具体抬头和税点联系客服。',
  },
  {
    q: '我自己有美卡,但想省事让你们代刷,可以吗?',
    a: '可以。"协助代刷"模式只收少量服务费,不加价,你的卡你的账。适合不想自己搞 IP / 地址但有美卡的用户。',
  },
];

export default async function DaishuaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = getUrlWithLocale('/services/daishua', locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI 订阅 / 海外 SaaS 一对一代刷',
    serviceType: 'Cross-border subscription payment service',
    provider: { '@type': 'Organization', name: 'YoTrade', url: getBaseUrl() },
    description: 'ChatGPT/Claude/Cursor 等海外订阅代刷,自有美卡链路、不与他人共享号池。',
    url: pageUrl,
  };

  return (
    <Container className="px-4 py-12 lg:py-20 flex flex-col gap-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-sm rounded-full border px-4 py-1.5 mb-6">
          <Bot className="size-3.5" />
          <span>核心服务 · AI / SaaS 订阅</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
          AI 订阅代刷
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
          没美卡也能稳定用{' '}
          <span className="font-semibold text-foreground">
            ChatGPT Plus / Claude Pro+Max / Cursor / Midjourney
          </span>
          。专属账号、自有美卡链路、{' '}
          <span className="font-semibold text-foreground">不共享号池</span>。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <LocaleLink href="/contact">
              <MessageCircle className="mr-2 size-4" /> 微信咨询报价
            </LocaleLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#faq">
              先看常见问题 <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-3">能代刷什么</h2>
        <p className="text-center text-muted-foreground mb-10">
          下列只是常见品类,有需求直接微信问,基本都能上
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {CATEGORIES.map((c) => (
            <Card key={c.title} className="bg-muted/20">
              <CardHeader>
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <c.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {c.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-1" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-8 lg:p-12">
          <ShieldCheck className="size-10 text-primary mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            为什么贵一点也值
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-1">✅ 一对一专属</div>
              <p className="text-muted-foreground leading-relaxed">
                你的账号、你的邮箱、你的密码;我们只走代刷链路,绝不与他人共享。
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1">✅ 自有美卡 + 干净 IP</div>
              <p className="text-muted-foreground leading-relaxed">
                来自真实美国身份链路的付款渠道,不是临时虚拟卡,稳定不会被风控批量关。
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1">✅ 周期内补刷保障</div>
              <p className="text-muted-foreground leading-relaxed">
                万一被强制下车,免费补刷;价格调整不收差价;售后随时微信。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">服务流程</h2>
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {PROCESS.map((p) => (
            <div key={p.step} className="p-6 rounded-lg border bg-card text-card-foreground">
              <div className="text-3xl font-bold text-primary mb-2">{p.step}</div>
              <div className="font-semibold mb-2">{p.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WeChat — primary conversion */}
      <section className="max-w-5xl mx-auto w-full">
        <WechatContact
          variant="compact"
          title="发产品名,10 分钟内报价"
          subtitle="ChatGPT / Claude / Cursor / Midjourney 一对一代刷,自有美卡链路"
          perks={[
            '10 分钟内市场价反馈',
            '账号 100% 你自己邮箱注册,密码你掌握',
            '被强制下车免费补刷,周期内不收差价',
          ]}
        />
      </section>

      {/* FAQs */}
      <section id="faq" className="scroll-mt-20 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-10">常见问题</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem value={`q-${i}`} key={i}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="text-center max-w-3xl mx-auto rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-10 lg:p-16">
        <Sparkles className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">先发产品名,10 分钟内报价</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          咨询免费、不强推。账号在你手上、密码你自己掌握,稳定不掉线。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact">
            <MessageCircle className="mr-2 size-4" /> 微信咨询报价
          </LocaleLink>
        </Button>
      </section>
    </Container>
  );
}
