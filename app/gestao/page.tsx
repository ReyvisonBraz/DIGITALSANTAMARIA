'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Loader2,
  MapPin,
  Megaphone,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import AdminAuditPanel from '@/features/gestao/AdminAuditPanel';
import AdminOverview from '@/features/gestao/AdminOverview';
import AdminSectionNav, { type AdminMainSection } from '@/features/gestao/AdminSectionNav';
import ContentAdminPanel, { type ContentTab } from '@/features/gestao/ContentAdminPanel';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import PetitionsAdminPanel from '@/features/gestao/PetitionsAdminPanel';
import ReportStatusUpdater from '@/features/gestao/ReportStatusUpdater';
import StatusUpdater from '@/features/gestao/StatusUpdater';
import UsersAdminPanel from '@/features/gestao/UsersAdminPanel';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import DemandTimeline from '@/features/ouvidoria/DemandTimeline';
import ReportTimeline from '@/features/relatar/ReportTimeline';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import { markDemandReadByStaff } from '@/services/demands.service';
import { markReportReadByStaff } from '@/services/reports.service';
import type { Demand, DemandStatus, DemandType, Report, ReportStatus, ReportType } from '@/types';

const demandStatusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em analise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const demandTypeLabel: Record<DemandType, string> = {
  reclamacao: 'Reclamacao',
  sugestao: 'Solicitacao',
  denuncia: 'Denuncia',
  elogio: 'Elogio',
};

const demandTypeMeta = {
  reclamacao: {
    icon: MessageSquareWarning,
    className: 'border-red-200 bg-red-50 text-red-700',
    accentClassName: 'bg-red-600 text-white',
  },
  sugestao: {
    icon: Lightbulb,
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    accentClassName: 'bg-sky-600 text-white',
  },
  denuncia: {
    icon: ShieldAlert,
    className: 'border-purple-200 bg-purple-50 text-purple-700',
    accentClassName: 'bg-purple-600 text-white',
  },
  elogio: {
    icon: HeartHandshake,
    className: 'border-green-200 bg-green-50 text-green-700',
    accentClassName: 'bg-green-600 text-white',
  },
} satisfies Record<DemandType, { icon: typeof AlertCircle; className: string; accentClassName: string }>;

const demandStatusMeta = {
  pending: {
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  analyzing: {
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  solved: {
    className: 'border-green-200 bg-green-50 text-green-800',
  },
  rejected: {
    className: 'border-red-200 bg-red-50 text-red-800',
  },
} satisfies Record<DemandStatus, { className: string }>;

function normalizeDemandStatus(status: string): DemandStatus {
  if (status === 'in_review') return 'analyzing';
  if (status === 'pending' || status === 'analyzing' || status === 'solved' || status === 'rejected') {
    return status;
  }
  return 'pending';
}

function normalizeDemandType(type: string): DemandType {
  if (type === 'solicitacao') return 'sugestao';
  if (type === 'reclamacao' || type === 'sugestao' || type === 'denuncia' || type === 'elogio') {
    return type;
  }
  return 'reclamacao';
}

function getDemandStatusLabel(status: string) {
  return demandStatusLabel[normalizeDemandStatus(status)];
}

function getDemandTypeLabel(type: string) {
  return demandTypeLabel[normalizeDemandType(type)];
}

const reportStatusLabel: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em analise',
  resolved: 'Resolvido',
  rejected: 'Recusado',
};

const reportTypeLabel: Record<ReportType, string> = {
  infrastructure: 'Infraestrutura',
  environment: 'Meio ambiente',
  security: 'Seguranca',
  other: 'Outro',
};

const reportTypeMeta = {
  infrastructure: {
    icon: Building2,
    className: 'border-orange-200 bg-orange-50 text-orange-800',
    accentClassName: 'bg-orange-600 text-white',
  },
  environment: {
    icon: Leaf,
    className: 'border-green-200 bg-green-50 text-green-800',
    accentClassName: 'bg-green-600 text-white',
  },
  security: {
    icon: ShieldAlert,
    className: 'border-red-200 bg-red-50 text-red-800',
    accentClassName: 'bg-red-600 text-white',
  },
  other: {
    icon: Megaphone,
    className: 'border-sky-200 bg-sky-50 text-sky-800',
    accentClassName: 'bg-sky-600 text-white',
  },
} satisfies Record<ReportType, { icon: typeof AlertCircle; className: string; accentClassName: string }>;

const reportStatusMeta = {
  pending: {
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  in_review: {
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  resolved: {
    className: 'border-green-200 bg-green-50 text-green-800',
  },
  rejected: {
    className: 'border-red-200 bg-red-50 text-red-800',
  },
} satisfies Record<ReportStatus, { className: string }>;

const demandStatusOptions: { value: DemandStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'analyzing', label: 'Em analise' },
  { value: 'solved', label: 'Resolvida' },
  { value: 'rejected', label: 'Recusada' },
];

const reportStatusOptions: { value: ReportStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_review', label: 'Em analise' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'rejected', label: 'Recusado' },
];

type ActiveSection = AdminMainSection;
type DemandSort = 'newest' | 'oldest' | 'pending' | 'needs_reply';
type DemandStatusFilter = DemandStatus | 'all';
type ReportSort = 'newest' | 'oldest' | 'pending' | 'needs_reply';
type ReportStatusFilter = ReportStatus | 'all';

function timestampMillis(value: { seconds?: number } | unknown) {
  if (value && typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }
  return 0;
}

function hasUnreadStaffMessage(demand: Demand) {
  return demand.conversation?.unreadByStaff === true;
}

function hasUnreadReportStaffMessage(report: Report) {
  return report.conversation?.unreadByStaff === true;
}

function buildDemandSearchText(demand: Demand) {
  return [
    demand.protocolId,
    demand.subject,
    demand.content.text,
    demand.category,
    getDemandStatusLabel(String(demand.status)),
    getDemandTypeLabel(String(demand.type)),
    demand.conversation?.lastMessageAuthorName,
    hasUnreadStaffMessage(demand) ? 'nova resposta cidadao' : '',
  ].join(' ').toLowerCase();
}

function buildReportSearchText(report: Report) {
  return [
    report.protocol,
    report.title,
    report.description,
    report.reporterName,
    reportTypeLabel[report.type],
    reportStatusLabel[report.status],
    report.conversation?.lastMessageAuthorName,
    hasUnreadReportStaffMessage(report) ? 'nova resposta cidadao' : '',
  ].join(' ').toLowerCase();
}

interface AuthGateProps {
  authError: string | null;
  loginError: string | null;
  onLogin: () => void;
}

function LoginGate({ authError, loginError, onLogin }: AuthGateProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-12 w-12 text-primary" />
      <h1 className="mt-4 text-3xl font-semibold tracking-normal text-text-main">Painel de Gestao</h1>
      <p className="mt-3 text-base font-medium leading-7 text-text-muted">
        Entre com uma conta autorizada para acessar solicitacoes, relatos e cadastros administrativos.
      </p>
      <button type="button" onClick={onLogin} className="action-button-primary mt-6">
        Entrar
      </button>
      {(loginError || authError) && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {loginError || authError}
        </p>
      )}
    </div>
  );
}

function RestrictedGate() {
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

function CopyProtocolButton({ protocol }: { protocol: string }) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(protocol);
      toast('Protocolo copiado.', 'success');
    } catch {
      toast('Nao foi possivel copiar o protocolo.', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
      title="Copiar protocolo"
    >
      <Copy className="h-3.5 w-3.5" />
      Copiar
    </button>
  );
}

interface DemandsSectionProps {
  demands: Demand[];
  loading: boolean;
  error: string | null;
  userId: string;
  clerkName: string;
  onRefresh: () => Promise<void>;
}

function DemandsSection({ demands, loading, error, userId, clerkName, onRefresh }: DemandsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState<DemandSort>('newest');
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);

  const metrics = {
    total: demands.length,
    pending: demands.filter((demand) => normalizeDemandStatus(String(demand.status)) === 'pending').length,
    analyzing: demands.filter((demand) => normalizeDemandStatus(String(demand.status)) === 'analyzing').length,
    solved: demands.filter((demand) => normalizeDemandStatus(String(demand.status)) === 'solved').length,
  };
  const unreadByStaffCount = demands.filter(hasUnreadStaffMessage).length;

  const statusCounts = useMemo(() => {
    return demandStatusOptions.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = demands.filter((demand) => normalizeDemandStatus(String(demand.status)) === item.value).length;
      return acc;
    }, {});
  }, [demands]);

  const categories = useMemo(() => {
    return Array.from(new Set(demands.map((demand) => demand.category))).sort();
  }, [demands]);

  const filteredDemands = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return demands
      .filter((demand) => {
        const matchesSearch = !search || buildDemandSearchText(demand).includes(search);
        const demandStatus = normalizeDemandStatus(String(demand.status));
        const matchesStatus = statusFilter === 'all' || demandStatus === statusFilter;
        const matchesCategory = categoryFilter === 'all' || demand.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortMode === 'needs_reply') {
          const unreadA = hasUnreadStaffMessage(a) ? 0 : 1;
          const unreadB = hasUnreadStaffMessage(b) ? 0 : 1;
          const messageTimeA = timestampMillis(a.conversation?.lastMessageAt) || timestampMillis(a.updatedAt);
          const messageTimeB = timestampMillis(b.conversation?.lastMessageAt) || timestampMillis(b.updatedAt);
          return unreadA - unreadB || messageTimeB - messageTimeA;
        }
        if (sortMode === 'pending') {
          const order: Record<DemandStatus, number> = { pending: 0, analyzing: 1, rejected: 2, solved: 3 };
          const statusA = normalizeDemandStatus(String(a.status));
          const statusB = normalizeDemandStatus(String(b.status));
          return order[statusA] - order[statusB] || timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
        }
        if (sortMode === 'oldest') return timestampMillis(a.createdAt) - timestampMillis(b.createdAt);
        return timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
      });
  }, [categoryFilter, demands, searchTerm, sortMode, statusFilter]);

  const selectedDemandExists = filteredDemands.some((demand) => demand.id === selectedDemandId);
  const activeDemandId = selectedDemandExists ? selectedDemandId : null;

  const handleDemandToggle = async (demand: Demand, isOpen: boolean) => {
    if (isOpen) {
      setSelectedDemandId(null);
      return;
    }

    setSelectedDemandId(demand.id);

    if (!hasUnreadStaffMessage(demand)) return;

    try {
      await markDemandReadByStaff(demand.id);
      await onRefresh();
    } catch {
      // A conversa continua acessivel mesmo se a sincronizacao de leitura falhar.
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
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="all">Todas categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as DemandSort)}
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="needs_reply">Novas respostas primeiro</option>
            <option value="pending">Pendentes primeiro</option>
          </select>
        </div>

        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredDemands.length} de {demands.length} solicitacoes.
          {unreadByStaffCount > 0 && (
            <span className="ml-2 text-primary-dark">
              {unreadByStaffCount} com nova resposta do cidadao.
            </span>
          )}
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
          {filteredDemands.map((demand) => {
            const safeType = normalizeDemandType(String(demand.type));
            const safeStatus = normalizeDemandStatus(String(demand.status));
            const typeMeta = demandTypeMeta[safeType];
            const statusMeta = demandStatusMeta[safeStatus];
            const TypeIcon = typeMeta.icon;
            const isOpen = activeDemandId === demand.id;
            const needsStaffReply = hasUnreadStaffMessage(demand);

            return (
              <article key={demand.id} className={`civic-card overflow-hidden ${isOpen ? 'ring-2 ring-primary/25' : ''} ${needsStaffReply ? 'border-primary/45 bg-blue-50/50' : ''}`}>
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
                        {needsStaffReply && (
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
                          Ultima mensagem de {demand.conversation.lastMessageAuthorName}
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
                            Solicitacao original
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
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Cidadao</dt>
                              <dd className="mt-1 font-bold text-text-main">
                                {demand.isAnonymous ? 'Anonimo' : demand.authorName || demand.authorId || 'Identificado'}
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

interface ReportsSectionProps {
  reports: Report[];
  loading: boolean;
  error: string | null;
  userId: string;
  clerkName: string;
  onRefresh: () => Promise<void>;
}

function ReportsSection({ reports, loading, error, userId, clerkName, onRefresh }: ReportsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>('all');
  const [sortMode, setSortMode] = useState<ReportSort>('newest');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const metrics = {
    total: reports.length,
    pending: reports.filter((report) => report.status === 'pending').length,
    analyzing: reports.filter((report) => report.status === 'in_review').length,
    solved: reports.filter((report) => report.status === 'resolved').length,
  };
  const unreadByStaffCount = reports.filter(hasUnreadReportStaffMessage).length;

  const statusCounts = useMemo(() => {
    return reportStatusOptions.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = reports.filter((report) => report.status === item.value).length;
      return acc;
    }, {});
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return reports
      .filter((report) => {
        const matchesSearch = !search || buildReportSearchText(report).includes(search);
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortMode === 'needs_reply') {
          const unreadA = hasUnreadReportStaffMessage(a) ? 0 : 1;
          const unreadB = hasUnreadReportStaffMessage(b) ? 0 : 1;
          const messageTimeA = timestampMillis(a.conversation?.lastMessageAt) || timestampMillis(a.updatedAt);
          const messageTimeB = timestampMillis(b.conversation?.lastMessageAt) || timestampMillis(b.updatedAt);
          return unreadA - unreadB || messageTimeB - messageTimeA;
        }
        if (sortMode === 'newest') return timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
        if (sortMode === 'oldest') return timestampMillis(a.createdAt) - timestampMillis(b.createdAt);
        const order: Record<ReportStatus, number> = { pending: 0, in_review: 1, rejected: 2, resolved: 3 };
        return order[a.status] - order[b.status] || timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
      });
  }, [reports, searchTerm, sortMode, statusFilter]);

  const selectedReportExists = filteredReports.some((report) => report.id === selectedReportId);
  const activeReportId = selectedReportExists ? selectedReportId : null;

  const handleReportToggle = async (report: Report, isOpen: boolean) => {
    if (isOpen) {
      setSelectedReportId(null);
      return;
    }

    setSelectedReportId(report.id);

    if (!hasUnreadReportStaffMessage(report)) return;

    try {
      await markReportReadByStaff(report.id);
      await onRefresh();
    } catch {
      // O detalhe continua acessivel mesmo se a sincronizacao de leitura falhar.
    }
  };

  return (
    <>
      <MetricsDashboard {...metrics} />

      <div className="glass-panel p-4">
        <AdminQueueToolbar
          search={searchTerm}
          searchPlaceholder="Buscar por protocolo, titulo, descricao ou cidadao"
          filter={statusFilter}
          statusOptions={reportStatusOptions}
          loading={loading}
          onSearchChange={setSearchTerm}
          onFilterChange={(value) => setStatusFilter(value as ReportStatusFilter)}
          onRefresh={onRefresh}
        />

        <AdminStatusSummary
          total={reports.length}
          filter={statusFilter}
          statusOptions={reportStatusOptions}
          counts={statusCounts}
          onFilterChange={(value) => setStatusFilter(value as ReportStatusFilter)}
        />

        <div className="mt-3">
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as ReportSort)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary md:max-w-sm"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="needs_reply">Novas respostas primeiro</option>
            <option value="pending">Pendentes primeiro</option>
          </select>
        </div>

        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredReports.length} de {reports.length} relatos.
          {unreadByStaffCount > 0 && (
            <span className="ml-2 text-primary-dark">
              {unreadByStaffCount} com nova resposta do cidadao.
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : error ? (
        <EmptyState title="Erro ao carregar" description={error} />
      ) : reports.length === 0 ? (
        <EmptyState title="Nenhum relato ainda" description="Quando alguem enviar um relato pela pagina /relatar, ele aparece aqui." />
      ) : filteredReports.length === 0 ? (
        <EmptyState title="Nada encontrado" description="Tente limpar os filtros ou buscar outro termo." />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const typeMeta = reportTypeMeta[report.type];
            const statusMeta = reportStatusMeta[report.status];
            const TypeIcon = typeMeta.icon;
            const isOpen = activeReportId === report.id;
            const needsStaffReply = hasUnreadReportStaffMessage(report);

            return (
              <article key={report.id} className={`civic-card overflow-hidden ${isOpen ? 'ring-2 ring-primary/25' : ''} ${needsStaffReply ? 'border-primary/45 bg-blue-50/50' : ''}`}>
                <div className="grid grid-cols-1 gap-4 p-5 md:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${typeMeta.accentClassName}`}>
                    <TypeIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${typeMeta.className}`}>
                        {reportTypeLabel[report.type]}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${statusMeta.className}`}>
                        {reportStatusLabel[report.status]}
                      </span>
                      {report.photo?.url && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                          <Camera className="h-3 w-3" />
                          Foto
                        </span>
                      )}
                      {needsStaffReply && (
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-800">
                          Nova resposta
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-normal text-text-main md:text-xl">{report.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-text-muted">
                      {report.description}
                    </p>
                    {report.location?.address && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {report.location.address}
                      </p>
                    )}
                    {report.conversation?.lastMessageAuthorRole === 'citizen' && report.conversation.lastMessageAuthorName && (
                      <p className="mt-2 text-xs font-bold text-text-muted">
                        Ultima mensagem de {report.conversation.lastMessageAuthorName}
                        {report.conversation.lastMessageAt ? ` em ${formatDate(report.conversation.lastMessageAt)}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-64 lg:items-end">
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className="break-all font-mono text-xs font-black text-primary">{report.protocol}</span>
                      <CopyProtocolButton protocol={report.protocol} />
                    </div>
                    <span className="text-xs font-bold text-text-muted">{formatDate(report.createdAt)}</span>
                    <button
                      type="button"
                      onClick={() => void handleReportToggle(report, isOpen)}
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-black text-primary transition hover:border-primary hover:bg-primary/10"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isOpen ? 'Fechar detalhe' : 'Abrir detalhe'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-white p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_22rem]">
                      <div className="space-y-4">
                        {report.photo?.url && (
                          <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border bg-surface">
                            <Image
                              src={report.photo.url}
                              alt={`Evidencia do relato ${report.title}`}
                              fill
                              sizes="(min-width: 1024px) 640px, 100vw"
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="rounded-xl border border-border bg-surface p-4">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                            <FileText className="h-4 w-4 text-primary" />
                            Relato original
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-muted">
                            {report.description}
                          </p>
                          {report.location?.address && (
                            <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-text-muted">
                              <MapPin className="h-4 w-4 text-primary" />
                              {report.location.address}
                            </p>
                          )}
                        </div>

                        <ReportTimeline report={report} compact />
                      </div>

                      <aside className="space-y-4">
                        <div className="rounded-xl border border-border bg-surface p-4">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Dados do relato
                          </div>
                          <dl className="mt-3 space-y-3 text-sm">
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Cidadao</dt>
                              <dd className="mt-1 font-bold text-text-main">{report.reporterName || 'Identificado'}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Criado em</dt>
                              <dd className="mt-1 font-bold text-text-main">{formatDate(report.createdAt)}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Atualizado em</dt>
                              <dd className="mt-1 font-bold text-text-main">{formatDate(report.updatedAt)}</dd>
                            </div>
                            {report.location && (report.location.lat !== 0 || report.location.lng !== 0) && (
                              <div>
                                <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Coordenadas</dt>
                                <dd className="mt-1 font-mono text-xs font-bold text-text-main">
                                  {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <ReportStatusUpdater
                          reportId={report.id}
                          clerkId={userId}
                          clerkName={clerkName}
                          initialStatus={report.status}
                          initialResponse={report.adminResponse || ''}
                          reportType={report.type}
                          onUpdate={onRefresh}
                        />
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

export default function GestaoPage() {
  const { user, userRole, loading: authLoading, authError, login } = useAuth();
  const isStaff = userRole === 'admin' || userRole === 'clerk';
  const canManageAdminCatalog = userRole === 'admin';
  const { demands, reports, loading, error, refresh } = useAdminData(!!user && isStaff);
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [contentTab, setContentTab] = useState<ContentTab>('notices');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const allowedForClerk: ActiveSection[] = ['overview', 'demands', 'reports', 'content'];
    if (!canManageAdminCatalog && !allowedForClerk.includes(activeSection)) {
      setActiveSection('overview');
    }
  }, [activeSection, canManageAdminCatalog]);

  const reportPendingCount = useMemo(() => {
    return reports.filter((report) => report.status === 'pending').length;
  }, [reports]);

  const visibleSection: ActiveSection = canManageAdminCatalog || activeSection === 'overview' || activeSection === 'demands' || activeSection === 'reports' || activeSection === 'content'
    ? activeSection
    : 'overview';

  const clerkName = user?.displayName || user?.email || 'Gestor';

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
    } catch (loginProblem) {
      setLoginError(loginProblem instanceof Error ? loginProblem.message : 'Nao foi possivel iniciar o login.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginGate authError={authError} loginError={loginError} onLogin={handleLogin} />;
  }

  if (!isStaff) {
    return <RestrictedGate />;
  }

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel p-5 sm:p-7 md:p-9">
          <div className="soft-chip">
            <ShieldCheck className="h-4 w-4" />
            Gestao municipal
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-main md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
            Painel de <span className="text-gradient">operacao</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
            Acompanhe solicitacoes, responda protocolos, gerencie conteudo publico e mantenha os cadastros administrativos em ordem.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <AdminSectionNav
          activeSection={visibleSection}
          demandCount={demands.length}
          reportCount={reports.length}
          reportPendingCount={reportPendingCount}
          canManageAdminCatalog={canManageAdminCatalog}
          onChange={setActiveSection}
        />

        {visibleSection === 'overview' ? (
          <AdminOverview
            demands={demands}
            reports={reports}
            loadingBase={loading}
            errorBase={error}
            canManageCatalog={canManageAdminCatalog}
            onNavigate={setActiveSection}
            onOpenContentTab={(tab) => {
              setContentTab(tab);
              setActiveSection('content');
            }}
            onRefreshBase={refresh}
          />
        ) : visibleSection === 'demands' ? (
          <DemandsSection
            demands={demands}
            loading={loading}
            error={error}
            userId={user.uid}
            clerkName={clerkName}
            onRefresh={refresh}
          />
        ) : visibleSection === 'reports' ? (
          <ReportsSection
            reports={reports}
            loading={loading}
            error={error}
            userId={user.uid}
            clerkName={clerkName}
            onRefresh={refresh}
          />
        ) : visibleSection === 'content' ? (
          <ContentAdminPanel activeTab={contentTab} canManageCatalog={canManageAdminCatalog} onTabChange={setContentTab} />
        ) : visibleSection === 'petitions' ? (
          <PetitionsAdminPanel />
        ) : visibleSection === 'audit' ? (
          <AdminAuditPanel />
        ) : (
          <UsersAdminPanel />
        )}
      </main>
    </div>
  );
}
