'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Briefcase, Loader2, Pencil, Save, X } from 'lucide-react';
import { createJob, getAllJobs, updateJob } from '@/services/jobs.service';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Job, JobType } from '@/types';

const TYPES: { value: JobType; label: string }[] = [
  { value: 'clt', label: 'CLT' },
  { value: 'pj', label: 'PJ' },
  { value: 'temporario', label: 'Temporario' },
  { value: 'estagio', label: 'Estagio' },
  { value: 'voluntario', label: 'Voluntario' },
];

const emptyForm = {
  employerName: 'Prefeitura Municipal',
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  salary: '',
  type: 'clt' as JobType,
  location: '',
  tags: '',
  isActive: true,
  isFeatured: false,
};

type FormState = typeof emptyForm;

function parseList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function JobsAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setJobs(await getAllJobs());
    } catch {
      toast('Nao foi possivel carregar vagas.', 'error');
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

  const startEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      employerName: job.employerName,
      title: job.title,
      description: job.description,
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
      salary: job.salary || '',
      type: job.type,
      location: job.location,
      tags: job.tags.join('\n'),
      isActive: job.isActive,
      isFeatured: job.isFeatured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast('Preencha titulo, descricao e local.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        employerId: user?.uid || 'municipio',
        employerName: form.employerName.trim() || 'Prefeitura Municipal',
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: parseList(form.requirements),
        benefits: parseList(form.benefits),
        salary: form.salary.trim() || null,
        type: form.type,
        location: form.location.trim(),
        tags: parseList(form.tags),
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      };

      if (editingId) {
        await updateJob(editingId, payload);
        toast('Vaga atualizada.', 'success');
      } else {
        await createJob(payload);
        toast('Vaga publicada.', 'success');
      }

      resetForm();
      load();
    } catch {
      toast('Erro ao salvar vaga.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Banco de talentos</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar vaga' : 'Publicar vaga'}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece em <code className="font-mono text-xs text-primary">/empregos</code> e aceita candidaturas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Titulo</span>
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descricao</span>
            <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Empregador</span>
            <input value={form.employerName} onChange={(event) => updateField('employerName', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</span>
            <select value={form.type} onChange={(event) => updateField('type', event.target.value as JobType)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Local</span>
            <input value={form.location} onChange={(event) => updateField('location', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Salario</span>
            <input value={form.salary} onChange={(event) => updateField('salary', event.target.value)} placeholder="Ex: R$ 1.800" className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Requisitos</span>
            <textarea value={form.requirements} onChange={(event) => updateField('requirements', event.target.value)} rows={3} placeholder="Um requisito por linha" className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Beneficios</span>
            <textarea value={form.benefits} onChange={(event) => updateField('benefits', event.target.value)} rows={3} placeholder="Um beneficio por linha" className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tags</span>
            <textarea value={form.tags} onChange={(event) => updateField('tags', event.target.value)} rows={2} placeholder="Uma tag por linha" className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
            <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Vaga ativa</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
            <input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField('isFeatured', event.target.checked)} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Destaque</span>
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
              {editingId ? 'Salvar alteracoes' : 'Publicar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Publicadas</p>
          <h3 className="text-lg font-semibold text-text-main">Vagas ({jobs.length})</h3>
        </div>
        {loading ? (
          <div className="flex min-h-32 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : jobs.length === 0 ? (
          <EmptyState title="Nenhuma vaga ativa" description="Use o formulario acima para publicar uma vaga." />
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <article key={job.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">{job.type}</span>
                    {job.isFeatured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">Destaque</span>}
                    <span className="text-xs font-bold text-text-muted">{job.applicationCount} candidatura{job.applicationCount === 1 ? '' : 's'}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{job.title}</h4>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">{job.employerName} - {job.location}</p>
                </div>
                <button type="button" onClick={() => startEdit(job)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary">
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
