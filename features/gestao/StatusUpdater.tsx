'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { updateDemandStatus } from '@/services/demands.service';
import { useToast } from '@/lib/toast-context';
import type { DemandStatus } from '@/types';

interface StatusUpdaterProps {
  demandId: string;
  clerkId: string;
  clerkName: string;
  initialStatus: DemandStatus;
  initialResponse?: string;
  onUpdate: () => void;
}

const statuses: { label: string; value: DemandStatus }[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em analise', value: 'analyzing' },
  { label: 'Resolvida', value: 'solved' },
  { label: 'Recusada', value: 'rejected' },
];

export default function StatusUpdater({
  demandId,
  clerkId,
  clerkName,
  initialStatus,
  initialResponse = '',
  onUpdate,
}: StatusUpdaterProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<DemandStatus>(initialStatus);
  const [response, setResponse] = useState(initialResponse);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
    setResponse(initialResponse);
  }, [initialStatus, initialResponse]);

  const handleSave = async () => {
    if (!response.trim() && (status === 'solved' || status === 'rejected')) {
      toast('Informe uma resposta oficial para concluir a solicitacao.', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateDemandStatus(demandId, status, {
        clerkId,
        clerkName,
        response: response.trim(),
      });
      toast('Solicitacao atualizada.', 'success');
      onUpdate();
    } catch {
      toast('Erro ao atualizar solicitacao.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as DemandStatus)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Resposta oficial</span>
          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            rows={3}
            placeholder="Escreva a resposta que o cidadao vera na consulta do protocolo."
            className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
          />
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Salvar atualizacao
      </button>
    </div>
  );
}
