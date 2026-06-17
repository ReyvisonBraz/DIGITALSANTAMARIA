'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Save, Zap } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getResponsesForCategory } from '@/lib/constants/respostas-rapidas';

/**
 * Props para o formulário de atualização de status (demandas, relatos, etc).
 */
export interface StatusOption {
  label: string;
  value: string;
}

interface StatusUpdateFormProps {
  /** Opções de status disponíveis */
  statusOptions: StatusOption[];
  /** Status atual */
  status: string;
  /** Callback ao mudar status */
  onStatusChange: (value: string) => void;
  /** Texto da resposta oficial */
  response: string;
  /** Callback ao mudar resposta */
  onResponseChange: (value: string) => void;
  /** Salvar */
  onSave: () => void;
  /** Loading do save */
  loading: boolean;
  /** Categoria para respostas rápidas */
  quickResponseCategory?: string;

  /** Confirmação (resolvido/rejeitado) */
  confirmOpen: boolean;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel: string;
  confirmTone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancelConfirm: () => void;
}

export default function StatusUpdateForm({
  statusOptions,
  status,
  onStatusChange,
  response,
  onResponseChange,
  onSave,
  loading,
  quickResponseCategory = 'outros',
  confirmOpen,
  confirmTitle,
  confirmDescription,
  confirmLabel,
  confirmTone = 'default',
  onConfirm,
  onCancelConfirm,
}: StatusUpdateFormProps) {
  const [showQuickResponses, setShowQuickResponses] = useState(false);

  const quickResponses = useMemo(
    () => getResponsesForCategory(quickResponseCategory),
    [quickResponseCategory],
  );

  const applyTemplate = (text: string) => {
    onResponseChange(response ? response + '\n\n' + text : text);
  };

  return (
    <>
      <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3">
          <label className="min-w-0 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Status</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Resposta oficial</span>
              <button
                type="button"
                onClick={() => setShowQuickResponses((v) => !v)}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg px-1 text-[11px] font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/5 hover:text-primary-dark"
              >
                <Zap className="h-3 w-3" />
                Respostas rápidas
                {showQuickResponses ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {showQuickResponses && (
              <div className="rounded-xl border border-border bg-surface/50 p-3 space-y-2">
                {(['solicitar_dados', 'encaminhamento', 'resolucao', 'rejeicao'] as const).map((group) => {
                  const items = quickResponses.filter((r) => r.group === group);
                  if (items.length === 0) return null;
                  const label = { solicitar_dados: 'Solicitar dados', encaminhamento: 'Encaminhamento', resolucao: 'Resolução', rejeicao: 'Rejeição' }[group];
                  return (
                    <div key={group}>
                      <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/60">{label}</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <button key={item.label} type="button" onClick={() => applyTemplate(item.text)}
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
              onChange={(e) => onResponseChange(e.target.value)}
              rows={6}
              placeholder="Escreva a resposta que o cidadão verá."
              className="min-h-[120px] w-full min-w-0 resize-y rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-primary"
            />
          </label>
        </div>

        <button
          onClick={onSave}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar atualização
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        loading={loading}
        tone={confirmTone}
        onConfirm={onConfirm}
        onClose={onCancelConfirm}
      />
    </>
  );
}
