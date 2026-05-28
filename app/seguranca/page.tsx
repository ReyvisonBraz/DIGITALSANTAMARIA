'use client';

import React from 'react';
import { Shield, Siren } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { SafetyZone } from '@/types';

/**
 * SegurancaPage — Delegacias, postos policiais e serviços de emergência.
 *
 * Carrega dados da coleção Firestore 'safety_zones' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function SegurancaPage() {
  const { data, loading, error, refresh } = useContent<SafetyZone>('safety_zones');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Shield}
        label="Proteção"
        title="Rede de Segurança"
        subtitle="Delegacias, postos policiais e serviços de emergência."
        accent="primary-dark"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum ponto de segurança cadastrado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.type, color: 'bg-red-600/10 text-red-600 border border-red-600/20' }}
              address={item.address}
              phone={item.emergencyPhone}
              extra={
                item.is24h ? (
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-semibold uppercase tracking-widest mt-2 border border-emerald-200">
                    24h
                  </span>
                ) : null
              }
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
