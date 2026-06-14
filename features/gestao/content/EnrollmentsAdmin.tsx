'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import { getAllEnrollments, updateEnrollmentStatus } from '@/services/educacao.service';
import { useToast } from '@/lib/toast-context';
import type { Enrollment, EnrollmentStatus } from '@/types';

const STATUS_OPTIONS: { value: EnrollmentStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovada' },
  { value: 'waiting_list', label: 'Lista de espera' },
  { value: 'rejected', label: 'Rejeitada' },
];

const STATUS_CLASS: Record<EnrollmentStatus, string> = {
  pending: 'bg-sky-50 text-sky-700',
  approved: 'bg-emerald-50 text-emerald-700',
  waiting_list: 'bg-amber-50 text-amber-700',
  rejected: 'bg-rose-50 text-rose-700',
};

function getStatusLabel(status: EnrollmentStatus) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

function requiresConfirmation(status: EnrollmentStatus) {
  return status === 'approved' || status === 'rejected';
}

export default function EnrollmentsAdmin() {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | EnrollmentStatus>('all');
  const [search, setSearch] = useState('');
  const [pendingStatus, setPendingStatus] = useState<{ enrollment: Enrollment; status: EnrollmentStatus } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEnrollments(await getAllEnrollments());
    } catch {
      toast('Não foi possível carregar matrículas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enrollments.filter((enrollment) => {
      const searchable = [
        enrollment.protocol,
        enrollment.studentName,
        enrollment.parentName,
        enrollment.parentCpf,
        enrollment.schoolPreference,
        enrollment.address,
        enrollment.cep,
        getStatusLabel(enrollment.status),
      ].join(' ').toLowerCase();
      const matchesSearch = !term || searchable.includes(term);
      const matchesStatus = filter === 'all' || enrollment.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, filter, search]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = enrollments.filter((enrollment) => enrollment.status === item.value).length;
      return acc;
    }, {});
  }, [enrollments]);

  const saveStatusChange = async (enrollment: Enrollment, status: EnrollmentStatus) => {
    if (enrollment.status === status) return;
    setSavingId(enrollment.id);
    try {
      await updateEnrollmentStatus(enrollment.id, status);
      setEnrollments((current) =>
        current.map((item) => (item.id === enrollment.id ? { ...item, status } : item)),
      );
      toast('Status da matrícula atualizado.', 'success');
      setPendingStatus(null);
    } catch {
      toast('Erro ao atualizar matrícula.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = (enrollment: Enrollment, status: EnrollmentStatus) => {
    if (enrollment.status === status) return;
    if (requiresConfirmation(status)) {
      setPendingStatus({ enrollment, status });
      return;
    }
    saveStatusChange(enrollment, status);
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Rede municipal</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Solicitações de matrícula</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Analise pedidos enviados pela matrícula digital e atualize a situação.
            </p>
          </div>
        </div>

        <div className="md:min-w-40" />
      </div>

      <AdminQueueToolbar
        search={search}
        searchPlaceholder="Buscar por protocolo, aluno, responsávelavel, CPF ou escola"
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        loading={loading}
        onSearchChange={setSearch}
        onFilterChange={(value) => setFilter(value as 'all' | EnrollmentStatus)}
        onRefresh={load}
      />
      <AdminStatusSummary
        total={enrollments.length}
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        counts={statusCounts}
        onFilterChange={(value) => setFilter(value as 'all' | EnrollmentStatus)}
      />

      <p className="mt-3 text-xs font-bold text-text-muted">
        Mostrando {filtered.length} de {enrollments.length} matrículas.
      </p>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhuma matrícula encontrada" description="Os pedidos aparecem aqui quando forem enviados." />
      ) : (
        <div className="space-y-3">
          {filtered.map((enrollment) => (
            <article key={enrollment.id} className="civic-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[enrollment.status]}`}>
                      {getStatusLabel(enrollment.status)}
                    </span>
                    <span className="font-mono text-xs font-bold text-text-muted">{enrollment.protocol}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-text-main">{enrollment.studentName}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
                    Responsável: {enrollment.parentName} - CPF {enrollment.parentCpf}
                  </p>
                  <div className="mt-2 grid gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium leading-6 text-text-muted md:grid-cols-2">
                    <span>Nascimento: {enrollment.studentBirth}</span>
                    <span>Escola: {enrollment.schoolPreference}</span>
                    <span className="md:col-span-2">Endereco: {enrollment.address}</span>
                    {enrollment.cep && <span>CEP: {enrollment.cep}</span>}
                  </div>
                </div>

                <select
                  value={enrollment.status}
                  disabled={savingId === enrollment.id}
                  onChange={(event) => handleStatusChange(enrollment, event.target.value as EnrollmentStatus)}
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
        description={pendingStatus ? `Esta ação vai marcar a matrícula de ${pendingStatus.enrollment.studentName} como ${getStatusLabel(pendingStatus.status).toLowerCase()} e enviar notificação ao responsável.` : ''}
        confirmLabel="Confirmar status"
        loading={!!pendingStatus && savingId === pendingStatus.enrollment.id}
        tone={pendingStatus?.status === 'rejected' ? 'danger' : 'default'}
        onConfirm={() => {
          if (pendingStatus) saveStatusChange(pendingStatus.enrollment, pendingStatus.status);
        }}
        onClose={() => setPendingStatus(null)}
      />
    </section>
  );
}
