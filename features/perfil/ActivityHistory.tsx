'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CalendarCheck,
  Camera,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Send,
  Siren,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DemandTimeline from '@/features/ouvidoria/DemandTimeline';
import ReportTimeline from '@/features/relatar/ReportTimeline';
import { cancelDemandByCitizen } from '@/services/demands.service';
import { cancelReportByCitizen, createReportMessage } from '@/services/reports.service';
import { uploadReportPhoto } from '@/services/storage.service';
import {
  canCitizenCancelDemand,
  canCitizenCancelReport,
  DEMAND_STATUS_LABEL,
  isReportClosed,
  REPORT_STATUS_LABEL,
} from '@/lib/constants/protocols';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import type {
  ApplicationStatus,
  Appointment,
  AppointmentStatus,
  Demand,
  EmergencyAlert,
  EmergencyAlertStatus,
  Enrollment,
  EnrollmentStatus,
  JobApplication,
  Report,
} from '@/types';

const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Concluída',
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

type ConversationActivity =
  | {
      id: string;
      source: Demand;
      protocol: string;
      type: 'Solicitação';
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
    };

type ActivityItem =
  | ConversationActivity
  | {
      id: string;
      source: null;
      protocol: string;
      type: 'Consulta' | 'Candidatura' | 'Matrícula' | 'Emergência';
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
  const { toast } = useToast();
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ConversationActivity | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const activities: ActivityItem[] = [
    ...demands.map((demand): ActivityItem => ({
      id: demand.id,
      source: demand,
      protocol: demand.protocolId,
      type: 'Solicitação',
      title: demand.subject,
      status: DEMAND_STATUS_LABEL[demand.status],
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
      status: REPORT_STATUS_LABEL[report.status],
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
      type: 'Matrícula',
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
      type: 'Emergência',
      title: alert.location,
      status: emergencyStatusLabel[alert.status],
      unreadByCitizen: false,
      date: alert.createdAt,
      icon: Siren,
    })),
  ].sort((a, b) => getMillis(b.date) - getMillis(a.date));

  const handleCancelProtocol = async () => {
    if (!cancelTarget || !currentUserId) return;
    const reason = cancelReason.trim();
    if (reason.length < 8) {
      toast('Explique o motivo do cancelamento com pelo menos 8 caracteres.', 'error');
      return;
    }
    setCancelling(true);
    try {
      if (cancelTarget.type === 'Solicitação') {
        await cancelDemandByCitizen(cancelTarget.id, currentUserId, reason);
      } else {
        await cancelReportByCitizen(cancelTarget.id, currentUserId, reason);
      }
      toast('Protocolo cancelado.', 'success');
      setOpenItemId(null);
      setCancelTarget(null);
      setCancelReason('');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível cancelar o protocolo.', 'error');
    } finally {
      setCancelling(false);
    }
  };

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
          Abra uma solicitação ou registre um relato. Eles aparecerão aqui automaticamente.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/ouvidoria"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
          >
            Abrir solicitação
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
        const canOpen = item.type === 'Solicitação' || item.type === 'Relato';
        const canCancel =
          (item.type === 'Solicitação' && canCitizenCancelDemand(item.source.status, item.source.isAnonymous)) ||
          (item.type === 'Relato' && canCitizenCancelReport(item.source.status));
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
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-black uppercase tracking-widest text-text-muted">
                    {item.status}
                  </span>
                  {item.unreadByCitizen && (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-black uppercase tracking-widest text-blue-800">
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
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1 text-[11px] font-black uppercase tracking-widest text-primary hover:border-primary"
                  >
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    Conversa
                  </button>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => setCancelTarget(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2 py-1 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {isOpen && item.type === 'Solicitação' && (
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
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                />
                {!isReportClosed(item.source.status) && currentUserId === item.source.reporterId && (
                  <ReportComplementForm
                    report={item.source}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        title="Cancelar protocolo"
        description={cancelTarget ? `O protocolo ${cancelTarget.protocol} será marcado como cancelado e continuará visível no seu histórico.` : ''}
        confirmLabel="Cancelar protocolo"
        loading={cancelling}
        tone="danger"
        onConfirm={handleCancelProtocol}
        onClose={() => {
          setCancelTarget(null);
          setCancelReason('');
        }}
      >
        <label className="block space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Justificativa</span>
          <textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            rows={4}
            maxLength={400}
            placeholder="Explique por que este protocolo deve ser cancelado."
            className="w-full rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 text-text-main outline-none transition focus:border-primary"
          />
          <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            {cancelReason.trim().length}/400
          </span>
        </label>
      </ConfirmDialog>
    </div>
  );
}

function ReportComplementForm({
  report,
  currentUserId,
  currentUserName,
}: {
  report: Report;
  currentUserId: string;
  currentUserName: string;
}) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = `report-complement-photo-${report.id}`;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!currentUserId) {
      toast('Entre com sua conta para anexar foto.', 'error');
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadReportPhoto(currentUserId, file);
      setPhotoURL(uploaded.url);
      toast('Foto complementar anexada.', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível anexar a foto.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = message.trim();
    if (!text && !photoURL) {
      toast('Informe um complemento ou anexe uma foto.', 'error');
      return;
    }

    const payload = [
      text,
      photoURL ? `Foto complementar: ${photoURL}` : '',
    ].filter(Boolean).join('\n\n');

    setSubmitting(true);
    try {
      await createReportMessage({
        reportId: report.id,
        authorId: currentUserId,
        authorName: currentUserName || report.reporterName || 'Cidadão',
        authorRole: 'citizen',
        message: payload,
      });
      setMessage('');
      setPhotoURL('');
      toast('Complemento adicionado ao relato.', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível adicionar o complemento.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-text-main">Complementar relato</p>
          <p className="mt-1 text-xs font-medium leading-5 text-text-muted">
            Use este campo para acrescentar informações ou nova foto. O relato original permanece preservado.
          </p>
        </div>
      </div>

      <label className="mt-3 block space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nova informação</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={800}
          placeholder="Ex: O problema piorou hoje pela manhã, próximo ao poste da esquina."
          className="w-full rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 text-text-main outline-none transition focus:border-primary"
        />
      </label>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor={fileInputId}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-primary transition hover:border-primary"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {uploading ? 'Anexando...' : 'Anexar foto'}
        </label>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          disabled={uploading || submitting}
          onChange={handleFileChange}
          className="sr-only"
        />
        {photoURL && (
          <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
            Foto complementar pronta para enviar
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
          {message.trim().length}/800
        </span>
        <button
          type="submit"
          disabled={uploading || submitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Adicionar complemento
        </button>
      </div>
    </form>
  );
}
