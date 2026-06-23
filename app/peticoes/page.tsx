'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, FileText, Loader2, Plus, Search, Users } from 'lucide-react';
import SignatureButton from '@/features/peticoes/SignatureButton';
import SignatureProgress from '@/features/peticoes/SignatureProgress';
import CreatePetitionModal from '@/features/peticoes/CreatePetitionModal';
import { listenToActivePetitions } from '@/services/petitions.service';
import type { Petition } from '@/types';

export default function PeticoesPage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = listenToActivePetitions(
      (data) => {
        setPetitions(data);
        setLoading(false);
        setError(null);
      },
      () => {
        setError('Não foi possível carregar as petições.');
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value), 300);
  };

  const filteredPetitions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return petitions;
    return petitions.filter((petition) =>
      `${petition.title} ${petition.description} ${petition.category}`.toLowerCase().includes(search)
    );
  }, [petitions, query]);

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel relative grid w-full grid-cols-1 gap-5 p-5 sm:p-7 md:p-9">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative z-10">
            <div className="soft-chip">
              <Users className="h-4 w-4" />
              Participação cidadã
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal text-text-main md:text-6xl">
              Petições públicas
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
              Crie e apoie causas abertas pela comunidade para mobilizar a cidade.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-tertiary px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-tertiary/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Criar petição
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <div className="glass-panel p-4">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Buscar por título, categoria ou descrição"
                aria-label="Buscar petições"
                className="h-12 w-full rounded-xl border border-border bg-white/80 pl-10 pr-3 text-sm font-medium text-text-main shadow-inner outline-none transition focus:border-primary"
              />
          </label>
        </div>

        {loading ? (
          <div className="glass-panel flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass-panel flex min-h-64 flex-col items-center justify-center gap-4 p-8">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h2 className="text-xl font-semibold text-text-main">Erro ao carregar</h2>
            <p className="text-sm font-medium text-text-muted">{error}</p>
          </div>
        ) : filteredPetitions.length === 0 ? (
          <div className="glass-panel border-dashed p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-text-main">Nenhuma petição encontrada</h2>
            <p className="mt-2 text-sm font-medium text-text-muted">
              Tente outro termo de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredPetitions.map((petition) => (
              <article key={petition.id} className="civic-card flex flex-col p-5">
                <div className="relative z-10 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                      {petition.category}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      por {petition.creatorName}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-normal text-text-main">
                    {petition.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-text-muted">
                    {petition.description}
                  </p>
                </div>

                <div className="relative z-10 mt-5 space-y-4">
                  <SignatureProgress current={petition.signaturesCount} goal={petition.goal} />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SignatureButton
                      petitionId={petition.id}
                      petitionTitle={petition.title}
                      className="flex-1"
                    />
                    <Link
                      href={`/peticoes/${petition.id}`}
                      className="action-button-secondary flex-1"
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
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
