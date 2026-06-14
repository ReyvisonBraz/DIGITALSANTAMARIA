'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { createDemand, waitForDemandProtocol } from '@/services/demands.service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { DemandCategory, DemandType } from '@/types';

interface DemandFormProps {
  onSuccess: (protocolId: string) => void;
}

const demandTypes: { label: string; value: DemandType }[] = [
  { label: 'Reclamação', value: 'reclamacao' },
  { label: 'Solicitação', value: 'sugestao' },
  { label: 'Denúncia', value: 'denuncia' },
  { label: 'Elogio', value: 'elogio' },
];

const categories: { label: string; value: DemandCategory }[] = [
  { label: 'Infraestrutura', value: 'infraestrutura' },
  { label: 'Saude', value: 'saude' },
  { label: 'Educacao', value: 'educacao' },
  { label: 'Seguranca', value: 'seguranca' },
  { label: 'Meio ambiente', value: 'meio_ambiente' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Tributos', value: 'tributos' },
  { label: 'Outros', value: 'outros' },
];

export default function DemandForm({ onSuccess }: DemandFormProps) {
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

  // Re-submete apos login (M2 fix)
  useEffect(() => {
    if (user && pendingSubmit.current) {
      pendingSubmit.current = false;
      submitDemand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cleanup do listener de protocolo ao desmontar
  useEffect(() => {
    return () => {
      if (protocolUnsubscribe.current) {
        protocolUnsubscribe.current();
      }
    };
  }, []);

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

      // Aguarda o protocolId real da Cloud Function
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
      toast('Não foi possível enviar a solicitação agora.', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.subject.trim() || !formData.text.trim()) {
      toast('Preencha o assunto e a descricao da solicitação.', 'error');
      return;
    }

    if (!formData.consent) {
      toast('Confirme os termos para protocolar a solicitação.', 'error');
      return;
    }

    if (!user) {
      pendingSubmit.current = true;
      try {
        await login();
      } catch (error) {
        pendingSubmit.current = false;
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    submitDemand();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</span>
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
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Categoria</span>
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
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">Assunto</span>
        <input
          value={formData.subject}
          onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
          placeholder="Ex: Iluminacao apagada na rua principal"
          maxLength={200}
          className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none transition placeholder:font-medium focus:border-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</span>
        <textarea
          value={formData.text}
          onChange={(event) => setFormData({ ...formData, text: event.target.value })}
          placeholder="Descreva o que aconteceu, onde aconteceu e qualquer detalhe importante."
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
            Enviar como solicitação anonima.
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
            Confirmo que as informações são verdadeiras e autorizo o tratamento dos dados necessários para atendimento.
          </span>
        </label>
      </div>

      {!user && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium leading-6">
            Para protocolar, entre com sua conta Google. Se marcar anonimo, seus dados nao aparecerao no atendimento.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Protocolar solicitação
      </button>
    </form>
  );
}
