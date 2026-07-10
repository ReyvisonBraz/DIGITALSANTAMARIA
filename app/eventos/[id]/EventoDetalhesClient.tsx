'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useContentItem } from '@/lib/hooks/use-content-item';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Event } from '@/types';

export default function EventoDetalhesClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { item: event, loading, error, refresh } = useContentItem<Event>('events', id);

  return (
    <div className="page-shell">
      <main className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition hover:text-primary"
          aria-label="Voltar para lista de eventos"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <ContentPage
          loading={loading}
          error={error}
          isEmpty={!event}
          onRetry={refresh}
          emptyMessage="Evento não encontrado."
        >
          {event && (
            <>
              <ContentHero
                icon={CalendarDays}
                label={event.category}
                title={event.title}
                subtitle={`${event.date} às ${event.time} — ${event.location}`}
                accent="accent"
              />
              <ContentCard
                title={event.title}
                description={event.description}
                imageURL={event.imageURL}
                date={event.date}
                time={event.time}
                address={event.address}
                badge={{
                  text: event.isFree ? 'Gratuito' : event.price,
                  color: event.isFree
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800',
                }}
                stats={[
                  { label: 'Organizador', value: event.organizer },
                ]}
              />
            </>
          )}
        </ContentPage>
      </main>
    </div>
  );
}
