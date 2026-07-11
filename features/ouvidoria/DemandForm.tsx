'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { createDemand, waitForDemandProtocol } from '@/services/demands.service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { DemandCategory, DemandType } from '@/types';

interface DemandFormProps {
  onSuccess: (protocolId: string) => void;
}

export default function DemandForm({ onSuccess }: DemandFormProps) {
  const t = useTranslations('ouvidoria.form');
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'reclamacao' as DemandType,
    category: 'outros' as DemandCategory,
    subject: '',
    text: '',
    isAnonymous: false,
    consent: false,
  });
  const pendingSubmit = useRef(false);
  const protocolUnsubscribe = useRef<(() => void) | null>(null);

  const demandTypes: { label: string; value: DemandType }[] = [
    { label: t('types.reclamacao'), value: 'reclamacao' },
    { label: t('types.solicitacao'), value: 'sugestao' },
    { label: t('types.denuncia'), value: 'denuncia' },
    { label: t('types.elogio'), value: 'elogio' },
  ];

  const categories: { label: string; value: DemandCategory }[] = [
    { label: t('categories.infraestrutura'), value: 'infraestrutura' },
    { label: t('categories.saude'), value: 'saude' },
    { label: t('categories.educacao'), value: 'educacao' },
    { label: t('categories.seguranca'), value: 'seguranca' },
    { label: t('categories.meio_ambiente'), value: 'meio_ambiente' },
    { label: t('categories.transporte'), value: 'transporte' },
    { label: t('categories.tributos'), value: 'tributos' },
    { label: t('categories.outros'), value: 'outros' },
  ];

  const submitDemand = async () => {
    setLoading(true);
    try {
      const result = await createDemand({
        ...formData,
        subject: formData.subject.trim(),
        text: formData.text.trim(),
        authorId: user!.uid,
        authorName: user!.displayName || user!.email || '',
      });

      protocolUnsubscribe.current = waitForDemandProtocol(result.id, (protocolId) => {
        setLoading(false);
        onSuccess(protocolId);
        setFormData({
          type: 'reclamacao',
          category: 'outros',
          subject: '',
          text: '',
          isAnonymous: false,
          consent: false,
        });
      });
    } catch {
      toast(t('submitError'), 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && pendingSubmit.current) {
      pendingSubmit.current = false;
      submitDemand();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (protocolUnsubscribe.current) {
        protocolUnsubscribe.current();
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.subject.trim() || !formData.text.trim()) {
      toast(t('fillRequired'), 'error');
      return;
    }

    if (!formData.consent) {
      toast(t('confirmTerms'), 'error');
      return;
    }

    if (!user) {
      pendingSubmit.current = true;
      try {
        await login();
      } catch (error) {
        pendingSubmit.current = false;
        toast(error instanceof Error ? error.message : t('loginError'), 'error');
      }
      return;
    }

    submitDemand();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('type')}</span>
          <select
            value={formData.type}
            onChange={(event) => setFormData({ ...formData, type: event.target.value as DemandType })}
            className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition focus:border-primary"
          >
            {demandTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('category')}</span>
          <select
            value={formData.category}
            onChange={(event) => setFormData({ ...formData, category: event.target.value as DemandCategory })}
            className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition focus:border-primary"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('subject')}</span>
        <input
          value={formData.subject}
          onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
          placeholder={t('subjectPlaceholder')}
          maxLength={200}
          className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition placeholder:font-medium focus:border-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('description')}</span>
        <textarea
          value={formData.text}
          onChange={(event) => setFormData({ ...formData, text: event.target.value })}
          placeholder={t('descriptionPlaceholder')}
          rows={6}
          maxLength={4000}
          className="w-full resize-y rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 text-text-main outline-none transition focus:border-primary min-h-[120px]"
        />
      </label>

      <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={(event) => setFormData({ ...formData, isAnonymous: event.target.checked })}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium leading-6 text-text-muted">
            {t('anonymous')}
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(event) => setFormData({ ...formData, consent: event.target.checked })}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium leading-6 text-text-muted">
            {t('consent')}
          </span>
        </label>
      </div>

      {!user && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium leading-6">
            {t('loginInfo')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {t('submit')}
      </button>
    </form>
  );
}
