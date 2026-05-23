'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Loader2, Save, Search } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import { getAllPetitions, updatePetitionAdmin } from '@/services/petitions.service';
import type { Petition, PetitionStatus } from '@/types';

const statusOptions: { label: string; value: PetitionStatus }[] = [
  { label: 'Ativa', value: 'active' },
  { label: 'Meta alcancada', value: 'achieved' },
  { label: 'Resposta oficial', value: 'official_reply' },
  { label: 'Fechada', value: 'closed' },
];

const statusLabel: Record<PetitionStatus, string> = {
  active: 'Ativa',
  achieved: 'Meta alcancada',
  official_reply: 'Resposta oficial',
  closed: 'Fechada',
};

type PetitionStatusFilter = PetitionStatus | 'all';

function petitionTime(value: { seconds?: number } | unknown) {
  if (value && typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }
  return 0;
}

function PetitionAdminCard({ petition, onSaved }: { petition: Petition; onSaved: () => void }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<PetitionStatus>(petition.status);
  const [officialReply, setOfficialReply] = useState(petition.officialReply || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePetitionAdmin(petition.id, {
        status,
        officialReply: officialReply.trim() || null,
      });
      toast('Peticao atualizada.', 'success');
      onSaved();
    } catch {
      toast('Erro ao atualizar peticao.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm md:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              {petition.category}
            </span>
            <span className="rounded-full bg-surface px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
              {statusLabel[petition.status]}
            </span>
            <span className="text-xs font-bold text-text-muted">{formatDate(petition.createdAt)}</span>
          </div>
          <h2 className="mt-3 text-xl font-black tracking-normal text-text-main">{petition.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-text-muted">
            {petition.description}
          </p>
          <p className="mt-3 text-xs font-bold text-text-muted">
            Autor: {petition.creatorName} | {petition.signaturesCount}/{petition.goal} assinaturas
          </p>
        </div>

        <Link
          href={`/peticoes/${petition.id}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir
        </Link>
      </div>

      <div className="mt-5 space-y-3 rounded-xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as PetitionStatus)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Resposta oficial</span>
            <textarea
              value={officialReply}
              onChange={(event) => setOfficialReply(event.target.value)}
              rows={3}
              placeholder="Informe uma posicao oficial da gestao sobre esta peticao."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar peticao
        </button>
      </div>
    </article>
  );
}

export default function PetitionsAdminPanel() {
  const { toast } = useToast();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PetitionStatusFilter>('all');
  const [sortMode, setSortMode] = useState<'newest' | 'oldest' | 'signatures'>('newest');

  const loadPetitions = () => {
    setLoading(true);
    getAllPetitions()
      .then(setPetitions)
      .catch(() => toast('Nao foi possivel carregar peticoes.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPetitions();
  }, []);

  const filteredPetitions = petitions
    .filter((petition) => {
      const search = searchTerm.trim().toLowerCase();
      const searchable = [
        petition.title,
        petition.description,
        petition.category,
        petition.creatorName,
        statusLabel[petition.status],
      ].join(' ').toLowerCase();

      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = statusFilter === 'all' || petition.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortMode === 'signatures') return b.signaturesCount - a.signaturesCount;
      if (sortMode === 'oldest') return petitionTime(a.createdAt) - petitionTime(b.createdAt);
      return petitionTime(b.createdAt) - petitionTime(a.createdAt);
    });

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (petitions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-black text-text-main">Nenhuma peticao criada</h2>
        <p className="mt-2 text-sm font-medium text-text-muted">
          As peticoes criadas pelos cidadaos aparecerao aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por titulo, autor, categoria ou descricao"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as PetitionStatusFilter)}
            className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="all">Todos status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as 'newest' | 'oldest' | 'signatures')}
            className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="signatures">Mais assinaturas</option>
          </select>
        </div>
        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredPetitions.length} de {petitions.length} peticoes.
        </p>
      </div>

      {filteredPetitions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-black text-text-main">Nada encontrado</h2>
          <p className="mt-2 text-sm font-medium text-text-muted">
            Tente limpar os filtros ou buscar outro termo.
          </p>
        </div>
      ) : (
        filteredPetitions.map((petition) => (
          <PetitionAdminCard key={petition.id} petition={petition} onSaved={loadPetitions} />
        ))
      )}
    </div>
  );
}
