'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Archive, Loader2, Pencil, Save, X } from 'lucide-react';
import { createContentService } from '@/services/content.service';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import type { ContentStatus } from '@/types';
import type { Timestamp } from 'firebase/firestore';

type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'list' | 'options' | 'select';

interface CatalogFieldOption {
  value: string;
  label: string;
}

export interface CatalogField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean | string[];
  options?: CatalogFieldOption[];
}

export interface CatalogAdminConfig {
  collection: string;
  eyebrow: string;
  title: string;
  publicPath: string;
  emptyTitle: string;
  categoryField?: string;
  fields: CatalogField[];
}

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  [key: string]: unknown;
}

type FormState = Record<string, string | boolean>;

interface CatalogOptionValue {
  id?: string;
  text?: string;
  votes?: number;
}

function getOptionsVoteTotal(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return value.reduce((total, option) => {
    if (!option || typeof option !== 'object') return total;
    return total + Number((option as CatalogOptionValue).votes || 0);
  }, 0);
}

const baseFields: CatalogField[] = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Nome exibido ao cidadao' },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true, placeholder: 'Resumo público deste item' },
];

function fieldInitialValue(field: CatalogField): string | boolean {
  if (field.type === 'checkbox') return Boolean(field.defaultValue);
  if (Array.isArray(field.defaultValue)) return field.defaultValue.join('\n');
  if (field.defaultValue === undefined || field.defaultValue === null) return '';
  return String(field.defaultValue);
}

function itemToFieldValue(item: CatalogItem, field: CatalogField): string | boolean {
  const value = item[field.name];
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'options') {
    const options = Array.isArray(value) ? value : [];
    return options
      .map((option) => {
        if (option && typeof option === 'object' && 'text' in option) return String(option.text);
        return String(option);
      })
      .join('\n');
  }
  if (field.type === 'list') {
    return Array.isArray(value) ? value.map(String).join('\n') : '';
  }
  return value === undefined || value === null ? '' : String(value);
}

function parseFieldValue(field: CatalogField, raw: string | boolean, currentItem?: CatalogItem | null): unknown {
  if (field.type === 'checkbox') return Boolean(raw);
  const text = String(raw).trim();
  if (field.type === 'number') return text ? Number(text) : 0;
  if (field.type === 'list') {
    return text
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.type === 'options') {
    const previousOptions = Array.isArray(currentItem?.[field.name])
      ? (currentItem[field.name] as CatalogOptionValue[])
      : [];
    return text
      .split(/\r?\n/)
      .map((item, index) => item.trim())
      .filter(Boolean)
      .map((item, index) => {
        const previous = previousOptions.find((option) => option.text === item);
        return {
          id: previous?.id || `opcao-${index + 1}`,
          text: item,
          votes: Number(previous?.votes || 0),
        };
      });
  }
  return text;
}

function createEmptyForm(fields: CatalogField[]): FormState {
  return Object.fromEntries(fields.map((field) => [field.name, fieldInitialValue(field)]));
}

export default function GenericCatalogAdmin({ config }: { config: CatalogAdminConfig }) {
  const { toast } = useToast();
  const fields = useMemo(() => [...baseFields, ...config.fields], [config.fields]);
  const service = useMemo(() => createContentService<CatalogItem>(config.collection), [config.collection]);

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [form, setForm] = useState<FormState>(() => createEmptyForm(fields));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);

  const resetForm = useCallback(() => {
    setForm(createEmptyForm(fields));
    setEditingId(null);
    setEditingItem(null);
  }, [fields]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await service.list());
    } catch {
      toast(`Não foi possível carregar ${config.title.toLowerCase()}.`, 'error');
    } finally {
      setLoading(false);
    }
  }, [config.title, service, toast]);

  useEffect(() => {
    resetForm();
    load();
  }, [load, resetForm]);

  const updateField = (name: string, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const startEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setEditingItem(item);
    setForm(Object.fromEntries(fields.map((field) => [field.name, itemToFieldValue(item, field)])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const field of fields) {
      if (field.required && !String(form[field.name] ?? '').trim()) {
        toast(`Preencha ${field.label.toLowerCase()}.`, 'error');
        return;
      }
      if (field.type === 'options') {
        const options = String(form[field.name] ?? '')
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean);
        if (options.length < 2) {
          toast(`Informe pelo menos duas opcoes em ${field.label.toLowerCase()}.`, 'error');
          return;
        }
        if (new Set(options.map((item) => item.toLowerCase())).size !== options.length) {
          toast(`Remova opcoes duplicadas em ${field.label.toLowerCase()}.`, 'error');
          return;
        }
      }
    }

    setSaving(true);
    try {
      const parsed = Object.fromEntries(
        fields.map((field) => [field.name, parseFieldValue(field, form[field.name], editingItem)]),
      );
      const payload = {
        ...parsed,
        ...(config.collection === 'polls' ? { totalVotes: getOptionsVoteTotal(parsed.options) } : {}),
        status: 'published' as const,
      };

      if (editingId) {
        await service.update(editingId, payload);
        toast('Item atualizado.', 'success');
      } else {
        await service.create(payload as Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>);
        toast('Item publicado.', 'success');
      }

      resetForm();
      load();
    } catch {
      toast('Erro ao salvar item.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    setArchiving(true);
    try {
      await service.archive(archiveId);
      toast('Item arquivado.', 'success');
      setArchiveId(null);
      load();
    } catch {
      toast('Erro ao arquivar item.', 'error');
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{config.eyebrow}</p>
          <h2 className="text-xl font-semibold tracking-normal text-text-main">
            {editingId ? `Editar ${config.title}` : `Publicar ${config.title}`}
          </h2>
          <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
            Aparece em <code className="font-mono text-xs text-primary">{config.publicPath}</code> apos salvar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className={field.type === 'textarea' || field.type === 'list' || field.type === 'options' ? 'space-y-1.5 md:col-span-2' : 'space-y-1.5'}>
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{field.label}</span>
              {field.type === 'textarea' || field.type === 'list' || field.type === 'options' ? (
                <textarea
                  value={String(form[field.name] ?? '')}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  rows={field.type === 'textarea' ? 3 : 4}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  onChange={(event) => updateField(field.name, event.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
              ) : field.type === 'select' ? (
                <select
                  value={String(form[field.name] ?? '')}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  required={field.required}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={String(form[field.name] ?? '')}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
                />
              )}
            </label>
          ))}

          <div className="md:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
              >
                <X className="h-4 w-4" />
                Cancelar edição
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Salvar alterações' : 'Publicar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Publicados</p>
          <h3 className="text-lg font-semibold text-text-main">{config.title} ({items.length})</h3>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title={config.emptyTitle} description="Use o formulario acima para publicar o primeiro item." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {config.categoryField && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                        {String(item[config.categoryField] ?? '')}
                      </span>
                    )}
                    <span className="text-xs font-bold text-text-muted">{formatDate(item.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{item.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setArchiveId(item.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Arquivar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={!!archiveId}
        title="Arquivar item"
        description="Este item deixa de aparecer na página pública, mas o registro continua salvo no Firebase."
        confirmLabel="Arquivar"
        loading={archiving}
        tone="danger"
        onConfirm={handleArchive}
        onClose={() => setArchiveId(null)}
      />
    </div>
  );
}
