/**
 * @module NotificationsPanel
 * @description Painel lateral de notificações do usuário.
 *
 * Abre como SidePanel (slide da direita) e lista notificações
 * agrupadas por estado de leitura. Cada notificação tem tipo
 * semântico (info, success, alert, update) que determina cor e ícone.
 *
 * @example
 * ```tsx
 * <NotificationsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

'use client';

import React, { useEffect } from 'react';
import { Bell, Info, ShieldCheck, MessageSquare, Heart, Vote, X, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import SidePanel from '@/components/ui/SidePanel';
import { createLogger } from '@/lib/logger';

const log = createLogger('NotificationsPanel');

// ─── Tipos ──────────────────────────────────────────────────────────

/** Tipos semânticos de notificação */
type NotificationType = 'info' | 'success' | 'alert' | 'update';

/** Estrutura de uma notificação */
interface Notification {
  /** Identificador único */
  id: string;
  /** Título da notificação */
  title: string;
  /** Corpo da mensagem */
  message: string;
  /** Tipo semântico que determina cor e estilo */
  type: NotificationType;
  /** Tempo relativo (ex: "2 horas atrás") */
  time: string;
  /** Ícone representativo */
  icon: LucideIcon;
  /** Se a notificação ainda não foi lida */
  unread: boolean;
}

// ─── Dados mockados ─────────────────────────────────────────────────

/** Notificações de exemplo (substituir por dados reais do Firestore) */
const MOCK_NOTIFICATIONS: readonly Notification[] = [
  {
    id: '1',
    title: 'Relato em Análise',
    message: 'Seu relato sobre o buraco na Av. Principal foi recebido pela Secretaria de Obras.',
    type: 'update',
    time: '2 horas atrás',
    icon: MessageSquare,
    unread: true
  },
  {
    id: '2',
    title: 'Voto Computado',
    message: 'Parabéns! Sua participação no Projeto de Lei 204/2026 foi registrada com sucesso.',
    type: 'success',
    time: '5 horas atrás',
    icon: Vote,
    unread: false
  },
  {
    id: '3',
    title: 'Campanha de Vacinação',
    message: 'Novas doses disponíveis na Unidade de Saúde Central amanhã das 08h às 17h.',
    type: 'alert',
    time: 'Há 1 dia',
    icon: Heart,
    unread: true
  }
] as const;

/** Mapeamento de tipo de notificação para classes CSS */
const TYPE_STYLES: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-600',
  alert: 'bg-rose-50 border-rose-200 text-rose-600',
  update: 'bg-blue-50 border-blue-200 text-blue-600',
  info: 'bg-surface border-border text-primary',
};

// ─── Props ──────────────────────────────────────────────────────────

interface NotificationsPanelProps {
  /** Se `true`, o painel está visível */
  isOpen: boolean;
  /** Callback para fechar o painel */
  onClose: () => void;
}

// ─── Componente ─────────────────────────────────────────────────────

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  /** Loga abertura do painel */
  useEffect(() => {
    if (isOpen) log.info('Notifications panel opened');
  }, [isOpen]);

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Notificações"
    >
      <div className="p-4 space-y-4">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-5 rounded-2xl border-2 transition-all relative overflow-hidden group hover:shadow-lg",
              notif.unread
                ? "bg-white border-primary/20 shadow-sm"
                : "bg-surface border-border"
            )}
            role="article"
            aria-label={`Notificação: ${notif.title}`}
          >
            {/* Badge de não lido */}
            {notif.unread && (
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 flex items-center justify-center rounded-bl-xl border-l border-b border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full" aria-label="Não lida" />
              </div>
            )}

            <div className="flex gap-4">
              {/* Ícone com cor semântica */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2",
                TYPE_STYLES[notif.type]
              )}>
                <notif.icon className="w-6 h-6" />
              </div>

              {/* Conteúdo textual */}
              <div className="space-y-1">
                <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{notif.title}</h4>
                <p className="text-xs font-ui font-medium text-text-muted leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-text-muted uppercase tracking-widest pt-2">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <time>{notif.time}</time>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Ação para marcar todas como lidas */}
        <div className="pt-10 text-center">
            <button
              className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline transition-all"
              aria-label="Marcar todas as notificações como lidas"
            >
                Marcar todas como lidas
            </button>
        </div>
      </div>
    </SidePanel>
  );
}
