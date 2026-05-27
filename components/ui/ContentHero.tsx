'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * ContentHero — cabeçalho reutilizável das páginas de conteúdo.
 *
 * <ContentHero
 *   icon={Building2}
 *   label="Infraestrutura"
 *   title="Obras Públicas"
 *   subtitle="Acompanhe o progresso das obras"
 * />
 */

interface ContentHeroProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  /** Mantido por compatibilidade (classe de cor do acento). */
  color?: string;
  className?: string;
  action?: React.ReactNode;
}

export default function ContentHero({
  icon: Icon, label, title, subtitle, className, action,
}: ContentHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        'relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark p-8 text-white shadow-[0_26px_70px_rgba(44,68,49,0.30)] animate-drift md:p-14',
        className,
      )}
    >
      {/* glows ambiente */}
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative z-10 max-w-3xl space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur"
        >
          <Icon className="h-4 w-4 text-accent" />
          {label}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.7 }}
          className="text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="max-w-2xl border-l-2 border-accent/50 pl-5 text-base font-medium leading-relaxed text-white/75 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        {action && <div className="pt-2">{action}</div>}
      </div>

      <Icon className="animate-floaty pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 opacity-[0.06]" />
    </motion.section>
  );
}
