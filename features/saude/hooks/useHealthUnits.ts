'use client';

import { useState, useEffect } from 'react';
import { getHealthUnits } from '@/services/appointments.service';
import type { HealthUnit, AsyncStatus } from '@/types';

interface UseHealthUnitsResult {
  units: HealthUnit[];
  status: AsyncStatus;
  error: string | null;
}

export function useHealthUnits(): UseHealthUnitsResult {
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus('loading');
    getHealthUnits()
      .then((data) => {
        setUnits(data);
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erro ao carregar unidades');
        setStatus('error');
      });
  }, []);

  return { units, status, error };
}
