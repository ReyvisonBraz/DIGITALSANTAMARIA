'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, FileWarning } from 'lucide-react';
import { createLogger } from '@/lib/logger';

const log = createLogger('RelatarError');

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error('Erro na página de Relatar Demanda', { digest: error.digest }, error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
        <FileWarning className="w-8 h-8 text-amber-500" />
      </div>
      <h1 className="text-2xl font-bold text-text-main">Erro ao Relatar</h1>
      <p className="text-text-muted mt-2 max-w-md">
        Não foi possível carregar o formulário de relato. Tente novamente.
      </p>
      <Button onClick={reset} className="mt-6">
        <RefreshCw className="w-4 h-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
