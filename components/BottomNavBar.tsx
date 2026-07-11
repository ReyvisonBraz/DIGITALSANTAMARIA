'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const t = useTranslations('bottomNav');

  useEffect(() => {
    log.info('Navigation', { path: pathname });
  }, [pathname]);

  const labelMap: Record<string, string> = {
    'Inicio': t('home'),
    'Solicitar': t('request'),
    'Protocolo': t('protocol'),
    'Petições': t('petitions'),
    'Painel': t('panel'),
  };

  return (
    <nav
      className={cn(
        'fixed bottom-3 left-3 right-3 z-50 h-[72px] rounded-2xl border border-white/70 bg-white/90 shadow-[0_-10px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:hidden',
        className
      )}
      aria-label={t('mainNavigation')}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                'relative flex h-full min-w-0 flex-col items-center justify-center gap-1 px-1 text-text-muted transition',
                isActive && 'text-primary'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-xl transition',
                  isActive && 'bg-primary/10'
                )}
              >
                <item.icon className={cn('h-5 w-5 transition', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                <span className="max-w-full truncate text-[11px] font-bold leading-none">{labelMap[item.label] || item.label}</span>
              </motion.span>
              {isActive && (
                <motion.span
                  layoutId="active-mobile-tab"
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
