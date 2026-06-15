import type { DemandStatus, ReportStatus } from '@/types';

export const DEMAND_STATUS_LABEL: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  solved: 'Resolvida',
  rejected: 'Recusada',
  cancelled: 'Cancelada',
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em análise',
  resolved: 'Resolvido',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
};

export const OPEN_DEMAND_STATUSES: DemandStatus[] = ['pending', 'analyzing'];
export const OPEN_REPORT_STATUSES: ReportStatus[] = ['pending', 'in_review'];

export function canCitizenCancelDemand(status: DemandStatus, isAnonymous = false): boolean {
  return !isAnonymous && OPEN_DEMAND_STATUSES.includes(status);
}

export function canCitizenCancelReport(status: ReportStatus): boolean {
  return OPEN_REPORT_STATUSES.includes(status);
}

export function isDemandClosed(status: DemandStatus): boolean {
  return status === 'solved' || status === 'rejected' || status === 'cancelled';
}

export function isReportClosed(status: ReportStatus): boolean {
  return status === 'resolved' || status === 'rejected' || status === 'cancelled';
}
