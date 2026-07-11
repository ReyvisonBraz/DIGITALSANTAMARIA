'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, MapPin, ClipboardList, CheckCircle2, AlertCircle, Activity, Stethoscope, Syringe, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import SidePanel from '@/components/ui/SidePanel';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { getAppointmentsByUser } from '@/services/appointments.service';
import { formatDate } from '@/lib/utils/formatters';
import type { Appointment } from '@/types';

interface HealthHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthHistoryPanel({ isOpen, onClose }: HealthHistoryPanelProps) {
  const t = useTranslations('healthHistory');
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) return;
    getAppointmentsByUser(user.uid).then(setAppointments);
  }, [user]);

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className="p-8 space-y-10 pb-32">
        <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-[2rem] text-white space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(26,86,196,0.28)] group">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur shadow-inner">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-semibold text-accent uppercase tracking-widest">{t('restrictedAccess')}</h4>
                <p className="text-2xl font-semibold tracking-tighter leading-none uppercase">{t('digitalRecords')}</p>
              </div>
            </div>
          </div>
          <Activity className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform pointer-events-none" />
        </div>

        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-semibold text-text-main uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {t('appointments')}
          </h3>
        </div>

        <div className="space-y-5 relative">
          <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-border/50" />

          {appointments.length === 0 ? (
            <p className="text-center text-text-muted text-xs font-semibold uppercase tracking-widest py-10">{t('noAppointments')}</p>
          ) : appointments.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-6 group"
            >
              <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl bg-white border-2 border-border shadow-sm flex items-center justify-center group-hover:border-primary transition-all">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-grow bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-40">{item.date}</span>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1.5",
                    item.status === 'completed' ? "bg-green-50 text-green-600" : "bg-primary/5 text-primary"
                  )}>
                    {item.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status === 'completed' ? t('completed') : item.status}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-text-main leading-none uppercase tracking-tight">{item.specialty}</h4>
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-primary" />
                    {item.unitName}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface p-8 rounded-[2rem] border-2 border-border border-dashed space-y-6 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white rounded-xl shadow-inner text-tertiary">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-text-main uppercase leading-tight">{t('privacy')}</h4>
          </div>
          <p className="text-xs font-ui font-medium text-text-muted leading-relaxed relative z-10">
            {t('privacyNote')}
          </p>
        </div>
      </div>
    </SidePanel>
  );
}
