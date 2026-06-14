'use client';

import React from 'react';
import { Users, HeartHandshake } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { CommunityGroup } from '@/types';

/**
 * ComunidadePage — Grupos de bairro, fóruns e engajamento comunitário.
 *
 * Carrega dados da coleção Firestore 'community_groups' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function ComunidadePage() {
  const { data, loading, error, refresh } = useContent<CommunityGroup>('community_groups');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Users}
        label="Participação"
        title="Comunidade Viva"
        subtitle="Grupos de bairro, fóruns e engajamento comunitário."
        accent="accent-success"
      />

      <ContentPage
        isEmpty={data.length === 0}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum grupo ativo no momento."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageURL={item.imageURL || null}
              badge={{ text: item.neighborhood, color: 'bg-green-500/10 text-green-600 border border-green-500/20' }}
              stats={[
                { label: 'Membros', value: item.membersCount },
              ]}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
