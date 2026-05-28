'use client';

import React from 'react';
import { Store, ShoppingBag } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Business } from '@/types';

/**
 * ComercioPage — Vitrine de produtores e negócios de Santa Maria do Pará.
 *
 * Carrega dados da coleção Firestore 'businesses' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function ComercioPage() {
  const { data, loading, error, refresh } = useContent<Business>('businesses');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Store}
        label="Economia Local"
        title="Comércio Local"
        subtitle="Vitrine de produtores e negócios de Santa Maria do Pará."
        accent="accent"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum comércio cadastrado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageURL={item.imageURL || null}
              badge={{ text: item.category, color: 'bg-blue-500/10 text-blue-600 border border-blue-500/20' }}
              address={item.address}
              phone={item.phone}
              status={item.isOpen ? 'Aberto' : 'Fechado'}
              statusColor={item.isOpen ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
