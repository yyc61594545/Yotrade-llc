import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Container from '@/components/layout/container';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl, getUrlWithLocale } from '@/lib/urls/urls';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Package,
  ShoppingBag,
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
    title: '海外商品代购 | 美亚 / 日亚 / 欧美直邮 | YoTrade',
    description:
      '专业海外代购,从下单到送达全程跟踪。美亚 / 日亚 / 欧美各大平台均可,真实美国地址收货,价格透明无隐藏费用。',
    canonicalUrl: getUrlWithLocale('/services/daigou', locale),
  });
}

const TARGETS = [
  '想买美亚 / 日亚 / 欧美电商上有但国内买不到 / 加价多的商品',
  '中国信用卡刷不了 / 平台不接受国内地址的特定品类',
  '担心海外商家发货 / 关税 / 转运被坑的新手',
  '不想自己处理英文客服、退换货、转运对接的人',
];

const PROCESS = [
  { step: '01', title: '发链接报价', desc: '微信发商品链接 + 规格,30 分钟内反馈到手总价(商品价 + 国内服务费 + 运费 + 关税预估)。' },
  { step: '02', title: '确认下单', desc: '你确认后我们用真实海外身份 + 美国地址下单,实物清晰可追溯。' },
  { step: '03', title: '收货检查', desc: '商品到美国仓后实拍验货,发图给你确认无误。' },
  { step: '04', title: '直邮 / 转运', desc: '按你需求走直邮 / 海运 / 空运,全程提供物流单号。' },
];

const FAQS = [
  {
    q: '价格透明吗?会不会有隐藏费用?',
    a: '一次性报全:商品价 + 服务费 + 国际运费 + 关税预估。报价后不再加价。关税多退少补,差价超过 5% 我们自己承担。',
  },
  {
    q: '哪些品类不能代购?',
    a: '禁运品(液体危险品 / 仿牌 / 武器 / 易燃易爆)、平台禁售品(超出申报价值的奢侈品)、过度敏感品类(具体微信咨询)。',
  },
  {
    q: '到货要多久?',
    a: '美亚下单 1–3 天发货 + 国际运输:直邮空运通常 7–14 天到中国,海运 30–45 天。日亚 / 欧美各地区时效略有差异,下单时会告诉你预计窗口。',
  },
  {
    q: '商品有问题怎么办?',
    a: '海外仓收货阶段我们会实拍验货,问题立即跟商家退换。已发到国内的商品按平台政策处理(部分品类支持国际退,我们协助沟通)。',
  },
  {
    q: '比转运公司便宜吗?',
    a: '小件、单件商品基本持平或略贵;但你省下了:① 自己注册海外账号 ② 自己搞美国地址 ③ 自己对接英文客服 ④ 自己出关税。综合下来通常更省心。',
  },
];

export default async function DaigouPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = getUrlWithLocale('/services/daigou', locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '海外商品代购',
    serviceType: 'Cross-border personal shopping',
    provider: { '@type': 'Organization', name: 'YoTrade', url: getBaseUrl() },
    description: '专业海外代购,全程跟踪,价格透明。',
    url: pageUrl,
  };

  return (
    <Container className="px-4 py-12 lg:py-20 flex flex-col gap-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-sm rounded-full border px-4 py-1.5 mb-6">
          <ShoppingBag className="size-3.5" />
          <span>海外购物 · 全程托管</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">海外商品代购</h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
          帮您购买海外商品,从下单到送达{' '}
          <span className="font-semibold text-foreground">全程跟踪</span>。
          真实美国地址收货,价格透明无隐藏费用。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact">
            <MessageCircle className="mr-2 size-4" /> 发链接报价
          </LocaleLink>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10">谁适合用代购</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {TARGETS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-5 rounded-lg border bg-muted/30">
              <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm lg:text-base">{t}</span>
            </div>
          ))}
        </div>
      </section>

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

      <section className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-10">常见问题</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem value={`q-${i}`} key={i}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="text-center max-w-3xl mx-auto rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-10 lg:p-16">
        <Package className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">把商品链接发给我们</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          30 分钟内出报价,确认后我们下单。全程跟踪,验货拍照,关税多退少补。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact">
            <MessageCircle className="mr-2 size-4" /> 微信发链接
          </LocaleLink>
        </Button>
      </section>
    </Container>
  );
}
