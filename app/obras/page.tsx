'use client';

import React from 'react';
import { Building2, HardHat } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Work } from '@/types';

/**
 * ObrasPage — Acompanhe o progresso das obras em Santa Maria do Pará.
 *
 * Carrega dados da coleção Firestore 'works' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function ObrasPage() {
  const { data, loading, error, refresh } = useContent<Work>('works');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={HardHat}
        label="Infraestrutura"
        title="Obras Públicas"
        subtitle="Acompanhe o progresso das obras em Santa Maria do Pará."
        color="bg-amber-500"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhuma obra em andamento."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageURL={item.imageURL || null}
              badge={{ text: item.category, color: 'bg-amber-500/10 text-amber-600 border border-amber-500/20' }}
              address={item.address}
              extra={
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <span>Progresso</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase">
                    Orçamento: R$ {item.budget.toLocaleString('pt-BR')}
                  </p>
                </div>
              }
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
