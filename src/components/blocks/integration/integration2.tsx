'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Integration2Section() {
  const t = useTranslations('HomePage.integration2');

  // 商家logo列表 - 您可以在这里添加更多商家
  const merchants = [
    { name: 'Amazon', logo: '/merchants/amazon.png' },
    { name: 'Walmart', logo: '/merchants/Walmart.png' },
    { name: 'Macys', logo: '/merchants/macys.png' },
    { name: 'Coach', logo: '/merchants/coach.png' },
    { name: 'Target', logo: '/merchants/target.png' },
    { name: 'Best Buy', logo: '/merchants/bestbuy.png' },
    { name: 'eBay', logo: '/merchants/ebay.png' },
    { name: 'Nike', logo: '/merchants/nike.png' },
  ];

  return (
    <section id="integration2" className="px-4 py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('title')}
          </h2>
        </div>

        {/* 不规则排列的商家logo */}
        <div className="relative mx-auto max-w-7xl">
          {/* 第一行 - 4个logo */}
          <div className="flex justify-center gap-8 mb-8">
            {merchants.slice(0, 4).map((merchant) => (
              <MerchantLogo
                key={merchant.name}
                name={merchant.name}
                logo={merchant.logo}
              />
            ))}
          </div>

          {/* 第二行 - 3个logo（居中） */}
          <div className="flex justify-center gap-8 mb-8">
            {merchants.slice(4, 7).map((merchant) => (
              <MerchantLogo
                key={merchant.name}
                name={merchant.name}
                logo={merchant.logo}
              />
            ))}
          </div>

          {/* 第三行 - 1个logo */}
          <div className="flex justify-center gap-8">
            {merchants.slice(7, 8).map((merchant) => (
              <MerchantLogo
                key={merchant.name}
                name={merchant.name}
                logo={merchant.logo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MerchantLogo = ({ name, logo }: { name: string; logo: string }) => {
  return (
    <div className="group relative flex items-center justify-center w-24 h-24 rounded-xl bg-background border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Image
        src={logo}
        alt={name}
        width={96}
        height={96}
        className="object-cover rounded-xl transition-all"
      />
    </div>
  );
};
