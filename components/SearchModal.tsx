/**
 * @module SearchModal
 * @description Modal de busca global do portal.
 *
 * Funcionalidades:
 * - Busca por texto em todos os serviços
 * - Filtros por categoria (Protocolos, Petições, Saúde, Cultura)
 * - Atalho ESC para fechar
 * - Autofoco no campo de busca ao abrir
 * - Bloqueio de scroll do body enquanto aberto
 *
 * @example
 * ```tsx
 * <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, X, ArrowRight, MapPin, Store,
  Briefcase, Heart, MessageSquare, Calendar,
  DollarSign, Navigation, School, HardHat
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';

const log = createLogger('SearchModal');

// ─── Tipos ──────────────────────────────────────────────────────────

/** Item de resultado de busca */
interface SearchResult {
  /** Identificador único */
  id: string;
  /** Título exibido ao usuário */
  title: string;
  /** Categoria para filtro e badge */
  category: string;
  /** Rota de destino */
  href: string;
  /** Ícone representativo */
  icon: LucideIcon;
}

// ─── Dados estáticos ────────────────────────────────────────────────

/** Resultados de busca mockados (substituir por API real no futuro) */
const MOCK_RESULTS: readonly SearchResult[] = [
  { id: '1', title: 'Relatar Buraco na Rua', category: 'Zeladoria', href: '/relatar', icon: MessageSquare },
  { id: '2', title: 'Unidade de Saúde Centro', category: 'Saúde', href: '/saude', icon: Heart },
  { id: '3', title: 'Vagas de Analista', category: 'Empregos', href: '/empregos', icon: Briefcase },
  { id: '4', title: 'Mercado Municipal', category: 'Comércio', href: '/comercio', icon: Store },
  { id: '5', title: 'Inscrição Escolar 2026', category: 'Educação', href: '/educacao', icon: School },
  { id: '6', title: 'Segunda Via IPTU', category: 'Tributos', href: '/tributos', icon: DollarSign },
  { id: '7', title: 'Festival de Música', category: 'Cultura', href: '/eventos', icon: Calendar },
  { id: '8', title: 'Horário de Ônibus', category: 'Trânsito', href: '/transito', icon: Navigation },
  { id: '9', title: 'Andamento de Obras', category: 'Transparência', href: '/obras', icon: HardHat },
  { id: '10', title: 'Petição Pavimentação', category: 'Petições', href: '/peticoes', icon: ArrowRight },
] as const;

/** Filtros disponíveis */
const FILTERS = ['Todas', 'Protocolos', 'Petições', 'Saúde', 'Cultura'] as const;

// ─── Props ──────────────────────────────────────────────────────────

interface SearchModalProps {
  /** Se `true`, o modal está visível */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
}

// ─── Componente ─────────────────────────────────────────────────────

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Todas');

  /** Ref para salvar o overflow original do body */
  const previousOverflowRef = useRef<string>('');

  // Atalho ESC para fechar
  useKeyboardShortcut('Escape', () => handleClose(), { enabled: isOpen });

  // ─── Lógica de filtro ─────────────────────────────────────────

  /** Filtra resultados por categoria e query de texto */
  const results = useMemo(() => {
    let filtered: readonly SearchResult[] = MOCK_RESULTS;

    // Filtra por categoria
    if (activeFilter !== 'Todas') {
      filtered = MOCK_RESULTS.filter(r => r.category === activeFilter);
    }

    // Filtra por texto (mínimo 2 caracteres)
    if (query.length > 1) {
      const normalizedQuery = query.toLowerCase();
      return filtered.filter(r =>
        r.title.toLowerCase().includes(normalizedQuery) ||
        r.category.toLowerCase().includes(normalizedQuery)
      );
    }

    // Sem query: mostra resultados apenas se um filtro está ativo
    return activeFilter === 'Todas' ? [] : [...filtered];
  }, [query, activeFilter]);

  // ─── Effects ──────────────────────────────────────────────────

  /** Bloqueia scroll do body ao abrir, restaura ao fechar */
  useEffect(() => {
    if (isOpen) {
      log.info('Search modal opened');
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflowRef.current;
    }

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isOpen]);

  // ─── Handlers ─────────────────────────────────────────────────

  /** Fecha o modal e limpa o estado de busca */
  const handleClose = useCallback(() => {
    log.info('Search modal closed', { queryLength: query.length });
    setQuery('');
    setActiveFilter('Todas');
    onClose();
  }, [query.length, onClose]);

  // ─── Render ───────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Busca global de serviços"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-text-main/40 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Painel de busca */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border-2 border-border overflow-hidden"
      >
        {/* ── Campo de busca e filtros ──────────────────────── */}
        <div className="p-6 border-b-2 border-border">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-primary" aria-hidden="true" />
            <input
              autoFocus
              placeholder="O que você está procurando hoje?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface border-2 border-border pl-14 pr-12 py-5 rounded-2xl font-bold text-lg outline-none focus:border-primary transition-all shadow-inner"
              aria-label="Campo de busca"
            />
            <button
              onClick={handleClose}
              className="absolute right-4 p-2 hover:bg-border rounded-xl transition-colors"
              aria-label="Fechar busca"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* Filtros por categoria */}
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2" role="tablist" aria-label="Filtrar por categoria">
             {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2",
                    activeFilter === f
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                      : "bg-surface border-border text-text-muted hover:border-primary/30"
                  )}
                  role="tab"
                  aria-selected={activeFilter === f}
                >
                   {f}
                </button>
             ))}
          </div>
        </div>

        {/* ── Lista de resultados ───────────────────────────── */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar" role="listbox">
          {query.length === 0 && activeFilter === 'Todas' ? (
            /* Estado vazio — instrução ao usuário */
            <div className="p-8 text-center space-y-4">
              <div className="p-4 bg-surface rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted/70" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-text-main uppercase tracking-widest text-sm">Busca Global</p>
                <p className="text-xs text-text-muted font-ui">Digite pelo menos 2 caracteres para pesquisar em todo o portal.</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Resultados encontrados */
            <div className="space-y-2">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 mb-4">
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.href}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all group"
                  role="option"
                >
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center group-hover:bg-white border-2 border-border transition-colors">
                    <result.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-text-main uppercase text-sm tracking-tight">{result.title}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{result.category}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            /* Nenhum resultado */
            <div className="p-12 text-center text-text-muted">
              <p className="font-black">Nenhum resultado para &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        {/* ── Rodapé com dicas ──────────────────────────────── */}
        <div className="p-4 bg-surface-container border-t-2 border-border flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
          <span>Dica: Use termos curtos como &quot;Saúde&quot; ou &quot;Luz&quot;</span>
          <div className="flex gap-4">
             <span className="flex items-center gap-1">
               <kbd className="bg-white border-2 border-border px-1.5 py-0.5 rounded-md text-[8px]">ESC</kbd> Fechar
             </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
