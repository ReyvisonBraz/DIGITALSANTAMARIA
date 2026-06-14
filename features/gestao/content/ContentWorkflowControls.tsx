'use client';

import { useState } from 'react';
import { Archive, Eye, FileEdit, Loader2, Send, X } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { ContentStatus } from '@/types';
import { cn } from '@/lib/utils';

export type ContentListSort = 'newest' | 'oldest' | 'title';

export const CONTENT_STATUS_OPTIONS: { value: ContentStatus; label: string; description: string }[] = [
  { value: 'published', label: 'Publicado', description: 'Aparece no site publico' },
  { value: 'draft', label: 'Rascunho', description: 'Salvo apenas no painel' },
  { value: 'pending_approval', label: 'Pendente', description: 'Aguardando revisao' },
  { value: 'archived', label: 'Arquivado', description: 'Fora do site publico' },
];

const STATUS_CLASS: Record<ContentStatus, string> = {
  published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  draft: 'border-zinc-200 bg-zinc-50 text-zinc-700',
  pending_approval: 'border-amber-200 bg-amber-50 text-amber-700',
  archived: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function getContentStatusLabel(status: ContentStatus) {
  return CONTENT_STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest', STATUS_CLASS[status])}>
      {getContentStatusLabel(status)}
    </span>
  );
}

interface ContentStatusSelectProps {
  value: ContentStatus;
  onChange: (status: ContentStatus) => void;
}

export function ContentStatusSelect({ value, onChange }: ContentStatusSelectProps) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-black uppercase tracking-widest text-text-muted">Status</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ContentStatus)}
        className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
      >
        {CONTENT_STATUS_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label} - {item.description}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ContentStatusFilterProps {
  value: ContentStatus | 'all';
  counts: Record<string, number>;
  total: number;
  onChange: (status: ContentStatus | 'all') => void;
}

export function ContentStatusFilter({ value, counts, total, onChange }: ContentStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={cn(
          'rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-widest transition',
          value === 'all' ? 'admin-choice-active' : 'admin-choice-idle',
        )}
      >
        Todos {total}
      </button>
      {CONTENT_STATUS_OPTIONS.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-widest transition',
            value === item.value ? 'admin-choice-active' : 'admin-choice-idle',
          )}
        >
          {item.label} {counts[item.value] || 0}
        </button>
      ))}
    </div>
  );
}

interface ContentListControlsProps {
  search: string;
  sort: ContentListSort;
  searchPlaceholder?: string;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: ContentListSort) => void;
}

export function ContentListControls({
  search,
  sort,
  searchPlaceholder = 'Buscar por título ou descrição',
  onSearchChange,
  onSortChange,
}: ContentListControlsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
      <label className="space-y-1.5">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">Busca</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition focus:border-primary"
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">Ordenar</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ContentListSort)}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition focus:border-primary"
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="title">Titulo A-Z</option>
        </select>
      </label>
    </div>
  );
}

interface ContentQuickActionsProps {
  status: ContentStatus;
  loading: boolean;
  onPublish: () => void;
  onDraft: () => void;
  onArchive: () => void;
}

export function ContentQuickActions({
  status,
  loading,
  onPublish,
  onDraft,
  onArchive,
}: ContentQuickActionsProps) {
  const [publishConfirmationOpen, setPublishConfirmationOpen] = useState(false);
  const publishLabel = status === 'archived' ? 'Reativar' : 'Publicar';

  const confirmPublish = () => {
    setPublishConfirmationOpen(false);
    onPublish();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status !== 'published' && (
          <button
            type="button"
            onClick={() => setPublishConfirmationOpen(true)}
            disabled={loading}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Publicar
          </button>
        )}
        {status !== 'draft' && status !== 'archived' && (
          <button
            type="button"
            onClick={onDraft}
            disabled={loading}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileEdit className="h-3.5 w-3.5" />}
            Rascunho
          </button>
        )}
        {status === 'archived' ? (
          <button
            type="button"
            onClick={() => setPublishConfirmationOpen(true)}
            disabled={loading}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            Reativar
          </button>
        ) : (
          <button
            type="button"
            onClick={onArchive}
            disabled={loading}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
            Arquivar
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={publishConfirmationOpen}
        title={`${publishLabel} conteudo`}
        description="Esta acao torna o item visivel nas paginas publicas do site. Confirme apenas depois de revisar titulo, texto, data e links."
        confirmLabel={publishLabel}
        loading={loading}
        onConfirm={confirmPublish}
        onClose={() => setPublishConfirmationOpen(false)}
      />
    </>
  );
}

interface ContentPreviewDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string[];
  actionLabel?: string | null;
  actionURL?: string | null;
  onClose: () => void;
}

export function ContentPreviewDialog({
  isOpen,
  title,
  description,
  eyebrow = 'Preview publico',
  meta = [],
  actionLabel,
  actionURL,
  onClose,
}: ContentPreviewDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary">{eyebrow}</p>
            <h3 className="mt-1 text-lg font-semibold text-text-main">Como o cidadao deve ver</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white text-text-muted transition hover:border-primary hover:text-primary"
            aria-label="Fechar preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <article className="civic-card p-5">
            {meta.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {meta.filter(Boolean).map((item) => (
                  <span key={item} className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {item}
                  </span>
                ))}
              </div>
            )}
            <h4 className="text-xl font-semibold tracking-normal text-text-main">{title || 'Sem título'}</h4>
            <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
              {description || 'Sem descrição.'}
            </p>
            {actionURL && (
              <a
                href={actionURL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
              >
                {actionLabel || 'Abrir link'}
              </a>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
