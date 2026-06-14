'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Hospital, Loader2, Pencil, Save, X } from 'lucide-react';
import { createHealthUnit, getHealthUnits, updateHealthUnit } from '@/services/appointments.service';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast-context';
import type { HealthUnit, HealthUnitType, WaitTimeLevel } from '@/types';

const TYPES: { value: HealthUnitType; label: string }[] = [
  { value: 'upa', label: 'UPA' },
  { value: 'clinica', label: 'Clinica' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'cras', label: 'CRAS' },
];

const WAIT_LEVELS: { value: WaitTimeLevel; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
];

const emptyForm = {
  name: '',
  type: 'clinica' as HealthUnitType,
  address: '',
  phone: '',
  waitTime: '0 min',
  waitLevel: 'low' as WaitTimeLevel,
  isOpen: true,
  openHours: '',
  specialties: '',
};

type FormState = typeof emptyForm;

function parseSpecialties(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function HealthUnitsAdmin() {
  const { toast } = useToast();
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUnits(await getHealthUnits());
    } catch {
      toast('Não foi possível carregar unidades de saúde.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const startEdit = (unit: HealthUnit) => {
    setEditingId(unit.id);
    setForm({
      name: unit.name,
      type: unit.type,
      address: unit.address,
      phone: unit.phone,
      waitTime: unit.waitTime,
      waitLevel: unit.waitLevel,
      isOpen: unit.isOpen,
      openHours: unit.openHours,
      specialties: unit.specialties.join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      toast('Preencha nome e endereco.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim(),
        phone: form.phone.trim(),
        waitTime: form.waitTime.trim() || '0 min',
        waitLevel: form.waitLevel,
        isOpen: form.isOpen,
        openHours: form.openHours.trim(),
        specialties: parseSpecialties(form.specialties),
      };

      if (editingId) {
        await updateHealthUnit(editingId, payload);
        toast('Unidade atualizada.', 'success');
      } else {
        await createHealthUnit(payload);
        toast('Unidade cadastrada.', 'success');
      }

      resetForm();
      load();
    } catch {
      toast('Erro ao salvar unidade.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500/12 text-sky-600">
            <Hospital className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Rede de saude</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar unidade' : 'Cadastrar unidade'}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Alimenta a pagina <code className="font-mono text-xs text-primary">/saude</code> e o fluxo de agendamento.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nome</span>
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</span>
            <select value={form.type} onChange={(event) => updateField('type', event.target.value as HealthUnitType)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Telefone</span>
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereco</span>
            <input value={form.address} onChange={(event) => updateField('address', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tempo de espera</span>
            <input value={form.waitTime} onChange={(event) => updateField('waitTime', event.target.value)} placeholder="Ex: 15 min" className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nivel de espera</span>
            <select value={form.waitLevel} onChange={(event) => updateField('waitLevel', event.target.value as WaitTimeLevel)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {WAIT_LEVELS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Horario</span>
            <input value={form.openHours} onChange={(event) => updateField('openHours', event.target.value)} placeholder="Ex: 7h-17h" className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
            <input type="checkbox" checked={form.isOpen} onChange={(event) => updateField('isOpen', event.target.checked)} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Unidade aberta</span>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Especialidades</span>
            <textarea value={form.specialties} onChange={(event) => updateField('specialties', event.target.value)} rows={4} placeholder="Uma especialidade por linha" className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>

          <div className="md:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editingId && (
              <button type="button" onClick={resetForm} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary">
                <X className="h-4 w-4" />
                Cancelar edicao
              </button>
            )}
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Salvar alterações' : 'Publicar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Cadastradas</p>
          <h3 className="text-lg font-semibold text-text-main">Unidades ({units.length})</h3>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : units.length === 0 ? (
          <EmptyState title="Nenhuma unidade cadastrada" description="Use o formulario acima para cadastrar a primeira unidade." />
        ) : (
          <div className="space-y-3">
            {units.map((unit) => (
              <article key={unit.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-700">{unit.type}</span>
                    <span className={unit.isOpen ? 'rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-700' : 'rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-700'}>
                      {unit.isOpen ? 'Aberta' : 'Fechada'}
                    </span>
                    <span className="text-xs font-bold text-text-muted">{unit.waitTime}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{unit.name}</h4>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">{unit.address}</p>
                  <p className="mt-1 text-xs font-bold text-text-muted">{unit.specialties.join(', ')}</p>
                </div>
                <button type="button" onClick={() => startEdit(unit)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
