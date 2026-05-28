'use client';

import React from 'react';
import { Vote, Gavel } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Poll } from '@/types';

/**
 * VotosPage — Orçamento participativo, consultas públicas e projetos de lei.
 *
 * Carrega dados da coleção Firestore 'polls' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function VotosPage() {
  const { data, loading, error, refresh } = useContent<Poll>('polls');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Gavel}
        label="Democracia"
        title="Votações Cidadãs"
        subtitle="Orçamento participativo, consultas públicas e projetos de lei."
        accent="primary"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhuma votação ativa no momento."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.category, color: 'bg-violet-600/10 text-violet-600 border border-violet-600/20' }}
              status={item.isActive ? 'Ativa' : 'Encerrada'}
              statusColor={item.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}
              stats={[
                { label: 'Votos', value: item.totalVotes },
                { label: 'Opções', value: item.options.length },
              ]}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
