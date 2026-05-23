'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Loader2, Plus, Search, Users } from 'lucide-react';
import CreatePetitionModal from '@/components/CreatePetitionModal';
import SignatureButton from '@/features/peticoes/SignatureButton';
import SignatureProgress from '@/features/peticoes/SignatureProgress';
import { useToast } from '@/lib/toast-context';
import { getActivePetitions } from '@/services/petitions.service';
import type { Petition } from '@/types';

export default function PeticoesPage() {
  const { toast } = useToast();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadPetitions = () => {
    setLoading(true);
    getActivePetitions()
      .then(setPetitions)
      .catch((error) => {
        console.error('[peticoes] erro ao carregar peticoes', error);
        toast('Nao foi possivel carregar as peticoes.', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPetitions();
  }, []);

  const filteredPetitions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return petitions;
    return petitions.filter((petition) =>
      `${petition.title} ${petition.description} ${petition.category}`.toLowerCase().includes(search)
    );
  }, [petitions, query]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-7 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:px-10 md:py-10 lg:px-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Users className="h-4 w-4" />
              Participacao cidada
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-normal text-text-main md:text-5xl">
              Peticoes publicas
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
              Apoie causas abertas pela comunidade ou proponha uma nova peticao para mobilizar a cidade.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Nova peticao
          </button>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por titulo, categoria ou descricao"
              className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium text-text-main outline-none transition focus:border-primary"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPetitions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-black text-text-main">Nenhuma peticao encontrada</h2>
            <p className="mt-2 text-sm font-medium text-text-muted">
              Crie uma nova peticao ou tente outro termo de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredPetitions.map((petition) => (
              <article key={petition.id} className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      {petition.category}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      por {petition.creatorName}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-black tracking-normal text-text-main">
                    {petition.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-text-muted">
                    {petition.description}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <SignatureProgress current={petition.signaturesCount} goal={petition.goal} />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SignatureButton
                      petitionId={petition.id}
                      petitionTitle={petition.title}
                      onSign={loadPetitions}
                      className="flex-1"
                    />
                    <Link
                      href={`/peticoes/${petition.id}`}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                    >
                      Detalhes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <CreatePetitionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadPetitions}
      />
    </div>
  );
}
