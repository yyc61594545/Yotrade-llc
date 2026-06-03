import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Container from '@/components/layout/container';
import { WechatContact } from '@/components/wechat/wechat-contact';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl, getUrlWithLocale } from '@/lib/urls/urls';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Ticket,
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
    title: '海外限定款代买 | 球鞋 / 演唱会 / 限购品 | YoTrade',
    description:
      '协助在海外平台买限定款、折扣品、需要特定国家账号或支付方式的商品。球鞋抽签、演唱会门票、地区限购、独家发售,我们用真实海外身份帮你抢。',
    canonicalUrl: getUrlWithLocale('/services/daimai', locale),
  });
}

const SCENARIOS = [
  { icon: '👟', title: '球鞋抽签 / 限定发售', desc: 'Nike SNKRS、Adidas Confirmed、Yeezy Supply 等抽签发售,需要海外账号 + 真实地址。' },
  { icon: '🎫', title: '演唱会 / 体育门票', desc: 'Ticketmaster / StubHub / AXS 等海外票务,需要本地手机号、信用卡和地址才能购买。' },
  { icon: '🎮', title: '区域限购游戏 / 道具', desc: '部分游戏 / DLC / 数字商品只在特定地区发售,需要切区账号 + 当地支付。' },
  { icon: '🎨', title: '艺术品 / 收藏品', desc: 'KAWS / Bearbrick / 限量盲盒等抢购,需要真实海外身份持续蹲守。' },
  { icon: '💄', title: '限购品类', desc: '部分美妆 / 健康品 / 保健品 / 婴儿用品有"每人限购 X 件",需要多账号 + 多地址组合。' },
  { icon: '🛍️', title: '黑五 / Boxing Day 折扣', desc: '海外购物季的限时折扣,语言、时差、抢购速度都是障碍,我们帮你拿到。' },
];

const PROCESS = [
  { step: '01', title: '说清需求', desc: '微信告诉我们要买什么、什么时候开售、有没有目标尺码 / 区号 / 数量。' },
  { step: '02', title: '报价确认', desc: '商品价 + 代买服务费 + 风险加成(限定品成功率不同)一次说清。' },
  { step: '03', title: '上线抢购', desc: '我们用预热账号 + 真实海外身份在开售瞬间执行,部分品类支持多账号并行。' },
  { step: '04', title: '运送回国', desc: '抢到后走直邮 / 海运,部分商品支持本地交付(如演唱会门票直接发邮箱)。' },
];

const FAQS = [
  {
    q: '抢限定款的成功率有多高?',
    a: '看品类。预热账号充足的球鞋抽签 30–60%,Ticketmaster 演唱会票 50–80%(看场次热度),区域限购游戏 / 数字商品 90%+。下单前我们会按品类如实告知预期成功率,不画饼。',
  },
  {
    q: '没抢到会退钱吗?',
    a: '是。服务费按"成功即收"原则,没抢到只扣极少量"已尝试成本"(通常 < 服务费的 20%),其余全额退。具体退款条款下单前白纸黑字写清。',
  },
  {
    q: '球鞋抽签需要多久?',
    a: '当天开签当天出结果。中签后我们立即支付并发邮箱截图给你确认,5–7 天后商品到我们美国仓,再走直邮或海运到国内。',
  },
  {
    q: '演唱会门票是电子票吗?能直接给我?',
    a: '是的,Ticketmaster / AXS 等多数已数字化。抢到后我们把门票转入你提供的邮箱账号(或代你保管到开演前),完全合规。',
  },
  {
    q: '会用我自己的支付方式吗?',
    a: '不需要。整个抢购流程用我们自有美卡 + 海外身份,你只用人民币和我们结算。',
  },
];

export default async function DaimaiPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = getUrlWithLocale('/services/daimai', locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '海外限定款代买',
    serviceType: 'Cross-border limited-edition purchasing',
    provider: { '@type': 'Organization', name: 'YoTrade', url: getBaseUrl() },
    description: '协助海外限定款 / 演唱会 / 抽签发售商品代买,真实海外身份执行。',
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
          <Ticket className="size-3.5" />
          <span>限定 / 抽签 / 限购</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">海外限定款代买</h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
          协助在国外购物平台买到{' '}
          <span className="font-semibold text-foreground">
            限定款、抽签发售、地区限购
          </span>
          {' '}的商品。真实海外身份 + 预热账号,把语言、时差、支付障碍全帮你解决。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact">
            <MessageCircle className="mr-2 size-4" /> 说说你要抢什么
          </LocaleLink>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-3">常见代买场景</h2>
        <p className="text-center text-muted-foreground mb-10">不在下面也能问,大部分海外平台都能上</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="p-6 rounded-lg border bg-muted/20">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-semibold mb-2">{s.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
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

      {/* WeChat — primary conversion */}
      <section className="max-w-5xl mx-auto w-full">
        <WechatContact
          variant="compact"
          title="开售前预约,成功率翻倍"
          subtitle="球鞋抽签 / 演唱会票 / 区域限购 — 真实海外身份 + 预热账号"
          perks={[
            '按品类如实告知预期成功率,不画饼',
            '没抢到全额退服务费(扣极少"已尝试成本")',
            '抢购付款用我们自有美卡,你只付人民币',
          ]}
        />
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
        <CreditCard className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">下次发售开始前找我们</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          越提前预约,预热账号越多,成功率越高。先把开售日期告诉我们就行。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact">
            <MessageCircle className="mr-2 size-4" /> 微信预约抢购
          </LocaleLink>
        </Button>
      </section>
    </Container>
  );
}
