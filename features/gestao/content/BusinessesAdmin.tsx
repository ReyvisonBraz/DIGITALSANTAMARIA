'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Save,
  Store,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';
import { createContentService } from '@/services/content.service';
import {
  approveBusiness,
  listPendingBusinesses,
  rejectBusiness,
} from '@/services/businesses.service';
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
import type { Business, ContentStatus } from '@/types';

const service = createContentService<Business>('businesses');

const CATEGORIES: { value: Business['category']; label: string }[] = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'servico', label: 'Servico' },
  { value: 'loja', label: 'Loja' },
  { value: 'outros', label: 'Outros' },
];

export default function BusinessesAdmin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pending, setPending] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [approvingBusiness, setApprovingBusiness] = useState<Business | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<ContentListSort>('newest');
  const [quickActionId, setQuickActionId] = useState<string | null>(null);
  const [previewBusiness, setPreviewBusiness] = useState<Business | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState<Business['category']>('restaurante');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [hours, setHours] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, pendingList] = await Promise.all([service.listAdmin(), listPendingBusinesses()]);
      setBusinesses(list);
      setPending(pendingList);
    } catch {
      toast('Não foi possível carregar os comércios.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('published');
    setCategory('restaurante');
    setAddress('');
    setPhone('');
    setWhatsapp('');
    setHours('');
    setIsOpen(true);
    setEditingId(null);
  };

  const startEdit = (business: Business) => {
    setEditingId(business.id);
    setTitle(business.title);
    setDescription(business.description);
    setStatus(business.status);
    setCategory(business.category);
    setAddress(business.address);
    setPhone(business.phone);
    setWhatsapp(business.whatsapp);
    setHours(business.hours);
    setIsOpen(business.isOpen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = async () => {
    if (!approvingBusiness) return;
    setActionId(approvingBusiness.id);
    try {
      await approveBusiness(approvingBusiness.id);
      await tryCreateAdminAuditLog({
        action: 'content_status_changed',
        collectionName: 'businesses',
        documentId: approvingBusiness.id,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: approvingBusiness.status,
        nextValue: 'published',
        note: 'Cadastro aprovado pela fila de comércios.',
      });
      toast('Cadastro aprovado e publicado.', 'success');
      setApprovingBusiness(null);
      load();
    } catch {
      toast('Erro ao aprovar.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const startReject = (id: string) => {
    setRejectingId(id);
    setRejectNote('');
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    const note = rejectNote.trim();
    if (note.length < 10) {
      toast('Informe um motivo com pelo menos 10 caracteres para orientar o cidadao.', 'error');
      return;
    }

    const rejectedBusiness = pending.find((business) => business.id === rejectingId)
      || businesses.find((business) => business.id === rejectingId);

    setActionId(rejectingId);
    try {
      await rejectBusiness(rejectingId, note);
      await tryCreateAdminAuditLog({
        action: 'content_status_changed',
        collectionName: 'businesses',
        documentId: rejectingId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: rejectedBusiness?.status || 'pending_approval',
        nextValue: 'archived',
        note,
      });
      toast('Cadastro reprovado.', 'success');
      setRejectingId(null);
      setRejectNote('');
      load();
    } catch {
      toast('Erro ao reprovar.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      toast('Preencha nome, descricao e endereco.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        category,
        address: address.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        hours: hours.trim(),
        imageURL: null,
        isOpen,
        lat: null,
        lng: null,
        ownerId: '',
        ownerName: 'Prefeitura',
        reviewNote: null,
      };

      if (editingId) {
        await service.update(editingId, payload);
        await tryCreateAdminAuditLog({
          action: 'content_updated',
          collectionName: 'businesses',
          documentId: editingId,
          actorId: user?.uid || 'unknown',
          actorName: user?.displayName || user?.email || 'Gestor',
          previousValue: null,
          nextValue: status,
          note: null,
        });
        toast('Comercio atualizado.', 'success');
      } else {
        const newId = await service.create(payload);
        await tryCreateAdminAuditLog({
          action: 'content_created',
          collectionName: 'businesses',
          documentId: newId,
          actorId: user?.uid || 'unknown',
          actorName: user?.displayName || user?.email || 'Gestor',
          previousValue: null,
          nextValue: status,
          note: null,
        });
        toast(status === 'published' ? 'Comercio publicado.' : 'Comercio salvo.', 'success');
      }

      resetForm();
      load();
    } catch {
      toast('Erro ao salvar o comércio.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    const archivedBusiness = businesses.find((business) => business.id === archiveId);
    setArchiving(true);
    try {
      await service.archive(archiveId);
      await tryCreateAdminAuditLog({
        action: 'content_archived',
        collectionName: 'businesses',
        documentId: archiveId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: archivedBusiness?.status || null,
        nextValue: 'archived',
        note: null,
      });
      toast('Comercio arquivado.', 'success');
      setArchiveId(null);
      load();
    } catch {
      toast('Erro ao arquivar.', 'error');
    } finally {
      setArchiving(false);
    }
  };

  const handleQuickStatus = async (business: Business, nextStatus: ContentStatus) => {
    const businessId = business.id;
    setQuickActionId(businessId);
    try {
      if (nextStatus === 'archived') {
        await service.archive(businessId);
      } else {
        await service.setStatus(businessId, nextStatus);
      }
      await tryCreateAdminAuditLog({
        action: nextStatus === 'archived' ? 'content_archived' : 'content_status_changed',
        collectionName: 'businesses',
        documentId: businessId,
        actorId: user?.uid || 'unknown',
        actorName: user?.displayName || user?.email || 'Gestor',
        previousValue: business.status,
        nextValue: nextStatus,
        note: null,
      });
      toast('Status do comércio atualizado.', 'success');
      load();
    } catch {
      toast('Erro ao atualizar status do comércio.', 'error');
    } finally {
      setQuickActionId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return businesses.reduce<Record<string, number>>((acc, business) => {
      acc[business.status] = (acc[business.status] || 0) + 1;
      return acc;
    }, {});
  }, [businesses]);

  const visibleBusinesses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return businesses
      .filter((business) => {
        const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
        const searchable = [
          business.title,
          business.description,
          business.category,
          business.address,
          business.phone,
          business.whatsapp,
          business.hours,
          business.ownerName,
          business.reviewNote || '',
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
  }, [businesses, searchTerm, sortMode, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/22 text-primary-dark">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Economia local</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">
              {editingId ? 'Editar comércio' : 'Cadastrar comércio'}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece em <code className="font-mono text-xs text-primary">/comercio</code> com telefone, WhatsApp e horário.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nome do negocio</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
              placeholder='Ex: "Padaria Sao Jose"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descricao</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={400}
              required
              placeholder="O que vende, especialidades, diferenciais."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Business['category'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Horario</span>
            <input
              type="text"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              maxLength={80}
              placeholder='Ex: "Seg-Sab 8h-18h"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <ContentStatusSelect value={status} onChange={setStatus} />

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereco</span>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              maxLength={200}
              placeholder="Rua, numero, bairro"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Telefone</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              placeholder="(91) 99999-0000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">WhatsApp com DDD</span>
            <input
              type="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value.replace(/\D/g, ''))}
              maxLength={13}
              placeholder="91999990000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
           </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={(event) => setIsOpen(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-medium text-text-main">Aberto no momento</span>
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
              {editingId ? 'Salvar alterações' : status === 'published' ? 'Publicar' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent-success">
              <Clock3 className="h-3.5 w-3.5" />
              Aguardando aprovação
            </p>
            <h3 className="text-lg font-semibold text-text-main">
              Cadastros pendentes ({pending.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : pending.length === 0 ? (
          <EmptyState
            title="Nenhum cadastro pendente"
            description="Quando um lojista cadastrar seu negócio pelo painel, aparece aqui para aprovação."
          />
        ) : (
          <div className="space-y-3">
            {pending.map((biz) => (
              <article key={biz.id} className="civic-card flex flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Pendente
                  </span>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                    {biz.category}
                  </span>
                  <span className="text-xs font-bold text-text-muted">{formatDate(biz.createdAt)}</span>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-main">{biz.title}</h4>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-muted">{biz.description}</p>
                </div>

                <div className="grid gap-2 text-xs font-bold text-text-muted md:grid-cols-2">
                  <p className="inline-flex items-center gap-1">
                    <UserRound className="h-3.5 w-3.5 text-primary" />
                    {biz.ownerName || 'Sem nome'}
                  </p>
                  <p className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {biz.address}
                  </p>
                  {(biz.phone || biz.whatsapp) && (
                    <p className="inline-flex items-center gap-1 md:col-span-2">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {biz.phone}{biz.whatsapp ? ` - WhatsApp ${biz.whatsapp}` : ''}
                    </p>
                  )}
                  {biz.hours && (
                    <p className="text-text-muted md:col-span-2">Horario: {biz.hours}</p>
                  )}
                </div>

                {rejectingId === biz.id && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                    <label className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-widest text-rose-700">Motivo da reprovacao</span>
                      <textarea
                        value={rejectNote}
                        onChange={(event) => setRejectNote(event.target.value)}
                        rows={3}
                        maxLength={300}
                        placeholder="Explique o que precisa ser corrigido. Esse texto fica visivel para o lojista."
                        className="w-full resize-none rounded-xl border border-rose-200 bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-rose-400"
                      />
                      <span className="block text-[11px] font-bold text-rose-700">{rejectNote.trim().length}/300</span>
                    </label>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => setApprovingBusiness(biz)}
                    disabled={actionId === biz.id}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent-success px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionId === biz.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Aprovar e publicar
                  </button>

                  {rejectingId === biz.id ? (
                    <>
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={actionId === biz.id}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        Confirmar reprovacao
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(null);
                          setRejectNote('');
                        }}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startReject(biz.id)}
                      disabled={actionId === biz.id}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle className="h-4 w-4" />
                      Reprovar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workflow editorial</p>
            <h3 className="text-lg font-semibold text-text-main">Comercios cadastrados ({businesses.length})</h3>
          </div>
        </div>

        <div className="mb-4">
          <ContentStatusFilter
            value={statusFilter}
            counts={statusCounts}
            total={businesses.length}
            onChange={setStatusFilter}
          />
        </div>

        <div className="mb-4">
          <ContentListControls
            search={searchTerm}
            sort={sortMode}
            searchPlaceholder="Buscar por negocio, endereco, categoria, telefone ou proprietario"
            onSearchChange={setSearchTerm}
            onSortChange={setSortMode}
          />
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : businesses.length === 0 ? (
          <EmptyState title="Nenhum comércio cadastrado" description="Use o formulário acima para registrar o primeiro." />
        ) : visibleBusinesses.length === 0 ? (
          <EmptyState title="Nenhum comércio encontrado" description="Ajuste a busca ou os filtros para ver mais registros." />
        ) : (
          <div className="space-y-3">
            {visibleBusinesses.map((biz) => (
              <article key={biz.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                      {biz.category}
                    </span>
                    <ContentStatusBadge status={biz.status} />
                    {biz.hours && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        {biz.hours}
                      </span>
                    )}
                    <span className="text-xs font-bold text-text-muted">{formatDate(biz.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-text-main">{biz.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{biz.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {biz.address}
                  </p>
                  {(biz.phone || biz.whatsapp) && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-text-muted">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {biz.phone}{biz.whatsapp ? ` - WhatsApp ${biz.whatsapp}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {biz.status === 'pending_approval' ? (
                    <span className="inline-flex min-h-9 items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-800">
                      Revise na fila de aprovação
                    </span>
                  ) : (
                    <ContentQuickActions
                      status={biz.status}
                      loading={quickActionId === biz.id}
                      onPublish={() => handleQuickStatus(biz, 'published')}
                      onDraft={() => handleQuickStatus(biz, 'draft')}
                      onArchive={() => setArchiveId(biz.id)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewBusiness(biz)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(biz)}
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
        isOpen={!!approvingBusiness}
        title="Aprovar comércio"
        description={approvingBusiness ? `Este cadastro será publicado em /comercio como "${approvingBusiness.title}". Confirme depois de revisar nome, endereço e contatos.` : ''}
        confirmLabel="Aprovar e publicar"
        loading={!!approvingBusiness && actionId === approvingBusiness.id}
        onConfirm={handleApprove}
        onClose={() => setApprovingBusiness(null)}
      />

      <ConfirmDialog
        isOpen={!!archiveId}
        title="Arquivar comércio"
        description="Este comércio deixa de aparecer na página pública, mas o registro continua salvo no Firebase."
        confirmLabel="Arquivar"
        loading={archiving}
        tone="danger"
        onConfirm={handleArchive}
        onClose={() => setArchiveId(null)}
      />

      <ContentPreviewDialog
        isOpen={!!previewBusiness}
        title={previewBusiness?.title || ''}
        description={previewBusiness?.description || ''}
        meta={previewBusiness ? [previewBusiness.category, previewBusiness.hours, previewBusiness.address, previewBusiness.phone] : []}
        actionLabel={previewBusiness?.whatsapp ? 'Chamar no WhatsApp' : null}
        actionURL={previewBusiness?.whatsapp ? `https://wa.me/${previewBusiness.whatsapp}` : null}
        onClose={() => setPreviewBusiness(null)}
      />
    </div>
  );
}
