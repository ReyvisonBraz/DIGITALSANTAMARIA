'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  BellOff,
  Briefcase,
  CalendarCheck,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  Loader2,
  MessageSquare,
  Siren,
  Store,
  Vote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import SidePanel from '@/components/ui/SidePanel';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { createLogger } from '@/lib/logger';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import type { NotificationKind, NotificationTone } from '@/types';

const log = createLogger('NotificationsPanel');

const TONE_STYLES: Record<NotificationTone, string> = {
  success: 'bg-green-50 border-green-200 text-green-600',
  alert: 'bg-rose-50 border-rose-200 text-rose-600',
  update: 'bg-blue-50 border-blue-200 text-blue-600',
};

const KIND_ICONS: Record<NotificationKind, LucideIcon> = {
  demand_update: MessageSquare,
  report_update: FileText,
  petition_update: Vote,
  business_update: Store,
  appointment_update: CalendarCheck,
  application_update: Briefcase,
  enrollment_update: GraduationCap,
  emergency_update: Siren,
  system: Heart,
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const { notifications, unreadCount, loading, markAllAsRead, markAsRead } = useNotifications();

  useEffect(() => {
    if (isOpen) log.info('Notifications panel opened', { count: notifications.length });
  }, [isOpen, notifications.length]);

  const handleLogin = async () => {
    try {
      await login();
      onClose();
    } catch (error) {
      log.error('Login failed from notifications panel', {}, error);
      toast(error instanceof Error ? error.message : 'Nao foi possivel iniciar o login.', 'error');
    }
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Notificações">
      <div className="space-y-3 p-4">
        {!user ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
            <BellOff className="mx-auto h-6 w-6 text-text-muted" />
            <p className="mt-3 text-sm font-semibold text-text-main">Entre para receber notificacoes</p>
            <p className="mt-2 text-xs font-medium leading-5 text-text-muted">
              Avisos sobre seus protocolos, relatos e petições aparecem aqui assim que você entra com sua conta.
            </p>
            <button
              type="button"
              onClick={handleLogin}
              className="action-button-primary mt-4"
            >
              Entrar com Google
            </button>
          </div>
        ) : loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
            <BellOff className="mx-auto h-6 w-6 text-text-muted" />
            <p className="mt-3 text-sm font-semibold text-text-main">Nenhuma notificacao ainda</p>
            <p className="mt-2 text-xs font-medium leading-5 text-text-muted">
              Quando uma solicitação, relato ou petição sua mudar de status, você é avisado por aqui.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = KIND_ICONS[notification.kind] || MessageSquare;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link
                  href={notification.href || '/perfil'}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                    onClose();
                  }}
                  className={cn(
                    'relative block overflow-hidden rounded-xl border p-4 transition hover:border-primary/40 hover:shadow-sm',
                    !notification.read ? 'border-primary/20 bg-white shadow-sm' : 'border-border bg-surface',
                  )}
                  aria-label={`Notificação: ${notification.title}`}
                >
                  {!notification.read && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" aria-label="Nao lida" />
                  )}

                  <div className="flex gap-3">
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border', TONE_STYLES[notification.tone])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold uppercase tracking-normal text-text-main">{notification.title}</h4>
                      <p className="mt-1 text-xs font-medium leading-5 text-text-muted">{notification.message}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        <Clock className="h-3 w-3" />
                        <time>{formatRelativeTime(notification.createdAt)}</time>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}

        {user && notifications.length > 0 && (
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
            >
              Marcar todas como lidas
            </button>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
