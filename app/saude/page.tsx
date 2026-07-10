'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import ClinicCard from '@/components/ClinicCard';
import HealthHistoryPanel from '@/components/HealthHistoryPanel';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';
import { useContent } from '@/lib/hooks/use-content';
import { useHealthUnits } from '@/features/saude/hooks/useHealthUnits';
import { motion, AnimatePresence } from 'motion/react';
import DevBanner from '@/components/ui/DevBanner';
import { cn } from '@/lib/utils';
import type { HealthUnit, PharmacyItem } from '@/types';

const AppointmentModal = dynamic(() => import('@/components/AppointmentModal'), {
  loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-sky-500" /></div>,
  ssr: false,
});

const HealthMap = dynamic(() => import('@/components/HealthMap'), {
  loading: () => <div className="h-64 rounded-2xl bg-surface animate-pulse" />,
  ssr: false,
});

type HealthTab = 'unidades' | 'portal' | 'farmacia';

type PharmacyDisplayItem = Pick<
  PharmacyItem,
  'id' | 'title' | 'description' | 'unit' | 'quantity' | 'stockStatus' | 'location' | 'requiresPrescription'
>;

const fallbackMedicines: PharmacyDisplayItem[] = [
  {
    id: 'fallback-amoxicilina',
    title: 'Amoxicilina 500mg',
    description: 'Antibiotico de uso controlado.',
    unit: 'unidades',
    quantity: 12,
    stockStatus: 'available',
    location: 'Farmácia Municipal',
    requiresPrescription: true,
  },
  {
    id: 'fallback-ibuprofeno',
    title: 'Ibuprofeno 600mg',
    description: 'Anti-inflamatorio.',
    unit: 'unidades',
    quantity: 0,
    stockStatus: 'unavailable',
    location: 'Farmácia Municipal',
    requiresPrescription: false,
  },
  {
    id: 'fallback-losartana',
    title: 'Losartana 50mg',
    description: 'Medicamento para controle de pressao.',
    unit: 'unidades',
    quantity: 540,
    stockStatus: 'available',
    location: 'Farmácia Municipal',
    requiresPrescription: true,
  },
];

const stockLabel: Record<PharmacyItem['stockStatus'], string> = {
  available: 'Disponivel',
  low_stock: 'Baixo estoque',
  unavailable: 'Em falta',
};

export default function SaudePage() {
  const { toast } = useToast();
  const { units, status, error } = useHealthUnits();
  const {
    data: pharmacyItems,
    loading: pharmacyLoading,
    error: pharmacyError,
    refresh: refreshPharmacy,
  } = useContent<PharmacyItem>('pharmacy_items');
  const [selectedClinic, setSelectedClinic] = useState<HealthUnit | null>(null);
  const [activeTab, setActiveTab] = useState<HealthTab>('unidades');
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const usingFallbackMedicines = pharmacyItems.length === 0 && !pharmacyLoading && !pharmacyError;
  const visiblePharmacyItems: PharmacyDisplayItem[] = usingFallbackMedicines ? fallbackMedicines : pharmacyItems;

  const exportVaccineCertificate = () => {
    const content = [
      'Conecta Santa Maria - Carteira de vacinacao digital',
      `Emitido em: ${new Date().toLocaleString('pt-BR')}`,
      'Status: Assinatura digital ativa',
      'Identificador: DIGITAL-VAX-ID-2026-USER',
      '',
      'Documento demonstrativo gerado pelo portal municipal.',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'carteira-vacinacao-digital.txt';
    anchor.click();
    URL.revokeObjectURL(url);
    toast('Carteira digital exportada.', 'success');
  };

  const categories: { id: HealthTab; label: string; icon: typeof Hospital }[] = [
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
               <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/10 text-sky-500 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] border border-sky-500/20">
                  <Activity className="w-3.5 h-3.5" />
                  Atenção à saúde
               </div>
               <h1 className="text-4xl font-semibold text-text-main tracking-tight leading-[1.02]" style={{ fontFamily: 'var(--font-display)' }}>Saúde <span className="text-sky-500">conectada</span></h1>
            </div>

            <div className="flex p-1.5 bg-surface rounded-2xl border-2 border-border shadow-inner">
               {categories.map((cat) => (
                   <button 
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      aria-pressed={activeTab === cat.id}
                      aria-label={`Alternar para aba ${cat.label}`}
                      className={cn(
                         "flex-1 py-3 rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all",
                         activeTab === cat.id ? "bg-white text-sky-500 shadow-lg border border-sky-500/10" : "text-text-muted hover:text-text-main"
                      )}
                   >
                      {cat.label}
                   </button>
                ))}
            </div>

            <button 
               onClick={() => {
                  setSelectedClinic(null);
                  setModalOpen(true);
               }}
               className="w-full bg-sky-500 text-white p-4 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
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
                           <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Tempos de Espera (Live)</h3>
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-500">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              VERIFICADO
                           </div>
                        </div>

                        {status === 'loading' ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                          </div>
                        ) : status === 'error' ? (
                          <div className="text-center py-8 space-y-3">
                            <AlertTriangle className="w-8 h-8 text-sky-500 mx-auto" />
                            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">{error}</p>
                          </div>
                        ) : units.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Nenhuma unidade disponível</p>
                          </div>
                        ) : (
                          units.map((unit) => (
                           <div key={unit.id} 
                              onClick={() => setSelectedClinic(unit)}
                              className="bg-white p-5 rounded-[2.5rem] border-2 border-border hover:border-sky-500 group cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-sky-500/5"
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110",
                                    unit.waitLevel === 'low' ? "bg-green-50 border-green-100 text-green-600" : (unit.waitLevel === 'medium' ? "bg-amber-50 border-amber-100 text-amber-600" : (unit.waitLevel === 'critical' ? "bg-red-50 border-red-100 text-red-600" : "bg-sky-50 border-sky-100 text-sky-600"))
                                 )}>
                                    <Hospital className="w-7 h-7" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <h4 className="text-sm font-semibold text-text-main uppercase leading-tight group-hover:text-sky-500 transition-colors">{unit.name}</h4>
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                       <MapPin className="w-3 h-3 text-sky-500" />
                                       {unit.address.split('-')[0]}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xl font-semibold text-text-main tabular-nums leading-none">{unit.waitTime}</p>
                                 <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest opacity-60">
                                    {unit.isOpen ? unit.type.toUpperCase() : 'FECHADA'}
                                 </p>
                              </div>
                           </div>
                          ))
                        )}
                     </div>
                  </motion.div>
               ) : activeTab === 'portal' ? (
                  <motion.div 
                     key="portal"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-6"
                  >
                     <div className="ring-highlight-dark bg-gradient-to-br from-primary to-primary-dark p-8 rounded-[2rem] text-white space-y-6 relative overflow-hidden group shadow-[0_20px_50px_rgba(26,86,196,0.28)]">
                        <div aria-hidden className="hero-grid-overlay" />
                        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                           <div className="space-y-1">
                              <h3 className="text-3xl font-semibold leading-[1.02] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Minha saúde</h3>
                              <p className="text-sm opacity-70 font-medium leading-relaxed">Histórico completo de atendimentos e laudos técnicos disponíveis para download.</p>
                           </div>
                           <button 
                              onClick={() => setHistoryOpen(true)}
                              className="w-full py-4 bg-white text-text-main rounded-2xl font-semibold text-[11px] uppercase tracking-widest hover:bg-sky-50 transition-all shadow-xl"
                           >
                              Acessar Prontuário
                           </button>
                        </div>
                        <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] rotate-12 group-hover:scale-110 transition-transform" />
                     </div>

<div className="bg-white p-8 rounded-[2rem] border-2 border-border space-y-6 shadow-sm">
                      <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center border-2 border-sky-500/20 shadow-inner">
                              <Syringe className="w-8 h-8" />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-sm font-semibold text-text-main tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Carteira de vacinação</h4>
                              <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.12em]">Versão digital</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 py-4 bg-surface rounded-3xl border-2 border-border shadow-inner relative group">
                           <div
                              aria-label="QR code demonstrativo"
                              className="grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl bg-white p-4 shadow-inner"
                           >
                              {Array.from({ length: 25 }).map((_, index) => (
                                 <span
                                    key={index}
                                    className={cn(
                                       'rounded-[2px]',
                                       [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24, 7, 12, 17].includes(index)
                                          ? 'bg-sky-900'
                                          : 'bg-sky-100',
                                    )}
                                 />
                              ))}
                           </div>
                           <div className="text-center space-y-1">
                              <span className="text-[11px] font-semibold text-sky-500 uppercase flex items-center justify-center gap-1.5 font-mono">
                                 <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                                 ASSINATURA DIGITAL ATIVA
                              </span>
                           </div>
                        </div>
                        <button 
                           onClick={exportVaccineCertificate}
                           className="w-full py-4 bg-sky-500/5 border-2 border-sky-500/20 rounded-2xl font-semibold text-[11px] uppercase tracking-widest text-sky-600 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-2"
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
                           <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Estoque Popular</h3>
                           <Pill className="w-4 h-4 text-sky-500" />
                        </div>
                        
                        {pharmacyLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                          </div>
                        ) : pharmacyError ? (
                          <div className="rounded-3xl border-2 border-border bg-white p-5 text-center">
                            <AlertTriangle className="mx-auto h-8 w-8 text-sky-500" />
                            <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                              Não foi possível carregar o estoque.
                            </p>
                            <button
                              type="button"
                              onClick={refreshPharmacy}
                              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-[11px] font-black uppercase tracking-widest text-sky-600"
                            >
                              <RefreshCcw className="h-3.5 w-3.5" />
                              Tentar novamente
                            </button>
                          </div>
                        ) : (
                          <>
                          {usingFallbackMedicines && (
                            <DevBanner
                              title="Estoque demonstrativo"
                              description="Medicamentos, quantidades e disponibilidade abaixo sao exemplos ate a publicacao do estoque real pela Secretaria de Saude."
                            />
                          )}
                          {visiblePharmacyItems.map((med) => (
                           <div key={med.id} className="bg-white p-5 rounded-3xl border-2 border-border flex items-center justify-between gap-4 group cursor-pointer hover:border-sky-500 transition-all">
                              <div className="min-w-0 space-y-0.5">
                                 <h4 className="text-sm font-semibold text-text-main uppercase">{med.title}</h4>
                                 <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                                    {med.quantity} {med.unit} - {med.location}
                                 </p>
                                 {med.requiresPrescription && (
                                   <p className="text-[11px] font-bold uppercase tracking-widest text-sky-500">Exige receita</p>
                                 )}
                              </div>
                              <span className={cn(
                                 "shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest",
                                 med.stockStatus === 'available' ? "bg-green-100 text-green-600" : (med.stockStatus === 'low_stock' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600")
                              )}>
                                 {stockLabel[med.stockStatus]}
                              </span>
                           </div>
                          ))}
                          </>
                        )}
                     </div>

                     <div className="bg-sky-500 p-8 rounded-[2rem] text-white space-y-6 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col gap-4">
                           <h3 className="text-2xl font-semibold leading-[1.02] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Receita digital</h3>
                           <p className="text-sm opacity-85 font-medium leading-relaxed">Sincronize suas receitas assinadas digitalmente para retirada rápida em qualquer UBS.</p>
                           <button 
                              onClick={() => toast('Abrindo scanner de receitas digitais...', 'info')}
                              className="w-full py-4 bg-white text-sky-500 rounded-2xl font-semibold text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
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
         <HealthMap
            units={units}
            selectedUnitId={selectedClinic?.id ?? null}
            onSelectUnit={(unit) => setSelectedClinic(unit)}
         />

         {/* Map Legend/Controls */}
         <div className="absolute top-8 right-8 z-10 space-y-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border-2 border-border shadow-2xl space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-[11px] font-semibold uppercase text-text-main tracking-widest">Espera Menor</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-[11px] font-semibold uppercase text-text-main tracking-widest">Espera Média</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-sky-500 rounded-full" />
                  <span className="text-[11px] font-semibold uppercase text-text-main tracking-widest">Espera Alta</span>
               </div>
            </div>
         </div>

         <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
            <div className="bg-white rounded-2xl border-2 border-border shadow-2xl flex flex-col overflow-hidden text-sky-500">
               <button aria-label="Ampliar mapa" className="p-4 hover:bg-sky-50 border-b-2 border-border transition-colors"><Plus className="w-6 h-6" /></button>
               <button aria-label="Reduzir mapa" className="p-4 hover:bg-sky-50 transition-colors"><ChevronRight className="w-6 h-6 rotate-90" /></button>
            </div>
            <button aria-label="Acionar emergência" className="p-4 bg-sky-500 text-white rounded-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
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
                   <div className="bg-white p-8 rounded-[2rem] border-2 border-sky-500 shadow-2xl space-y-6 relative overflow-hidden group">
                      <div className="flex justify-between items-start relative z-10">
                         <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-sky-500 uppercase tracking-widest">{selectedClinic.type.toUpperCase()}</span>
                            <h4 className="text-2xl font-semibold text-text-main tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>{selectedClinic.name}</h4>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
                               <MapPin className="w-3 h-3 text-sky-500" />
                               {selectedClinic.address}
                            </div>
                         </div>
                         <div className={cn(
                            "px-4 py-2 rounded-2xl text-[11px] font-semibold shadow-lg",
                            selectedClinic.waitLevel === 'low' ? "bg-green-500 text-white" : (selectedClinic.waitLevel === 'medium' ? "bg-amber-500 text-white" : (selectedClinic.waitLevel === 'critical' ? "bg-red-500 text-white" : "bg-sky-500 text-white"))
                         )}>
                            {selectedClinic.waitTime}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 relative z-10">
                         {selectedClinic.specialties.slice(0, 2).map((spec) => (
                           <div key={spec} className="bg-surface p-3 rounded-2xl border border-border">
                              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-1">{spec}</p>
                              <p className="text-xs font-semibold text-text-main">Disponível</p>
                           </div>
                         ))}
                      </div>

                      <div className="flex gap-4 relative z-10">
                         <button 
                            onClick={() => setSelectedClinic(null)}
                            className="px-6 py-4 bg-surface border-2 border-border rounded-2xl text-[11px] font-semibold uppercase tracking-widest text-text-muted hover:border-sky-500/30 transition-all font-ui font-bold"
                         >
                            Fechar
                         </button>
                         <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            disabled={!selectedClinic.isOpen}
                            className="flex-grow bg-sky-500 text-white px-8 py-4 rounded-2xl font-semibold text-[11px] uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
                         >
                            {selectedClinic.isOpen ? 'Agendar aqui' : 'Unidade fechada'}
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
        units={units.filter((unit) => unit.isOpen)}
        initialUnit={selectedClinic}
      />

      <HealthHistoryPanel 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}

