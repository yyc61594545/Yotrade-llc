import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl, getUrlWithLocale } from '@/lib/urls/urls';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  Landmark,
  MessageCircle,
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
    title: '美国身份代办 | ITIN / 美国公司 / 银行账户 / Stripe 收款 | YoTrade',
    description:
      'NRA（非美国居民）一站式美国身份代办服务：ITIN 申请、美国 LLC 注册、Mercury 银行开户、Stripe 全球收款、年度报税合规。手册版到全能代办四档可选，最快 7 天打通跨境收款。',
    canonicalUrl: getUrlWithLocale('/services/daiban', locale),
  });
}

const TARGETS = [
  '想做 Stripe / Paypal 收款但被中国身份卡住的跨境电商 / SaaS 创业者',
  '需要 ITIN 申请 Chase / Citi / Capital One 美卡的 NRA',
  '注册美国 LLC 享受合规免税结构的海外自由职业者',
  '完成 Form 5472 + 1120 报税合规、避免 $25,000 罚款的外资 LLC 所有人',
  'Amazon FBA / Shopify / 独立站需要美国本地银行收款的卖家',
];

const MODULES = [
  {
    icon: BadgeCheck,
    title: 'ITIN 申请代办',
    desc: 'CAA 授权代理远程视频核验，护照不离手；W-7 + 税表全包整理，6–8 周拿号。',
    link: '/blog/itin-application-complete-guide-2026',
    linkText: '看 ITIN 完整教程',
  },
  {
    icon: Building2,
    title: '美国 LLC 注册 + EIN',
    desc: '特拉华 / 怀俄明 / 新墨西哥三州可选，含注册代理首年 + Operating Agreement 中英双语 + 传真法 EIN 申请。',
    link: '/blog/nra-us-llc-state-comparison-2026',
    linkText: '看三州横评',
  },
  {
    icon: Landmark,
    title: 'Mercury / 企业银行账户',
    desc: '业务网站合规改造 + 拒户雷区规避 + $250 开户奖励达标策略；全能版含企业公户协助。',
    link: '/blog/us-business-banking-mercury-relay-wise-comparison-2026',
    linkText: '看银行实测对比',
  },
  {
    icon: CreditCard,
    title: 'Stripe 收款 + 跨境结算',
    desc: '零手续费 Stripe 方案，覆盖 Visa / Mastercard / Amex / 支付宝 / 微信 / USDT 多渠道收款。',
    link: '/blog',
    linkText: '看收款合规系列',
  },
];

const PROCESS = [
  { step: '01', title: '免费咨询', desc: '加微信 / 客服窗口说清你的业务模式，我们 30 分钟内反馈最适合的代办档位。' },
  { step: '02', title: '材料预审', desc: '专业团队审核护照 / 业务描述 / 收款流程，最大化批卡率与开户通过率。' },
  { step: '03', title: '代办执行', desc: 'ITIN → LLC → EIN → 银行 → Stripe 串行打通，全程进度可查。' },
  { step: '04', title: '售后社群', desc: '专属社群续费提醒、5472 报税跟踪、薅卡情报、合规答疑长期支持。' },
];

const FAQS = [
  {
    q: '完全没接触过美国身份，应该买哪个档位？',
    a: '想自己动手 + 预算紧 → 选「手册版」按教程一步步走；没时间 / 怕踩坑 / 想要专人对接 → 选「个人代理服务」省心；要打通 Stripe 收款 + 报税合规 → 「全能代理服务」一次到位；做独立站 / 亚马逊 → 「建站代理服务」连电商落地一起包。',
  },
  {
    q: '整套美国身份从 0 到能收款要多久？',
    a: 'ITIN 6–8 周（旺季最长 12 周）+ LLC 注册 1–10 天 + EIN 传真 5–10 工作日 + Mercury 开户 1–7 天 + Stripe 配置 1–3 天，串行执行的话最快 7 周打通收款，并行可以压到 5 周左右。',
  },
  {
    q: '我已经有美国 LLC 了，能只买 Stripe 这一段吗？',
    a: '可以，私聊客服按"分段代办"报价，常见的单段代办：ITIN / EIN 补办 / Mercury 拒户重申 / Stripe 配置 / Form 5472 补报。',
  },
  {
    q: '代办时你们会接触我的护照原件吗？',
    a: '不需要。我们的 CAA（IRS 授权认证代理）支持远程视频核验，护照全程在你手里。这是和"DIY 邮寄"路径相比最大的安全优势。',
  },
  {
    q: 'NRA 申请美国信用卡的成功率怎么保证？',
    a: '我们按 Chase 5/24 / AmEx Pop-up Jail / Capital One Velocity 风控逻辑定制申卡顺序（详见博客 12 个月路线图），配合美国地址 + Mobile IP + 合规消费模式，正常通过率 80%+。',
  },
  {
    q: '报税也帮我做吗？Form 5472 漏报真的会罚 $25,000 吗？',
    a: '是的，IRS 对外资 LLC 的 Form 5472 + 1120 漏报罚款 $25,000 起步，且没有"初次违规减免"。全能代理服务和建站代理服务都包含年度记账报税，由专业会计师执行。',
  },
  {
    q: '联系方式是什么？',
    a: '加客服微信 / WhatsApp，或在网站右下角点 Crisp 在线客服直接咨询。咨询完全免费。',
  },
];

export default async function DaibanPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = getUrlWithLocale('/services/daiban', locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '美国身份代办（ITIN / LLC / 银行 / Stripe）',
    serviceType: 'Cross-border financial setup for non-US residents',
    provider: {
      '@type': 'Organization',
      name: 'YoTrade',
      url: getBaseUrl(),
    },
    areaServed: { '@type': 'Country', name: 'Worldwide' },
    description:
      'NRA 一站式美国身份代办：ITIN 申请、美国 LLC 注册、Mercury 银行开户、Stripe 收款、5472 / 1120 报税合规。',
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
          <Sparkles className="size-3.5" />
          <span>核心服务 · 跨境创业必备</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
          美国身份代办
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
          NRA 一站式打通{' '}
          <span className="font-semibold text-foreground">
            ITIN / 美国 LLC / Mercury 银行 / Stripe 收款
          </span>{' '}
          {' '}— 从中国身份卡在收款最后一公里，到完整美国金融基建上线，最快 7 周。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <a href="#pricing">
              查看代办方案 <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocaleLink href="/contact">
              <MessageCircle className="mr-2 size-4" /> 免费咨询
            </LocaleLink>
          </Button>
        </div>
      </section>

      {/* Who needs */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">谁需要这项服务</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {TARGETS.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-5 rounded-lg border bg-muted/30"
            >
              <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm lg:text-base">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-3">服务内容</h2>
        <p className="text-center text-muted-foreground mb-10">
          四大子模块按需自由组合，每一块都附深度教程供你参考
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {MODULES.map((m) => (
            <Card key={m.title} className="border bg-muted/20">
              <CardHeader>
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <m.icon className="size-5 text-primary" />
                </div>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {m.desc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocaleLink
                  href={m.link}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {m.linkText} <ArrowRight className="size-3" />
                </LocaleLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">服务流程</h2>
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {PROCESS.map((p) => (
            <div
              key={p.step}
              className="p-6 rounded-lg border bg-card text-card-foreground"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {p.step}
              </div>
              <div className="font-semibold mb-2">{p.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-3">代办方案</h2>
        <p className="text-center text-muted-foreground mb-10">
          从自助手册到全能代理 + 建站，按预算和需求选档
        </p>
        <PricingTable />
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-3">常见问题</h2>
        <p className="text-center text-muted-foreground mb-10">
          没解决你的疑问？右下角 Crisp 在线客服直接问
        </p>
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
        <ShieldCheck className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          世界那么大,支付不该那么难
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          一次咨询免费,不强推任何档位。我们先听你的业务,再告诉你最省钱的路径——哪怕是只买手册自己动手,我们也会推。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <LocaleLink href="/contact">
              <MessageCircle className="mr-2 size-4" /> 免费咨询
            </LocaleLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocaleLink href="/blog">
              <Briefcase className="mr-2 size-4" /> 浏览代办案例
            </LocaleLink>
          </Button>
        </div>
      </section>
    </Container>
  );
}
