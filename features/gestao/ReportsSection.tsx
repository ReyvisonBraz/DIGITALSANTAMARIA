'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Camera, ChevronDown, ChevronUp, FileText, MapPin, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import ReportStatusUpdater from '@/features/gestao/ReportStatusUpdater';
import ReportTimeline from '@/features/relatar/ReportTimeline';
import { formatDate } from '@/lib/utils/formatters';
import { markReportReadByStaff } from '@/services/reports.service';
import type { Report, ReportStatus } from '@/types';
import {
  buildReportSearchText,
  hasUnreadReportStaffMessage,
  reportStatusLabel,
  reportStatusMeta,
  reportStatusOptions,
  reportTypeLabel,
  reportTypeMeta,
  timestampMillis,
} from './gestao.utils';
import { CopyProtocolButton } from './AuthGates';

type ReportSort = 'newest' | 'oldest' | 'pending' | 'needs_reply';
type ReportStatusFilter = ReportStatus | 'all';

interface ReportsSectionProps {
  reports: Report[];
  loading: boolean;
  error: string | null;
  userId: string;
  clerkName: string;
  onRefresh: () => Promise<void>;
}

export default function ReportsSection({ reports, loading, error, userId, clerkName, onRefresh }: ReportsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>('all');
  const [sortMode, setSortMode] = useState<ReportSort>('newest');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const metrics = {
    total:     reports.length,
    pending:   reports.filter((r) => r.status === 'pending').length,
    analyzing: reports.filter((r) => r.status === 'in_review').length,
    solved:    reports.filter((r) => r.status === 'resolved').length,
  };
  const unreadByStaffCount = reports.filter(hasUnreadReportStaffMessage).length;

  const statusCounts = useMemo(() => {
    return reportStatusOptions.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = reports.filter((r) => r.status === item.value).length;
      return acc;
    }, {});
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return reports
      .filter((r) => {
        const matchesSearch = !search || buildReportSearchText(r).includes(search);
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortMode === 'needs_reply') {
          const unreadA = hasUnreadReportStaffMessage(a) ? 0 : 1;
          const unreadB = hasUnreadReportStaffMessage(b) ? 0 : 1;
          const msgA = timestampMillis(a.conversation?.lastMessageAt) || timestampMillis(a.updatedAt);
          const msgB = timestampMillis(b.conversation?.lastMessageAt) || timestampMillis(b.updatedAt);
          return unreadA - unreadB || msgB - msgA;
        }
        if (sortMode === 'newest') return timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
        if (sortMode === 'oldest') return timestampMillis(a.createdAt) - timestampMillis(b.createdAt);
        const order: Record<ReportStatus, number> = { pending: 0, in_review: 1, rejected: 2, resolved: 3, cancelled: 4 };
        return order[a.status] - order[b.status] || timestampMillis(b.createdAt) - timestampMillis(a.createdAt);
      });
  }, [reports, searchTerm, sortMode, statusFilter]);

  const activeReportId = filteredReports.some((r) => r.id === selectedReportId) ? selectedReportId : null;

  const handleReportToggle = async (report: Report, isOpen: boolean) => {
    if (isOpen) { setSelectedReportId(null); return; }
    setSelectedReportId(report.id);
    if (!hasUnreadReportStaffMessage(report)) return;
    try {
      await markReportReadByStaff(report.id);
      await onRefresh();
    } catch {
      // O detalhe continua acessível mesmo se a sincronização de leitura falhar.
    }
  };

  return (
    <>
      <MetricsDashboard {...metrics} />

      <div className="glass-panel p-4">
        <AdminQueueToolbar
          search={searchTerm}
          searchPlaceholder="Buscar por protocolo, título, descrição ou cidadão"
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
            onChange={(e) => setSortMode(e.target.value as ReportSort)}
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
              {unreadByStaffCount} com nova resposta do cidadão.
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4"><Skeleton variant="card" /><Skeleton variant="card" /></div>
      ) : error ? (
        <EmptyState title="Erro ao carregar" description={error} />
      ) : reports.length === 0 ? (
        <EmptyState title="Nenhum relato ainda" description="Quando alguém enviar um relato pela página /relatar, ele aparece aqui." />
      ) : filteredReports.length === 0 ? (
        <EmptyState title="Nada encontrado" description="Tente limpar os filtros ou buscar outro termo." />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const typeMeta   = reportTypeMeta[report.type];
            const statusMeta = reportStatusMeta[report.status];
            const TypeIcon   = typeMeta.icon;
            const isOpen     = activeReportId === report.id;
            const needsReply = hasUnreadReportStaffMessage(report);

            return (
              <article
                key={report.id}
                className={`civic-card overflow-hidden ${isOpen ? 'ring-2 ring-primary/25' : ''} ${needsReply ? 'border-primary/45 bg-blue-50/50' : ''}`}
              >
                <div className="grid grid-cols-1 gap-4 p-5 md:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${typeMeta.accentClassName}`}>
                    <TypeIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-widest ${typeMeta.className}`}>
                        {reportTypeLabel[report.type]}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-widest ${statusMeta.className}`}>
                        {reportStatusLabel[report.status]}
                      </span>
                      {report.photo?.url && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-text-muted">
                          <Camera className="h-3 w-3" />
                          Foto
                        </span>
                      )}
                      {needsReply && (
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-blue-800">
                          Nova resposta
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-normal text-text-main md:text-xl">{report.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{report.description}</p>
                    {report.location?.address && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {report.location.address}
                      </p>
                    )}
                    {report.conversation?.lastMessageAuthorRole === 'citizen' && report.conversation.lastMessageAuthorName && (
                      <p className="mt-2 text-xs font-bold text-text-muted">
                        Última mensagem de {report.conversation.lastMessageAuthorName}
                        {report.conversation.lastMessageAt ? ` em ${formatDate(report.conversation.lastMessageAt)}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-64 lg:items-end">
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className="break-all font-mono text-xs font-black text-primary">{report.protocolId}</span>
                      <CopyProtocolButton protocol={report.protocolId} />
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
                              alt={`Evidência do relato ${report.title}`}
                              fill
                              sizes="(min-width: 1024px) 640px, 100vw"
                              unoptimized
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
                              <dt className="text-xs font-black uppercase tracking-widest text-text-muted">Cidadão</dt>
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
