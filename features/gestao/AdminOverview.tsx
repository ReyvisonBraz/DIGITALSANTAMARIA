'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Loader2,
  Megaphone,
  RefreshCw,
  Siren,
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import type { ContentTab } from '@/features/gestao/ContentAdminPanel';
import { getAllAppointments } from '@/services/appointments.service';
import { getAllEnrollments } from '@/services/educacao.service';
import { getAllEmergencyAlerts } from '@/services/emergency.service';
import { getAllApplications } from '@/services/jobs.service';
import type { Appointment, Demand, EmergencyAlert, Enrollment, JobApplication, Report } from '@/types';

type MainSection = 'demands' | 'reports' | 'content' | 'petitions' | 'users';

interface AdminOverviewProps {
  demands: Demand[];
  reports: Report[];
  loadingBase: boolean;
  errorBase: string | null;
  canManageCatalog: boolean;
  onNavigate: (section: MainSection) => void;
  onOpenContentTab: (tab: ContentTab) => void;
  onRefreshBase: () => Promise<void>;
}

interface ExtraQueues {
  appointments: Appointment[];
  applications: JobApplication[];
  enrollments: Enrollment[];
  emergencies: EmergencyAlert[];
}

const emptyQueues: ExtraQueues = {
  appointments: [],
  applications: [],
  enrollments: [],
  emergencies: [],
};

function pendingRatio(pending: number, total: number) {
  if (total === 0) return '0%';
  return `${Math.round((pending / total) * 100)}%`;
}

export default function AdminOverview({
  demands,
  reports,
  loadingBase,
  errorBase,
  canManageCatalog,
  onNavigate,
  onOpenContentTab,
  onRefreshBase,
}: AdminOverviewProps) {
  const [queues, setQueues] = useState<ExtraQueues>(emptyQueues);
  const [loadingQueues, setLoadingQueues] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  const loadQueues = useCallback(async () => {
    setLoadingQueues(true);
    setQueueError(null);
    try {
      const [appointments, applications, enrollments, emergencies] = await Promise.all([
        getAllAppointments(),
        getAllApplications(),
        getAllEnrollments(),
        getAllEmergencyAlerts(),
      ]);
      setQueues({ appointments, applications, enrollments, emergencies });
    } catch {
      setQueueError('Não foi possível carregar todos os indicadores operacionais.');
    } finally {
      setLoadingQueues(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const stats = useMemo(() => {
    const demandPending = demands.filter((item) => item.status === 'pending').length;
    const demandUnread = demands.filter((item) => item.conversation?.unreadByStaff === true).length;
    const demandActionable = demands.filter((item) => item.status === 'pending' || item.conversation?.unreadByStaff === true).length;
    const reportPending = reports.filter((item) => item.status === 'pending').length;
    const reportUnread = reports.filter((item) => item.conversation?.unreadByStaff === true).length;
    const reportActionable = reports.filter((item) => item.status === 'pending' || item.conversation?.unreadByStaff === true).length;
    const appointmentPending = queues.appointments.filter((item) => item.status === 'scheduled').length;
    const applicationPending = queues.applications.filter((item) => item.status === 'applied').length;
    const enrollmentPending = queues.enrollments.filter((item) => item.status === 'pending').length;
    const emergencyActive = queues.emergencies.filter((item) => item.status === 'active').length;

    return {
      totalPending:
        demandActionable +
        reportActionable +
        appointmentPending +
        applicationPending +
        enrollmentPending +
        emergencyActive,
      rows: [
        {
          label: 'Solicitações',
          value: demandActionable,
          total: demands.length,
          helper: demandUnread > 0
            ? `${demandUnread} novas respostas, ${demandPending} pendentes`
            : `${pendingRatio(demandPending, demands.length)} pendentes`,
          icon: FileText,
          color: 'border-amber-200 bg-amber-50 text-amber-800',
          section: 'demands' as MainSection,
        },
        {
          label: 'Relatos',
          value: reportActionable,
          total: reports.length,
          helper: reportUnread > 0
            ? `${reportUnread} novas respostas, ${reportPending} pendentes`
            : `${pendingRatio(reportPending, reports.length)} pendentes`,
          icon: Megaphone,
          color: 'border-orange-200 bg-orange-50 text-orange-800',
          section: 'reports' as MainSection,
        },
        {
          label: 'Consultas',
          value: appointmentPending,
          total: queues.appointments.length,
          helper: 'Agendadas aguardando confirmação',
          icon: CalendarCheck,
          color: 'border-sky-200 bg-sky-50 text-sky-800',
          section: 'content' as MainSection,
          contentTab: 'appointments' as ContentTab,
        },
        {
          label: 'Candidaturas',
          value: applicationPending,
          total: queues.applications.length,
          helper: 'Recebidas ainda não visualizadas',
          icon: ClipboardList,
          color: 'border-violet-200 bg-violet-50 text-violet-800',
          section: 'content' as MainSection,
          contentTab: 'applications' as ContentTab,
        },
        {
          label: 'Matrículas',
          value: enrollmentPending,
          total: queues.enrollments.length,
          helper: 'Pedidos aguardando análise',
          icon: GraduationCap,
          color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
          section: 'content' as MainSection,
          contentTab: 'enrollments' as ContentTab,
        },
        {
          label: 'Emergências',
          value: emergencyActive,
          total: queues.emergencies.length,
          helper: 'Alertas ativos agora',
          icon: Siren,
          color: 'border-red-200 bg-red-50 text-red-800',
          section: 'content' as MainSection,
          contentTab: 'emergency' as ContentTab,
        },
      ],
    };
  }, [demands, queues, reports]);

  const handleRefresh = async () => {
    await Promise.all([onRefreshBase(), loadQueues()]);
  };

  const loading = loadingBase || loadingQueues;
  const error = errorBase || queueError;

  return (
    <section className="space-y-5">
      <div className="glass-panel p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Visao geral operacional</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">Fila de trabalho do painel</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-text-muted">
              Resumo das áreas que exigem acompanhamento administrativo. Use os atalhos para entrar direto nas filas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_2fr]">
          <div className="ring-highlight-dark relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary to-primary-dark p-5 text-white shadow-[0_16px_38px_rgba(26,86,196,0.26)]">
            <div aria-hidden className="hero-grid-overlay" />
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/12 text-white backdrop-blur">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-black leading-none">{stats.totalPending}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/70">Itens pedindo ação</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-white/75">
                {canManageCatalog
                  ? 'Priorize emergências, solicitações e relatos pendentes antes de editar cadastros públicos.'
                  : 'Priorize emergências, solicitações e relatos pendentes para manter as filas em dia.'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.rows.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.section === 'content' && item.contentTab) {
                      onOpenContentTab(item.contentTab);
                      return;
                    }
                    if (item.section !== 'content') {
                      onNavigate(item.section);
                    }
                  }}
                  className={`sheen-on-hover ring-highlight rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${item.color}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <ChevronRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-4 text-2xl font-black leading-none">{item.value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest">{item.label}</p>
                  <p className="mt-2 text-xs font-bold opacity-75">
                    {item.helper} de {item.total} registros
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && <EmptyState title="Indicadores incompletos" description={error} />}

      <div className={`grid gap-4 ${canManageCatalog ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        <div className="civic-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Atendimento</p>
          <h3 className="mt-2 text-lg font-semibold text-text-main">Responder primeiro</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
            Use solicitações e relatos para manter protocolos oficiais com resposta e status atualizados.
          </p>
        </div>
        <div className="civic-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Filas operacionais</p>
          <h3 className="mt-2 text-lg font-semibold text-text-main">Resolver com contexto</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
            Consultas, candidaturas, matrículas e emergências ficam agrupadas para atendimento rápido.
          </p>
        </div>
        {canManageCatalog && (
          <>
            <div className="civic-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Conteudo</p>
              <h3 className="mt-2 text-lg font-semibold text-text-main">Publicar com controle</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
                Avisos, eventos, obras e comércios precisam de workflow de rascunho, publicação e arquivamento.
              </p>
            </div>
            <div className="civic-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Segurança</p>
              <h3 className="mt-2 text-lg font-semibold text-text-main">Registrar ações</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
                Ações sensíveis devem ficar documentadas em auditoria administrativa.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
