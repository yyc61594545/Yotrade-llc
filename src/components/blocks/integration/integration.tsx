'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Static layout constants for service cards
const CARD_CONTAINER_SIZE = 128;
const CARD_ICON_SCALE = 1.0;
const CARD_BORDER_RADIUS = 16;
const CARD_MARGIN_TOP = -64;

export default function IntegrationSection() {
  const t = useTranslations('HomePage.integration');

  const services = [
    {
      id: 'daigou',
      title: t('items.item-1.title'),
      description: t('items.item-1.description'),
      logo: '/services/daigou.png',
      link: '/services/daigou?utm_source=home&utm_medium=card&utm_campaign=integration',
    },
    {
      id: 'daimai',
      title: t('items.item-2.title'),
      description: t('items.item-2.description'),
      logo: '/services/daimai.png',
      link: '/services/daimai?utm_source=home&utm_medium=card&utm_campaign=integration',
    },
    {
      id: 'daishua',
      title: t('items.item-3.title'),
      description: t('items.item-3.description'),
      logo: '/services/daishua.png',
      link: '/services/daishua?utm_source=home&utm_medium=card&utm_campaign=integration',
    },
    {
      id: 'daiban',
      title: t('items.item-4.title'),
      description: t('items.item-4.description'),
      logo: '/services/daiban.png',
      link: '/services/daiban?utm_source=home&utm_medium=card&utm_campaign=integration',
    },
  ];

  return (
    <section id="integration" className="px-4 py-16 relative">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ paddingTop: `${Math.abs(CARD_MARGIN_TOP)}px` }}
        >
          {services.map((service) => (
            <IntegrationCard
              key={service.id}
              title={service.title}
              description={service.description}
              logo={service.logo}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  logo,
  link,
}: {
  title: string;
  description: string;
  logo: string;
  link: string;
}) => {
  const t = useTranslations('HomePage.integration');

  return (
    <LocaleLink
      href={link}
      className="block group"
      aria-label={`${t('learnMore')}: ${title}`}
    >
      <Card className="p-6 bg-transparent hover:bg-accent dark:hover:bg-card transition-colors h-full">
        <div className="flex flex-col h-full items-center text-center">
          <div
            className="flex items-center justify-center bg-primary shadow-lg overflow-hidden mb-6"
            style={{
              width: `${CARD_CONTAINER_SIZE}px`,
              height: `${CARD_CONTAINER_SIZE}px`,
              borderRadius: `${CARD_BORDER_RADIUS}px`,
              marginTop: `${CARD_MARGIN_TOP}px`,
            }}
          >
            <Image
              src={logo}
              alt={title}
              width={512}
              height={512}
              className="object-contain"
              style={{
                width: `${CARD_ICON_SCALE * 100}%`,
                height: `${CARD_ICON_SCALE * 100}%`,
              }}
            />
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          <div className="flex gap-3 border-t border-dashed pt-4 mt-4 w-full justify-center">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1 pr-2 shadow-none pointer-events-none"
            >
              <span>
                {t('learnMore')}
                <ChevronRight className="ml-0 !size-3.5 opacity-50" />
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </LocaleLink>
  );
};
