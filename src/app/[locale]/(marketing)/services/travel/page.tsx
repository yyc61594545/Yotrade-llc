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
  Calculator,
  CheckCircle2,
  Mail,
  MessageCircle,
  Plane,
  Send,
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
      'IHG 优悦会积分代订参考单价 ¥400 / 万分（$57），洲际、皇冠假日、假日酒店等全球门店，报价时同步给官网现金价，比官网 85 折贵的单不接。航班里程票与官网直订代付,真实姓名入住,官方确认单可查。',
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

const PRICE_CNY = '400';
const PRICE_USD = '57';

const PRICE_RULES = [
  {
    title: '报价 = 积分价 × 单价',
    desc: '例：一晚 70,000 分 → ¥2,800。报价时一并给你 IHG 官网同日现金价，两个数字自己比。',
  },
  {
    title: '比官网 85 折贵的单不接',
    desc: '积分价折算后高于官网现金价 85 折，我们直接劝你付现金或走官网直订代付，不硬卖。',
  },
  {
    title: '大单 ¥380 / 万分',
    desc: '单次行程 ≥ 100,000 分（多晚度假村、连住）按 ¥380 计，报价时自动按大单算。',
  },
] as const;

const PRICE_EXAMPLES = [
  { scene: '海外度假村旺季（如 Kimpton 度假村）', points: '70,000', quote: '¥2,800', cash: '≈ ¥7,000', verdict: '接，省 60%' },
  { scene: '亚洲一线城市洲际周末', points: '55,000', quote: '¥2,200', cash: '≈ ¥2,700', verdict: '接，省 18%' },
  { scene: '国内中端店淡季', points: '25,000', quote: '¥1,000', cash: '¥700–900', verdict: '不接，劝付现金' },
] as const;

const CONTACTS = [
  {
    icon: MessageCircle,
    label: '微信',
    value: 'Easloyip',
    note: '国内首选 · 扫下方码，备注「IHG」',
    href: null,
  },
  {
    icon: Send,
    label: 'Telegram',
    value: '@Easlo',
    note: '海外用户优先 · 异步工单',
    href: 'https://t.me/Easlo',
  },
  {
    icon: Mail,
    label: '邮件',
    value: 'service@yotradellc.com',
    note: '商务 / 发票 / 售后',
    href: 'mailto:service@yotradellc.com',
  },
] as const;

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
    a: 'IHG 积分代订参考单价 ¥400 / 万分（约 $57），单次行程 ≥ 100,000 分按 ¥380。报价 = 酒店当期积分价 × 单价，一次报到手总价，同时把官网同日现金价发你对比；比官网 85 折贵的单我们不接。航班按航线与舱位单独报价。最终以微信客服确认为准,确认后再付款。',
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
    offers: {
      '@type': 'Offer',
      name: 'IHG 积分代订',
      price: PRICE_CNY,
      priceCurrency: 'CNY',
      description: '每 10,000 IHG 积分参考单价，报价 = 酒店当期积分价 × 单价',
      availability: 'https://schema.org/InStock',
    },
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

      {/* 参考单价 + 联系方式（口径参考 yotradeapi.com：明码单价、微信确认后付款） */}
      <section id="pricing" className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-3">参考单价</h2>
        <p className="text-muted-foreground text-center mb-10">
          明码单价，报价以微信客服确认为准，确认后再付款。
        </p>
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2 rounded-2xl border bg-ink-900 text-white p-8 flex flex-col">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-200 mb-5">
              <Calculator className="size-3.5" /> IHG 积分代订
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight">¥{PRICE_CNY}</span>
              <span className="text-white/70 mb-2">/ 万分</span>
            </div>
            <div className="mt-1 text-white/70">
              或 <span className="font-bold text-white">${PRICE_USD}</span> / 10,000 分（按当期汇率对齐）
            </div>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li>· 洲际 / Kimpton / 皇冠假日 / 假日 / 英迪格 全品牌</li>
              <li>· 真实姓名入住，IHG 官方确认号可查</li>
              <li>· 微信 / 支付宝 / USDT 付款，报价确认后付款，付款后下单出确认单</li>
            </ul>
            <div className="mt-auto pt-6 text-xs text-white/50">
              航班里程票与官网直订代付按航线单独报价。单价随 IHG 买分促销价浮动，以报价当日为准。
            </div>
          </div>
          <div className="lg:col-span-3 grid gap-4">
            {PRICE_RULES.map((r) => (
              <div key={r.title} className="rounded-2xl border bg-card p-5">
                <div className="font-bold mb-1">{r.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">场景</th>
                <th className="px-4 py-3 font-semibold">积分价 / 晚</th>
                <th className="px-4 py-3 font-semibold">我们的报价</th>
                <th className="px-4 py-3 font-semibold">官网现金价</th>
                <th className="px-4 py-3 font-semibold">结论</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_EXAMPLES.map((e) => (
                <tr key={e.scene} className="border-t">
                  <td className="px-4 py-3">{e.scene}</td>
                  <td className="px-4 py-3">{e.points}</td>
                  <td className="px-4 py-3 font-semibold">{e.quote}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.cash}</td>
                  <td className="px-4 py-3">{e.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          示例为常见区间演示，实际以酒店当期积分价与官网现金价为准。IHG 为动态定价，同一酒店同一房型不同日期积分价可相差一倍。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CONTACTS.map(({ icon: Icon, label, value, note, href }) => {
            const body = (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4" /> {label}
                </div>
                <div className="mt-1 font-bold break-all">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{note}</div>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/40"
              >
                {body}
              </a>
            ) : (
              <div key={label} className="rounded-2xl border bg-card p-5">
                {body}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          流程：发酒店 / 航线 + 日期 + 入住人 → 30 分钟内收到积分价折算报价与官网现金价 → 微信确认后付款 → 收 IHG / 航司官方确认单。
        </p>
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
