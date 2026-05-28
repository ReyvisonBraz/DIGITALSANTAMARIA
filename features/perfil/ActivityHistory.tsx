'use client';

import Link from 'next/link';
import { ClipboardList, Clock, FileText, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import type { Demand, DemandStatus, Report, ReportStatus } from '@/types';

const demandStatusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const reportStatusLabel: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em análise',
  resolved: 'Resolvido',
  rejected: 'Recusado',
};

function getMillis(value: Demand['createdAt'] | Report['createdAt']) {
  if (value && typeof value === 'object' && 'seconds' in value) {
    return value.seconds * 1000;
  }
  return new Date(String(value)).getTime();
}

interface ActivityHistoryProps {
  demands: Demand[];
  reports: Report[];
  loading?: boolean;
}

export default function ActivityHistory({ demands, reports, loading = false }: ActivityHistoryProps) {
  const activities = [
    ...demands.map((demand) => ({
      id: demand.id,
      protocol: demand.protocolId,
      type: 'Solicitação',
      title: demand.subject,
      status: demandStatusLabel[demand.status],
      date: demand.createdAt,
      icon: ClipboardList,
    })),
    ...reports.map((report) => ({
      id: report.id,
      protocol: report.protocol,
      type: 'Relato',
      title: report.title,
      status: reportStatusLabel[report.status],
      date: report.createdAt,
      icon: FileText,
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
          Abra uma solicitação ou registre um relato — eles aparecerão aqui automaticamente.
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
      {activities.slice(0, 8).map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="civic-card grid grid-cols-[auto_1fr] gap-3 p-4 sm:grid-cols-[auto_1fr_auto]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <item.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-black text-text-main">{item.title}</p>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
                {item.status}
              </span>
            </div>
            <p className="mt-1 break-all font-mono text-xs font-bold text-primary">{item.protocol}</p>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-text-muted sm:col-span-1">
            <Clock className="h-4 w-4" />
            {formatDate(item.date)}
          </div>
        </div>
      ))}
    </div>
  );
}
