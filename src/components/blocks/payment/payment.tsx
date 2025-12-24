'use client';

import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function PaymentSection() {
  const t = useTranslations('HomePage.payment');

  const paymentMethods = [
    {
      id: 'wechat',
      title: t('items.wechat.title'),
      description: t('items.wechat.description'),
      logo: '/payment/wechat.png',
    },
    {
      id: 'alipay',
      title: t('items.alipay.title'),
      description: t('items.alipay.description'),
      logo: '/payment/alipay.png',
    },
    {
      id: 'applepay',
      title: t('items.applepay.title'),
      description: t('items.applepay.description'),
      logo: '/payment/applepay.png',
    },
    {
      id: 'googlepay',
      title: t('items.googlepay.title'),
      description: t('items.googlepay.description'),
      logo: '/payment/googlepay.png',
    },
    {
      id: 'creditcard',
      title: t('items.creditcard.title'),
      description: t('items.creditcard.description'),
      logo: '/payment/creditcard.png',
    },
    {
      id: 'banktransfer',
      title: t('items.banktransfer.title'),
      description: t('items.banktransfer.description'),
      logo: '/payment/banktransfer.png',
    },
  ];

  return (
    <section id="payment" className="px-4 py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className="p-6 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={method.logo}
                    alt={method.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold">{method.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
