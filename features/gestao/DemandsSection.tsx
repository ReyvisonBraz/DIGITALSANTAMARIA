'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, FileText, MapPin, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import StatusUpdater from '@/features/gestao/StatusUpdater';
import DemandTimeline from '@/features/ouvidoria/DemandTimeline';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import { markDemandReadByStaff } from '@/services/demands.service';
import type { Demand, DemandStatus } from '@/types';
import {
  buildDemandSearchText,
  demandStatusMeta,
  demandStatusOptions,
  demandTypeMeta,
  getDemandStatusLabel,
  getDemandTypeLabel,
  hasUnreadStaffMessage,
  normalizeDemandStatus,
  normalizeDemandType,
  timestampMillis,
} from './gestao.utils';
import { CopyProtocolButton } from './AuthGates';

type DemandSort = 'newest' | 'oldest' | 'pending' | 'needs_reply';
type DemandStatusFilter = DemandStatus | 'all';

interface DemandsSectionProps {
  demands: Demand[];
  loading: boolean;
  error: string | null;
  userId: string;
  clerkName: string;
  onRefresh: () => Promise<void>;
}

export default function DemandsSection({ demands, loading, error, userId, clerkName, onRefresh }: DemandsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState<DemandSort>('newest');
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);

  const metrics = {
    total:     demands.length,
    pending:   demands.filter((d) => normalizeDemandStatus(String(d.status)) === 'pending').length,
    analyzing: demands.filter((d) => normalizeDemandStatus(String(d.status)) === 'analyzing').length,
    solved:    demands.filter((d) => normalizeDemandStatus(String(d.status)) === 'solved').length,
  };
  const unreadByStaffCount = demands.filter(hasUnreadStaffMessage).length;

  const statusCounts = useMemo(() => {
    return demandStatusOptions.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = demands.filter((d) => normalizeDemandStatus(String(d.status)) === item.value).length;
      return acc;
    }, {});
  }, [demands]);

  const categories = useMemo(
    () => Array.from(new Set(demands.map((d) => d.category))).sort(),
    [demands],
  );

  const filteredDemands = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return demands
      .filter((d) => {
        const matchesSearch = !search || buildDemandSearchText(d).includes(search);
        const demandStatus = normalizeDemandStatus(String(d.status));
        const matchesStatus = statusFilter === 'all' || demandStatus === statusFilter;
        const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortMode === 'needs_reply') {
          const unreadA = hasUnreadStaffMessage(a) ? 0 : 1;
          const unreadB = hasUnreadStaffMessage(b) ? 0 : 1;
          const msgA = timestampMillis(a.conversation?.lastMessageAt) || timestampMillis(a.updatedAt);
          const msgB = timestampMillis(b.conversation?.lastMessageAt) || timestampMillis(b.updatedAt);
          return unreadA - unreadB || msgB - msgA;
        }
        if (sortMode === 'pending') {
          const order: Record<DemandStatus, number> = { pending: 0, analyzing: 1, rejected: 2, solved: 3 };
          const sa = normalizeDemandStatus(String(a.status));
          const sb = normalizeDemandStatus(String(b.status));
          return order[sa] - order[sb] || timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
        }
        if (sortMode === 'oldest') return timestampMillis(a.createdAt) - timestampMillis(b.createdAt);
        return timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
      });
  }, [categoryFilter, demands, searchTerm, sortMode, statusFilter]);

  const activeDemandId = filteredDemands.some((d) => d.id === selectedDemandId) ? selectedDemandId : null;

  const handleDemandToggle = async (demand: Demand, isOpen: boolean) => {
    if (isOpen) { setSelectedDemandId(null); return; }
    setSelectedDemandId(demand.id);
    if (!hasUnreadStaffMessage(demand)) return;
    try {
      await markDemandReadByStaff(demand.id);
      await onRefresh();
    } catch {
      // A conversa continua acessível mesmo se a sincronização de leitura falhar.
    }
  };

  return (
    <>
      <MetricsDashboard {...metrics} />

      <div className="glass-panel p-4">
        <AdminQueueToolbar
          search={searchTerm}
          searchPlaceholder="Buscar por protocolo, assunto, texto ou categoria"
          filter={statusFilter}
          statusOptions={demandStatusOptions}
          loading={loading}
          onSearchChange={setSearchTerm}
          onFilterChange={(value) => setStatusFilter(value as DemandStatusFilter)}
          onRefresh={onRefresh}
        />
        <AdminStatusSummary
          total={demands.length}
          filter={statusFilter}
          statusOptions={demandStatusOptions}
          counts={statusCounts}
          onFilterChange={(value) => setStatusFilter(value as DemandStatusFilter)}
        />
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="all">Todas categorias</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as DemandSort)}
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="needs_reply">Novas respostas primeiro</option>
            <option value="pending">Pendentes primeiro</option>
          </select>
        </div>
        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredDemands.length} de {demands.length} solicitações.
          {unreadByStaffCount > 0 && (
            <span className="ml-2 text-primary-dark">
              {unreadByStaffCount} com nova resposta do cidadão.
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4"><Skeleton variant="card" /><Skeleton variant="card" /></div>
      ) : error ? (
        <EmptyState title="Erro ao carregar" description={error} />
      ) : demands.length === 0 ? (
        <EmptyState title="Nenhuma solicitação" description="Ainda não há solicitações registradas." />
      ) : filteredDemands.length === 0 ? (
        <EmptyState title="Nada encontrado" description="Tente limpar os filtros ou buscar outro termo." />
      ) : (
        <div className="space-y-4">
          {filteredDemands.map((demand) => {
            const safeType   = normalizeDemandType(String(demand.type));
            const safeStatus = normalizeDemandStatus(String(demand.status));
            const typeMeta   = demandTypeMeta[safeType];
            const statusMeta = demandStatusMeta[safeStatus];
            const TypeIcon   = typeMeta.icon;
            const isOpen     = activeDemandId === demand.id;
            const needsReply = hasUnreadStaffMessage(demand);

            return (
              <article
                key={demand.id}
                className={`civic-card overflow-hidden ${isOpen ? 'ring-2 ring-primary/25' : ''} ${needsReply ? 'border-primary/45 bg-blue-50/50' : ''}`}
              >
                <div className="flex w-full flex-col gap-4 p-5 text-left md:p-6">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${typeMeta.accentClassName}`}>
                      <TypeIcon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${typeMeta.className}`}>
                          {getDemandTypeLabel(String(demand.type))}
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${statusMeta.className}`}>
                          {getDemandStatusLabel(String(demand.status))}
                        </span>
                        <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {demand.category}
                        </span>
                        {needsReply && (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-800">
                            Nova resposta
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold tracking-normal text-text-main md:text-xl">
                        {demand.subject}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-text-muted">
                        {demand.content.text}
                      </p>
                      {demand.conversation?.lastMessageAuthorRole === 'citizen' && demand.conversation.lastMessageAuthorName && (
                        <p className="mt-2 text-xs font-bold text-text-muted">
                          Última mensagem de {demand.conversation.lastMessageAuthorName}
                          {demand.conversation.lastMessageAt ? ` em ${formatDate(demand.conversation.lastMessageAt)}` : ''}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-64 lg:items-end">
                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <span className="font-mono text-xs font-black text-primary">{demand.protocolId}</span>
                        <CopyProtocolButton protocol={demand.protocolId} />
                      </div>
                      <span className="text-xs font-bold text-text-muted">{formatDate(demand.createdAt)}</span>
                      <button
                        type="button"
                        onClick={() => void handleDemandToggle(demand, isOpen)}
                        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-black text-primary transition hover:border-primary hover:bg-primary/10"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {isOpen ? 'Fechar detalhe' : 'Abrir detalhe'}
                      </button>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-white p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_22rem]">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border bg-surface p-4">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                            <FileText className="h-4 w-4 text-primary" />
                            Solicitação original
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-muted">
                            {demand.content.text}
                          </p>
                          {demand.content.location && (
                            <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-text-muted">
                              <MapPin className="h-4 w-4 text-primary" />
                              {demand.content.location.address || `${demand.content.location.lat}, ${demand.content.location.lng}`}
                            </p>
                          )}
                        </div>
                        <DemandTimeline demand={demand} compact />
                      </div>

                      <aside className="space-y-4">
                        <div className="rounded-xl border border-border bg-surface p-4">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Dados do atendimento
                          </div>
                          <dl className="mt-3 space-y-3 text-sm">
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Cidadão</dt>
                              <dd className="mt-1 font-bold text-text-main">
                                {demand.isAnonymous ? 'Anônimo' : demand.authorName || demand.authorId || 'Identificado'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Criada em</dt>
                              <dd className="mt-1 font-bold text-text-main">{formatDate(demand.createdAt)}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Atualizada em</dt>
                              <dd className="mt-1 font-bold text-text-main">{formatDate(demand.updatedAt)}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="rounded-xl border border-border bg-white p-4">
                          <StatusUpdater
                            demandId={demand.id}
                            clerkId={userId}
                            clerkName={clerkName}
                            initialStatus={safeStatus}
                            initialResponse={demand.adminAction?.response || ''}
                            category={demand.category}
                            onUpdate={onRefresh}
                          />
                        </div>
                      </aside>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
