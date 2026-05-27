'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof window !== 'undefined') {
      try {
        fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'error',
            message: `ErrorBoundary caught: ${error.message}`,
            context: { componentStack: errorInfo.componentStack || '' },
            error: { name: error.name, message: error.message, stack: error.stack },
          }),
        }).catch(() => {});
      } catch {}
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center bg-surface rounded-3xl border-2 border-border">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold text-text-main uppercase tracking-tighter mb-2">
            Algo deu errado
          </h3>
          <p className="text-sm font-medium text-text-muted font-ui max-w-md mb-8">
            Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Recarregar Página
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-8 p-6 bg-slate-900 text-green-400 rounded-2xl text-xs text-left max-w-2xl overflow-auto font-mono border-2 border-slate-700">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
