'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createLogger } from '@/lib/logger';

const log = createLogger('App');

export default function RootLayoutLogger() {
  const pathname = usePathname();

  useEffect(() => {
    log.info('Page viewed', { path: pathname });
  }, [pathname]);

  useEffect(() => {
    log.info('Application mounted');

    const handleOnline = () => log.info('Network: online');
    const handleOffline = () => log.warn('Network: offline');
    const handleError = (event: ErrorEvent) => {
      log.error('Uncaught error', { path: pathname }, event.error || event.message);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      log.error('Unhandled promise rejection', { path: pathname }, event.reason);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pathname]);

  return null;
}
