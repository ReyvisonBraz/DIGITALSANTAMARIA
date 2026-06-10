'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, HardHat } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import type { Work } from '@/types';

export default function ObraDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWork = () => {
    setLoading(true);
    setError(null);
    getDoc(doc(db, 'works', id))
      .then((snap) => {
        if (!snap.exists()) {
          setWork(null);
        } else {
          const data = snap.data() as Work;
          if (data.deletedAt) {
            setWork(null);
          } else {
            setWork({ ...data, id: snap.id });
          }
        }
      })
      .catch(() => setError('Erro ao carregar a obra.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWork();
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
          onRetry={fetchWork}
          emptyMessage="Obra não encontrada."
        >
          {!loading && !error && !work ? null : work && (
            <>
              <ContentHero icon={HardHat} label={work.category} title={work.title} subtitle={work.neighborhood} accent="primary-dark" />
              <ContentCard
                title={work.title}
                description={work.description}
                imageURL={work.imageURL}
                address={work.address}
                badge={{ text: `${work.progress}% concluído`, color: 'bg-blue-100 text-blue-800' }}
                stats={[
                  { label: 'Orçamento', value: `R$ ${work.budget.toLocaleString('pt-BR')}` },
                  { label: 'Início', value: work.startDate },
                  { label: 'Previsão', value: work.endDate },
                  { label: 'Contratada', value: work.contractor },
                ]}
              />
            </>
          )}
        </ContentPage>
      </main>
    </div>
  );
}
