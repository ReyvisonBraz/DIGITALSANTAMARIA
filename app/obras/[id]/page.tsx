'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, HardHat, Building2, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Work } from '@/types';

/**
 * ObraDetalhesPage — Detalhes completos de uma obra pública.
 *
 * Carrega os dados da obra específica via useContent() e exibe
 * informações completas com ContentHero + ContentCard.
 */

export default function ObraDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refresh } = useContent<Work>('works');
  const work = data.find((w) => w.id === id) || null;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <ContentHero
        icon={HardHat}
        label="Infraestrutura"
        title={work?.title || 'Obra'}
        subtitle={work?.description || 'Carregando detalhes da obra...'}
        color="bg-amber-500"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Obra não encontrada."
      >
        {work && (
          <ContentCard
            key={work.id}
            title={work.title}
            description={work.description}
            imageURL={work.imageURL || null}
            badge={{ text: work.category, color: 'bg-amber-500/10 text-amber-600 border border-amber-500/20' }}
            status={work.progress >= 100 ? 'Concluída' : 'Em andamento'}
            address={work.address}
            stats={[
              { label: 'Progresso', value: `${work.progress}%` },
              { label: 'Orçamento', value: `R$ ${work.budget.toLocaleString('pt-BR')}` },
              { label: 'Início', value: work.startDate },
              { label: 'Previsão', value: work.endDate },
            ]}
            extra={
              <div className="space-y-3 pt-2">
                <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${work.progress}%` }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-text-muted uppercase">
                  Contratada: {work.contractor}
                </p>
                <p className="text-[10px] font-semibold text-text-muted uppercase">
                  Bairro: {work.neighborhood}
                </p>
              </div>
            }
          />
        )}
      </ContentPage>

    </div>
  );
}
