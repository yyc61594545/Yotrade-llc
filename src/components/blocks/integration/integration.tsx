'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

// 默认配置参数
const DEFAULT_CONFIG = {
  containerSize: 128,
  iconScale: 1.0,
  borderRadius: 16,
  marginTop: -64,
};

export default function IntegrationSection() {
  const t = useTranslations('HomePage.integration');

  // 使用 state 来管理配置，允许实时调整
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const services = [
    {
      id: 'daigou',
      title: t('items.item-1.title'),
      description: t('items.item-1.description'),
      logo: '/services/daigou.png',
    },
    {
      id: 'daimai',
      title: t('items.item-2.title'),
      description: t('items.item-2.description'),
      logo: '/services/daimai.png',
    },
    {
      id: 'daishua',
      title: t('items.item-3.title'),
      description: t('items.item-3.description'),
      logo: '/services/daishua.png',
    },
    {
      id: 'daiban',
      title: t('items.item-4.title'),
      description: t('items.item-4.description'),
      logo: '/services/daiban.png',
    },
  ];

  return (
    <section id="integration" className="px-4 py-16 relative">
      {/* 调试面板开关按钮 */}
      <button
        onClick={() => setShowDebugPanel(!showDebugPanel)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
      >
        {showDebugPanel ? '隐藏调试面板' : '显示调试面板'}
      </button>

      {/* 调试面板 */}
      {showDebugPanel && (
        <div className="fixed bottom-20 right-4 z-50 w-80 p-6 bg-background border rounded-lg shadow-xl space-y-4">
          <h3 className="font-semibold text-lg mb-4">图标大小调试</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                图标缩放: {config.iconScale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={config.iconScale}
                onChange={(e) => setConfig({ ...config, iconScale: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                容器大小: {config.containerSize}px
              </label>
              <input
                type="range"
                min="80"
                max="200"
                step="8"
                value={config.containerSize}
                onChange={(e) => setConfig({ ...config, containerSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                圆角大小: {config.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={config.borderRadius}
                onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <button
              onClick={() => {
                console.log('当前配置:', config);
                alert(`复制以下配置到代码中：\n\nconst ICON_CONFIG = ${JSON.stringify(config, null, 2)}`);
              }}
              className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              复制配置
            </button>

            <button
              onClick={() => setConfig(DEFAULT_CONFIG)}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
            >
              重置为默认
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ paddingTop: `${Math.abs(config.marginTop)}px` }}
        >
          {services.map((service) => (
            <IntegrationCard
              key={service.id}
              title={service.title}
              description={service.description}
              logo={service.logo}
              config={config}
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
  link = '#',
  config,
}: {
  title: string;
  description: string;
  logo: string;
  link?: string;
  config: typeof DEFAULT_CONFIG;
}) => {
  const t = useTranslations('HomePage.integration');

  return (
    <Card className="p-6 bg-transparent hover:bg-accent dark:hover:bg-card transition-colors">
      <div className="flex flex-col h-full items-center text-center">
        <div
          className="flex items-center justify-center bg-primary shadow-lg overflow-hidden mb-6"
          style={{
            width: `${config.containerSize}px`,
            height: `${config.containerSize}px`,
            borderRadius: `${config.borderRadius}px`,
            marginTop: `${config.marginTop}px`,
          }}
        >
          <Image
            src={logo}
            alt={title}
            width={512}
            height={512}
            className="object-contain"
            style={{
              width: `${config.iconScale * 100}%`,
              height: `${config.iconScale * 100}%`,
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
            className="gap-1 pr-2 shadow-none"
          >
            <LocaleLink href={link}>
              {t('learnMore')}
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </LocaleLink>
          </Button>
        </div>
      </div>
    </Card>
  );
};
