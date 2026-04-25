'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Bell, 
  MapPin, 
  CalendarDays,
  Stethoscope,
  Activity,
  History,
  Download,
  CheckCircle2,
  ChevronRight,
  Megaphone,
  Syringe,
  Hospital,
  BriefcaseMedical,
  Siren,
  X,
  RefreshCcw,
  AlertTriangle,
  Pill,
  TrendingUp,
  Search as SearchIcon,
  Info,
  ArrowRight
} from 'lucide-react';
import ClinicCard from '@/components/ClinicCard';
import AppointmentModal from '@/components/AppointmentModal';
import HealthHistoryPanel from '@/components/HealthHistoryPanel';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const clinics = [
  {
    name: 'UPA Central',
    address: 'Av. Principal, 1200 - Centro',
    waitTime: '15 min',
    status: 'low' as const,
    icon: Activity
  },
  {
    name: 'Hospital Municipal',
    address: 'Rua da Paz, 45 - Jardim Botânico',
    waitTime: '120 min',
    status: 'high' as const,
    icon: Activity
  },
  {
    name: 'UPA Norte',
    address: 'Av. Brasil, 890 - Vila Nova',
    waitTime: '45 min',
    status: 'medium' as const,
    icon: Activity
  }
];

export default function SaudePage() {  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'unidades' | 'portal' | 'farmacia'>('unidades');
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const categories = [
    { id: 'unidades', label: 'Unidades', icon: Hospital },
    { id: 'portal', label: 'Meu Portal', icon: Activity },
    { id: 'farmacia', label: 'Farmácia', icon: Pill },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      
      {/* Control Sidebar */}
      <aside className="w-full md:w-[420px] lg:w-[480px] bg-white border-r-2 border-border flex flex-col z-40 relative shadow-2xl">
         
         <div className="p-6 md:p-8 space-y-6 border-b-2 border-border bg-white sticky top-0 z-20">
            <div className="space-y-1">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                  <Activity className="w-3 h-3" />
                  Saúde Conectada
               </div>
               <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">Digital <br/> <span className="text-rose-500">Saúde.</span></h1>
            </div>

            <div className="flex p-1.5 bg-surface rounded-2xl border-2 border-border shadow-inner">
               {categories.map((cat) => (
                  <button 
                     key={cat.id}
                     onClick={() => setActiveTab(cat.id as any)}
                     className={cn(
                        "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                        activeTab === cat.id ? "bg-white text-rose-500 shadow-lg border border-rose-500/10" : "text-text-muted hover:text-text-main"
                     )}
                  >
                     {cat.label}
                  </button>
               ))}
            </div>

            <button 
               onClick={() => setModalOpen(true)}
               className="w-full bg-rose-500 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
               <CalendarDays className="w-4 h-4" />
               Agendar Consulta
            </button>
         </div>

         <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar bg-surface/30">
            
            <AnimatePresence mode="wait">
               {activeTab === 'unidades' ? (
                  <motion.div 
                     key="unidades"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-6"
                  >
                     <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                           <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tempos de Espera (Live)</h3>
                           <div className="flex items-center gap-1.5 text-[8px] font-black text-green-500 animate-pulse">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              VERIFICADO
                           </div>
                        </div>
                        
                        {clinics.map((clinic, idx) => (
                           <div key={idx} 
                              onClick={() => setSelectedClinic(clinic)}
                              className="bg-white p-5 rounded-[2.5rem] border-2 border-border hover:border-rose-500 group cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-rose-500/5"
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110",
                                    clinic.status === 'low' ? "bg-green-50 border-green-100 text-green-600" : (clinic.status === 'medium' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-rose-50 border-rose-100 text-rose-600")
                                 )}>
                                    <Hospital className="w-7 h-7" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <h4 className="text-sm font-black text-text-main uppercase leading-tight group-hover:text-rose-500 transition-colors">{clinic.name}</h4>
                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                       <MapPin className="w-3 h-3 text-rose-500" />
                                       {clinic.address.split('-')[0]}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xl font-black text-text-main tabular-nums leading-none">{clinic.waitTime}</p>
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-60">Filas: {Math.floor(Math.random() * 10) + 1}p</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               ) : activeTab === 'portal' ? (
                  <motion.div 
                     key="portal"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-6"
                  >
                     <div className="bg-text-main p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                           <div className="space-y-1">
                              <h3 className="text-2xl font-black uppercase leading-none">Minha <br/> Saúde.</h3>
                              <p className="text-xs opacity-60 font-ui font-medium">Histórico completo de atendimentos e laudos técnicos disponíves para download.</p>
                           </div>
                           <button 
                              onClick={() => setHistoryOpen(true)}
                              className="w-full py-4 bg-white text-text-main rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl"
                           >
                              Acessar Prontuário
                           </button>
                        </div>
                        <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] rotate-12 group-hover:scale-110 transition-transform" />
                     </div>

                     <div className="bg-white p-8 rounded-[3rem] border-2 border-border border-dashed space-y-6 shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border-2 border-rose-500/20 shadow-inner">
                              <Syringe className="w-8 h-8" />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest">DigitalVax ID</h4>
                              <p className="text-xs font-bold text-text-muted uppercase italic">Carteira de Vacinação Digital</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 py-4 bg-surface rounded-3xl border-2 border-border shadow-inner relative group">
                           <Image 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DIGITAL-VAX-ID-2026-USER" 
                              alt="Vax QR" 
                              width={160} 
                              height={160} 
                              className="grayscale opacity-80 contrast-125 mix-blend-multiply transition-all group-hover:scale-105"
                              referrerPolicy="no-referrer"
                           />
                           <div className="text-center space-y-1">
                              <span className="text-[8px] font-black text-rose-500 uppercase flex items-center justify-center gap-1.5 font-mono">
                                 <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                 ASSINATURA DIGITAL ATIVA
                              </span>
                           </div>
                        </div>
                        <button 
                           onClick={() => toast('Configurando exportação do certificado internacional...', 'info')}
                           className="w-full py-4 bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl font-black text-[9px] uppercase tracking-widest text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Download className="w-4 h-4" />
                           Exportar para Viagem
                        </button>
                     </div>
                  </motion.div>
               ) : (
                  <motion.div 
                     key="farmacia"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-6"
                  >
                     <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                           <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Estoque Popular</h3>
                           <Pill className="w-4 h-4 text-rose-500" />
                        </div>
                        
                        {[
                          { name: 'Amoxicilina 500mg', stock: 'Disponível', units: '12 unidades' },
                          { name: 'Ibuprofeno 600mg', stock: 'Em falta', units: '0 unidades' },
                          { name: 'Losartana 50mg', stock: 'Disponível', units: '540 unidades' }
                        ].map((med, idx) => (
                           <div key={idx} className="bg-white p-5 rounded-3xl border-2 border-border flex items-center justify-between group cursor-pointer hover:border-rose-500 transition-all">
                              <div className="space-y-0.5">
                                 <h4 className="text-sm font-black text-text-main uppercase">{med.name}</h4>
                                 <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{med.units}</p>
                              </div>
                              <span className={cn(
                                 "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                 med.stock === 'Disponível' ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-600"
                              )}>
                                 {med.stock}
                              </span>
                           </div>
                        ))}
                     </div>

                     <div className="bg-rose-500 p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col gap-4">
                           <h3 className="text-xl font-black uppercase leading-none">Receita <br/> Digital.</h3>
                           <p className="text-xs opacity-80 font-ui font-medium">Sincronize suas receitas assinadas digitalmente para retirada rápida em qualquer UBS.</p>
                           <button 
                              onClick={() => toast('Abrindo scanner de receitas digitais...', 'info')}
                              className="w-full py-4 bg-white text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                           >
                              <SearchIcon className="w-4 h-4" />
                              Validar Receita
                           </button>
                        </div>
                        <Pill className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </aside>

      {/* Main Content: Map View */}
      <section className="flex-grow relative bg-slate-200">
         <div className="absolute inset-0 z-0">
            <Image 
               src="https://picsum.photos/seed/healthmap/1920/1080" 
               alt="Mapa da Saúde" 
               fill 
               className="object-cover grayscale contrast-125 brightness-110"
               referrerPolicy="no-referrer"
            />
            
            {/* Mock Map Markers */}
            <div className="absolute top-1/2 left-1/3 group cursor-pointer">
               <div className="bg-rose-500 text-white p-4 rounded-full shadow-2xl border-4 border-white animate-bounce-slow">
                  <BriefcaseMedical className="w-6 h-6" />
               </div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white p-3 rounded-2xl shadow-2xl border-2 border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <p className="text-xs font-black text-text-main uppercase">UPA Central</p>
                  <p className="text-[8px] font-black text-green-500 uppercase">Espera: 15 min</p>
               </div>
            </div>

            <div className="absolute top-1/4 left-2/3 group cursor-pointer">
               <div className="bg-text-main text-white p-4 rounded-full shadow-2xl border-4 border-white animate-pulse">
                  <Hospital className="w-6 h-6" />
               </div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white p-3 rounded-2xl shadow-2xl border-2 border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <p className="text-xs font-black text-text-main uppercase">Hospital Municipal</p>
                  <p className="text-[8px] font-black text-rose-500 uppercase">Espera: 120 min</p>
               </div>
            </div>
         </div>

         {/* Map Legend/Controls */}
         <div className="absolute top-8 right-8 z-10 space-y-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border-2 border-border shadow-2xl space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-[9px] font-black uppercase text-text-main tracking-widest">Espera Menor</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-[9px] font-black uppercase text-text-main tracking-widest">Espera Média</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full" />
                  <span className="text-[9px] font-black uppercase text-text-main tracking-widest">Espera Alta</span>
               </div>
            </div>
         </div>

         <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
            <div className="bg-white rounded-2xl border-2 border-border shadow-2xl flex flex-col overflow-hidden text-rose-500">
               <button className="p-4 hover:bg-rose-50 border-b-2 border-border transition-colors"><Plus className="w-6 h-6" /></button>
               <button className="p-4 hover:bg-rose-50 transition-colors"><ChevronRight className="w-6 h-6 rotate-90" /></button>
            </div>
            <button className="p-4 bg-rose-500 text-white rounded-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
               <Siren className="w-6 h-6" />
            </button>
         </div>

         {/* Unit Overlay Detail Card */}
         <AnimatePresence>
            {selectedClinic && (
               <motion.div 
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.9 }}
                  className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[420px] z-20"
               >
                  <div className="bg-white p-8 rounded-[3rem] border-2 border-rose-500 shadow-2xl space-y-6 relative overflow-hidden group">
                     <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                           <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Unidade Oficial</span>
                           <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter leading-none">{selectedClinic.name}</h4>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {selectedClinic.address}
                           </div>
                        </div>
                        <div className={cn(
                           "px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg",
                           selectedClinic.status === 'low' ? "bg-green-500 text-white" : (selectedClinic.status === 'medium' ? "bg-amber-500 text-white" : "bg-rose-500 text-white")
                        )}>
                           {selectedClinic.waitTime}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="bg-surface p-3 rounded-2xl border border-border">
                           <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Clínico Geral</p>
                           <p className="text-xs font-black text-text-main">3 pessoas na fila</p>
                        </div>
                        <div className="bg-surface p-3 rounded-2xl border border-border">
                           <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Pediatria</p>
                           <p className="text-xs font-black text-text-main">Vazio agora</p>
                        </div>
                     </div>

                     <div className="flex gap-4 relative z-10">
                        <button 
                           onClick={() => setSelectedClinic(null)}
                           className="px-6 py-4 bg-surface border-2 border-border rounded-2xl text-[9px] font-black uppercase tracking-widest text-text-muted hover:border-rose-500/30 transition-all font-ui font-bold"
                        >
                           Fechar
                        </button>
                        <button 
                           className="flex-grow bg-rose-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                           Como Chegar
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>

                     <Hospital className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

      </section>

      {/* Overlay Modals */}
      <AppointmentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />

      <HealthHistoryPanel 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}

