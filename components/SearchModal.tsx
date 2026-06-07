'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createLogger } from '@/lib/logger';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const log = createLogger('SearchModal');

interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: LucideIcon;
}

const EXTRA_RESULTS: readonly SearchResult[] = [
  { id: 'extra-matricula', title: 'Matricula escolar', category: 'Educacao', href: '/educacao/matricula', icon: ArrowRight },
  { id: 'extra-protocolo', title: 'Consultar protocolo', category: 'Atendimento', href: '/perfil', icon: Search },
];

const RESULTS: readonly SearchResult[] = [
  ...NAV_LINKS.map((link) => ({
    id: link.href,
    title: link.label,
    category: link.category,
    href: link.href,
    icon: link.icon,
  })),
  ...EXTRA_RESULTS,
] as const;

const FILTERS = ['Todas', ...Array.from(new Set(RESULTS.map((result) => result.category)))] as const;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const previousOverflowRef = useRef('');

  const handleClose = useCallback(() => {
    log.info('Search modal closed', { queryLength: query.length });
    setQuery('');
    setActiveFilter('Todas');
    onClose();
  }, [onClose, query.length]);

  useKeyboardShortcut('Escape', handleClose, { enabled: isOpen });

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

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    const byFilter = activeFilter === 'Todas'
      ? RESULTS
      : RESULTS.filter((result) => result.category === activeFilter);

    if (search.length < 2) return activeFilter === 'Todas' ? [] : byFilter;

    return byFilter.filter((result) =>
      `${result.title} ${result.category}`.toLowerCase().includes(search)
    );
  }, [activeFilter, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 md:pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Busca global de servicos"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-primary-dark/30 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl"
          >
            <div className="border-b border-border p-4 md:p-5">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-primary" />
                <input
                  autoFocus
                  placeholder="O que voce esta procurando?"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-13 w-full rounded-xl border border-border bg-surface py-4 pl-12 pr-12 text-base font-bold outline-none transition focus:border-primary"
                  aria-label="Campo de busca"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-3 rounded-lg p-2 text-text-muted transition hover:bg-border"
                  aria-label="Fechar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar busca por categoria">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      'shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition',
                      activeFilter === filter
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-text-muted hover:border-primary hover:text-primary'
                    )}
                    role="tab"
                    aria-selected={activeFilter === filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto p-3 md:p-4" role="listbox">
              {query.length === 0 && activeFilter === 'Todas' ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                    <Search className="h-7 w-7 text-text-muted" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-text-main">Busca global</p>
                  <p className="mt-1 text-sm font-medium text-text-muted">Digite pelo menos 2 caracteres ou escolha um filtro.</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    {results.length} resultado{results.length !== 1 ? 's' : ''}
                  </p>
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={handleClose}
                      className="group flex items-center gap-4 rounded-xl border border-transparent p-3 transition hover:border-primary/20 hover:bg-primary/5"
                      role="option"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                        <result.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold uppercase tracking-normal text-text-main">{result.title}</span>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary">{result.category}</span>
                      </span>
                      <ArrowRight className="h-5 w-5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <p className="font-semibold">Nenhum resultado para &quot;{query}&quot;</p>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-surface-container p-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Dica: busque por protocolo, peticoes, saude ou tributos.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
