'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * ContentHero — Seção de cabeçalho reutilizável para páginas de conteúdo.
 *
 * Uso:
 * ```tsx
 * <ContentHero
 *   icon={Building2}
 *   label="Infraestrutura"
 *   title="Obras Públicas"
 *   subtitle="Acompanhe o progresso das obras"
 *   color="bg-amber-500"
 * />
 * ```
 */

interface ContentHeroProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  color?: string;
  className?: string;
  action?: React.ReactNode;
}

export default function ContentHero({
  icon: Icon, label, title, subtitle, color = 'bg-primary', className, action,
}: ContentHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-text-main text-white p-8 md:p-14 border-4 border-white/10',
        className,
      )}
    >
      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur">
          <Icon className="w-4 h-4 text-primary" />
          {label}
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
          {title}
        </h1>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-base md:text-lg font-medium text-white/70 max-w-2xl leading-relaxed border-l-4 border-primary/30 pl-6">
            {subtitle}
          </p>
        )}

        {/* Ação opcional */}
        {action && <div className="pt-2">{action}</div>}
      </div>

      {/* Decoração de fundo */}
      <Icon className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.03] rotate-12 pointer-events-none" />
    </motion.section>
  );
}
