'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Bell, Loader2, Pencil, Save, X } from 'lucide-react';
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
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import type { ContentStatus, Notice } from '@/types';

const service = createContentService<Notice>('notices');

const NOTICE_TYPES: { value: Notice['type']; label: string }[] = [
  { value: 'aviso',      label: 'Aviso' },
  { value: 'alerta',     label: 'Alerta' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'urgencia',   label: 'Urgência' },
];

const PRIORITIES: { value: Notice['priority']; label: string }[] = [
  { value: 'low',      label: 'Baixa' },
  { value: 'medium',   label: 'Média' },
  { value: 'high',     label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

const PRIORITY_BADGE: Record<Notice['priority'], string> = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function NoticesAdmin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<ContentListSort>('newest');
  const [quickActionId, setQuickActionId] = useState<string | null>(null);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
  const [type, setType] = useState<Notice['type']>('aviso');
  const [priority, setPriority] = useState<Notice['priority']>('medium');
  const [actionLabel, setActionLabel] = useState('');
  const [actionURL, setActionURL] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.listAdmin();
      setNotices(list);
    } catch {
      toast('Não foi possível carregar os avisos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('published');
    setType('aviso');
    setPriority('medium');
    setActionLabel('');
    setActionURL('');
    setEditingId(null);
  };

  const startEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setTitle(notice.title);
    setDescription(notice.description);
    setStatus(notice.status);
    setType(notice.type);
    setPriority(notice.priority);
    setActionLabel(notice.actionLabel || '');
    setActionURL(notice.actionURL || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast('Preencha título e descrição.', 'error');
      return;
    }
    if (actionURL.trim() && !actionLabel.trim()) {
      toast('Informe um rótulo para o botão de ação.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        type,
        priority,
        expiresAt: null,
        actionLabel: actionLabel.trim() || null,
        actionURL: actionURL.trim() || null,
      };
      if (editingId) {
        await service.update(editingId, payload);
        toast('Aviso atualizado.', 'success');
      } else {
        await service.create(payload);
        toast(status === 'published' ? 'Aviso publicado.' : 'Aviso salvo.', 'success');
      }
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar o aviso.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    setArchiving(true);
    try {
      await service.archive(archiveId);
      toast('Aviso arquivado.', 'success');
      setArchiveId(null);
      load();
    } catch {
      toast('Erro ao arquivar.', 'error');
    } finally {
      setArchiving(false);
    }
  };

  const handleQuickStatus = async (notice: Notice, nextStatus: ContentStatus) => {
    const noticeId = notice.id;
    setQuickActionId(noticeId);
    try {
      if (nextStatus === 'archived') {
        await service.archive(noticeId);
      } else {
        await service.setStatus(noticeId, nextStatus);
      }
      await tryCreateAdminAuditLog({
        action: nextStatus === 'archived' ? 'content_archived' : 'content_status_changed',
        collectionName: 'notices',
        documentId: noticeId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: notice.status,
        nextValue: nextStatus,
        note: null,
      });
      toast('Status do aviso atualizado.', 'success');
      load();
    } catch {
      toast('Erro ao atualizar status do aviso.', 'error');
    } finally {
      setQuickActionId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return notices.reduce<Record<string, number>>((acc, notice) => {
      acc[notice.status] = (acc[notice.status] || 0) + 1;
      return acc;
    }, {});
  }, [notices]);

  const visibleNotices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return notices
      .filter((notice) => {
        const matchesStatus = statusFilter === 'all' || notice.status === statusFilter;
        const searchable = [
          notice.title,
          notice.description,
          notice.type,
          notice.priority,
          notice.actionLabel,
          notice.actionURL,
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
  }, [notices, searchTerm, sortMode, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-dark/12 text-primary-dark">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Avisos e alertas</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar aviso' : 'Publicar aviso'}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece imediatamente em <code className="font-mono text-xs text-primary">/avisos</code> após salvar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              required
              placeholder="Ex: Mutirão de saúde no domingo"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              required
              placeholder="Resumo curto que o cidadão lê na lista (até 500 caracteres)."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Notice['type'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {NOTICE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Prioridade</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Notice['priority'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {PRIORITIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <ContentStatusSelect value={status} onChange={setStatus} />

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Rótulo do botão (opcional)</span>
            <input
              type="text"
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              maxLength={40}
              placeholder='Ex: "Saiba mais"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">URL do botão (opcional)</span>
            <input
              type="url"
              value={actionURL}
              onChange={(e) => setActionURL(e.target.value)}
              placeholder="https://..."
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <div className="md:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
              >
                <X className="h-4 w-4" />
                Cancelar edicao
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Salvar alteracoes' : status === 'published' ? 'Publicar' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workflow editorial</p>
            <h3 className="text-lg font-semibold text-text-main">Avisos cadastrados ({notices.length})</h3>
          </div>
        </div>

        <div className="mb-4">
          <ContentStatusFilter
            value={statusFilter}
            counts={statusCounts}
            total={notices.length}
            onChange={setStatusFilter}
          />
        </div>

        <div className="mb-4">
          <ContentListControls
            search={searchTerm}
            sort={sortMode}
            searchPlaceholder="Buscar por titulo, descricao, tipo ou prioridade"
            onSearchChange={setSearchTerm}
            onSortChange={setSortMode}
          />
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : notices.length === 0 ? (
          <EmptyState
            title="Nenhum aviso cadastrado"
            description="Use o formulário acima para publicar o primeiro aviso da prefeitura."
          />
        ) : visibleNotices.length === 0 ? (
          <EmptyState title="Nenhum aviso encontrado" description="Ajuste a busca ou os filtros para ver mais registros." />
        ) : (
          <div className="space-y-3">
            {visibleNotices.map((notice) => (
              <article key={notice.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest', PRIORITY_BADGE[notice.priority])}>
                      {notice.priority}
                    </span>
                    <ContentStatusBadge status={notice.status} />
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      {notice.type}
                    </span>
                    <span className="text-xs font-bold text-text-muted">{formatDate(notice.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{notice.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{notice.description}</p>
                  {notice.actionURL && (
                    <a
                      href={notice.actionURL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
                    >
                      {notice.actionLabel || 'Abrir link'} →
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <ContentQuickActions
                    status={notice.status}
                    loading={quickActionId === notice.id}
                    onPublish={() => handleQuickStatus(notice, 'published')}
                    onDraft={() => handleQuickStatus(notice, 'draft')}
                    onArchive={() => setArchiveId(notice.id)}
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewNotice(notice)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(notice)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                  >
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
        title="Arquivar aviso"
        description="Este aviso deixa de aparecer na pagina publica, mas o registro continua salvo no Firebase."
        confirmLabel="Arquivar"
        loading={archiving}
        tone="danger"
        onConfirm={handleArchive}
        onClose={() => setArchiveId(null)}
      />

      <ContentPreviewDialog
        isOpen={!!previewNotice}
        title={previewNotice?.title || ''}
        description={previewNotice?.description || ''}
        meta={previewNotice ? [previewNotice.type, previewNotice.priority] : []}
        actionLabel={previewNotice?.actionLabel}
        actionURL={previewNotice?.actionURL}
        onClose={() => setPreviewNotice(null)}
      />
    </div>
  );
}
