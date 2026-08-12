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
        className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3"
        role="status"
        aria-label="Carregando conteúdo"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="min-h-52 rounded-[1.4rem] border border-border/70 bg-white/65 p-6 shadow-[0_10px_34px_rgba(20,34,74,0.04)]">
            <div className="h-3 w-20 animate-pulse rounded-full bg-primary/10" />
            <div className="mt-6 h-7 w-3/4 animate-pulse rounded-lg bg-slate-200/80" />
            <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-slate-200/70" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-slate-200/70" />
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-primary">
              {index === 0 && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>
        ))}
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
        className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-rose-100 bg-white/65 px-6 py-16 text-center shadow-[0_12px_34px_rgba(20,34,74,0.05)]"
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
            className="action-button-primary min-h-11 px-5 py-2.5 text-[11px] uppercase tracking-widest"
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
        className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-border bg-white/65 px-6 py-16 text-center shadow-[0_12px_34px_rgba(20,34,74,0.05)]"
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
