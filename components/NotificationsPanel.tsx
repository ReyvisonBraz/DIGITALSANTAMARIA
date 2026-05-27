'use client';

import { useEffect } from 'react';
import { Clock, Heart, MessageSquare, Vote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import SidePanel from '@/components/ui/SidePanel';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';

const log = createLogger('NotificationsPanel');

type NotificationType = 'success' | 'alert' | 'update';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  icon: LucideIcon;
  unread: boolean;
}

const notifications: readonly Notification[] = [
  {
    id: '1',
    title: 'Solicitacao em analise',
    message: 'Uma solicitacao enviada ao municipio foi recebida pela equipe responsavel.',
    type: 'update',
    time: '2 horas atras',
    icon: MessageSquare,
    unread: true,
  },
  {
    id: '2',
    title: 'Participacao registrada',
    message: 'Sua participacao foi registrada com sucesso no portal.',
    type: 'success',
    time: '5 horas atras',
    icon: Vote,
    unread: false,
  },
  {
    id: '3',
    title: 'Aviso de saude',
    message: 'Novos comunicados de atendimento podem aparecer aqui.',
    type: 'alert',
    time: 'Ha 1 dia',
    icon: Heart,
    unread: true,
  },
] as const;

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
            className={cn(
              'relative overflow-hidden rounded-xl border p-4 transition',
              notification.unread ? 'border-primary/20 bg-white shadow-sm' : 'border-border bg-surface'
            )}
            role="article"
            aria-label={`Notificacao: ${notification.title}`}
          >
            {notification.unread && (
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
          </motion.div>
        ))}

        <div className="pt-4 text-center">
          <button className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary hover:underline">
            Marcar todas como lidas
          </button>
        </div>
      </div>
    </SidePanel>
  );
}
