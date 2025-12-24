'use client';

import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('size-8', className)} />
    );
  }

  const logoSrc = resolvedTheme === 'dark'
    ? websiteConfig.metadata.images.logoDark
    : websiteConfig.metadata.images.logoLight;

  return (
    <Image
      src={logoSrc}
      alt="Logo"
      width={32}
      height={32}
      className={cn('size-8', className)}
      priority
    />
  );
}
