/**
 * @module utils
 * @description Utilitário de mesclagem de classes CSS.
 * Combina `clsx` (composição condicional) com `twMerge` (resolução de conflitos Tailwind).
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', isActive && 'bg-primary text-white', className)
 * // Resultado: resolve conflitos de Tailwind automaticamente
 * ```
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
