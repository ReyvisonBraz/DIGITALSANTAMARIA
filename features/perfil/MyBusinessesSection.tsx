'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  deleteOwnedBusiness,
  listenToOwnedBusinesses,
  registerBusiness,
  resubmitOwnedBusiness,
  updateOwnedBusiness,
} from '@/services/businesses.service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';
import {
  BUSINESS_CATEGORIES,
  GENERIC_BUSINESS_LOGOS,
  getBusinessCategoryLabel,
} from '@/lib/constants/businesses';
import type { Business, ContentStatus } from '@/types';

const STATUS_META: Record<ContentStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  pending_approval: {
    label: 'Aguardando aprovacao',
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock3,
  },
  published: {
    label: 'Publicado',
    tone: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  archived: {
    label: 'Nao aprovado',
    tone: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
  },
  draft: {
    label: 'Rascunho',
    tone: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock3,
  },
};

interface FormState {
  id?: string;
  currentStatus?: ContentStatus;
  title: string;
  description: string;
  category: Business['category'];
  address: string;
  mapURL: string;
  phone: string;
  whatsapp: string;
  hours: string;
  imageURL: string | null;
}

const emptyForm: FormState = {
  title: '',
  description: '',
  category: 'restaurante',
  address: '',
  mapURL: '',
  phone: '',
  whatsapp: '',
  hours: '',
  imageURL: null,
};

function isHttpURL(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isLogoURL(value: string | null): boolean {
  if (!value?.trim()) return true;
  if (value.startsWith('/business-logos/')) return true;
  return value.startsWith('https://');
}

function businessPatch(form: FormState) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    address: form.address.trim(),
    mapURL: form.mapURL.trim() || null,
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim(),
    hours: form.hours.trim(),
    imageURL: form.imageURL,
  };
}

export default function MyBusinessesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      setBusinesses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToOwnedBusinesses(
      user.uid,
      (list) => {
        setBusinesses(list);
        setLoading(false);
      },
      () => {
        setBusinesses([]);
        setLoading(false);
        toast('Nao foi possivel carregar seus negocios agora.', 'error');
      },
    );

    return unsubscribe;
  }, [toast, user]);

  const pendingCount = useMemo(
    () => businesses.filter((business) => business.status === 'pending_approval').length,
    [businesses],
  );

  if (!user) return null;

  const startCreate = () => {
    setEditing({ ...emptyForm });
  };

  const startEdit = (business: Business) => {
    setEditing({
      id: business.id,
      currentStatus: business.status,
      title: business.title,
      description: business.description,
      category: business.category,
      address: business.address,
      mapURL: business.mapURL || '',
      phone: business.phone,
      whatsapp: business.whatsapp,
      hours: business.hours,
      imageURL: business.imageURL,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const selectGenericLogo = (url: string) => {
    if (!editing) return;
    setEditing({ ...editing, imageURL: url });
  };

  const removeLogo = () => {
    if (!editing) return;
    setEditing({ ...editing, imageURL: null });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    if (!editing.title.trim() || !editing.description.trim() || !editing.address.trim()) {
      toast('Preencha nome, descrição e endereço.', 'error');
      return;
    }

    if (!isHttpURL(editing.mapURL)) {
      toast('Informe um link de mapa valido iniciando com http ou https.', 'error');
      return;
    }
    if (!isLogoURL(editing.imageURL)) {
      toast('Informe uma URL de logo publica iniciando com https:// ou escolha uma logo generica.', 'error');
      return;
    }

    setSaving(true);
    try {
      const patch = businessPatch(editing);
      if (editing.id) {
        if (editing.currentStatus === 'archived') {
          await resubmitOwnedBusiness(editing.id, patch);
          toast('Cadastro corrigido e reenviado para analise.', 'success');
        } else {
          await updateOwnedBusiness(editing.id, patch);
          toast('Negocio atualizado.', 'success');
        }
      } else {
        await registerBusiness({
          ...patch,
          ownerId: user.uid,
          ownerName: user.displayName || user.email || 'Cidadao',
        });
        toast('Cadastro enviado. Aguarde a aprovacao da prefeitura.', 'success');
      }

      cancelEdit();
    } catch {
      toast('Nao foi possivel salvar agora.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOwnedBusiness(deleteTarget.id);
      if (editing?.id === deleteTarget.id) setEditing(null);
      toast(deleteTarget.status === 'pending_approval' ? 'Cadastro cancelado.' : 'Negocio excluido.', 'success');
      setDeleteTarget(null);
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';
      const message = code === 'permission-denied'
        ? 'Sem permissao para cancelar este cadastro. Publique as regras do Firestore ou confirme se ele pertence a sua conta.'
        : error instanceof Error && error.message
          ? error.message
          : 'Nao foi possivel remover este negocio agora.';
      toast(message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Store className="h-3.5 w-3.5" />
            Comercio
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">
            Meus negocios
          </h2>
          <p className="mt-1 text-xs font-medium leading-5 text-text-muted">
            Cadastre seu comercio ou servico. Depois da aprovacao da prefeitura, ele aparece em <code className="font-mono text-primary">/comercio</code>.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={startCreate}
            className="action-button-primary self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Cadastrar negocio
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-primary/20 bg-white p-4 md:grid-cols-2 md:p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 md:col-span-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                {editing.id ? 'Editar negocio' : 'Novo cadastro'}
              </h3>
              {editing.currentStatus === 'archived' && (
                <p className="mt-1 text-xs font-semibold text-rose-700">
                  Ao salvar, este cadastro volta para a fila de aprovacao.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Cancelar"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-text-muted hover:border-rose-300 hover:text-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nome do negocio</span>
            <input
              type="text"
              value={editing.title}
              required
              maxLength={120}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              placeholder='Ex: "Padaria Sao Jose"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descricao</span>
            <textarea
              value={editing.description}
              required
              rows={3}
              maxLength={400}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
              placeholder="O que oferece, especialidades e diferenciais."
              className="w-full resize-y rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
            <select
              value={editing.category}
              onChange={(event) => setEditing({ ...editing, category: event.target.value as Business['category'] })}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {BUSINESS_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Horario</span>
            <input
              type="text"
              value={editing.hours}
              maxLength={80}
              onChange={(event) => setEditing({ ...editing, hours: event.target.value })}
              placeholder='Ex: "Seg-Sab 8h-18h"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereco</span>
            <input
              type="text"
              value={editing.address}
              required
              maxLength={200}
              onChange={(event) => setEditing({ ...editing, address: event.target.value })}
              placeholder="Rua, número, bairro"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Link do Google Maps ou mapa</span>
            <input
              type="url"
              value={editing.mapURL}
              maxLength={500}
              onChange={(event) => setEditing({ ...editing, mapURL: event.target.value })}
              placeholder="https://maps.google.com/..."
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Logo</span>
              {editing.imageURL && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:border-rose-300 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remover
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-[160px_1fr]">
              <div className="relative grid h-32 place-items-center overflow-hidden rounded-xl border border-border bg-surface">
                {editing.imageURL ? (
                  <Image
                    src={editing.imageURL}
                    alt="Logo selecionada"
                    fill
                    sizes="160px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-9 w-9 text-text-muted" />
                )}
              </div>

              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">URL da logo</span>
                  <input
                    type="url"
                    value={editing.imageURL?.startsWith('/business-logos/') ? '' : editing.imageURL || ''}
                    maxLength={500}
                    onChange={(event) => setEditing({ ...editing, imageURL: event.target.value.trim() || null })}
                    placeholder="https://exemplo.com/logo.png"
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENERIC_BUSINESS_LOGOS.map((logo) => (
                    <button
                      key={logo.id}
                      type="button"
                      onClick={() => selectGenericLogo(logo.url)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border px-2 py-1.5 text-[11px] font-bold text-text-main transition hover:border-primary',
                        editing.imageURL === logo.url ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-white',
                      )}
                    >
                      <Image src={logo.url} alt="" width={28} height={28} className="rounded-lg" />
                      {logo.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-semibold leading-5 text-text-muted">
                  Use uma imagem publica em HTTPS ou escolha uma logo generica. Upload direto fica desativado enquanto o Storage nao estiver ativo.
                </p>
              </div>
            </div>
          </div>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Telefone</span>
            <input
              type="tel"
              value={editing.phone}
              maxLength={20}
              onChange={(event) => setEditing({ ...editing, phone: event.target.value })}
              placeholder="(91) 99999-0000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">WhatsApp</span>
            <input
              type="tel"
              value={editing.whatsapp}
              maxLength={13}
              onChange={(event) => setEditing({ ...editing, whatsapp: event.target.value.replace(/\D/g, '') })}
              placeholder="91999990000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

          <div className="flex flex-col-reverse gap-2 md:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted hover:border-primary hover:text-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing.id ? 'Salvar alteracoes' : 'Enviar para aprovacao'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex min-h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : businesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-text-main">Nenhum negocio cadastrado</p>
          <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
            Quando você cadastrar um comércio ou serviço, ele aparece aqui com o status da aprovação.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingCount > 0 && (
            <p className="text-xs font-bold text-text-muted">
              {pendingCount} cadastro{pendingCount === 1 ? '' : 's'} aguardando aprovacao.
            </p>
          )}

          {businesses.map((business) => {
            const meta = STATUS_META[business.status];
            const StatusIcon = meta.icon;
            const deleteLabel = business.status === 'pending_approval' ? 'Cancelar cadastro' : 'Excluir';

            return (
              <article key={business.id} className="civic-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest', meta.tone)}>
                    <StatusIcon className="h-3 w-3" />
                    {meta.label}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    {getBusinessCategoryLabel(business.category)}
                  </span>
                </div>

                <div className="mt-3 flex gap-3">
                  {business.imageURL && (
                    <Image
                      src={business.imageURL}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-text-main">{business.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{business.description}</p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-text-muted">
                  {business.address && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {business.address}
                    </span>
                  )}
                  {business.mapURL && (
                    <a
                      href={business.mapURL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver mapa
                    </a>
                  )}
                  {business.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {business.phone}
                    </span>
                  )}
                  {business.whatsapp && (
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-accent-success" />
                      {business.whatsapp}
                    </span>
                  )}
                </div>

                {business.status === 'archived' && business.reviewNote && (
                  <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium leading-5 text-rose-900">
                    <strong className="font-bold uppercase tracking-widest text-rose-700">Motivo da reprovacao:</strong>
                    <br />
                    {business.reviewNote}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(business)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-main hover:border-primary hover:text-primary"
                  >
                    {business.status === 'archived' ? 'Corrigir e reenviar' : 'Editar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(business)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleteLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={deleteTarget?.status === 'pending_approval' ? 'Cancelar cadastro' : 'Excluir negocio'}
        description={deleteTarget ? `O cadastro "${deleteTarget.title}" deixara de aparecer no seu painel e na vitrine publica.` : ''}
        confirmLabel={deleteTarget?.status === 'pending_approval' ? 'Cancelar cadastro' : 'Excluir'}
        loading={deleting}
        tone="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}
