'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPendingReports, getReportById } from '@/services/reports.service';
import { getDemandsByUser } from '@/services/demands.service';
import type { Report, Demand } from '@/types';

interface AdminData {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingReports();
      setReports(data);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reports, loading, error, refresh };
}
