'use client';

import React from 'react';
import { TrendingUp, Users, MessageSquare, Vote, CheckCircle2, Award, Zap, BarChart3, School, Stethoscope, Store } from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '@/components/ui/Modal';

interface GlobalStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalStatsModal({ isOpen, onClose }: GlobalStatsModalProps) {
  const stats = [
    { label: 'Cidadãos Ativos', value: '12.450', icon: Users, color: 'text-primary' },
    { label: 'Obras em Dia', value: '94%', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Escolas Municipais', value: '15', icon: School, color: 'text-blue-500' },
    { label: 'Consultas/Mês', value: '2.800', icon: Stethoscope, color: 'text-tertiary' },
    { label: 'Empresas Locais', value: '456', icon: Store, color: 'text-secondary' },
    { label: 'Participação PLs', value: '4.500', icon: Vote, color: 'text-primary' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Panorama da Cidade"
    >
      <div className="space-y-8 p-2">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary mb-2 shadow-sm">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-text-main tracking-tight leading-none">Dados da <span className="text-primary">Cidade.</span></h3>
          <p className="text-xs font-medium text-text-muted leading-relaxed max-w-[240px] mx-auto">Métricas consolidadas de participação cidadã e zeladoria urbana.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-container p-5 rounded-2xl border border-border text-center space-y-2"
            >
              <stat.icon className={`w-5 h-5 mx-auto ${stat.color} opacity-80`} />
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-text-main tracking-tight leading-none tabular-nums">{stat.value}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-3xl text-white relative overflow-hidden shadow-[0_12px_32px_rgba(26,86,196,0.28)]">
           <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
           <div className="relative z-10 flex gap-4 items-center">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                 <Zap className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-0.5">
                 <h4 className="text-base font-bold tracking-tight leading-none uppercase">Eficiência</h4>
                 <p className="text-[11px] font-medium text-white/70">Estamos a 5% de atingir a meta de 95% de zeladoria resolvida!</p>
              </div>
           </div>
           <Award className="deco-fade absolute -right-6 -bottom-6 w-24 h-24 text-white pointer-events-none" />
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white border border-border text-text-muted rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container hover:border-primary/30 hover:text-primary transition-all shadow-sm active:scale-[0.98]"
        >
          Fechar Painel
        </button>
      </div>
    </Modal>
  );
}
