/**
 * @module use-keyboard-shortcut
 * @description Hook para registrar atalhos de teclado globais.
 *
 * @example
 * ```tsx
 * // Fechar modal com ESC
 * useKeyboardShortcut('Escape', handleClose);
 *
 * // Abrir busca com Cmd+K / Ctrl+K
 * useKeyboardShortcut('k', handleSearch, { meta: true });
 * ```
 */

'use client';

import { useEffect, useCallback } from 'react';

/** Opções de modificadores para o atalho */
interface ShortcutOptions {
  /** Requer Ctrl (Windows/Linux) */
  ctrl?: boolean;
  /** Requer Meta/Cmd (Mac) ou Ctrl (Windows) — combinação universal */
  meta?: boolean;
  /** Requer Shift */
  shift?: boolean;
  /** Requer Alt */
  alt?: boolean;
  /** Se `false`, o atalho fica desativado (default: `true`) */
  enabled?: boolean;
}

/**
 * Registra um atalho de teclado global.
 *
 * @param key - Valor da tecla (event.key), ex: 'Escape', 'k', 'Enter'
 * @param callback - Função executada quando o atalho é pressionado
 * @param options - Modificadores e configurações opcionais
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
): void {
  const { ctrl, meta, shift, alt, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignora quando o foco está em inputs/textareas (exceto ESC)
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput && key !== 'Escape') return;

      // Verifica a tecla
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      // Verifica modificadores
      if (ctrl && !event.ctrlKey) return;
      if (meta && !(event.metaKey || event.ctrlKey)) return; // Cmd no Mac, Ctrl no Windows
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;

      event.preventDefault();
      callback();
    },
    [key, callback, ctrl, meta, shift, alt]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
