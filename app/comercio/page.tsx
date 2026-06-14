'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCcw, Store } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentHero from '@/components/ui/ContentHero';
import BusinessCard from '@/features/comercio/BusinessCard';
import { cn } from '@/lib/utils';
import type { Business } from '@/types';

const CATEGORIES: { value: Business['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'restaurante', label: 'Restaurantes' },
  { value: 'farmacia', label: 'Farmácias' },
  { value: 'mercado', label: 'Mercados' },
  { value: 'servico', label: 'Serviços' },
  { value: 'loja', label: 'Lojas' },
  { value: 'outros', label: 'Outros' },
];

export default function ComercioPage() {
  const { data, loading, error, refresh } = useContent<Business>('businesses');
  const [category, setCategory] = useState<Business['category'] | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return data;
    return data.filter((business) => business.category === category);
  }, [data, category]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 p-4 pb-32 md:p-12">
      <ContentHero
        icon={Store}
        label="Economia local"
        title="Comércio Local"
        subtitle="Restaurantes, farmácias, lojas e serviços de Santa Maria do Pará: fale direto no WhatsApp."
        accent="accent"
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((option) => {
          const active = option.value === category;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              className={cn(
                'inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition',
                active
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-border bg-white text-text-muted hover:border-primary hover:text-primary',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24" role="status">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="sr-only">Carregando...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-rose-100 bg-rose-50 text-rose-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-tight text-text-main">Erro ao carregar</p>
          <p className="max-w-xs text-xs font-medium text-text-muted">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:brightness-110"
          >
            <RefreshCcw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-border bg-surface text-text-muted">
            <Inbox className="h-8 w-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {category === 'all'
              ? 'Nenhum comércio cadastrado ainda.'
              : 'Nenhum negocio nesta categoria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
