'use client';

import { AlertCircle, FileText, Loader2, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import StatusUpdater from '@/features/gestao/StatusUpdater';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils/formatters';
import type { DemandStatus, DemandType } from '@/types';

const statusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const typeLabel: Record<DemandType, string> = {
  reclamacao: 'Reclamação',
  sugestao: 'Solicitação',
  denuncia: 'Denúncia',
  elogio: 'Elogio',
};

export default function GestaoPage() {
  const { user, userRole, loading: authLoading, login } = useAuth();
  const { demands, loading, error, refresh } = useAdminData();

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
        <h1 className="mt-4 text-3xl font-black tracking-normal text-text-main">Painel de Gestão</h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Entre com uma conta autorizada para acessar solicitações da Ouvidoria.
        </p>
        <button
          onClick={login}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white"
        >
          Entrar
        </button>
      </div>
    );
  }

  if (userRole !== 'admin' && userRole !== 'clerk') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-normal text-text-main">Acesso restrito</h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Sua conta não tem permissão para acessar o painel administrativo.
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

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <section className="border-b border-border bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-10 lg:px-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <ShieldCheck className="h-4 w-4" />
            Gestão municipal
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-normal text-text-main md:text-5xl">
            Solicitações da Ouvidoria
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
            Acompanhe demandas abertas pelos cidadãos, atualize status e registre respostas oficiais.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <MetricsDashboard {...metrics} />

        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : error ? (
          <EmptyState title="Erro ao carregar" description={error} />
        ) : demands.length === 0 ? (
          <EmptyState title="Nenhuma solicitação" description="Ainda não há solicitações registradas." />
        ) : (
          <div className="space-y-4">
            {demands.map((demand) => (
              <article key={demand.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                        {typeLabel[demand.type]}
                      </span>
                      <span className="rounded-full bg-surface px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {statusLabel[demand.status]}
                      </span>
                      <span className="text-xs font-bold text-text-muted">{formatDate(demand.createdAt)}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-black tracking-normal text-text-main">{demand.subject}</h2>
                    <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-text-muted">
                      {demand.content.text}
                    </p>
                    <p className="mt-3 break-all font-mono text-xs font-bold text-primary">
                      {demand.protocolId}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-4 lg:min-w-64">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                      <FileText className="h-4 w-4 text-primary" />
                      Cidadão
                    </div>
                    <p className="mt-2 text-sm font-bold text-text-main">
                      {demand.isAnonymous ? 'Anônimo' : demand.authorName || demand.authorId || 'Identificado'}
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
      </main>
    </div>
  );
}
