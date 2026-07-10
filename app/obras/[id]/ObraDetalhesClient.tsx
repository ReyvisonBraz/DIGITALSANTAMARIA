'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, HardHat } from 'lucide-react';
import { useContentItem } from '@/lib/hooks/use-content-item';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Work } from '@/types';

export default function ObraDetalhesClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { item: work, loading, error, refresh } = useContentItem<Work>('works', id);

  return (
    <div className="page-shell">
      <main className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition hover:text-primary"
          aria-label="Voltar para lista de obras"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <ContentPage
          loading={loading}
          error={error}
          isEmpty={!work}
          onRetry={refresh}
          emptyMessage="Obra não encontrada."
        >
          {work && (
            <>
              <ContentHero
                icon={HardHat}
                label={work.category}
                title={work.title}
                subtitle={work.neighborhood}
                accent="primary-dark"
              />
              <ContentCard
                title={work.title}
                description={work.description}
                imageURL={work.imageURL}
                address={work.address}
                badge={{
                  text: `${work.progress}% concluído`,
                  color: 'bg-blue-100 text-blue-800',
                }}
                stats={[
                  { label: 'Orçamento', value: `R$ ${work.budget.toLocaleString('pt-BR')}` },
                  { label: 'Início', value: work.startDate },
                  { label: 'Previsão', value: work.endDate },
                  { label: 'Contratada', value: work.contractor },
                ]}
              />
            </>
          )}
        </ContentPage>
      </main>
    </div>
  );
}
