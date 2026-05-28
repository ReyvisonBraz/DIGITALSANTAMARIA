'use client';

import React from 'react';
import { Leaf, TreePine } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { EnvironmentData } from '@/types';

/**
 * MeioAmbientePage — Coleta seletiva, áreas verdes e denúncias ambientais.
 *
 * Carrega dados da coleção Firestore 'environment_data' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function MeioAmbientePage() {
  const { data, loading, error, refresh } = useContent<EnvironmentData>('environment_data');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Leaf}
        label="Sustentabilidade"
        title="Meio Ambiente"
        subtitle="Coleta seletiva, áreas verdes e denúncias ambientais."
        accent="accent-success"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhuma informação ambiental disponível."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.category, color: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' }}
              stats={[
                { label: 'Dias de coleta', value: item.days.join(', ') },
              ]}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
