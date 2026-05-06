'use client';

import React from 'react';
import { Layers, FolderOpen } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { PublicService } from '@/types';

/**
 * ServicosPage — Todos os serviços municipais em um só lugar.
 *
 * Carrega dados da coleção Firestore 'public_services' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function ServicosPage() {
  const { data, loading, error, refresh } = useContent<PublicService>('public_services');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Layers}
        label="Catálogo"
        title="Serviços Públicos"
        subtitle="Todos os serviços municipais em um só lugar."
        color="bg-teal-500"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum serviço disponível."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.category, color: 'bg-teal-500/10 text-teal-600 border border-teal-500/20' }}
              address={item.address}
              phone={item.phone}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
