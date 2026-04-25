'use client';

import React from 'react';
import { 
  AlertTriangle, 
  Info, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  WifiOff, 
  Droplets, 
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';

interface Aviso {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  category: 'Tempo' | 'Obras' | 'Rede' | 'Geral';
  title: string;
  description: string;
  date: string;
  location?: string;
  icon: any;
}

const avisos: Aviso[] = [
  {
    id: '1',
    type: 'urgent',
    category: 'Tempo',
    title: 'Previsão de Chuvas Fortes',
    description: 'A Defesa Civil emite alerta vermelho para precipitações acima de 80mm nas próximas 24 horas. Evite áreas de encosta e pontos de alagamento conhecidos no bairro Jardim Botânico.',
    date: '23 de Outubro, 2026',
    location: 'Todo o Município',
    icon: AlertTriangle
  },
  {
    id: '2',
    type: 'warning',
    category: 'Rede',
    title: 'Manutenção na Rede de Água',
    description: 'A companhia de saneamento informa que haverá interrupção no fornecimento de água para limpeza de reservatórios no Setor Norte.',
    date: '25 de Outubro, 2026',
    location: 'Setor Norte / Vila Nova',
    icon: Droplets
  },
  {
    id: '3',
    type: 'warning',
    category: 'Obras',
    title: 'Interdição na Av. Central',
    description: 'Trecho entre a Praça da Matriz e a Rua das Flores estará totalmente bloqueado para obras de recapeamento asfáltico durante todo o final de semana.',
    date: '26 a 28 de Outubro, 2026',
    location: 'Av. Central',
    icon: Zap
  },
  {
    id: '4',
    type: 'info',
    category: 'Geral',
    title: 'Campanha de Atualização Cadastral',
    description: 'Cidadãos que possuem benefícios sociais ativos devem comparecer ao CRAS mais próximo para validação de documentos.',
    date: 'Até Dezembro de 2026',
    location: 'CRAS da Cidade',
    icon: Info
  }
];

export default function AvisosPage() {
  const { toast } = useToast();
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-12">
      
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-accent-danger/10 text-accent-danger rounded-2xl border-2 border-accent-danger/20">
              <ShieldAlert className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase italic leading-none">Avisos & Alertas</h1>
              <p className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">Central de Comunicação de Emergência</p>
           </div>
        </div>
      </section>

      {/* Grid */}
      <div className="space-y-8">
        {avisos.map((aviso, idx) => (
          <motion.article 
            key={aviso.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-8 rounded-[3rem] border-2 shadow-sm relative overflow-hidden group transition-all hover:shadow-2xl",
              aviso.type === 'urgent' ? "bg-white border-accent-danger/30 shadow-accent-danger/5" :
              aviso.type === 'warning' ? "bg-white border-orange-200" :
              "bg-surface border-border opacity-80"
            )}
          >
            {aviso.type === 'urgent' && (
               <div className="absolute top-0 right-0 py-2 px-6 bg-accent-danger text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg">
                  Prioridade Máxima
               </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
               <div className={cn(
                 "w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 border-4 border-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6",
                 aviso.type === 'urgent' ? "bg-accent-danger text-white" :
                 aviso.type === 'warning' ? "bg-orange-500 text-white" :
                 "bg-surface text-text-muted border-border"
               )}>
                  <aviso.icon className="w-10 h-10" />
               </div>

               <div className="space-y-4 flex-grow">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{aviso.category}</span>
                     <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight uppercase group-hover:text-primary transition-colors leading-none">
                       {aviso.title}
                     </h2>
                  </div>
                  
                  <p className="font-ui font-medium text-text-muted leading-relaxed max-w-2xl">
                    {aviso.description}
                  </p>

                  <div className="flex flex-wrap gap-6 pt-2">
                     <div className="flex items-center gap-2 text-[10px] font-black font-ui uppercase tracking-widest text-text-muted/60">
                        <Calendar className="w-4 h-4" />
                        {aviso.date}
                     </div>
                     {aviso.location && (
                        <div className="flex items-center gap-2 text-[10px] font-black font-ui uppercase tracking-widest text-text-muted/60">
                           <MapPin className="w-4 h-4" />
                           {aviso.location}
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex items-center md:items-end justify-end">
                  <button 
                    onClick={() => toast(`Visualizando detalhes do alerta: ${aviso.title}`, 'info')}
                    className="p-4 bg-surface border-2 border-border rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all group/btn active:scale-95"
                   >
                     <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Stats/Summary Footer */}
      <div className="bg-text-main p-10 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
         <div className="space-y-4 relative z-10">
            <h4 className="text-2xl font-black tracking-tighter uppercase leading-none">Abono de Atividade Social</h4>
            <p className="text-sm font-ui opacity-70 max-w-sm">
               Em caso de interdição total comprovada, cidadãos podem solicitar justificativa de atraso para o trabalho através do protocolo.
            </p>
         </div>
         <button 
            onClick={() => toast('Iniciando processo de solicitação de justificativa via Protocolo...', 'success')}
            className="bg-white text-text-main px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl relative z-10 hover:translate-y-[-4px] transition-transform"
          >
            Solicitar Justificativa
         </button>
         <WifiOff className="absolute -left-10 -bottom-10 w-48 h-48 opacity-10 -rotate-12" />
      </div>

    </div>
  );
}
