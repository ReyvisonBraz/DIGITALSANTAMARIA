'use client';

import React from 'react';
import { Car, AlertTriangle } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { TrafficAlert } from '@/types';

/**
 * TransitoPage — Alertas de trânsito, obras e condições das vias.
 *
 * Carrega dados da coleção Firestore 'traffic_alerts' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function TransitoPage() {
  const { data, loading, error, refresh } = useContent<TrafficAlert>('traffic_alerts');

  const severityColors: Record<string, string> = {
    baixa: 'bg-blue-100 text-blue-700 border border-blue-200',
    media: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    alta: 'bg-orange-100 text-orange-700 border border-orange-200',
    critica: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Car}
        label="Mobilidade"
        title="Trânsito em Tempo Real"
        subtitle="Alertas de trânsito, obras e condições das vias."
        color="bg-orange-500"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum alerta de trânsito no momento."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.type, color: 'bg-orange-500/10 text-orange-600 border border-orange-500/20' }}
              status={item.severity}
              statusColor={severityColors[item.severity]}
              address={item.location}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
