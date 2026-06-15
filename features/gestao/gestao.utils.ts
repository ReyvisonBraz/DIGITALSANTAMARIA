import type { Demand, DemandStatus, DemandType, Report, ReportStatus, ReportType } from '@/types';
import {
  AlertCircle,
  Building2,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Megaphone,
  MessageSquareWarning,
  ShieldAlert,
} from 'lucide-react';

// ─── Demandas ────────────────────────────────────────────────────────────────

export const demandStatusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  solved: 'Resolvida',
  rejected: 'Recusada',
  cancelled: 'Cancelada',
};

export const demandTypeLabel: Record<DemandType, string> = {
  reclamacao: 'Reclamação',
  sugestao: 'Solicitação',
  denuncia: 'Denúncia',
  elogio: 'Elogio',
};

export const demandTypeMeta = {
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

export const demandStatusMeta = {
  pending:   { className: 'border-amber-200 bg-amber-50 text-amber-800' },
  analyzing: { className: 'border-blue-200 bg-blue-50 text-blue-800' },
  solved:    { className: 'border-green-200 bg-green-50 text-green-800' },
  rejected:  { className: 'border-red-200 bg-red-50 text-red-800' },
  cancelled: { className: 'border-zinc-200 bg-zinc-50 text-zinc-700' },
} satisfies Record<DemandStatus, { className: string }>;

export const demandStatusOptions: { value: DemandStatus; label: string }[] = [
  { value: 'pending',   label: 'Pendente' },
  { value: 'analyzing', label: 'Em análise' },
  { value: 'solved',    label: 'Resolvida' },
  { value: 'rejected',  label: 'Recusada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export function normalizeDemandStatus(status: string): DemandStatus {
  if (status === 'in_review') return 'analyzing';
  if (status === 'pending' || status === 'analyzing' || status === 'solved' || status === 'rejected' || status === 'cancelled') {
    return status;
  }
  return 'pending';
}

export function normalizeDemandType(type: string): DemandType {
  if (type === 'solicitação') return 'sugestao';
  if (type === 'reclamacao' || type === 'sugestao' || type === 'denuncia' || type === 'elogio') {
    return type;
  }
  return 'reclamacao';
}

export function getDemandStatusLabel(status: string) {
  return demandStatusLabel[normalizeDemandStatus(status)];
}

export function getDemandTypeLabel(type: string) {
  return demandTypeLabel[normalizeDemandType(type)];
}

export function hasUnreadStaffMessage(demand: Demand) {
  return demand.conversation?.unreadByStaff === true;
}

export function buildDemandSearchText(demand: Demand) {
  return [
    demand.protocolId,
    demand.subject,
    demand.content.text,
    demand.category,
    getDemandStatusLabel(String(demand.status)),
    getDemandTypeLabel(String(demand.type)),
    demand.conversation?.lastMessageAuthorName,
    hasUnreadStaffMessage(demand) ? 'nova resposta cidadão' : '',
  ].join(' ').toLowerCase();
}

// ─── Relatos ─────────────────────────────────────────────────────────────────

export const reportStatusLabel: Record<ReportStatus, string> = {
  pending:   'Pendente',
  in_review: 'Em análise',
  resolved:  'Resolvido',
  rejected:  'Recusado',
  cancelled: 'Cancelado',
};

export const reportTypeLabel: Record<ReportType, string> = {
  infrastructure: 'Infraestrutura',
  environment:    'Meio ambiente',
  security:       'Segurança',
  other:          'Outro',
};

export const reportTypeMeta = {
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

export const reportStatusMeta = {
  pending:   { className: 'border-amber-200 bg-amber-50 text-amber-800' },
  in_review: { className: 'border-blue-200 bg-blue-50 text-blue-800' },
  resolved:  { className: 'border-green-200 bg-green-50 text-green-800' },
  rejected:  { className: 'border-red-200 bg-red-50 text-red-800' },
  cancelled: { className: 'border-zinc-200 bg-zinc-50 text-zinc-700' },
} satisfies Record<ReportStatus, { className: string }>;

export const reportStatusOptions: { value: ReportStatus; label: string }[] = [
  { value: 'pending',   label: 'Pendente' },
  { value: 'in_review', label: 'Em análise' },
  { value: 'resolved',  label: 'Resolvido' },
  { value: 'rejected',  label: 'Recusado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function hasUnreadReportStaffMessage(report: Report) {
  return report.conversation?.unreadByStaff === true;
}

export function buildReportSearchText(report: Report) {
  return [
    report.protocolId,
    report.title,
    report.description,
    report.reporterName,
    reportTypeLabel[report.type],
    reportStatusLabel[report.status],
    report.conversation?.lastMessageAuthorName,
    hasUnreadReportStaffMessage(report) ? 'nova resposta cidadão' : '',
  ].join(' ').toLowerCase();
}

// ─── Utilitários compartilhados ───────────────────────────────────────────────

/** Converte Firestore Timestamp ou objeto com `seconds` em milissegundos. */
export function timestampMillis(value: { seconds?: number } | unknown): number {
  if (value && typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }
  return 0;
}
