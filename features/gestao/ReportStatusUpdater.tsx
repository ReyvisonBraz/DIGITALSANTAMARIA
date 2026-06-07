import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { updateReportStatus } from '@/services/reports.service';
import { useToast } from '@/lib/toast-context';
import type { ReportStatus } from '@/types';

interface ReportStatusUpdaterProps {
  reportId: string;
  clerkId: string;
  clerkName: string;
  initialStatus?: ReportStatus;
  initialResponse?: string;
  onUpdate: () => void;
}

const statuses: { label: string; value: ReportStatus }[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em analise', value: 'in_review' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Recusado', value: 'rejected' },
];

function getStatusLabel(status: ReportStatus) {
  return statuses.find((item) => item.value === status)?.label || status;
}

function requiresConfirmation(status: ReportStatus) {
  return status === 'resolved' || status === 'rejected';
}

export default function ReportStatusUpdater({
  reportId,
  clerkId,
  clerkName,
  initialStatus = 'in_review',
  initialResponse = '',
  onUpdate,
}: ReportStatusUpdaterProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<ReportStatus>(initialStatus);
  const [response, setResponse] = useState(initialResponse);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
    setResponse(initialResponse);
  }, [initialStatus, initialResponse]);

  const saveStatus = async () => {
    setLoading(true);
    try {
      await updateReportStatus(reportId, status, clerkId, clerkName, response.trim() || undefined);
      toast('Relato atualizado.', 'success');
      setConfirmOpen(false);
      onUpdate();
    } catch {
      toast('Erro ao atualizar relato.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!response.trim() && (status === 'resolved' || status === 'rejected')) {
      toast('Informe uma resposta oficial para concluir o relato.', 'error');
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
              onChange={(event) => setStatus(event.target.value as ReportStatus)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Resposta oficial</span>
            <textarea
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              rows={3}
              placeholder="Escreva o que o cidadao vera nas notificacoes e no painel."
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Confirmar ${getStatusLabel(status).toLowerCase()}`}
        description={`Esta acao vai marcar o relato como ${getStatusLabel(status).toLowerCase()} e o cidadao vera a resposta oficial no historico do relato.`}
        confirmLabel="Confirmar status"
        loading={loading}
        tone={status === 'rejected' ? 'danger' : 'default'}
        onConfirm={saveStatus}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
