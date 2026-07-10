'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { NotificationsProvider } from '@/lib/notifications-context';

/**
 * Compose providers in a flat, readable structure.
 *
 * Before (7 levels of nesting):
 * ```tsx
 * <AccessibilityProvider>
 *   <AuthProvider>
 *     <ToastProvider>
 *       <NotificationsProvider>
 *         {children}
 *       </NotificationsProvider>
 *     </ToastProvider>
 *   </AuthProvider>
 * </AccessibilityProvider>
 * ```
 *
 * After (flat):
 * ```tsx
 * <Providers>{children}</Providers>
 * ```
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </ToastProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
