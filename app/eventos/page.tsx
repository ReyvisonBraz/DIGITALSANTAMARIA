'use client';

import React from 'react';
import { CalendarDays, PartyPopper } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Event } from '@/types';

/**
 * EventosPage — Shows, feiras, oficinas e atividades gratuitas na cidade.
 *
 * Carrega dados da coleção Firestore 'events' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function EventosPage() {
  const { data, loading, error, refresh } = useContent<Event>('events');

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={CalendarDays}
        label="Agenda Cultural"
        title="Eventos 2026"
        subtitle="Shows, feiras, oficinas e atividades gratuitas na cidade."
        accent="primary-dark"
      />

      <ContentPage
        isEmpty={data.length === 0}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum evento programado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageURL={item.imageURL || null}
              badge={{ text: item.category, color: 'bg-purple-500/10 text-purple-600 border border-purple-500/20' }}
              date={item.date}
              time={item.time}
              address={item.location}
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
