'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Archive, Loader2, MapPin, Phone, Save, Store } from 'lucide-react';
import { createContentService } from '@/services/content.service';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import type { Business } from '@/types';

const service = createContentService<Business>('businesses');

const CATEGORIES: { value: Business['category']; label: string }[] = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'farmacia',    label: 'Farmácia' },
  { value: 'mercado',     label: 'Mercado' },
  { value: 'servico',     label: 'Serviço' },
  { value: 'loja',        label: 'Loja' },
  { value: 'outros',      label: 'Outros' },
];

export default function BusinessesAdmin() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Business['category']>('restaurante');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [hours, setHours] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.list();
      setBusinesses(list);
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
    setCategory('restaurante');
    setAddress('');
    setPhone('');
    setWhatsapp('');
    setHours('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      toast('Preencha nome, descrição e endereço.', 'error');
      return;
    }

    setSaving(true);
    try {
      await service.create({
        title: title.trim(),
        description: description.trim(),
        status: 'published',
        category,
        address: address.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        hours: hours.trim(),
        imageURL: null,
        isOpen: true,
        lat: null,
        lng: null,
      });
      toast('Comércio publicado.', 'success');
      resetForm();
      load();
    } catch {
      toast('Erro ao publicar o comércio.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Arquivar este comércio? Ele deixa de aparecer na página pública.')) return;
    try {
      await service.archive(id);
      toast('Comércio arquivado.', 'success');
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
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Economia local</p>
            <h2 className="text-xl font-semibold tracking-normal text-text-main">Cadastrar comércio</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
              Aparece em <code className="font-mono text-xs text-primary">/comercio</code> com botão pro WhatsApp e horário.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nome do negócio</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required
              placeholder='Ex: "Padaria São José"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={400} required
              placeholder="O que vende, especialidades, diferenciais."
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as Business['category'])}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary">
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Horário</span>
            <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} maxLength={80}
              placeholder='Ex: "Seg-Sab 8h-18h"'
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Endereço</span>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={200}
              placeholder="Rua, número, bairro"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Telefone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20}
              placeholder="(91) 99999-0000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">WhatsApp (somente números, com DDD)</span>
            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} maxLength={13}
              placeholder="91999990000"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none focus:border-primary" />
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Cadastrados</p>
            <h3 className="text-lg font-semibold text-text-main">Comércios ativos ({businesses.length})</h3>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : businesses.length === 0 ? (
          <EmptyState title="Nenhum comércio cadastrado" description="Use o formulário acima para registrar o primeiro." />
        ) : (
          <div className="space-y-3">
            {businesses.map((biz) => (
              <article key={biz.id} className="civic-card flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-dark">
                      {biz.category}
                    </span>
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
                      {biz.phone}{biz.whatsapp ? ` · WhatsApp ${biz.whatsapp}` : ''}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => handleArchive(biz.id)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600">
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
