/**
 * @module use-click-outside
 * @description Hook para detectar cliques fora de um elemento referenciado.
 * Útil para fechar dropdowns, popovers e menus.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 * return <div ref={ref}>Conteúdo</div>;
 * ```
 */

'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Dispara um callback quando o usuário clica fora do elemento referenciado.
 *
 * @param ref - Referência ao elemento DOM a ser monitorado
 * @param handler - Callback executado no clique externo
 * @param enabled - Se `false`, o listener não é registrado (default: `true`)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;

      // Ignora se o clique foi dentro do elemento ou seus filhos
      if (!el || el.contains(event.target as Node)) return;

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
