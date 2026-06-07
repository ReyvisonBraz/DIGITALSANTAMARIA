'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Loader2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { getAllAppointments, updateAppointmentStatus } from '@/services/appointments.service';
import { useToast } from '@/lib/toast-context';
import type { Appointment, AppointmentStatus } from '@/types';

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'completed', label: 'Concluida' },
  { value: 'cancelled', label: 'Cancelada' },
];

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  scheduled: 'bg-sky-50 text-sky-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-zinc-100 text-zinc-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

function getStatusLabel(status: AppointmentStatus) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

export default function AppointmentsAdmin() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAppointments(await getAllAppointments());
    } catch {
      toast('Nao foi possivel carregar consultas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const handleStatusChange = async (appointment: Appointment, status: AppointmentStatus) => {
    if (appointment.status === status) return;
    setSavingId(appointment.id);
    try {
      await updateAppointmentStatus(appointment.id, status);
      setAppointments((current) =>
        current.map((item) => (item.id === appointment.id ? { ...item, status } : item)),
      );
      toast('Status da consulta atualizado.', 'success');
    } catch {
      toast('Erro ao atualizar consulta.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Agenda de saude</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Consultas solicitadas</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Confirme, conclua ou cancele agendamentos feitos pelos cidadaos.
            </p>
          </div>
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as 'all' | AppointmentStatus)}
          className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
        >
          <option value="all">Todos os status</option>
          {STATUS_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nenhuma consulta encontrada" description="Os agendamentos aparecem aqui quando forem enviados." />
      ) : (
        <div className="space-y-3">
          {filtered.map((appointment) => (
            <article key={appointment.id} className="civic-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[appointment.status]}`}>
                      {getStatusLabel(appointment.status)}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {appointment.date} as {appointment.time}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-text-main">{appointment.userName}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
                    {appointment.specialty} - {appointment.unitName}
                  </p>
                  {appointment.notes && (
                    <p className="mt-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium leading-6 text-text-muted">
                      {appointment.notes}
                    </p>
                  )}
                </div>

                <select
                  value={appointment.status}
                  disabled={savingId === appointment.id}
                  onChange={(event) => handleStatusChange(appointment, event.target.value as AppointmentStatus)}
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
    </section>
  );
}
