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
  BedDouble,
  CheckCircle2,
  MessageCircle,
  Plane,
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
    title: 'IHG 酒店积分代订 / 航班里程票代订 | 酒店机票代订 | YoTrade',
    description:
      '用 IHG 优悦会积分与会员权益代订洲际、皇冠假日、假日酒店等全球门店，航班里程票与官网直订代付。真实客人姓名入住,行程确认单可查,未出行前按规则可退。',
    canonicalUrl: getUrlWithLocale('/services/travel', locale),
  });
}

const TARGETS = [
  '要订 IHG 旗下酒店(洲际 / 皇冠假日 / 假日 / 英迪格 / Kimpton),但官网现金价偏高的人',
  '没有海外信用卡,航司官网 / 酒店国际站付不了款或频繁被拒的人',
  '出差、旅行、探亲要在海外住店,想用积分价 + 会员权益省下一截房费的人',
  '不想自己研究会员体系、买分促销、里程票放票规律,只想拿到一张能入住的确认单的人',
];

const PROCESS = [
  { step: '01', title: '发行程报价', desc: '微信发酒店 / 航线 + 日期 + 入住人数,30 分钟内对比现金价与积分价,反馈到手总价。' },
  { step: '02', title: '确认下单', desc: '你确认后我们用会员账号 + 海外卡下单,入住人写你的真实姓名。' },
  { step: '03', title: '发确认单', desc: '发你 IHG / 航司官方确认号与确认邮件,自己在官网 / App 可查。' },
  { step: '04', title: '入住 / 出行', desc: '凭证件办理入住或值机。行前有变动按酒店 / 航司当期退改规则处理。' },
];

const FAQS = [
  {
    q: '积分代订的房间和自己在官网订有区别吗?',
    a: '房型、床型、早餐政策以预订页面显示为准,入住体验一致。区别在于积分订单不累计你自己的会员房晚,以及部分酒店对积分房的退改期限与现金房不同,下单前我们会先说明。',
  },
  {
    q: '入住人不是会员本人,能顺利入住吗?',
    a: '可以。IHG 允许会员为他人预订积分房,预订时把你的真实姓名加进入住人。大中华区(内地 / 港澳台)酒店需要提前至少 7 天向 IHG 客服登记真实入住人,所以内地行程请至少提前一周下单。',
  },
  {
    q: '价格怎么算?',
    a: '按酒店 / 航线当期积分价折算,一次报到手总价。报价前会把官网现金价一起给你看,不划算我们会直说。本站不放公开价目表,微信报价。',
  },
  {
    q: '能取消吗?',
    a: '未到酒店取消期限前取消,按酒店规则退款;超过期限或不可取消房型,按酒店当期政策处理。里程机票的退改按航司规则,通常比现金票灵活但会有手续费。',
  },
  {
    q: '航班也能订吗?',
    a: '可以。里程票视航线与舱位放票情况而定,不保证一定有票;现金票走航司官网直订代付,确认号在航司官网可查。中美航线 2026-27 冬春航季运力仍比疫前低六成多,建议尽早下单。',
  },
];

export default async function TravelPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = getUrlWithLocale('/services/travel', locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'IHG 酒店积分代订与航班代订',
    serviceType: 'Hotel and flight booking assistance',
    provider: { '@type': 'Organization', name: 'YoTrade', url: getBaseUrl() },
    description:
      '用 IHG 优悦会积分与会员权益代订全球门店,航班里程票与官网直订代付,真实姓名入住,官方确认单可查。',
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
          <BedDouble className="size-3.5" />
          <span>酒店机票 · 积分代订 · 新上线</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
          IHG 酒店 / 航班代订
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
          用 IHG 优悦会积分与会员权益订全球门店,航班里程票与官网直订代付。{' '}
          <span className="font-semibold text-foreground">真实姓名入住,官方确认单可查</span>
          ,不划算我们直说。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact?utm_source=services&utm_medium=hero&utm_campaign=travel">
            <MessageCircle className="mr-2 size-4" /> 发行程报价
          </LocaleLink>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10">谁适合用代订</h2>
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

      {/* WeChat — primary conversion */}
      <section className="max-w-5xl mx-auto w-full">
        <WechatContact
          variant="compact"
          title="发酒店 / 航线 + 日期,30 分钟出到手价"
          subtitle="IHG 全品牌积分代订 · 航班里程票 / 官网直订代付 · 现金价与积分价一起对比"
          perks={[
            '30 分钟内反馈到手总价,现金价与积分价一起给你看',
            '真实姓名入住,IHG / 航司官方确认号自己可查',
            '未到退改期限前取消,按酒店 / 航司规则退',
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
        <Plane className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">把行程发给我们</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          酒店名 / 航线 + 日期 + 人数,30 分钟内出报价。确认后下单,确认单官网可查。
        </p>
        <Button asChild size="lg">
          <LocaleLink href="/contact?utm_source=services&utm_medium=bottom&utm_campaign=travel">
            <MessageCircle className="mr-2 size-4" /> 微信发行程
          </LocaleLink>
        </Button>
      </section>
    </Container>
  );
}
