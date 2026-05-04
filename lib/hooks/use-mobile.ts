/**
 * @module use-mobile
 * @description Hook para detectar se o dispositivo está em viewport mobile.
 * Usa `matchMedia` para reatividade a mudanças de tamanho da janela.
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileView /> : <DesktopView />;
 * ```
 */

'use client';

import { useState, useEffect } from 'react';

/** Breakpoint que define a fronteira mobile/desktop (em pixels) */
const MOBILE_BREAKPOINT = 768;

/**
 * Retorna `true` quando a viewport é menor que o breakpoint mobile.
 * Reage automaticamente a mudanças de tamanho da janela.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mql.matches);

    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
