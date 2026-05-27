'use client';

import { useEffect } from 'react';

/**
 * ScrollAmbience — transição de cor de fundo ligada ao scroll.
 *
 * Interpola dois "glows" ambientes (--ambient-1 / --ambient-2, lidos pelo
 * gradiente do body em globals.css) entre terracota, dourado e verde-musgo
 * conforme o progresso de rolagem da página. Tons bem dessaturados para não
 * competir com o conteúdo. Desativado quando o usuário pede menos movimento.
 */

type RGB = [number, number, number];

const TERRACOTA: RGB = [181, 70, 46];
const GOLD: RGB = [216, 154, 63];
const MOSS: RGB = [58, 90, 64];

// Anchoras ao longo do progresso [0 → 1]
const STOPS_1: RGB[] = [TERRACOTA, GOLD, MOSS, TERRACOTA];
const STOPS_2: RGB[] = [MOSS, TERRACOTA, GOLD, MOSS];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sample(stops: RGB[], p: number): RGB {
  const segments = stops.length - 1;
  const scaled = Math.min(Math.max(p, 0), 1) * segments;
  const i = Math.min(Math.floor(scaled), segments - 1);
  const t = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

export default function ScrollAmbience() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const root = document.documentElement;
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const [r1, g1, b1] = sample(STOPS_1, p);
      const [r2, g2, b2] = sample(STOPS_2, p);
      root.style.setProperty('--ambient-1', `rgba(${r1}, ${g1}, ${b1}, 0.12)`);
      root.style.setProperty('--ambient-2', `rgba(${r2}, ${g2}, ${b2}, 0.10)`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return null;
}
