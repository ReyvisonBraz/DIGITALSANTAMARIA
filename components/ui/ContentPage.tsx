'use client';

import React from 'react';
import { Loader2, AlertTriangle, Inbox, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * ContentPage — Wrapper universal para qualquer página de conteúdo.
 *
 * Gerencia 4 estados automaticamente:
 * 1. loading  → spinner centralizado
 * 2. error    → alerta com botão de retry
 * 3. empty    → mensagem amigável com ícone (requer isEmpty={data.length === 0})
 * 4. success  → renderiza children
 *
 * Uso:
 * ```tsx
 * <ContentPage
 *   loading={loading}
 *   error={error}
 *   isEmpty={data.length === 0}
 *   emptyMessage="Nenhum item."
 *   onRetry={fetch}
 * >
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </ContentPage>
 * ```
 *
 * Nota: `isEmpty` deve ser sempre fornecido explicitamente. Depender de
 * `children` para detectar estado vazio é não confiável porque children
 * pode ser um wrapper <div> mesmo quando não há itens dentro.
 */

interface ContentPageProps {
  loading: boolean;
  error: string | null;
  /** Deve ser `data.length === 0`. Controla o empty state de forma explícita. */
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function ContentPage({
  loading,
  error,
  isEmpty,
  emptyMessage = 'Nenhum conteúdo disponível.',
  emptyIcon,
  onRetry,
  className,
  children,
}: ContentPageProps) {
  /* ── Loading State ─────────────────────────────── */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        role="status"
        aria-label="Carregando conteúdo"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  /* ── Error State ───────────────────────────────── */
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6"
        role="alert"
      >
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border-2 border-rose-100">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold text-text-main uppercase tracking-tight">Erro ao carregar</p>
        <p className="text-xs font-medium text-text-muted max-w-xs">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar Novamente
          </button>
        )}
      </motion.div>
    );
  }

  /* ── Empty State ───────────────────────────────── */
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6"
      >
        <div className="w-16 h-16 bg-surface border-2 border-border rounded-2xl flex items-center justify-center text-text-muted">
          {emptyIcon ?? <Inbox className="w-8 h-8" />}
        </div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">{emptyMessage}</p>
      </motion.div>
    );
  }

  /* ── Success State ─────────────────────────────── */
  return <div className={cn('space-y-6', className)}>{children}</div>;
}
