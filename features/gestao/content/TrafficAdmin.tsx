'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { AlertTriangle, Archive, Car, Loader2, MapPin, Save } from 'lucide-react';
import { createContentService } from '@/services/content.service';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import type { TrafficAlert } from '@/types';

const service = createContentService<TrafficAlert>('traffic_alerts');

const TYPES: { value: TrafficAlert['type']; label: string }[] = [
  { value: 'acidente',   label: 'Acidente' },
  { value: 'obra',       label: 'Obra' },
  { value: 'desvio',     label: 'Desvio' },
  { value: 'blitz',      label: 'Blitz' },
  { value: 'evento',     label: 'Evento' },
  { value: 'alagamento', label: 'Alagamento' },
];

const SEVERITIES: { value: TrafficAlert['severity']; label: string }[] = [
  { value: 'baixa',    label: 'Baixa' },
  { value: 'media',    label: 'Média' },
  { value: 'alta',     label: 'Alta' },
  { value: 'critica',  label: 'Crítica' },
];

const SEVERITY_BADGE: Record<TrafficAlert['severity'], string> = {
  baixa: 'bg-blue-50 text-blue-700 border-blue-200',
  media: 'bg-amber-50 text-amber-700 border-amber-200',
  alta: 'bg-orange-50 text-orange-700 border-orange-200',
  critica: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function TrafficAdmin() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TrafficAlert['type']>('obra');
  const [severity, setSeverity] = useState<TrafficAlert['severity']>('media');
  const [location, setLocation] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.list();
      setAlerts(list);
    } catch {
      toast('Não foi possível carregar os alertas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('obra');
    setSeverity('media');
    setLocation('');
    setValidUntil('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast('Preencha título, descrição e local.', 'error');
      return;
    }

    setSaving(true);
    try {
      await service.create({
        title: title.trim(),
        description: description.trim(),
        status: 'published',
        type,
        severity,
        location: location.trim(),
        lat: null,
        lng: null,
        validUntil,
      });
      toast('Alerta de trânsito publicado.', 'success');
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar o alerta.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Encerrar este alerta? Ele deixa de aparecer na página pública.')) return;
    try {
      await service.archive(id);
      toast('Alerta encerrado.', 'success');
      load();
    } catch {
      toast('Erro ao encerrar.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Mobilidade</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Publicar alerta de trânsito</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece em <code className="font-mono text-xs text-primary">/transito</code> imediatamente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Título</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} required
              placeholder='Ex: "Bloqueio na Av. Brasil por obra"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} required
              placeholder="Detalhes da situação e o que o motorista deve fazer."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</span>
            <select value={type} onChange={(e) => setType(e.target.value as TrafficAlert['type'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Severidade</span>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as TrafficAlert['severity'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {SEVERITIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Local</span>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required maxLength={200}
              placeholder='Ex: "Av. Brasil esquina com Rua das Flores"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Vigência até</span>
            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publicar
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Ativos</p>
            <h3 className="text-lg font-semibold text-text-main">Alertas de trânsito ({alerts.length})</h3>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState title="Nenhum alerta ativo" description="Use o formulário acima para publicar um alerta de trânsito." />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <article key={alert.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest', SEVERITY_BADGE[alert.severity])}>
                      <AlertTriangle className="h-3 w-3" />
                      {alert.severity}
                    </span>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      {alert.type}
                    </span>
                    <span className="text-xs font-bold text-text-muted">{formatDate(alert.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{alert.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{alert.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {alert.location}
                  </p>
                  {alert.validUntil && (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      Vigente até {alert.validUntil}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => handleArchive(alert.id)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600">
                  <Archive className="h-3.5 w-3.5" />
                  Encerrar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
