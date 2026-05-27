'use client';

import { useState } from 'react';
import { AlertCircle, FileText, Loader2, Search, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import PetitionsAdminPanel from '@/features/gestao/PetitionsAdminPanel';
import StatusUpdater from '@/features/gestao/StatusUpdater';
import UsersAdminPanel from '@/features/gestao/UsersAdminPanel';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils/formatters';
import type { DemandStatus, DemandType } from '@/types';

const statusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em analise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const typeLabel: Record<DemandType, string> = {
  reclamacao: 'Reclamacao',
  sugestao: 'Solicitacao',
  denuncia: 'Denuncia',
  elogio: 'Elogio',
};

type ActiveSection = 'demands' | 'petitions' | 'users';
type DemandSort = 'newest' | 'oldest' | 'pending';
type StatusFilter = DemandStatus | 'all';

function demandTime(value: { seconds?: number } | unknown) {
  if (value && typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }
  return 0;
}

export default function GestaoPage() {
  const { user, userRole, loading: authLoading, login } = useAuth();
  const isStaff = userRole === 'admin' || userRole === 'clerk';
  const { demands, loading, error, refresh } = useAdminData(!!user && isStaff);
  const [activeSection, setActiveSection] = useState<ActiveSection>('demands');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState<DemandSort>('newest');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-text-main">Painel de Gestao</h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Entre com uma conta autorizada para acessar solicitacoes e peticoes.
        </p>
        <button
          onClick={login}
          className="action-button-primary mt-6"
        >
          Entrar
        </button>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-normal text-text-main">Acesso restrito</h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Sua conta nao tem permissao para acessar o painel administrativo.
        </p>
      </div>
    );
  }

  const metrics = {
    total: demands.length,
    pending: demands.filter((demand) => demand.status === 'pending').length,
    analyzing: demands.filter((demand) => demand.status === 'analyzing').length,
    solved: demands.filter((demand) => demand.status === 'solved').length,
  };

  const categories = Array.from(new Set(demands.map((demand) => demand.category))).sort();
  const filteredDemands = demands
    .filter((demand) => {
      const search = searchTerm.trim().toLowerCase();
      const searchable = [
        demand.protocolId,
        demand.subject,
        demand.content.text,
        demand.category,
        statusLabel[demand.status],
        typeLabel[demand.type],
      ].join(' ').toLowerCase();

      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = statusFilter === 'all' || demand.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || demand.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortMode === 'pending') {
        const order: Record<DemandStatus, number> = { pending: 0, analyzing: 1, rejected: 2, solved: 3 };
        return order[a.status] - order[b.status] || demandTime(b.createdAt) - demandTime(a.createdAt);
      }
      if (sortMode === 'oldest') return demandTime(a.createdAt) - demandTime(b.createdAt);
      return demandTime(b.createdAt) - demandTime(a.createdAt);
    });

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel p-5 sm:p-7 md:p-9">
          <div className="soft-chip">
            <ShieldCheck className="h-4 w-4" />
            Gestão municipal
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-main md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
            Painel de <span className="text-gradient">operação</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
            Acompanhe solicitações, responda protocolos, gerencie petições e atualize dados de usuários.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <div className="glass-panel grid grid-cols-3 p-1">
          <button
            onClick={() => setActiveSection('demands')}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest transition ${
              activeSection === 'demands' ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
            }`}
          >
            Solicitacoes ({demands.length})
          </button>
          <button
            onClick={() => setActiveSection('petitions')}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest transition ${
              activeSection === 'petitions' ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
            }`}
          >
            Peticoes
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest transition ${
              activeSection === 'users' ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
            }`}
          >
            Usuarios
          </button>
        </div>

        {activeSection === 'demands' ? (
          <>
            <MetricsDashboard {...metrics} />

            <div className="glass-panel p-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_180px]">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por protocolo, assunto, texto ou categoria"
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary"
                  />
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
                >
                  <option value="all">Todos status</option>
                  <option value="pending">Pendente</option>
                  <option value="analyzing">Em analise</option>
                  <option value="solved">Resolvida</option>
                  <option value="rejected">Recusada</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
                >
                  <option value="all">Todas categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as DemandSort)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigas</option>
                  <option value="pending">Pendentes primeiro</option>
                </select>
              </div>

              <p className="mt-3 text-xs font-bold text-text-muted">
                Mostrando {filteredDemands.length} de {demands.length} solicitacoes.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            ) : error ? (
              <EmptyState title="Erro ao carregar" description={error} />
            ) : demands.length === 0 ? (
              <EmptyState title="Nenhuma solicitacao" description="Ainda nao ha solicitacoes registradas." />
            ) : filteredDemands.length === 0 ? (
              <EmptyState title="Nada encontrado" description="Tente limpar os filtros ou buscar outro termo." />
            ) : (
              <div className="space-y-4">
                {filteredDemands.map((demand) => (
                  <article key={demand.id} className="civic-card p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                            {typeLabel[demand.type]}
                          </span>
                          <span className="rounded-full bg-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                            {statusLabel[demand.status]}
                          </span>
                          <span className="text-xs font-bold text-text-muted">{formatDate(demand.createdAt)}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold tracking-normal text-text-main">{demand.subject}</h2>
                        <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-text-muted">
                          {demand.content.text}
                        </p>
                        <p className="mt-3 break-all font-mono text-xs font-bold text-primary">
                          {demand.protocolId}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-surface p-4 lg:min-w-64">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                          <FileText className="h-4 w-4 text-primary" />
                          Cidadao
                        </div>
                        <p className="mt-2 text-sm font-bold text-text-main">
                          {demand.isAnonymous ? 'Anonimo' : demand.authorName || demand.authorId || 'Identificado'}
                        </p>
                        <p className="mt-1 text-xs font-medium text-text-muted">
                          Categoria: {demand.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-border pt-5">
                      <StatusUpdater
                        demandId={demand.id}
                        clerkId={user.uid}
                        clerkName={user.displayName || user.email || 'Gestor'}
                        initialResponse={demand.adminAction?.response || ''}
                        onUpdate={refresh}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : activeSection === 'petitions' ? (
          <PetitionsAdminPanel />
        ) : (
          <UsersAdminPanel />
        )}
      </main>
    </div>
  );
}
