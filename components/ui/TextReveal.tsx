'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * TextReveal — palavras "sobem" de trás de uma máscara, em sequência,
 * quando o bloco entra no viewport. Efeito editorial (não o marquee clichê).
 * Respeita prefers-reduced-motion via Motion.
 */

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.04 },
  }),
};

const wordVariant: Variants = {
  hidden: { y: '118%' },
  show: { y: '0%', transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } },
};

interface TextRevealProps {
  text: string;
  /** Palavras (lowercase) que recebem o gradiente da marca. */
  highlight?: string[];
  className?: string;
  stagger?: number;
  once?: boolean;
}

export default function TextReveal({
  text,
  highlight = [],
  className,
  stagger = 0.07,
  once = true,
}: TextRevealProps) {
  const words = text.split(' ');
  const norm = (w: string) => w.replace(/[.,!?;:—]/g, '').toLowerCase();
  const hl = new Set(highlight.map((h) => h.toLowerCase()));

  return (
    <motion.span
      className={cn('inline', className)}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px' }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-flex overflow-hidden align-bottom leading-[1.05]"
          style={{ paddingBottom: '0.12em' }}
        >
          <motion.span
            variants={wordVariant}
            className={cn('inline-block', hl.has(norm(w)) && 'text-gradient')}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
