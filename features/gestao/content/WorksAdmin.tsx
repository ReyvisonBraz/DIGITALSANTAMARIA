'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { HardHat, Loader2, MapPin, Pencil, Save, X } from 'lucide-react';
import { createContentService } from '@/services/content.service';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import {
  ContentListControls,
  ContentQuickActions,
  ContentPreviewDialog,
  ContentStatusBadge,
  ContentStatusFilter,
  ContentStatusSelect,
  type ContentListSort,
} from '@/features/gestao/content/ContentWorkflowControls';
import { tryCreateAdminAuditLog } from '@/services/admin-audit.service';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import type { ContentStatus, Work } from '@/types';

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
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<ContentListSort>('newest');
  const [quickActionId, setQuickActionId] = useState<string | null>(null);
  const [previewWork, setPreviewWork] = useState<Work | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
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
      const list = await service.listAdmin();
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
    setStatus('published');
    setCategory('asfalto');
    setAddress('');
    setNeighborhood('');
    setBudget('');
    setProgress('0');
    setStartDate('');
    setEndDate('');
    setContractor('');
    setEditingId(null);
  };

  const startEdit = (work: Work) => {
    setEditingId(work.id);
    setTitle(work.title);
    setDescription(work.description);
    setStatus(work.status);
    setCategory(work.category);
    setAddress(work.address);
    setNeighborhood(work.neighborhood);
    setBudget(String(work.budget || ''));
    setProgress(String(work.progress ?? 0));
    setStartDate(work.startDate);
    setEndDate(work.endDate);
    setContractor(work.contractor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
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
      };
      if (editingId) {
        await service.update(editingId, payload);
        toast('Obra atualizada.', 'success');
      } else {
        await service.create(payload);
        toast(status === 'published' ? 'Obra publicada.' : 'Obra salva.', 'success');
      }
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar a obra.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    setArchiving(true);
    try {
      await service.archive(archiveId);
      toast('Obra arquivada.', 'success');
      setArchiveId(null);
      load();
    } catch {
      toast('Erro ao arquivar.', 'error');
    } finally {
      setArchiving(false);
    }
  };

  const handleQuickStatus = async (work: Work, nextStatus: ContentStatus) => {
    const workId = work.id;
    setQuickActionId(workId);
    try {
      if (nextStatus === 'archived') {
        await service.archive(workId);
      } else {
        await service.setStatus(workId, nextStatus);
      }
      await tryCreateAdminAuditLog({
        action: nextStatus === 'archived' ? 'content_archived' : 'content_status_changed',
        collectionName: 'works',
        documentId: workId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: work.status,
        nextValue: nextStatus,
        note: null,
      });
      toast('Status da obra atualizado.', 'success');
      load();
    } catch {
      toast('Erro ao atualizar status da obra.', 'error');
    } finally {
      setQuickActionId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return works.reduce<Record<string, number>>((acc, work) => {
      acc[work.status] = (acc[work.status] || 0) + 1;
      return acc;
    }, {});
  }, [works]);

  const visibleWorks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return works
      .filter((work) => {
        const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
        const searchable = [
          work.title,
          work.description,
          work.category,
          work.address,
          work.neighborhood,
          work.contractor,
          String(work.budget || ''),
          String(work.progress || ''),
        ].join(' ').toLowerCase();
        const matchesSearch = !search || searchable.includes(search);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortMode === 'title') return a.title.localeCompare(b.title);
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return sortMode === 'oldest' ? aTime - bTime : bTime - aTime;
      });
  }, [searchTerm, sortMode, statusFilter, works]);

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/22 text-primary-dark">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Infraestrutura</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar obra publica' : 'Publicar obra publica'}
            </h2>
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

          <ContentStatusSelect value={status} onChange={setStatus} />

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

          <div className="md:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editingId && (
              <button type="button" onClick={resetForm}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary">
                <X className="h-4 w-4" />
                Cancelar edicao
              </button>
            )}
            <button type="submit" disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Salvar alterações' : status === 'published' ? 'Publicar' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workflow editorial</p>
            <h3 className="text-lg font-semibold text-text-main">Obras cadastradas ({works.length})</h3>
          </div>
        </div>

        <div className="mb-4">
          <ContentStatusFilter
            value={statusFilter}
            counts={statusCounts}
            total={works.length}
            onChange={setStatusFilter}
          />
        </div>

        <div className="mb-4">
          <ContentListControls
            search={searchTerm}
            sort={sortMode}
            searchPlaceholder="Buscar por titulo, endereco, bairro, categoria ou empresa"
            onSearchChange={setSearchTerm}
            onSortChange={setSortMode}
          />
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : works.length === 0 ? (
          <EmptyState title="Nenhuma obra cadastrada" description="Use o formulario acima para registrar a primeira obra." />
        ) : visibleWorks.length === 0 ? (
          <EmptyState title="Nenhuma obra encontrada" description="Ajuste a busca ou os filtros para ver mais registros." />
        ) : (
          <div className="space-y-3">
            {visibleWorks.map((work) => (
              <article key={work.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                      {work.category}
                    </span>
                    <ContentStatusBadge status={work.status} />
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
                <div className="flex flex-wrap gap-2">
                  <ContentQuickActions
                    status={work.status}
                    loading={quickActionId === work.id}
                    onPublish={() => handleQuickStatus(work, 'published')}
                    onDraft={() => handleQuickStatus(work, 'draft')}
                    onArchive={() => setArchiveId(work.id)}
                  />
                  <button type="button" onClick={() => setPreviewWork(work)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary">
                    Preview
                  </button>
                  <button type="button" onClick={() => startEdit(work)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary">
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={!!archiveId}
        title="Arquivar obra"
        description="Esta obra deixa de aparecer na pagina publica, mas o registro continua salvo no Firebase."
        confirmLabel="Arquivar"
        loading={archiving}
        tone="danger"
        onConfirm={handleArchive}
        onClose={() => setArchiveId(null)}
      />

      <ContentPreviewDialog
        isOpen={!!previewWork}
        title={previewWork?.title || ''}
        description={previewWork?.description || ''}
        meta={previewWork ? [previewWork.category, `${previewWork.progress}%`, previewWork.address, previewWork.neighborhood] : []}
        onClose={() => setPreviewWork(null)}
      />
    </div>
  );
}
