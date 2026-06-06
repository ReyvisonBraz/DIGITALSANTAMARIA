'use client';

import { Car } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { TrafficAlert } from '@/types';

export default function TransitoPage() {
  const { data, loading, error, refresh } = useContent<TrafficAlert>('traffic_alerts');

  const severityColors: Record<string, string> = {
    baixa: 'bg-blue-100 text-blue-700 border border-blue-200',
    media: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    alta: 'bg-orange-100 text-orange-700 border border-orange-200',
    critica: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 p-4 pb-32 md:p-12">
      <ContentHero
        icon={Car}
        label="Mobilidade"
        title="Trânsito em tempo real"
        subtitle="Alertas de trânsito, obras e condições das vias."
        accent="primary"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum alerta de trânsito no momento."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
