/**
 * @module BottomNavBar
 * @description Barra de navegação inferior fixa, visível apenas em dispositivos mobile.
 *
 * Mostra 5 links principais com ícones e indicador de página ativa.
 * O layout usa `layoutId` do framer-motion para animação suave ao trocar de aba.
 *
 * @example
 * ```tsx
 * <BottomNavBar className="md:hidden" />
 * ```
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import { BOTTOM_NAV_ITEMS } from '@/lib/constants';

const log = createLogger('BottomNavBar');

// ─── Props ──────────────────────────────────────────────────────────

interface BottomNavBarProps {
  /** Classes CSS adicionais (ex: "md:hidden" para ocultar no desktop) */
  className?: string;
}

// ─── Componente ─────────────────────────────────────────────────────

export default function BottomNavBar({ className }: BottomNavBarProps) {
  const pathname = usePathname();

  /** Loga navegação a cada mudança de rota */
  useEffect(() => {
    log.info('Navigation', { path: pathname });
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe md:hidden",
        className
      )}
      aria-label="Navegação principal mobile"
    >
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full relative"
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-bold tracking-tight transition-all",
                  isActive ? "opacity-100" : "opacity-80"
                )}>
                  {item.label}
                </span>

                {/* Indicador de aba ativa — posição relativa ao Link pai */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
