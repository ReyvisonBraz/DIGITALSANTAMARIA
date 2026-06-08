'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Save, Zap } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { updateDemandStatus } from '@/services/demands.service';
import { useToast } from '@/lib/toast-context';
import { getResponsesForCategory } from '@/lib/constants/respostas-rapidas';
import type { DemandStatus } from '@/types';

interface StatusUpdaterProps {
  demandId: string;
  clerkId: string;
  clerkName: string;
  initialStatus: DemandStatus;
  initialResponse?: string;
  category?: string;
  onUpdate: () => void;
}

const statuses: { label: string; value: DemandStatus }[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em analise', value: 'analyzing' },
  { label: 'Resolvida', value: 'solved' },
  { label: 'Recusada', value: 'rejected' },
];

function getStatusLabel(status: DemandStatus) {
  return statuses.find((item) => item.value === status)?.label || status;
}

function requiresConfirmation(status: DemandStatus) {
  return status === 'solved' || status === 'rejected';
}

export default function StatusUpdater({
  demandId,
  clerkId,
  clerkName,
  initialStatus,
  initialResponse = '',
  category = 'outros',
  onUpdate,
}: StatusUpdaterProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<DemandStatus>(initialStatus);
  const [response, setResponse] = useState(initialResponse);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);

  const quickResponses = useMemo(
    () => getResponsesForCategory(category),
    [category],
  );

  useEffect(() => {
    setStatus(initialStatus);
    setResponse(initialResponse);
  }, [initialStatus, initialResponse]);

  const applyTemplate = (text: string) => {
    setResponse((prev) => (prev ? prev + '\n\n' + text : text));
  };

  const saveStatus = async () => {
    setLoading(true);
    try {
      await updateDemandStatus(demandId, status, {
        clerkId,
        clerkName,
        response: response.trim(),
      });
      toast('Solicitacao atualizada.', 'success');
      setConfirmOpen(false);
      onUpdate();
    } catch {
      toast('Erro ao atualizar solicitacao.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!response.trim() && (status === 'solved' || status === 'rejected')) {
      toast('Informe uma resposta oficial para concluir a solicitacao.', 'error');
      return;
    }

    if (requiresConfirmation(status)) {
      setConfirmOpen(true);
      return;
    }

    saveStatus();
  };

  return (
    <>
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Resposta oficial</span>
              <button
                type="button"
                onClick={() => setShowQuickResponses((v) => !v)}
                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
              >
                <Zap className="h-3 w-3" />
                Respostas rapidas
                {showQuickResponses ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {showQuickResponses && (
              <div className="rounded-xl border border-border bg-surface/50 p-3 space-y-2">
                {(['solicitar_dados', 'encaminhamento', 'resolucao', 'rejeicao'] as const).map((group) => {
                  const groupItems = quickResponses.filter((r) => r.group === group);
                  if (groupItems.length === 0) return null;
                  const groupLabel = {
                    solicitar_dados: 'Solicitar dados',
                    encaminhamento: 'Encaminhamento',
                    resolucao: 'Resolucao',
                    rejeicao: 'Rejeicao',
                  }[group];
                  return (
                    <div key={group}>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/60">{groupLabel}</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {groupItems.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => applyTemplate(item.text)}
                            className="inline-block rounded-lg border border-border bg-white px-2.5 py-1.5 text-left text-[11px] font-semibold leading-snug text-text-main hover:border-primary hover:bg-primary/5 transition-colors"
                            title={item.label}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <textarea
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              rows={6}
              placeholder="Escreva a resposta que o cidadao vera na consulta do protocolo."
              className="w-full resize-y rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary min-h-[120px]"
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Confirmar ${getStatusLabel(status).toLowerCase()}`}
        description={`Esta acao vai marcar a solicitacao como ${getStatusLabel(status).toLowerCase()} e o cidadao vera a resposta oficial no historico do protocolo.`}
        confirmLabel="Confirmar status"
        loading={loading}
        tone={status === 'rejected' ? 'danger' : 'default'}
        onConfirm={saveStatus}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
