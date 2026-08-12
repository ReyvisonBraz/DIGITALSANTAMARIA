'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { BOTTOM_NAV_ITEMS } from '@/lib/constants';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';

const log = createLogger('BottomNavBar');

interface BottomNavBarProps {
  className?: string;
}

export default function BottomNavBar({ className }: BottomNavBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('bottomNav');

  useEffect(() => {
    log.info('Navigation', { path: pathname });
  }, [pathname]);

  const labelMap: Record<string, string> = {
    'Inicio': t('home'),
    'Relatar': t('report'),
    'Pedir': t('request'),
    'Acompanhar': t('protocol'),
    'Minha área': t('panel'),
  };

  return (
    <nav
      className={cn(
        'liquid-bottom-nav fixed bottom-3 left-3 right-3 z-50 h-[72px] md:hidden',
        className
      )}
      aria-label={t('mainNavigation')}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const [itemPath, itemQuery] = item.href.split('?');
          const itemTab = itemQuery ? new URLSearchParams(itemQuery).get('tab') : null;
          const isActive = pathname === itemPath && (itemTab ? searchParams.get('tab') === itemTab : !searchParams.get('tab'));
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                'liquid-bottom-nav-item relative flex h-full min-w-0 flex-col items-center justify-center px-1 text-text-muted',
                isActive && 'is-active text-primary'
              )}
              data-active={isActive || undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.span
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'liquid-bottom-nav-button flex min-h-14 min-w-14 flex-col items-center justify-center gap-1'
                )}
              >
                <item.icon className={cn('relative z-10 h-5 w-5 transition-transform', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                <span className="relative z-10 max-w-full truncate text-[11px] font-bold leading-none">{labelMap[item.label] || item.label}</span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
