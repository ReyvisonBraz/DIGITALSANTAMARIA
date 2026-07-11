'use client';

import { useEffect, useState } from 'react';
import { Wifi, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Wifi className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-main">
            {isOnline ? 'Página não encontrada' : 'Sem conexão'}
          </h1>
          <p className="text-text-muted">
            {isOnline
              ? 'A página que você procura não está disponível no momento.'
              : 'Verifique sua conexão com a internet e tente novamente.'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>

        <p className="text-xs text-text-muted">
          Conecta Santa Maria — Portal do Cidadão
        </p>
      </div>
    </div>
  );
}
