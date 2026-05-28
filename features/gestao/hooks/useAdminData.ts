'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllDemands } from '@/services/demands.service';
import { getAllReports } from '@/services/reports.service';
import type { Demand, Report } from '@/types';

interface AdminData {
  demands: Demand[];
  reports: Report[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminData(enabled = true): AdminData {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setDemands([]);
      setReports([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [demandList, reportList] = await Promise.all([getAllDemands(), getAllReports()]);
      setDemands(demandList);
      setReports(reportList);
    } catch {
      setError('Erro ao carregar dados administrativos.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { demands, reports, loading, error, refresh };
}
