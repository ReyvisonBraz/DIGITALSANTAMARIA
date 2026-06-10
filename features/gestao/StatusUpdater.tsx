'use client';

import { useEffect, useState } from 'react';
import StatusUpdateForm from '@/components/StatusUpdateForm';
import { updateDemandStatus } from '@/services/demands.service';
import { useToast } from '@/lib/toast-context';
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

const STATUSES: { label: string; value: DemandStatus }[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Em análise', value: 'analyzing' },
  { label: 'Resolvida', value: 'solved' },
  { label: 'Recusada', value: 'rejected' },
];

function getLabel(s: DemandStatus) {
  return STATUSES.find((x) => x.value === s)?.label || s;
}

export default function StatusUpdater({
  demandId, clerkId, clerkName, initialStatus,
  initialResponse = '', category = 'outros', onUpdate,
}: StatusUpdaterProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<DemandStatus>(initialStatus);
  const [response, setResponse] = useState(initialResponse);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
    setResponse(initialResponse);
  }, [initialStatus, initialResponse]);

  const handleSave = () => {
    if (!response.trim() && (status === 'solved' || status === 'rejected')) {
      toast('Informe uma resposta oficial para concluir a solicitação.', 'error');
      return;
    }
    if (status === 'solved' || status === 'rejected') {
      setConfirmOpen(true);
      return;
    }
    saveStatus();
  };

  const saveStatus = async () => {
    setLoading(true);
    try {
      await updateDemandStatus(demandId, status, { clerkId, clerkName, response: response.trim() });
      toast('Solicitação atualizada.', 'success');
      setConfirmOpen(false);
      onUpdate();
    } catch {
      toast('Erro ao atualizar solicitação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StatusUpdateForm
      statusOptions={STATUSES}
      status={status}
      onStatusChange={(v) => setStatus(v as DemandStatus)}
      response={response}
      onResponseChange={setResponse}
      onSave={handleSave}
      loading={loading}
      quickResponseCategory={category}
      confirmOpen={confirmOpen}
      confirmTitle={`Confirmar ${getLabel(status).toLowerCase()}`}
      confirmDescription={`Esta ação vai marcar a solicitação como ${getLabel(status).toLowerCase()} e o cidadão verá a resposta oficial no histórico do protocolo.`}
      confirmLabel="Confirmar status"
      confirmTone={status === 'rejected' ? 'danger' : 'default'}
      onConfirm={saveStatus}
      onCancelConfirm={() => setConfirmOpen(false)}
    />
  );
}
