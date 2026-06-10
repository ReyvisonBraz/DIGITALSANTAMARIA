'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, Clock } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Event } from '@/types';

export default function EventoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = () => {
    setLoading(true);
    setError(null);
    getDoc(doc(db, 'events', id))
      .then((snap) => {
        if (!snap.exists()) {
          setEvent(null);
        } else {
          const data = snap.data() as Event;
          if (data.deletedAt) {
            setEvent(null);
          } else {
            setEvent({ ...data, id: snap.id });
          }
        }
      })
      .catch(() => setError('Erro ao carregar o evento.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="page-shell">
      <main className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <ContentPage
          loading={loading}
          error={error}
          onRetry={fetchEvent}
          emptyMessage="Evento não encontrado."
        >
          {!loading && !error && !event ? null : event && (
            <>
              <ContentHero icon={CalendarDays} label={event.category} title={event.title} subtitle={`${event.date} às ${event.time} — ${event.location}`} accent="accent" />
              <ContentCard
                title={event.title}
                description={event.description}
                imageURL={event.imageURL}
                date={event.date}
                time={event.time}
                address={event.address}
                badge={{ text: event.isFree ? 'Gratuito' : event.price, color: event.isFree ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800' }}
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
