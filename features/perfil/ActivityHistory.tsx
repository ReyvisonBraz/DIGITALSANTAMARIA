'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Siren,
} from 'lucide-react';
import DemandTimeline from '@/features/ouvidoria/DemandTimeline';
import ReportTimeline from '@/features/relatar/ReportTimeline';
import { formatDate } from '@/lib/utils/formatters';
import type {
  ApplicationStatus,
  Appointment,
  AppointmentStatus,
  Demand,
  DemandStatus,
  EmergencyAlert,
  EmergencyAlertStatus,
  Enrollment,
  EnrollmentStatus,
  JobApplication,
  Report,
  ReportStatus,
} from '@/types';

const demandStatusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em analise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const reportStatusLabel: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em analise',
  resolved: 'Resolvido',
  rejected: 'Recusado',
};

const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Concluida',
  cancelled: 'Cancelada',
};

const applicationStatusLabel: Record<ApplicationStatus, string> = {
  applied: 'Recebida',
  viewed: 'Visualizada',
  interview: 'Entrevista',
  hired: 'Aprovada',
  rejected: 'Rejeitada',
};

const enrollmentStatusLabel: Record<EnrollmentStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  waiting_list: 'Lista de espera',
};

const emergencyStatusLabel: Record<EmergencyAlertStatus, string> = {
  active: 'Ativo',
  in_progress: 'Em atendimento',
  resolved: 'Resolvido',
  cancelled: 'Cancelado',
};

type ActivityDate =
  | Demand['createdAt']
  | Report['createdAt']
  | Appointment['createdAt']
  | JobApplication['createdAt']
  | Enrollment['createdAt']
  | EmergencyAlert['createdAt'];

type ActivityItem =
  | {
      id: string;
      source: Demand;
      protocol: string;
      type: 'Solicitacao';
      title: string;
      status: string;
      unreadByCitizen: boolean;
      date: ActivityDate;
      icon: typeof ClipboardList;
    }
  | {
      id: string;
      source: Report;
      protocol: string;
      type: 'Relato';
      title: string;
      status: string;
      unreadByCitizen: boolean;
      date: ActivityDate;
      icon: typeof FileText;
    }
  | {
      id: string;
      source: null;
      protocol: string;
      type: 'Consulta' | 'Candidatura' | 'Matricula' | 'Emergencia';
      title: string;
      status: string;
      unreadByCitizen: false;
      date: ActivityDate;
      icon: typeof CalendarCheck;
    };

function getMillis(value: ActivityDate) {
  if (value && typeof value === 'object' && 'seconds' in value) {
    return value.seconds * 1000;
  }
  return new Date(String(value)).getTime();
}

interface ActivityHistoryProps {
  demands: Demand[];
  reports: Report[];
  currentUserId?: string;
  currentUserName?: string;
  appointments?: Appointment[];
  applications?: JobApplication[];
  enrollments?: Enrollment[];
  emergencyAlerts?: EmergencyAlert[];
  loading?: boolean;
}

export default function ActivityHistory({
  demands,
  reports,
  currentUserId = '',
  currentUserName = '',
  appointments = [],
  applications = [],
  enrollments = [],
  emergencyAlerts = [],
  loading = false,
}: ActivityHistoryProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const activities: ActivityItem[] = [
    ...demands.map((demand): ActivityItem => ({
      id: demand.id,
      source: demand,
      protocol: demand.protocolId,
      type: 'Solicitacao',
      title: demand.subject,
      status: demandStatusLabel[demand.status],
      unreadByCitizen: demand.conversation?.unreadByCitizen === true,
      date: demand.createdAt,
      icon: ClipboardList,
    })),
    ...reports.map((report): ActivityItem => ({
      id: report.id,
      source: report,
      protocol: report.protocolId,
      type: 'Relato',
      title: report.title,
      status: reportStatusLabel[report.status],
      unreadByCitizen: report.conversation?.unreadByCitizen === true,
      date: report.createdAt,
      icon: FileText,
    })),
    ...appointments.map((appointment): ActivityItem => ({
      id: appointment.id,
      source: null,
      protocol: `${appointment.date} ${appointment.time}`,
      type: 'Consulta',
      title: `${appointment.specialty} - ${appointment.unitName}`,
      status: appointmentStatusLabel[appointment.status],
      unreadByCitizen: false,
      date: appointment.createdAt,
      icon: CalendarCheck,
    })),
    ...applications.map((application): ActivityItem => ({
      id: application.id,
      source: null,
      protocol: `CAND-${application.id.slice(0, 6).toUpperCase()}`,
      type: 'Candidatura',
      title: application.jobTitle,
      status: applicationStatusLabel[application.status],
      unreadByCitizen: false,
      date: application.createdAt,
      icon: Briefcase,
    })),
    ...enrollments.map((enrollment): ActivityItem => ({
      id: enrollment.id,
      source: null,
      protocol: enrollment.protocol,
      type: 'Matricula',
      title: enrollment.studentName,
      status: enrollmentStatusLabel[enrollment.status],
      unreadByCitizen: false,
      date: enrollment.createdAt,
      icon: GraduationCap,
    })),
    ...emergencyAlerts.map((alert): ActivityItem => ({
      id: alert.id,
      source: null,
      protocol: alert.protocol,
      type: 'Emergencia',
      title: alert.location,
      status: emergencyStatusLabel[alert.status],
      unreadByCitizen: false,
      date: alert.createdAt,
      icon: Siren,
    })),
  ].sort((a, b) => getMillis(b.date) - getMillis(a.date));

  if (loading) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-text-main">Nenhum protocolo ainda</p>
        <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
          Abra uma solicitacao ou registre um relato. Eles aparecerao aqui automaticamente.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/ouvidoria"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
          >
            Abrir solicitacao
          </Link>
          <Link
            href="/relatar"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-main hover:border-primary hover:text-primary"
          >
            Relatar problema
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((item) => {
        const itemKey = `${item.type}-${item.id}`;
        const canOpen = item.type === 'Solicitacao' || item.type === 'Relato';
        const isOpen = openItemId === itemKey;
        const Icon = item.icon;

        return (
          <div
            key={itemKey}
            className={`civic-card overflow-hidden ${isOpen ? 'ring-2 ring-primary/20' : ''} ${
              item.unreadByCitizen ? 'border-primary/40 bg-blue-50/40' : ''
            }`}
          >
            <div className="grid grid-cols-[auto_1fr] gap-3 p-4 sm:grid-cols-[auto_1fr_auto]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-black text-text-main">{item.title}</p>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {item.status}
                  </span>
                  {item.unreadByCitizen && (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-800">
                      Nova resposta
                    </span>
                  )}
                </div>
                <p className="mt-1 break-all font-mono text-xs font-bold text-primary">{item.protocol}</p>
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted sm:col-span-1 sm:justify-end">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDate(item.date)}
                </span>
                {canOpen && (
                  <button
                    type="button"
                    onClick={() => setOpenItemId(isOpen ? null : itemKey)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary hover:border-primary"
                  >
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    Conversa
                  </button>
                )}
              </div>
            </div>

            {isOpen && item.type === 'Solicitacao' && (
              <div className="border-t border-border p-4">
                <DemandTimeline
                  demand={item.source}
                  compact
                  allowCitizenReply
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                />
              </div>
            )}
            {isOpen && item.type === 'Relato' && (
              <div className="border-t border-border p-4">
                <ReportTimeline
                  report={item.source}
                  compact
                  allowCitizenReply
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
