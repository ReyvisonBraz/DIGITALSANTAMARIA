'use client';

import React from 'react';
import { Heart, Users } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { SocialProgram } from '@/types';

/**
 * SocialPage — Programas de habitação, CRAS, Cadastro Único e assistência.
 *
 * Carrega dados da coleção Firestore 'social_programs' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function SocialPage() {
  const { data, loading, error, refresh } = useContent<SocialProgram>('social_programs');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Heart}
        label="Assistência"
        title="Cuidado Social"
        subtitle="Programas de habitação, CRAS, Cadastro Único e assistência."
        accent="accent-success"
      />

      <ContentPage
        isEmpty={data.length === 0}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum programa social cadastrado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.category, color: 'bg-pink-500/10 text-pink-600 border border-pink-500/20' }}
              address={item.address}
              phone={item.phone}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
