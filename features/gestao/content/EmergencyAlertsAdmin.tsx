'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, Siren } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { AdminQueueToolbar, AdminStatusSummary } from '@/features/gestao/content/AdminQueueControls';
import { getAllEmergencyAlerts, updateEmergencyAlertStatus } from '@/services/emergency.service';
import { useToast } from '@/lib/toast-context';
import type { EmergencyAlert, EmergencyAlertStatus, EmergencyAlertType } from '@/types';

const STATUS_OPTIONS: { value: EmergencyAlertStatus; label: string }[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'in_progress', label: 'Em atendimento' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'cancelled', label: 'Cancelado' },
];

const STATUS_CLASS: Record<EmergencyAlertStatus, string> = {
  active: 'bg-red-50 text-red-700',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-zinc-100 text-zinc-700',
};

const TYPE_LABEL: Record<EmergencyAlertType, string> = {
  panic: 'Panico',
  violence: 'Violencia',
  fire: 'Incendio',
  medical: 'Atendimento medico',
  flood: 'Alagamento',
  other: 'Outro',
};

function getStatusLabel(status: EmergencyAlertStatus) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

function requiresConfirmation(status: EmergencyAlertStatus) {
  return status === 'resolved' || status === 'cancelled';
}

export default function EmergencyAlertsAdmin() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | EmergencyAlertStatus>('active');
  const [search, setSearch] = useState('');
  const [pendingStatus, setPendingStatus] = useState<{ alert: EmergencyAlert; status: EmergencyAlertStatus } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAlerts(await getAllEmergencyAlerts());
    } catch {
      toast('Não foi possível carregar alertas emergenciais.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter((alert) => {
      const searchable = [
        alert.protocol,
        alert.location,
        alert.description,
        alert.userName,
        alert.userEmail,
        TYPE_LABEL[alert.type],
        getStatusLabel(alert.status),
      ].join(' ').toLowerCase();
      const matchesSearch = !term || searchable.includes(term);
      const matchesStatus = filter === 'all' || alert.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [alerts, filter, search]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce<Record<string, number>>((acc, item) => {
      acc[item.value] = alerts.filter((alert) => alert.status === item.value).length;
      return acc;
    }, {});
  }, [alerts]);

  const saveStatusChange = async (alert: EmergencyAlert, status: EmergencyAlertStatus) => {
    if (alert.status === status) return;
    setSavingId(alert.id);
    try {
      await updateEmergencyAlertStatus(alert.id, status);
      setAlerts((current) =>
        current.map((item) => (item.id === alert.id ? { ...item, status } : item)),
      );
      toast('Status do alerta atualizado.', 'success');
      setPendingStatus(null);
    } catch {
      toast('Erro ao atualizar alerta.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = (alert: EmergencyAlert, status: EmergencyAlertStatus) => {
    if (alert.status === status) return;
    if (requiresConfirmation(status)) {
      setPendingStatus({ alert, status });
      return;
    }
    saveStatusChange(alert, status);
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-600/12 text-red-600">
            <Siren className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600">Seguranca publica</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Alertas emergenciais</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Acompanhe ocorrências urgentes enviadas pelos cidadãos.
            </p>
          </div>
        </div>

        <div className="md:min-w-40" />
      </div>

      <AdminQueueToolbar
        search={search}
        searchPlaceholder="Buscar por protocolo, local, cidadão, tipo ou descrição"
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        loading={loading}
        onSearchChange={setSearch}
        onFilterChange={(value) => setFilter(value as 'all' | EmergencyAlertStatus)}
        onRefresh={load}
      />
      <AdminStatusSummary
        total={alerts.length}
        filter={filter}
        statusOptions={STATUS_OPTIONS}
        counts={statusCounts}
        onFilterChange={(value) => setFilter(value as 'all' | EmergencyAlertStatus)}
      />

      <p className="mt-3 text-xs font-bold text-text-muted">
        Mostrando {filtered.length} de {alerts.length} alertas.
      </p>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhum alerta encontrado" description="Alertas enviados pela página de segurança aparecem aqui." />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => (
            <article key={alert.id} className="civic-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[alert.status]}`}>
                      {getStatusLabel(alert.status)}
                    </span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-700">
                      {TYPE_LABEL[alert.type]}
                    </span>
                    <span className="font-mono text-xs font-bold text-text-muted">{alert.protocol}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-text-main">{alert.location}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">{alert.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted">
                    <span>{alert.userName}</span>
                    {alert.userEmail && (
                      <a href={`mailto:${alert.userEmail}`} className="inline-flex items-center gap-1 text-primary hover:text-primary-dark">
                        <Mail className="h-3.5 w-3.5" />
                        {alert.userEmail}
                      </a>
                    )}
                  </div>
                </div>

                <select
                  value={alert.status}
                  disabled={savingId === alert.id}
                  onChange={(event) => handleStatusChange(alert, event.target.value as EmergencyAlertStatus)}
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
        description={pendingStatus ? `Esta ação vai marcar o alerta ${pendingStatus.alert.protocol} como ${getStatusLabel(pendingStatus.status).toLowerCase()} e enviar notificação ao cidadão.` : ''}
        confirmLabel="Confirmar status"
        loading={!!pendingStatus && savingId === pendingStatus.alert.id}
        tone={pendingStatus?.status === 'cancelled' ? 'danger' : 'default'}
        onConfirm={() => {
          if (pendingStatus) saveStatusChange(pendingStatus.alert, pendingStatus.status);
        }}
        onClose={() => setPendingStatus(null)}
      />
    </section>
  );
}
