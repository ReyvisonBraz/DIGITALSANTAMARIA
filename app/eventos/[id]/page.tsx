'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Event } from '@/types';

/**
 * EventoDetalhesPage — Detalhes completos de um evento.
 *
 * Carrega os dados do evento específico via useContent() e exibe
 * informações completas com ContentHero + ContentCard.
 */

export default function EventoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refresh } = useContent<Event>('events');
  const event = data.find((e) => e.id === id) || null;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <ContentHero
        icon={CalendarDays}
        label="Agenda Cultural"
        title={event?.title || 'Evento'}
        subtitle={event?.description || 'Carregando detalhes do evento...'}
        accent="primary-dark"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Evento não encontrado."
      >
        {event && (
          <ContentCard
            key={event.id}
            title={event.title}
            description={event.description}
            imageURL={event.imageURL || null}
            badge={{ text: event.category, color: 'bg-purple-500/10 text-purple-600 border border-purple-500/20' }}
            status={event.isFree ? 'Gratuito' : event.price}
            date={event.date}
            time={event.time}
            address={event.location}
            stats={[
              { label: 'Confirmados', value: event.attendeesCount },
            ]}
            extra={
              <div className="pt-2">
                <p className="text-[10px] font-semibold text-text-muted uppercase">
                  Organizador: {event.organizer}
                </p>
              </div>
            }
          />
        )}
      </ContentPage>

    </div>
  );
}
