'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Store,
  X,
} from 'lucide-react';
import {
  listenToOwnedBusinesses,
  registerBusiness,
  resubmitOwnedBusiness,
  updateOwnedBusiness,
} from '@/services/businesses.service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';
import type { Business, ContentStatus } from '@/types';

const CATEGORIES: { value: Business['category']; label: string }[] = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'servico', label: 'Servico' },
  { value: 'loja', label: 'Loja' },
  { value: 'outros', label: 'Outros' },
];

const STATUS_META: Record<ContentStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  pending_approval: {
    label: 'Aguardando aprovação',
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock3,
  },
  published: {
    label: 'Publicado',
    tone: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  archived: {
    label: 'Não aprovado',
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
  phone: string;
  whatsapp: string;
  hours: string;
}

const emptyForm: FormState = {
  title: '',
  description: '',
  category: 'restaurante',
  address: '',
  phone: '',
  whatsapp: '',
  hours: '',
};

function businessPatch(form: FormState) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    address: form.address.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim(),
    hours: form.hours.trim(),
  };
}

export default function MyBusinessesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

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
        toast('Não foi possível carregar seus negócios agora.', 'error');
      },
    );

    return unsubscribe;
  }, [toast, user]);

  const pendingCount = useMemo(
    () => businesses.filter((business) => business.status === 'pending_approval').length,
    [businesses],
  );

  if (!user) return null;

  const startCreate = () => setEditing({ ...emptyForm });

  const startEdit = (business: Business) => setEditing({
    id: business.id,
    currentStatus: business.status,
    title: business.title,
    description: business.description,
    category: business.category,
    address: business.address,
    phone: business.phone,
    whatsapp: business.whatsapp,
    hours: business.hours,
  });

  const cancelEdit = () => setEditing(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    const patch = businessPatch(editing);
    if (!patch.title || !patch.description || !patch.address) {
      toast('Preencha nome, descrição e endereço.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editing.id) {
        if (editing.currentStatus === 'archived') {
          await resubmitOwnedBusiness(editing.id, patch);
          toast('Cadastro corrigido e reenviado para análise.', 'success');
        } else {
          await updateOwnedBusiness(editing.id, patch);
          toast('Negócio atualizado.', 'success');
        }
      } else {
        await registerBusiness({
          ...patch,
          ownerId: user.uid,
          ownerName: user.displayName || user.email || 'Cidadão',
        });
        toast('Cadastro enviado. Aguarde a aprovação da prefeitura.', 'success');
      }

      setEditing(null);
    } catch {
      toast('Não foi possível salvar agora.', 'error');
    } finally {
      setSaving(false);
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
            Meus negócios
          </h2>
          <p className="mt-1 text-xs font-medium leading-5 text-text-muted">
            Cadastre seu comércio ou serviço. Depois da aprovação da prefeitura, ele aparece em <code className="font-mono text-primary">/comercio</code>.
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
                  Ao salvar, este cadastro volta para a fila de aprovação.
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
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
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
              {CATEGORIES.map((item) => (
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
              placeholder="Rua, numero, bairro"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary"
            />
          </label>

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
              {editing.id ? 'Salvar alterações' : 'Enviar para aprovação'}
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
          <p className="text-sm font-bold uppercase tracking-widest text-text-main">Nenhum negócio cadastrado</p>
          <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
            Quando você cadastrar um comércio ou serviço, ele aparece aqui com o status da aprovação.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingCount > 0 && (
            <p className="text-xs font-bold text-text-muted">
              {pendingCount} cadastro{pendingCount === 1 ? '' : 's'} aguardando aprovação.
            </p>
          )}

          {businesses.map((business) => {
            const meta = STATUS_META[business.status];
            const StatusIcon = meta.icon;

            return (
              <article key={business.id} className="civic-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest', meta.tone)}>
                    <StatusIcon className="h-3 w-3" />
                    {meta.label}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    {business.category}
                  </span>
                </div>

                <h4 className="mt-2 text-base font-semibold text-text-main">{business.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-text-muted">{business.description}</p>

                <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-text-muted">
                  {business.address && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {business.address}
                    </span>
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
