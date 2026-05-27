'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Reveal — anima a entrada de um bloco quando ele aparece no viewport.
 * Respeita "prefers-reduced-motion" automaticamente (Motion neutraliza o efeito).
 */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  /** Distância do deslocamento inicial, em px. */
  distance?: number;
  className?: string;
  /** Anima toda vez que entra na tela (padrão: só uma vez). */
  repeat?: boolean;
}

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance };
    case 'down': return { y: -distance };
    case 'left': return { x: distance };
    case 'right': return { x: -distance };
    default: return {};
  }
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 24,
  className,
  repeat = false,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offset(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealGroup + RevealItem — stagger em sequência (ex.: grids de cards,
 * linhas de texto que entram uma após a outra).
 */

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};

export function RevealGroup({
  children,
  className,
  repeat = false,
}: {
  children: React.ReactNode;
  className?: string;
  repeat?: boolean;
}) {
  return (
    <motion.div
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
