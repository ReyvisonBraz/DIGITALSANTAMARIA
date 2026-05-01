'use client';

import React, { useEffect } from 'react';
import { Home, MessageSquare, Vote, FileText, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createLogger } from '@/lib/logger';

const log = createLogger('BottomNavBar');

const navItems = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: MessageSquare, label: 'Relatar', href: '/relatar' },
  { icon: Heart, label: 'Saúde', href: '/saude' },
  { icon: Vote, label: 'Votos', href: '/votos' },
  { icon: FileText, label: 'Petições', href: '/peticoes' },
];

export default function BottomNavBar({ className }: { className?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    log.info('Navigation', { path: pathname });
  }, [pathname]);

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe md:hidden",
      className
    )}>
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center h-full">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn(
                  "text-[10px] font-bold tracking-tight transition-all",
                  isActive ? "opacity-100" : "opacity-80"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-tab"
                    className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
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
