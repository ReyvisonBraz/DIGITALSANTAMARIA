'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Heart, MessageSquare, Vote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NotificationType = 'success' | 'alert' | 'update';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  icon: LucideIcon;
  href: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: readonly AppNotification[] = [
  {
    id: '1',
    title: 'Solicitacao em analise',
    message: 'Uma solicitacao enviada ao municipio foi recebida pela equipe responsavel.',
    type: 'update',
    time: '2 horas atras',
    icon: MessageSquare,
    href: '/perfil',
    read: false,
  },
  {
    id: '2',
    title: 'Participacao registrada',
    message: 'Sua participacao foi registrada com sucesso no portal.',
    type: 'success',
    time: '5 horas atras',
    icon: Vote,
    href: '/votos',
    read: true,
  },
  {
    id: '3',
    title: 'Aviso de saude',
    message: 'Novos comunicados de atendimento podem aparecer aqui.',
    type: 'alert',
    time: 'Ha 1 dia',
    icon: Heart,
    href: '/saude',
    read: false,
  },
];

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => [...INITIAL_NOTIFICATIONS]);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const value = useMemo<NotificationsContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    markAllAsRead,
    markAsRead,
  }), [notifications, markAllAsRead, markAsRead]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationsProvider');
  }
  return context;
}
