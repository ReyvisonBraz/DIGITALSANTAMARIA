'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import SidePanel from '@/components/ui/SidePanel';
import { useNotifications, type NotificationType } from '@/lib/notifications-context';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';

const log = createLogger('NotificationsPanel');

const styles: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-600',
  alert: 'bg-rose-50 border-rose-200 text-rose-600',
  update: 'bg-blue-50 border-blue-200 text-blue-600',
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  useEffect(() => {
    if (isOpen) log.info('Notifications panel opened');
  }, [isOpen]);

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Notificacoes">
      <div className="space-y-3 p-4">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href={notification.href}
              onClick={() => {
                markAsRead(notification.id);
                onClose();
              }}
              className={cn(
                'relative block overflow-hidden rounded-xl border p-4 transition hover:border-primary/40 hover:shadow-sm',
                !notification.read ? 'border-primary/20 bg-white shadow-sm' : 'border-border bg-surface'
              )}
              aria-label={`Notificacao: ${notification.title}`}
            >
              {!notification.read && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" aria-label="Nao lida" />
              )}

              <div className="flex gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border', styles[notification.type])}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold uppercase tracking-normal text-text-main">{notification.title}</h4>
                  <p className="mt-1 text-xs font-medium leading-5 text-text-muted">{notification.message}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    <Clock className="h-3 w-3" />
                    <time>{notification.time}</time>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        <div className="pt-4 text-center">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
          >
            Marcar todas como lidas
          </button>
        </div>
      </div>
    </SidePanel>
  );
}
