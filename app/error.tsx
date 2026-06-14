'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { createLogger } from '@/lib/logger';

const log = createLogger('PageError');

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error('Erro não capturado na página', { digest: error.digest }, error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Algo deu errado
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        Ocorreu um erro inesperado ao carregar esta página. Tente novamente.
      </p>
      <Button onClick={reset} className="mt-6">
        <RefreshCw className="w-4 h-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
