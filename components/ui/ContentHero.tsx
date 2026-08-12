'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * ContentHero — cabeçalho reutilizável das páginas de conteúdo.
 *
 * <ContentHero icon={Building2} label="Obras" title="Obras Públicas" accent="accent" />
 *
 * Cada categoria do portal recebe um `accent` distinto (Ciano para Saúde,
 * Verde brasão para Empregos, Ouro para Tributos, etc.) — o fundo navy se
 * mantém para legibilidade e os destaques (glows, ícone do chip, borda do
 * subtítulo) ganham a cor da categoria.
 */

export type ContentAccent = 'primary' | 'secondary' | 'accent' | 'accent-success' | 'primary-dark';

const ACCENTS: Record<ContentAccent, { glowTop: string; glowBottom: string; chipIcon: string; subtitleBorder: string; accentLine: string }> = {
  primary:          { glowTop: 'bg-primary/30',          glowBottom: 'bg-secondary/30',       chipIcon: 'text-secondary',       subtitleBorder: 'border-secondary/50',         accentLine: 'via-secondary/70' },
  secondary:        { glowTop: 'bg-secondary/35',        glowBottom: 'bg-primary-light/40',   chipIcon: 'text-secondary',       subtitleBorder: 'border-secondary/60',         accentLine: 'via-secondary/70' },
  accent:           { glowTop: 'bg-accent/30',           glowBottom: 'bg-secondary/25',       chipIcon: 'text-accent',          subtitleBorder: 'border-accent/55',            accentLine: 'via-accent/80' },
  'accent-success': { glowTop: 'bg-accent-success/30',   glowBottom: 'bg-secondary/25',       chipIcon: 'text-accent-success',  subtitleBorder: 'border-accent-success/55',    accentLine: 'via-accent-success/80' },
  'primary-dark':   { glowTop: 'bg-primary-dark/45',     glowBottom: 'bg-accent/22',          chipIcon: 'text-accent',          subtitleBorder: 'border-accent/50',            accentLine: 'via-accent/80' },
};

interface ContentHeroProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  /** Cor de destaque da categoria (default: 'primary'). */
  accent?: ContentAccent;
  /** @deprecated Mantido para retrocompatibilidade — use `accent` em vez disso. */
  color?: string;
  className?: string;
  action?: React.ReactNode;
}

export default function ContentHero({
  icon: Icon, label, title, subtitle, className, action, accent = 'primary',
}: ContentHeroProps) {
  const reduceMotion = useReducedMotion();
  const palette = ACCENTS[accent];

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'ring-highlight-dark relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary-dark via-primary to-primary-dark p-7 text-white shadow-[0_26px_70px_rgba(14,58,140,0.30)] sm:p-10 md:rounded-[2.5rem] md:p-14',
        className,
      )}
    >
      {/* Glows de acento da categoria */}
      <div aria-hidden className={cn('pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl', palette.glowTop)} />
      <div aria-hidden className={cn('pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full blur-3xl', palette.glowBottom)} />

      {/* Textura de grade pontilhada + brilho superior */}
      <div aria-hidden className="hero-grid-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Anel decorativo flutuante */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-white/[0.08]"
      />

      <div className="relative z-10 max-w-3xl space-y-5">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur"
        >
          <Icon className={cn('h-4 w-4', palette.chipIcon)} />
          {label}
        </motion.div>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn('max-w-2xl border-l-2 pl-5 text-base font-medium leading-relaxed text-white/75 md:text-lg', palette.subtitleBorder)}
          >
            {subtitle}
          </motion.p>
        )}

        {action && <div className="pt-2">{action}</div>}

        {/* Linha de acento da categoria */}
        <div aria-hidden className={cn('mt-1 h-px w-40 bg-gradient-to-r from-white/0', palette.accentLine, 'to-white/0')} />
      </div>

      <Icon className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 opacity-[0.07]" />
    </motion.section>
  );
}
