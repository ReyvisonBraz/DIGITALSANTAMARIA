'use client';

import React from 'react';
import { Bell, Info, ShieldCheck, MessageSquare, Heart, Vote, X, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import SidePanel from '@/components/ui/SidePanel';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'update';
  time: string;
  icon: any;
  unread: boolean;
}

const mockNotifications: Notification[] = [
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
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Notificações"
    >
      <div className="p-4 space-y-4">
        {mockNotifications.map((notif) => (
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
          >
            {notif.unread && (
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 flex items-center justify-center rounded-bl-xl border-l border-b border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            )}
            
            <div className="flex gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2",
                notif.type === 'success' ? "bg-green-50 border-green-200 text-green-600" :
                notif.type === 'alert' ? "bg-rose-50 border-rose-200 text-rose-600" :
                notif.type === 'update' ? "bg-blue-50 border-blue-200 text-blue-600" :
                "bg-surface border-border text-primary"
              )}>
                <notif.icon className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{notif.title}</h4>
                <p className="text-xs font-ui font-medium text-text-muted leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-text-muted uppercase tracking-widest pt-2">
                  <Clock className="w-3 h-3" />
                  {notif.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="pt-10 text-center">
            <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline transition-all">
                Marcar todas como lidas
            </button>
        </div>
      </div>
    </SidePanel>
  );
}
