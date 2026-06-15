'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusUpdateForm from '@/components/StatusUpdateForm';
import { updateReportStatus } from '@/services/reports.service';
import { useToast } from '@/lib/toast-context';
import type { ReportStatus, ReportType } from '@/types';

interface ReportStatusUpdaterProps {
  reportId: string;
  clerkId: string;
  clerkName: string;
  initialStatus?: ReportStatus;
  initialResponse?: string;
  reportType?: ReportType;
  onUpdate: () => void;
}

const STATUSES: { label: string; value: ReportStatus }[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em análise', value: 'in_review' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Recusado', value: 'rejected' },
  { label: 'Cancelado', value: 'cancelled' },
];

const TYPE_TO_CATEGORY: Record<ReportType, string> = {
  infrastructure: 'infraestrutura',
  environment: 'meio_ambiente',
  security: 'seguranca',
  other: 'outros',
};

function getLabel(s: ReportStatus) {
  return STATUSES.find((x) => x.value === s)?.label || s;
}

export default function ReportStatusUpdater({
  reportId, clerkId, clerkName, initialStatus = 'in_review',
  initialResponse = '', reportType = 'other', onUpdate,
}: ReportStatusUpdaterProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<ReportStatus>(initialStatus);
  const [response, setResponse] = useState(initialResponse);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const category = TYPE_TO_CATEGORY[reportType] || 'outros';

  useEffect(() => {
    setStatus(initialStatus);
    setResponse(initialResponse);
  }, [initialStatus, initialResponse]);

  const handleSave = () => {
    if (!response.trim() && (status === 'resolved' || status === 'rejected')) {
      toast('Informe uma resposta oficial para concluir o relato.', 'error');
      return;
    }
    if (status === 'resolved' || status === 'rejected' || status === 'cancelled') {
      setConfirmOpen(true);
      return;
    }
    saveStatus();
  };

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

  return (
    <StatusUpdateForm
      statusOptions={STATUSES}
      status={status}
      onStatusChange={(v) => setStatus(v as ReportStatus)}
      response={response}
      onResponseChange={setResponse}
      onSave={handleSave}
      loading={loading}
      quickResponseCategory={category}
      confirmOpen={confirmOpen}
      confirmTitle={`Confirmar ${getLabel(status).toLowerCase()}`}
      confirmDescription={`Esta ação vai marcar o relato como ${getLabel(status).toLowerCase()} e o cidadão verá a resposta oficial no histórico do relato.`}
      confirmLabel="Confirmar status"
      confirmTone={status === 'rejected' || status === 'cancelled' ? 'danger' : 'default'}
      onConfirm={saveStatus}
      onCancelConfirm={() => setConfirmOpen(false)}
    />
  );
}
