'use client';

import React from 'react';
import { Clock, MapPin, Calendar, ClipboardList, CheckCircle2, AlertCircle, X, Activity, Stethoscope, Syringe, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import SidePanel from '@/components/ui/SidePanel';
import { cn } from '@/lib/utils';

interface HealthRecord {
  id: string;
  type: 'Consulta' | 'Exame' | 'Vacina';
  title: string;
  location: string;
  date: string;
  status: 'Concluído' | 'Agendado' | 'Cancelado';
  doctor?: string;
}

const mockHistory: HealthRecord[] = [
  {
    id: '1',
    type: 'Consulta',
    title: 'Clínico Geral',
    location: 'UBS Vila Nova',
    date: '15/10/2026',
    status: 'Concluído',
    doctor: 'Dra. Ana Maria'
  },
  {
    id: '2',
    type: 'Exame',
    title: 'Hemograma Completo',
    location: 'Lab Municipal',
    date: '20/10/2026',
    status: 'Concluído'
  },
  {
    id: '3',
    type: 'Vacina',
    title: 'Gripe (Anual)',
    location: 'UBS Centro',
    date: '02/11/2026',
    status: 'Agendado'
  }
];

interface HealthHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthHistoryPanel({ isOpen, onClose }: HealthHistoryPanelProps) {
  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Meu Histórico de Saúde"
    >
      <div className="p-8 space-y-10 pb-32">
        {/* Profile Card Summary */}
        <div className="bg-text-main p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl group">
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur shadow-inner">
                        <ClipboardList className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Acesso Restrito</h4>
                        <p className="text-2xl font-black tracking-tighter leading-none uppercase">Prontuário <br/> Digital.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[9px] font-black opacity-50 uppercase tracking-widest block mb-1">Último Acesso</span>
                        <span className="text-xs font-bold">Hoje, 09:42</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[9px] font-black opacity-50 uppercase tracking-widest block mb-1">Status Global</span>
                        <span className="text-xs font-bold text-green-400">Estável</span>
                    </div>
                </div>
            </div>
            <Activity className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform pointer-events-none" />
        </div>

        {/* Timeline Header */}
        <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Eventos Recentes
            </h3>
            <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Filtrar</button>
        </div>

        {/* History List */}
        <div className="space-y-5 relative">
           <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-border/50" />
           
           {mockHistory.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="flex gap-6 group"
             >
               <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl bg-white border-2 border-border shadow-sm flex items-center justify-center group-hover:border-primary transition-all group-hover:scale-110 duration-500">
                  {item.type === 'Consulta' ? <Stethoscope className="w-7 h-7 text-primary" /> : 
                   item.type === 'Exame' ? <Activity className="w-7 h-7 text-primary" /> :
                   <Syringe className="w-7 h-7 text-primary" />}
               </div>
               
               <div className="flex-grow bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-xl transition-all group-hover:translate-x-2">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">{item.date}</span>
                     <div className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
                        item.status === 'Concluído' ? "bg-green-50 text-green-600" : "bg-primary/5 text-primary"
                     )}>
                        {item.status === 'Concluído' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
                     </div>
                  </div>

                  <h4 className="text-lg font-black text-text-main leading-none uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                  
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-primary" />
                        {item.location}
                     </div>
                     {item.doctor && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                           <FileText className="w-3 h-3 text-primary" />
                           {item.doctor}
                        </div>
                     )}
                  </div>
                  
                  <button className="mt-4 w-full py-3 bg-surface rounded-xl font-black text-[9px] uppercase tracking-widest text-text-muted hover:bg-primary/5 group-hover:text-primary transition-all">
                     Visualizar Laudo Completo
                  </button>
               </div>
             </motion.div>
           ))}
        </div>

        {/* Warning Policy Card */}
        <div className="bg-surface p-8 rounded-[3rem] border-2 border-border border-dashed space-y-6 relative overflow-hidden group">
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white rounded-xl shadow-inner text-tertiary">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-text-main uppercase leading-tight">Privacidade & <br/> Proteção de Dados</h4>
           </div>
           <p className="text-xs font-ui font-medium text-text-muted leading-relaxed relative z-10">
             Seu prontuário é protegido por criptografia de ponta a ponta integrada ao DigitalID. Apenas profissionais autorizados da rede municipal podem acessar estas informações durante seu atendimento.
           </p>
           <button className="relative z-10 text-[9px] font-black text-primary uppercase tracking-widest hover:underline">
             Gerenciar Consentimentos
           </button>
        </div>
      </div>
    </SidePanel>
  );
}
