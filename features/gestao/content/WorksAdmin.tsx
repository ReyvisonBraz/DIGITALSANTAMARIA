'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Archive, HardHat, Loader2, MapPin, Save } from 'lucide-react';
import { createContentService } from '@/services/content.service';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast-context';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import type { Work } from '@/types';

const service = createContentService<Work>('works');

const CATEGORIES: { value: Work['category']; label: string }[] = [
  { value: 'asfalto',    label: 'Asfalto' },
  { value: 'saneamento', label: 'Saneamento' },
  { value: 'escola',     label: 'Escola' },
  { value: 'hospital',   label: 'Hospital' },
  { value: 'praca',      label: 'Praça' },
  { value: 'ponte',      label: 'Ponte' },
  { value: 'outros',     label: 'Outros' },
];

export default function WorksAdmin() {
  const { toast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Work['category']>('asfalto');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [budget, setBudget] = useState('');
  const [progress, setProgress] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contractor, setContractor] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.list();
      setWorks(list);
    } catch {
      toast('Não foi possível carregar as obras.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('asfalto');
    setAddress('');
    setNeighborhood('');
    setBudget('');
    setProgress('0');
    setStartDate('');
    setEndDate('');
    setContractor('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      toast('Preencha título, descrição e endereço.', 'error');
      return;
    }
    const progressNum = Math.max(0, Math.min(100, Number(progress) || 0));
    const budgetNum = Math.max(0, Number(budget) || 0);

    setSaving(true);
    try {
      await service.create({
        title: title.trim(),
        description: description.trim(),
        status: 'published',
        category,
        address: address.trim(),
        neighborhood: neighborhood.trim(),
        budget: budgetNum,
        progress: progressNum,
        startDate,
        endDate,
        contractor: contractor.trim(),
        imageURL: null,
        updates: [],
      });
      toast('Obra publicada.', 'success');
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar a obra.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Arquivar esta obra? Ela deixa de aparecer na página pública.')) return;
    try {
      await service.archive(id);
      toast('Obra arquivada.', 'success');
      load();
    } catch {
      toast('Erro ao arquivar.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/22 text-primary-dark">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Infraestrutura</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Publicar obra pública</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece em <code className="font-mono text-xs text-primary">/obras</code> com barra de progresso e informações.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Título</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} required
              placeholder='Ex: "Recapeamento da Av. Brasil"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} required
              placeholder="Resumo do que está sendo feito e por que."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as Work['category'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Empresa responsável</span>
            <input type="text" value={contractor} onChange={(e) => setContractor(e.target.value)} maxLength={120}
              placeholder='Ex: "Construtora Pará"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereço</span>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={200}
              placeholder="Rua, número, ponto de referência"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Bairro</span>
            <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} maxLength={80}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Orçamento (R$)</span>
            <input type="number" min="0" step="1000" value={budget} onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: 250000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Início</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Previsão de término</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Progresso ({progress}%)</span>
            <input type="range" min="0" max="100" step="5" value={progress} onChange={(e) => setProgress(e.target.value)}
              className="w-full accent-primary" />
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Publicadas</p>
            <h3 className="text-lg font-semibold text-text-main">Obras em andamento ({works.length})</h3>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : works.length === 0 ? (
          <EmptyState title="Nenhuma obra publicada" description="Use o formulário acima para registrar a primeira obra." />
        ) : (
          <div className="space-y-3">
            {works.map((work) => (
              <article key={work.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                      {work.category}
                    </span>
                    {work.budget > 0 && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        {formatCurrency(work.budget)}
                      </span>
                    )}
                    <span className="text-xs font-bold text-text-muted">{formatDate(work.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{work.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{work.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {work.address}{work.neighborhood ? ` — ${work.neighborhood}` : ''}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      <span>Progresso</span>
                      <span>{work.progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${work.progress}%` }} />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleArchive(work.id)}
                  className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600')}>
                  <Archive className="h-3.5 w-3.5" />
                  Arquivar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
