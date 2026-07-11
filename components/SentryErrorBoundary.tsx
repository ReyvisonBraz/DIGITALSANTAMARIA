'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function SentryErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorBoundary>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">Algo deu errado</h1>
            <p className="text-text-muted mt-2 max-w-md">
              Ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>
            <button
              onClick={resetError}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-2xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Tentar novamente
            </button>
          </div>
        </ErrorBoundary>
      )}
      onError={(error, componentStack) => {
        Sentry.captureException(error, {
          extra: { componentStack },
        });
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
