'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, Loader2, MapPin, Pencil, Save, X } from 'lucide-react';
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
import type { ContentStatus, Event as CityEvent } from '@/types';

const service = createContentService<CityEvent>('events');

const CATEGORIES: { value: CityEvent['category']; label: string }[] = [
  { value: 'cultura',   label: 'Cultura' },
  { value: 'esporte',   label: 'Esporte' },
  { value: 'educacao',  label: 'Educação' },
  { value: 'saude',     label: 'Saúde' },
  { value: 'feira',     label: 'Feira' },
  { value: 'show',      label: 'Show' },
  { value: 'outros',    label: 'Outros' },
];

export default function EventsAdmin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<ContentListSort>('newest');
  const [quickActionId, setQuickActionId] = useState<string | null>(null);
  const [previewEvent, setPreviewEvent] = useState<CityEvent | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
  const [category, setCategory] = useState<CityEvent['category']>('cultura');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [organizer, setOrganizer] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.listAdmin();
      setEvents(list);
    } catch {
      toast('Não foi possível carregar os eventos.', 'error');
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
    setCategory('cultura');
    setDate('');
    setTime('');
    setLocation('');
    setAddress('');
    setIsFree(true);
    setPrice('');
    setOrganizer('');
    setEditingId(null);
  };

  const startEdit = (event: CityEvent) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setStatus(event.status);
    setCategory(event.category);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setAddress(event.address);
    setIsFree(event.isFree);
    setPrice(event.price);
    setOrganizer(event.organizer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      toast('Preencha título, descrição, data e local.', 'error');
      return;
    }
    if (!isFree && !price.trim()) {
      toast('Informe o valor ou marque como gratuito.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        category,
        date,
        time: time.trim(),
        location: location.trim(),
        address: address.trim(),
        imageURL: null,
        isFree,
        price: isFree ? '' : price.trim(),
        organizer: organizer.trim() || 'Prefeitura',
        attendeesCount: 0,
      };
      if (editingId) {
        await service.update(editingId, payload);
        toast('Evento atualizado.', 'success');
      } else {
        await service.create(payload);
        toast(status === 'published' ? 'Evento publicado.' : 'Evento salvo.', 'success');
      }
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar o evento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    setArchiving(true);
    try {
      await service.archive(archiveId);
      toast('Evento arquivado.', 'success');
      setArchiveId(null);
      load();
    } catch {
      toast('Erro ao arquivar.', 'error');
    } finally {
      setArchiving(false);
    }
  };

  const handleQuickStatus = async (cityEvent: CityEvent, nextStatus: ContentStatus) => {
    const eventId = cityEvent.id;
    setQuickActionId(eventId);
    try {
      if (nextStatus === 'archived') {
        await service.archive(eventId);
      } else {
        await service.setStatus(eventId, nextStatus);
      }
      await tryCreateAdminAuditLog({
        action: nextStatus === 'archived' ? 'content_archived' : 'content_status_changed',
        collectionName: 'events',
        documentId: eventId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: cityEvent.status,
        nextValue: nextStatus,
        note: null,
      });
      toast('Status do evento atualizado.', 'success');
      load();
    } catch {
      toast('Erro ao atualizar status do evento.', 'error');
    } finally {
      setQuickActionId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return events.reduce<Record<string, number>>((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {});
  }, [events]);

  const visibleEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return events
      .filter((event) => {
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        const searchable = [
          event.title,
          event.description,
          event.category,
          event.date,
          event.time,
          event.location,
          event.address,
          event.organizer,
          event.price,
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
  }, [events, searchTerm, sortMode, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-dark/12 text-primary-dark">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Agenda da cidade</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar evento' : 'Publicar evento'}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece imediatamente em <code className="font-mono text-xs text-primary">/eventos</code> após salvar.
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
              placeholder="Ex: Festival de Verão na praça central"
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
              placeholder="Resumo curto do que acontecerá."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CityEvent['category'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Organizador</span>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              maxLength={80}
              placeholder="Prefeitura"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <ContentStatusSelect value={status} onChange={setStatus} />

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Data</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Horário</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Local</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              maxLength={120}
              placeholder='Ex: "Praça Matriz"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereço (opcional)</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={200}
              placeholder="Rua, número, bairro"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Entrada</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-2">
              <label className="inline-flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-lg p-2 text-xs font-bold uppercase tracking-widest" style={{ background: isFree ? 'var(--color-primary)' : 'transparent', color: isFree ? '#fff' : 'var(--color-text-muted)' }}>
                <input type="radio" className="sr-only" checked={isFree} onChange={() => setIsFree(true)} />
                Gratuita
              </label>
              <label className="inline-flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-lg p-2 text-xs font-bold uppercase tracking-widest" style={{ background: !isFree ? 'var(--color-primary)' : 'transparent', color: !isFree ? '#fff' : 'var(--color-text-muted)' }}>
                <input type="radio" className="sr-only" checked={!isFree} onChange={() => setIsFree(false)} />
                Paga
              </label>
            </div>
          </div>

          {!isFree && (
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Valor</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='Ex: "R$ 20" ou "R$ 10 a R$ 50"'
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
              />
            </label>
          )}

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
              {editingId ? 'Salvar alterações' : status === 'published' ? 'Publicar' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workflow editorial</p>
            <h3 className="text-lg font-semibold text-text-main">Eventos cadastrados ({events.length})</h3>
          </div>
        </div>

        <div className="mb-4">
          <ContentStatusFilter
            value={statusFilter}
            counts={statusCounts}
            total={events.length}
            onChange={setStatusFilter}
          />
        </div>

        <div className="mb-4">
          <ContentListControls
            search={searchTerm}
            sort={sortMode}
            searchPlaceholder="Buscar por título, local, data, categoria ou organizador"
            onSearchChange={setSearchTerm}
            onSortChange={setSortMode}
          />
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="Nenhum evento cadastrado"
            description="Use o formulário acima para colocar o primeiro evento na agenda da cidade."
          />
        ) : visibleEvents.length === 0 ? (
          <EmptyState title="Nenhum evento encontrado" description="Ajuste a busca ou os filtros para ver mais registros." />
        ) : (
          <div className="space-y-3">
            {visibleEvents.map((event) => (
              <article key={event.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {event.category}
                    </span>
                    <ContentStatusBadge status={event.status} />
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      {event.isFree ? 'Gratuito' : event.price}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {event.date}{event.time ? ` · ${event.time}` : ''}
                    </span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{event.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{event.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {event.location}{event.address ? ` — ${event.address}` : ''}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Publicado em {formatDate(event.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ContentQuickActions
                    status={event.status}
                    loading={quickActionId === event.id}
                    onPublish={() => handleQuickStatus(event, 'published')}
                    onDraft={() => handleQuickStatus(event, 'draft')}
                    onArchive={() => setArchiveId(event.id)}
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewEvent(event)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(event)}
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
        title="Arquivar evento"
        description="Este evento deixa de aparecer na agenda publica, mas o registro continua salvo no Firebase."
        confirmLabel="Arquivar"
        loading={archiving}
        tone="danger"
        onConfirm={handleArchive}
        onClose={() => setArchiveId(null)}
      />

      <ContentPreviewDialog
        isOpen={!!previewEvent}
        title={previewEvent?.title || ''}
        description={previewEvent?.description || ''}
        meta={previewEvent ? [previewEvent.category, previewEvent.date, previewEvent.time, previewEvent.location] : []}
        actionLabel={previewEvent?.isFree ? 'Evento gratuito' : previewEvent?.price || null}
        onClose={() => setPreviewEvent(null)}
      />
    </div>
  );
}
