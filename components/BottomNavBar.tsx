'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { BOTTOM_NAV_ITEMS } from '@/lib/constants';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';

const log = createLogger('BottomNavBar');

interface BottomNavBarProps {
  className?: string;
}

export default function BottomNavBar({ className }: BottomNavBarProps) {
  const pathname = usePathname();

  useEffect(() => {
    log.info('Navigation', { path: pathname });
  }, [pathname]);

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 h-[72px] border-t border-border bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden',
        className
      )}
      aria-label="Navegacao principal mobile"
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
              <motion.span whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                <item.icon className={cn('h-5 w-5 transition', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                <span className="max-w-full truncate text-[10px] font-bold leading-none">{item.label}</span>
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
