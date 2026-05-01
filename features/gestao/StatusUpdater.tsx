'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { updateReportStatus } from '@/services/reports.service';
import { useToast } from '@/lib/toast-context';
import Button from '@/components/ui/Button';
import type { ReportStatus } from '@/types';

interface StatusUpdaterProps {
  reportId: string;
  clerkId: string;
  onUpdate: () => void;
}

export default function StatusUpdater({ reportId, clerkId, onUpdate }: StatusUpdaterProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: ReportStatus) => {
    setLoading(true);
    try {
      await updateReportStatus(reportId, status, clerkId);
      toast(`Relato atualizado para ${status}`, 'success');
      onUpdate();
    } catch {
      toast('Erro ao atualizar status', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        onClick={() => updateStatus('in_review')}
        disabled={loading}
        className="text-[9px] !px-3 !py-2"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
        Revisar
      </Button>
      <Button
        variant="danger"
        onClick={() => updateStatus('rejected')}
        disabled={loading}
        className="text-[9px] !px-3 !py-2"
      >
        <XCircle className="w-3 h-3" />
        Rejeitar
      </Button>
    </div>
  );
}
