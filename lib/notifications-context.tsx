'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  listenToUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/notifications.service';
import type { Notification } from '@/types';

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = listenToUserNotifications(user.uid, (next) => {
      setNotifications(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.uid);
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    await markNotificationAsRead(id);
  }, []);

  const value = useMemo<NotificationsContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    loading,
    markAllAsRead,
    markAsRead,
  }), [notifications, loading, markAllAsRead, markAsRead]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationsProvider');
  }
  return context;
}
