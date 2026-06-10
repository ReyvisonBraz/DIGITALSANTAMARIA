'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, FileQuestion, Loader2, Share2, ShieldCheck } from 'lucide-react';
import SignatureButton from '@/features/peticoes/SignatureButton';
import SignatureProgress from '@/features/peticoes/SignatureProgress';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import { listenToPetition } from '@/services/petitions.service';
import type { Petition } from '@/types';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;
    setLoading(true);
    setError(null);

    const unsubscribe = listenToPetition(
      id,
      (data) => {
        if (!data) {
          setError('Peticao nao encontrada.');
          toast('Peticao nao encontrada.', 'error');
        } else {
          setPetition(data);
          setError(null);
        }
        setLoading(false);
      },
      () => {
        setError('Nao foi possivel carregar a peticao.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [params.id, toast]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copiado.', 'info');
    } catch {
      toast('Nao foi possivel copiar o link automaticamente.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <FileQuestion className="h-12 w-12 text-text-muted" />
        <h2 className="text-xl font-semibold text-text-main">Peticao nao encontrada</h2>
        <p className="text-sm font-medium text-text-muted">{error || 'Verifique o link e tente novamente.'}</p>
        <Link href="/peticoes" className="text-sm font-bold text-primary hover:underline">
          Voltar para peticoes
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-7 sm:px-6 md:px-10 lg:grid-cols-[1fr_360px] lg:px-12">
        <section className="glass-panel p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/peticoes"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {petition.category}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-text-muted">
                <CalendarDays className="h-4 w-4" />
                {formatDate(petition.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-normal text-text-main md:text-5xl">
              {petition.title}
            </h1>

            <p className="text-sm font-bold text-text-muted">
              Proposta por {petition.creatorName}
            </p>

            <div className="rounded-xl border border-border bg-white/70 p-5 text-base font-medium leading-7 text-text-muted shadow-inner">
              {petition.description}
            </div>

            {petition.officialReply && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                  Resposta oficial
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-green-900">
                  {petition.officialReply}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glass-panel p-5 lg:sticky lg:top-28">
            <SignatureProgress current={petition.signaturesCount} goal={petition.goal} />

            <div className="mt-5">
              <SignatureButton
                petitionId={petition.id}
                petitionTitle={petition.title}
                onSign={() => {}}
                className="w-full"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-surface p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-medium leading-6 text-text-muted">
                A assinatura exige login para evitar duplicidade e preservar a integridade da consulta.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
