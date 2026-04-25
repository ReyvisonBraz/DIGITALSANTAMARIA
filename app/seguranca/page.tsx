'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  Wifi, 
  Smartphone,
  Bell,
  Navigation,
  Info,
  ChevronRight,
  Zap,
  PhoneCall,
  Lock,
  Camera,
  Siren,
  Radar,
  Radio,
  Search,
  Activity,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

export default function SegurancaPage() {
  const { toast } = useToast();
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleSOS();
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing]);

  const handleSOS = () => {
    toast('CHAMADA DE EMERGÊNCIA ATIVADA! Guardas Municipais em deslocamento.', 'error');
    setIsPressing(false);
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
  };

  const zones = [
     { id: 'Z-01', name: 'Centro Histórico', status: 'Seguro', patrolling: 'Alta', color: 'bg-green-500' },
     { id: 'Z-02', name: 'Distrito Industrial', status: 'Alerta', patrolling: 'Média', color: 'bg-amber-500' },
     { id: 'Z-03', name: 'Jardins & Parques', status: 'Seguro', patrolling: 'Alta', color: 'bg-green-500' },
     { id: 'Z-04', name: 'Área Portuária', status: 'Reforçado', patrolling: 'Máxima', color: 'bg-rose-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      
      {/* Side Intelligence Panel */}
      <aside className="w-full md:w-[450px] lg:w-[520px] bg-white border-r-2 border-border flex flex-col z-40 relative shadow-2xl">
         
         <div className="p-8 space-y-8 border-b-2 border-border bg-white sticky top-0 z-20">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                  <Radar className="w-3.5 h-3.5" />
                  Rede de Proteção Integrada
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-text-main tracking-tighter uppercase leading-[0.85]">Muralha <br/> <span className="text-rose-500">Digital.</span></h1>
            </div>

            {/* SOS Trigger Area */}
            <div className="p-8 bg-rose-50 rounded-[3rem] border-2 border-rose-200 shadow-inner flex flex-col items-center gap-8 relative overflow-hidden group">
               <div className="text-center space-y-1 relative z-10">
                  <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest leading-none">Canal de Emergência</h3>
                  <p className="text-[9px] font-bold text-rose-400 uppercase">Pressione por 3s para acionamento</p>
               </div>

               <div className="relative z-10">
                  <AnimatePresence>
                     {isPressing && (
                        <motion.div 
                           initial={{ scale: 1, opacity: 0 }}
                           animate={{ scale: 1.5, opacity: 0.2 }}
                           exit={{ scale: 2, opacity: 0 }}
                           className="absolute inset-0 bg-rose-500 rounded-full"
                        />
                     )}
                  </AnimatePresence>
                  
                  <button 
                     onMouseDown={() => setIsPressing(true)}
                     onMouseUp={() => setIsPressing(false)}
                     onMouseLeave={() => setIsPressing(false)}
                     onTouchStart={() => setIsPressing(true)}
                     onTouchEnd={() => setIsPressing(false)}
                     className={cn(
                        "relative w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl overflow-hidden",
                        isPressing ? "bg-rose-700 scale-95" : "bg-rose-600 hover:bg-rose-500"
                     )}
                  >
                     <ShieldAlert className={cn("w-12 h-12 text-white", isPressing && "animate-pulse")} />
                     <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">SOS GCM</span>
                     
                     <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                           cx="50%"
                           cy="50%"
                           r="46%"
                           fill="none"
                           stroke="white"
                           strokeWidth="8"
                           strokeDasharray="100 100"
                           strokeDashoffset={100 - progress}
                           strokeLinecap="round"
                           className="opacity-30"
                        />
                     </svg>
                  </button>
               </div>

               <div className="flex items-center gap-3 relative z-10">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-rose-50 flex items-center justify-center text-white"><PhoneCall size={10} /></div>
                     <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-rose-50 flex items-center justify-center text-white"><MapPin size={10} /></div>
                  </div>
                  <span className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest leading-none">Dados Enviados Automaticamente</span>
               </div>
               
               <Radar className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.03] animate-spin-slow text-rose-600" />
            </div>
         </div>

         <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar bg-surface/30">
            
            {/* Patrol Zones Grid */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                     <Radio className="w-4 h-4 text-rose-500" />
                     Zonas de Cobertura
                  </h3>
                  <span className="text-[8px] font-black text-green-500 uppercase flex items-center gap-1.5 leading-none">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     Vigilância Ativa
                  </span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {zones.map((zone) => (
                     <button
                        key={zone.id}
                        onClick={() => setActiveZone(zone.name)}
                        className={cn(
                           "p-5 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden",
                           activeZone === zone.name ? "bg-white border-rose-500 shadow-xl" : "bg-white border-border hover:border-rose-200"
                        )}
                     >
                        <div className="flex justify-between items-start">
                           <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main group-hover:text-rose-500 transition-colors">
                              <span className="text-[10px] font-black italic">{zone.id}</span>
                           </div>
                           <div className={cn("w-2 h-2 rounded-full", zone.color)} />
                        </div>
                        <div>
                           <h4 className="text-xs font-black uppercase leading-none mb-1">{zone.name}</h4>
                           <div className="flex items-center gap-1 text-[8px] font-bold text-text-muted uppercase tracking-tighter">
                              Patrulha: {zone.patrolling}
                           </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                           <ShieldCheck size={48} />
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Smart Alerts Feed */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2 px-2">
                  <Bell className="w-4 h-4 text-rose-500" />
                  Alertas de Vizinhança
               </h3>
               <div className="space-y-3">
                  {[
                    { type: 'Info', msg: 'Manutenção de iluminação pública na Rua X hoje às 20h.', time: 'há 15m', icon: Info, color: 'text-blue-500' },
                    { type: 'Aviso', msg: 'Aumento de patrulhamento preventivo devido ao evento local.', time: 'há 1h', icon: ShieldCheck, color: 'text-primary' },
                    { type: 'Alerta', msg: 'Via bloqueada para obras civis urgentes no setor norte.', time: 'há 2h', icon: Siren, color: 'text-rose-500' }
                  ].map((alert, i) => (
                     <div key={i} className="bg-white p-5 rounded-3xl border-2 border-border border-b-4 border-b-surface flex gap-4 items-start group hover:border-rose-100 transition-all">
                        <div className={cn("w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", alert.color)}>
                           <alert.icon size={20} />
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between items-center">
                              <span className={cn("text-[9px] font-black uppercase tracking-widest", alert.color)}>{alert.type}</span>
                              <span className="text-[8px] font-bold text-text-muted italic">{alert.time}</span>
                           </div>
                           <p className="text-xs font-ui font-medium text-text-muted leading-tight">{alert.msg}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Safety Metrics Widget */}
            <div className="bg-text-main p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-black uppercase leading-none">Indice de <br/> Confiança.</h3>
                     <p className="text-xs opacity-60 font-ui font-medium">O seu bairro atingiu 92% de cobertura monitorada por câmeras DigitalID.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[9px] font-black opacity-40 uppercase tracking-widest block mb-1">Câmeras Ativas</span>
                        <span className="text-xl font-black">142</span>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[9px] font-black opacity-40 uppercase tracking-widest block mb-1">Tempo Médio</span>
                        <span className="text-xl font-black">4.2m</span>
                     </div>
                  </div>
               </div>
               <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform" />
            </div>
         </div>
      </aside>

      {/* Main Command Map View */}
      <section className="flex-grow relative bg-slate-900">
         <div className="absolute inset-0 z-0">
            <Image 
               src="https://picsum.photos/seed/securitygrid/1920/1080" 
               alt="Grid de Vigilância" 
               fill 
               className="object-cover grayscale contrast-150 brightness-50 opacity-60"
               referrerPolicy="no-referrer"
            />
            {/* Visual Overlays for "Tech/Map" Look */}
            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
            
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Simulated Live Trackers */}
            <motion.div 
               animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/3 left-1/4"
            >
               <div className="relative">
                  <div className="absolute -inset-4 bg-rose-500/20 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)] border border-white/50" />
                  <div className="absolute top-full left-full mt-2 ml-2 whitespace-nowrap bg-black/80 backdrop-blur border border-white/10 p-2 rounded-xl scale-75 origin-top-left">
                     <p className="text-[8px] font-black text-rose-500 uppercase font-mono tracking-widest">PATRULHA_GCM_04</p>
                     <p className="text-[7px] font-bold text-white/50 uppercase leading-none">MOBILIDADE: ATIVA</p>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               animate={{ x: [0, -80, -20, 0], y: [0, -120, -40, 0] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute top-2/3 left-2/3"
            >
               <div className="relative">
                  <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-white/50" />
                  <div className="absolute top-full left-full mt-2 ml-2 whitespace-nowrap bg-black/80 backdrop-blur border border-white/10 p-2 rounded-xl scale-75 origin-top-left">
                     <p className="text-[8px] font-black text-blue-500 uppercase font-mono tracking-widest">UNIDADE_APOIO_02</p>
                     <p className="text-[7px] font-bold text-white/50 uppercase leading-none">MOBILIDADE: ESTACIONÁRIA</p>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Map Interface Components */}
         <div className="absolute top-10 right-10 z-10 flex flex-col gap-4 items-end">
            <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-3xl space-y-6 max-w-xs">
               <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Camera className="w-4 h-4 text-rose-500" />
                     Live Stream
                  </h3>
                  <Maximize2 size={12} className="text-white/40 cursor-pointer hover:text-white" />
               </div>
               
               <div className="h-40 bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-inner group">
                  <Image 
                     src="https://picsum.photos/seed/surveillance/400/300" 
                     alt="Monitoring" 
                     fill 
                     className="object-cover opacity-60 grayscale brightness-75 group-hover:scale-110 transition-transform duration-[20s]"
                     referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-rose-500/5 mix-blend-overlay" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                     <span className="text-[7px] font-mono font-black text-white uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">LIVE // AREA_OESTE_3</span>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  {[1, 2, 3, 4].map(n => (
                     <button key={n} className="flex-1 h-1 bg-white/20 rounded-full transition-all hover:bg-rose-500" />
                  ))}
               </div>
               <button className="w-full py-4 bg-white text-text-main rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                  Alternar Ângulo
               </button>
            </div>

            <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
               <button className="p-3 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all"><Search size={20} /></button>
               <button className="p-3 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all"><Maximize2 size={20} /></button>
               <div className="w-full h-[1px] bg-white/10" />
               <button className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xl animate-pulse"><PhoneCall size={24} /></button>
            </div>
         </div>

         {/* Active Incident Warning (Floating) */}
         <AnimatePresence>
            {activeZone === 'Área Portuária' && (
               <motion.div 
                  initial={{ opacity: 0, y: 100, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 100, x: '-50%' }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-md"
               >
                  <div className="bg-rose-600 p-8 rounded-[3.5rem] border-4 border-white/20 shadow-4xl text-white space-y-6 relative overflow-hidden group">
                     <div className="relative z-10 flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur shadow-inner animate-float">
                           <Siren className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Operação em Andamento</span>
                           <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">Área Reforçada</h4>
                           <p className="text-[10px] font-bold opacity-80 uppercase leading-none mt-2">Setor Portuário // Bloqueio Preventivo</p>
                        </div>
                     </div>
                     <p className="text-xs font-ui font-medium opacity-80 relative z-10 leading-relaxed">
                        A GCM está realizando uma operação de fiscalização integrada. Evite o perímetro para facilitar o fluxo de viaturas de suporte.
                     </p>
                     <div className="flex gap-4 relative z-10">
                        <button 
                           onClick={() => setActiveZone(null)}
                           className="px-6 py-4 bg-white/20 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/30 transition-all font-ui font-bold"
                        >
                           Ignorar Alerta
                        </button>
                        <button className="flex-grow bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                           Ver Perímetro
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                     <Radar className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.05] animate-spin-slow" />
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Bottom Map Controls Overlay */}
         <div className="absolute bottom-10 left-10 z-10 bg-black/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-8">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
               <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
                  <ShieldAlert className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Situação Global</p>
                  <p className="text-xl font-black text-white tracking-tighter uppercase leading-none">Controle Total</p>
               </div>
            </div>
            <div className="flex gap-4">
               {[
                 { label: 'Câmeras', icon: Camera, active: true },
                 { label: 'Viaturas', icon: Navigation, active: true },
                 { label: 'Áreas', icon: MapPin, active: false },
               ].map((mod, i) => (
                  <button 
                     key={i}
                     className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        mod.active ? "bg-white text-text-main shadow-lg" : "text-white/40 border border-white/5 hover:bg-white/5"
                     )}
                  >
                     <mod.icon size={14} />
                     {mod.label}
                  </button>
               ))}
            </div>
         </div>

      </section>

    </div>
  );
}
