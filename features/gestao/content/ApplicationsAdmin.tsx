'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, Loader2, Mail } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import { getAllApplications, updateApplicationStatus } from '@/services/jobs.service';
import { useToast } from '@/lib/toast-context';
import type { ApplicationStatus, JobApplication } from '@/types';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'applied', label: 'Recebida' },
  { value: 'viewed', label: 'Visualizada' },
  { value: 'interview', label: 'Entrevista' },
  { value: 'hired', label: 'Contratada' },
  { value: 'rejected', label: 'Rejeitada' },
];

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  applied: 'bg-sky-50 text-sky-700',
  viewed: 'bg-violet-50 text-violet-700',
  interview: 'bg-amber-50 text-amber-700',
  hired: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
};

function getStatusLabel(status: ApplicationStatus) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

function requiresConfirmation(status: ApplicationStatus) {
  return status === 'hired' || status === 'rejected';
}

export default function ApplicationsAdmin() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [search, setSearch] = useState('');
  const [pendingStatus, setPendingStatus] = useState<{ application: JobApplication; status: ApplicationStatus } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setApplications(await getAllApplications());
    } catch {
      toast('Não foi possível carregar candidaturas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((application) => {
      const searchable = [
        application.jobTitle,
        application.applicantName,
        application.applicantEmail,
        application.coverLetter,
        getStatusLabel(application.status),
      ].join(' ').toLowerCase();
      const matchesSearch = !term || searchable.includes(term);
      const matchesStatus = filter === 'all' || application.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, filter, search]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = applications.filter((application) => application.status === item.value).length;
      return acc;
    }, {});
  }, [applications]);

  const saveStatusChange = async (application: JobApplication, status: ApplicationStatus) => {
    if (application.status === status) return;
    setSavingId(application.id);
    try {
      await updateApplicationStatus(application.id, status);
      setApplications((current) =>
        current.map((item) => (item.id === application.id ? { ...item, status } : item)),
      );
      toast('Status da candidatura atualizado.', 'success');
      setPendingStatus(null);
    } catch {
      toast('Erro ao atualizar candidatura.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = (application: JobApplication, status: ApplicationStatus) => {
    if (application.status === status) return;
    if (requiresConfirmation(status)) {
      setPendingStatus({ application, status });
      return;
    }
    saveStatusChange(application, status);
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Banco de talentos</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Candidaturas recebidas</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Acompanhe interessados nas vagas e avance o status do processo.
            </p>
          </div>
        </div>

        <div className="md:min-w-40" />
      </div>

      <AdminQueueToolbar
        search={search}
        searchPlaceholder="Buscar por vaga, candidato, email ou texto"
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        loading={loading}
        onSearchChange={setSearch}
        onFilterChange={(value) => setFilter(value as 'all' | ApplicationStatus)}
        onRefresh={load}
      />
      <AdminStatusSummary
        total={applications.length}
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        counts={statusCounts}
        onFilterChange={(value) => setFilter(value as 'all' | ApplicationStatus)}
      />

      <p className="mt-3 text-xs font-bold text-text-muted">
        Mostrando {filtered.length} de {applications.length} candidaturas.
      </p>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhuma candidatura encontrada" description="As candidaturas aparecem aqui quando os usuarios se inscreverem." />
      ) : (
        <div className="space-y-3">
          {filtered.map((application) => (
            <article key={application.id} className="civic-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[application.status]}`}>
                      {getStatusLabel(application.status)}
                    </span>
                    <span className="text-xs font-bold text-text-muted">{application.jobTitle}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-text-main">{application.applicantName}</h3>
                  <a
                    href={`mailto:${application.applicantEmail}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-primary-dark"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {application.applicantEmail}
                  </a>
                  {application.coverLetter && (
                    <p className="mt-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium leading-6 text-text-muted">
                      {application.coverLetter}
                    </p>
                  )}
                </div>

                <select
                  value={application.status}
                  disabled={savingId === application.id}
                  onChange={(event) => handleStatusChange(application, event.target.value as ApplicationStatus)}
                  className="h-10 rounded-xl border border-border bg-white px-3 text-xs font-black uppercase tracking-widest text-text-main outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!pendingStatus}
        title={pendingStatus ? `Confirmar ${getStatusLabel(pendingStatus.status).toLowerCase()}` : 'Confirmar status'}
        description={pendingStatus ? `Esta ação vai marcar a candidatura de ${pendingStatus.application.applicantName} como ${getStatusLabel(pendingStatus.status).toLowerCase()} e enviar notificação ao candidato.` : ''}
        confirmLabel="Confirmar status"
        loading={!!pendingStatus && savingId === pendingStatus.application.id}
        tone={pendingStatus?.status === 'rejected' ? 'danger' : 'default'}
        onConfirm={() => {
          if (pendingStatus) saveStatusChange(pendingStatus.application, pendingStatus.status);
        }}
        onClose={() => setPendingStatus(null)}
      />
    </section>
  );
}
