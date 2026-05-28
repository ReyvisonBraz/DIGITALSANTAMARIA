'use client';

import React from 'react';
import { Landmark, DollarSign } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { TaxRecord } from '@/types';

/**
 * TributosPage — IPTU, ISS, certidões e serviços da fazenda municipal.
 *
 * Carrega dados da coleção Firestore 'tax_records' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function TributosPage() {
  const { data, loading, error, refresh } = useContent<TaxRecord>('tax_records');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Landmark}
        label="Finanças"
        title="Tributos Municipais"
        subtitle="IPTU, ISS, certidões e serviços da fazenda municipal."
        accent="accent"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum tributo cadastrado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.type, color: 'bg-cyan-600/10 text-cyan-600 border border-cyan-600/20' }}
              stats={[
                { label: 'Ano', value: item.year },
                { label: 'Vencimento', value: item.dueDate },
              ]}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
