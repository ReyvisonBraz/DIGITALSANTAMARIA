'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import StatusUpdater from '@/features/gestao/StatusUpdater';
import MetricsDashboard from '@/features/gestao/MetricsDashboard';
import { formatDate } from '@/lib/utils/formatters';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function GestaoPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const { reports, loading, error, refresh } = useAdminData();

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user || userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 border-4 border-red-100">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-text-main uppercase tracking-tighter mb-4">Acesso Restrito</h1>
        <p className="text-text-muted font-ui font-medium max-w-md">
          Você não tem permissão para acessar o painel de gestão.
        </p>
      </div>
    );
  }

  const metrics = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    inReview: reports.filter((r) => r.status === 'in_review').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 pb-32 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
          <ShieldCheck className="w-4 h-4" />
          Painel Administrativo
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-tighter">
          Gestão Municipal
        </h1>
      </div>

      <MetricsDashboard {...metrics} />

      <div className="space-y-4">
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Relatos Pendentes</h2>

        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : error ? (
          <EmptyState title="Erro ao carregar" description={error} />
        ) : reports.length === 0 ? (
          <EmptyState title="Nenhum relato pendente" description="Todos os relatos foram processados." />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-3xl border-2 border-border shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[8px] font-black uppercase tracking-widest">
                        {report.type}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">{formatDate(report.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-black text-text-main uppercase">{report.title}</h3>
                    <p className="text-xs text-text-muted font-ui line-clamp-2">{report.description}</p>
                    <p className="text-[9px] font-bold text-text-muted uppercase">Por: {report.reporterName} • Protocolo: {report.protocol}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-full text-[8px] font-black uppercase tracking-widest">
                    {report.status}
                  </span>
                  <StatusUpdater reportId={report.id} clerkId={user.uid} onUpdate={refresh} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
