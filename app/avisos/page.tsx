'use client';

import React from 'react';
import { Bell, Radio } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Notice } from '@/types';

/**
 * AvisosPage — Alertas oficiais da prefeitura e notícias de utilidade pública.
 *
 * Carrega dados da coleção Firestore 'notices' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function AvisosPage() {
  const { data, loading, error, refresh } = useContent<Notice>('notices');

  const priorityColors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-700 border border-blue-200',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    high: 'bg-orange-100 text-orange-700 border border-orange-200',
    critical: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Bell}
        label="Comunicados"
        title="Avisos e Alertas"
        subtitle="Alertas oficiais da prefeitura e notícias de utilidade pública."
        accent="primary-dark"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum aviso ativo."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.type, color: 'bg-red-500/10 text-red-600 border border-red-500/20' }}
              status={item.priority}
              statusColor={priorityColors[item.priority]}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
