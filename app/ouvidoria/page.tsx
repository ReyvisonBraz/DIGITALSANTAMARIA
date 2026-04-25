'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Send, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail,
  ChevronRight,
  Stamp,
  Users,
  CheckCircle2,
  Search,
  Clock,
  Building2,
  ArrowLeft,
  CalendarDays,
  Target,
  Zap,
  Activity,
  Award,
  Radio,
  MapPin,
  Fingerprint,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';

// Status Timeline Component for Protocol Tracking
const ProtocolTimeline = ({ status, onRate }: { status: string, onRate?: (rating: number) => void }) => {
  const steps = [
    { id: 'RECEBIDO', label: 'Protocolado', icon: FileText, date: '24/10/2026' },
    { id: 'ANALISE', label: 'Triagem Técnica', icon: Clock, date: '25/10/2026' },
    { id: 'RESOLVIDO', label: 'Resolvido', icon: CheckCircle2, date: '26/10/2026' }
  ];

  const currentIdx = steps.findIndex(s => s.id === status);
  const isResolved = status === 'RESOLVIDO';

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-row md:flex-col items-center gap-4 md:gap-5 relative z-10 w-full md:w-auto group">
                <div className={cn(
                  "w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.8rem] flex items-center justify-center border-2 md:border-4 border-white shadow-xl transition-all duration-500 shrink-0",
                  isDone ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-surface text-text-muted opacity-30 shadow-inner"
                )}>
                  <step.icon className={cn("w-6 h-6 md:w-8 md:h-8", isDone && "animate-pulse")} />
                </div>
                <div className="text-left md:text-center space-y-1">
                  <p className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none", isDone ? "text-text-main" : "text-text-muted")}>
                    {step.label}
                  </p>
                  <p className="text-[7px] md:text-[9px] font-bold text-text-muted opacity-60 uppercase mt-1 tabular-nums">{step.date}</p>
                </div>
                {/* Mobile vertical line */}
                {!isLast && (
                  <div className="md:hidden absolute left-6 top-14 w-0.5 h-10 bg-border -z-10 overflow-hidden">
                    <div className={cn("w-full h-full bg-primary", isDone ? "block" : "hidden")} />
                  </div>
                )}
              </div>
              {!isLast && (
                <div className="hidden md:block flex-grow h-2 bg-surface rounded-full mx-2 overflow-hidden border border-border shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isDone ? '100.1%' : '0%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="p-8 bg-surface rounded-[2.5rem] border-2 border-border border-dashed space-y-6 relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary border border-border shadow-sm">
              <Building2 size={24} />
           </div>
           <div>
              <p className="text-[9px] font-black uppercase text-text-muted tracking-widest leading-none">Unidade de Resposta</p>
              <h4 className="text-sm font-black text-text-main uppercase">Secretaria Municipal de Obras e Urbanismo</h4>
           </div>
        </div>
        <p className="text-sm font-ui text-text-muted font-medium leading-relaxed relative z-10 pl-6 border-l-4 border-primary/20">
          {isResolved 
            ? "A equipe Alfa-02 concluiu a manutenção da infraestrutura na via reportada. O protocolo foi auditado e encerrado via DigitalID."
            : "Sua manifestação foi integrada ao radar de prioridades da Secretaria. A triagem técnica estima visita ao local em até 48h úteis."
          }
        </p>

        {isResolved && onRate && (
          <div className="pt-8 border-t border-border mt-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 text-center">Auditoria de Satisfação Cidadã</p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => onRate(star)}
                  className="w-12 h-12 bg-white border-2 border-border rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90 shadow-sm"
                >
                  <Stamp className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        )}
        <Activity className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.03] text-primary -rotate-12" />
      </div>
    </div>
  );
};

export default function OuvidoriaPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [viewMode, setViewMode] = useState<'create' | 'search'>('create');
  const [searchId, setSearchId] = useState('');
  const [searchedProtocol, setSearchedProtocol] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    type: 'Reclamação',
    message: '',
    isAnonymous: false,
    consent: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const protocolNumber = useMemo(() => `#${2847192}`, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    
    if (searchId.includes('2847192')) {
      setSearchedProtocol({
        id: '#2847192',
        status: 'RESOLVIDO',
        createdAt: '24/10/2026',
        type: 'Reclamação',
        subject: 'Infraestrutura Urbana'
      });
    } else {
      toast('Protocolo não identificado no barramento municipal.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 1 && (!formData.type || !formData.subject)) {
        toast('Complete os campos de identificação.', 'error');
        return;
      }
      if (step === 2 && !formData.message) {
        toast('O detalhamento tático é obrigatório.', 'error');
        return;
      }
      setStep(step + 1);
      return;
    }
    
    if (!formData.consent) {
      toast('A aceite dos termos é mandatório para validação DigitalID.', 'error');
      return;
    }
    setShowSuccess(true);
  };

  const handleRate = (rating: number) => {
    toast(`Avaliação enviada com sucesso (${rating} selos). Obrigado por fiscalizar a gestão!`, 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-12 bg-background">
      
      {/* High-Fidelity Hero Section */}
      <section className="relative overflow-hidden rounded-[4rem] md:rounded-[5.5rem] bg-text-main text-white p-12 md:p-20 shadow-4xl flex flex-col md:flex-row items-center justify-between border-4 border-white/10 group">
         <div className="relative z-10 max-w-3xl text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
               <ShieldCheck className="w-4 h-4 text-primary" />
               Canal de Resposta Tática Governamental
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
               Ouvidoria <br/> <span className="text-primary">Ativa.</span>
            </h1>
            <p className="text-lg md:text-2xl font-ui font-medium opacity-80 max-w-2xl leading-relaxed border-l-4 border-primary/30 pl-8">
               Sua voz possui força de lei digital. Solicite, denuncie ou elogie a gestão pública através do canal integrado ao seu DigitalID para resposta garantida.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
               <button 
                  onClick={() => { setViewMode('create'); setStep(1); }}
                  className={cn(
                    "px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4",
                    viewMode === 'create' ? "bg-primary text-white" : "bg-white/10 text-white border-2 border-white/20 backdrop-blur"
                  )}
               >
                  <Send className="w-5 h-5" />
                  Manifestar
               </button>
               <button 
                  onClick={() => setViewMode('search')}
                  className={cn(
                    "px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4",
                    viewMode === 'search' ? "bg-primary text-white" : "bg-white/10 text-white border-2 border-white/20 backdrop-blur"
                  )}
               >
                  <Search className="w-5 h-5" />
                  Consultar Protocolo
               </button>
            </div>
         </div>
         <div className="relative mt-16 md:mt-0 hidden xl:block">
            <div className="w-[400px] h-[400px] bg-white/5 rounded-full absolute -inset-16 animate-pulse border-2 border-white/10" />
            <div className="relative z-10 w-80 h-80 flex flex-col items-center justify-center text-center p-10 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-inner group-hover:rotate-6 transition-transform duration-[2s]">
               <Activity className="w-16 h-16 text-primary mb-6 animate-pulse" />
               <p className="text-3xl font-black tracking-tighter leading-none mb-2">94%</p>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Taxa de Resolução Global</p>
            </div>
         </div>
         <MessageSquare className="absolute -left-12 -bottom-12 w-80 h-80 opacity-[0.03] text-white -rotate-12 pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Support Tools & Stats (Side) */}
        <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
           <div className="bg-white p-10 rounded-[3.5rem] border-2 border-border shadow-sm space-y-10 group overflow-hidden relative">
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter flex items-center gap-4 leading-none">
                    <Radio className="w-6 h-6 text-primary" />
                    Radar Distrital
                 </h3>
                 <p className="text-xs font-ui font-medium text-text-muted opacity-60">Status de demandas no seu bairro hoje.</p>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-5 bg-surface rounded-3xl border border-border">
                    <div className="flex items-center gap-3">
                       <MapPin size={18} className="text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Setor Sul</span>
                    </div>
                    <span className="text-xs font-black text-rose-500 uppercase">Alta Demanda</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center gap-1">
                       <span className="text-2xl font-black text-orange-600 leading-none">42</span>
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Abertos</span>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center text-center gap-1">
                       <span className="text-2xl font-black text-green-600 leading-none">128</span>
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Resolvidos</span>
                    </div>
                 </div>
              </div>
              <HelpCircle className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.02] text-primary rotate-12" />
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border-2 border-border shadow-sm space-y-8">
              <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-4 leading-none">
                 <Phone size={24} className="text-primary" />
                 Conexão Direta
              </h3>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border-2 border-border group-hover:bg-primary/5 group-hover:border-primary transition-all shadow-inner">
                       <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60 leading-none">Canal de Voz Gratuito</p>
                       <p className="text-base font-black text-text-main group-hover:text-primary transition-colors leading-none uppercase">156 (Ramal 9)</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border-2 border-border group-hover:bg-primary/5 group-hover:border-primary transition-all shadow-inner">
                       <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60 leading-none">Correio Digital</p>
                       <p className="text-base font-black text-text-main group-hover:text-primary transition-colors leading-none uppercase">ouvidoria@santamaria.pa.gov.br</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-text-main rounded-3xl text-white space-y-4 relative overflow-hidden group shadow-2xl">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Amparo Legal</p>
                 <p className="text-xs font-ui font-medium opacity-80 leading-relaxed relative z-10">
                    Sua manifestação é protegida pela Lei de Transparência 12.527/11. Resposta mandatória em até 20 dias úteis.
                 </p>
                 <ShieldCheck className="absolute -right-6 -bottom-6 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
              </div>
           </div>
        </div>

        {/* Form Post / Search Dashboard (Main) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <AnimatePresence mode="wait">
             {viewMode === 'create' ? (
               <motion.form 
                 key="create"
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -30 }}
                 onSubmit={handleSubmit}
                 className="bg-white p-8 md:p-14 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border border-b-[20px] border-b-primary shadow-4xl space-y-10 relative overflow-hidden"
               >
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-border pb-8">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-[1.5rem] bg-primary text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20">
                          {step}
                       </div>
                       <div className="space-y-1">
                          <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">
                             {step === 1 ? 'Categorização' : step === 2 ? 'Detalhamento' : 'Assinatura'}
                          </h2>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Etapa Operacional de Protocolo</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       {[1, 2, 3].map(s => (
                          <div key={s} className="w-16 h-2 bg-surface rounded-full overflow-hidden border border-border shadow-inner">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: s <= step ? '100.1%' : '0%' }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-primary"
                             />
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="min-h-[300px] relative z-10">
                   {step === 1 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Natureza do Chamado</label>
                           <div className="relative group">
                              <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-surface border-2 border-border p-6 rounded-3xl font-black uppercase text-xs focus:border-primary outline-none transition-all shadow-inner appearance-none relative z-10"
                              >
                                <option>Reclamação Operacional</option>
                                <option>Sugestão Executiva</option>
                                <option>Elogio Institucional</option>
                                <option>Denúncia Fiscal</option>
                                <option>Pedido de Informação</option>
                              </select>
                              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary rotate-90" />
                           </div>
                         </div>
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Secretaria de Destino</label>
                           <input 
                             placeholder="Ex: Infraestrutura, Saúde, Educação..." 
                             value={formData.subject}
                             onChange={(e) => setFormData({...formData, subject: e.target.value})}
                             className="w-full bg-surface border-2 border-border p-6 rounded-3xl font-black uppercase text-xs focus:border-primary outline-none transition-all shadow-inner placeholder:opacity-30"
                           />
                         </div>
                       </div>
                       <div className="p-6 bg-surface rounded-[2rem] border-2 border-border border-dashed flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary border border-border shadow-sm shrink-0">
                             <Zap size={22} />
                          </div>
                          <p className="text-xs font-ui font-medium text-text-muted leading-relaxed">
                             O sistema de inteligência artificial tentará automatizar o encaminhamento com base na secretaria informada para reduzir o tempo de triagem em até 72h.
                          </p>
                       </div>
                     </motion.div>
                   )}

                   {step === 2 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Memorial Descritivo / Manifestação</label>
                         <textarea 
                           rows={8}
                           placeholder="Descreva o incidente ou sugestão com precisão tática (local, data, envolvidos e evidências)..." 
                           value={formData.message}
                           onChange={(e) => setFormData({...formData, message: e.target.value})}
                           className="w-full bg-surface border-2 border-border p-8 rounded-[2.5rem] font-black text-xs md:text-sm focus:border-primary outline-none transition-all shadow-inner resize-none font-ui placeholder:opacity-30"
                         />
                       </div>
                       <div className="flex justify-end">
                          <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">Mínimo sugerido: 100 caracteres</span>
                       </div>
                     </motion.div>
                   )}

                   {step === 3 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                       <div className="flex flex-col gap-6 p-8 bg-surface rounded-[3rem] border-2 border-border border-dashed shadow-inner">
                         <label className="flex items-center gap-4 cursor-pointer group">
                           <div className={cn("w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center transition-all", formData.isAnonymous ? "bg-primary border-primary text-white" : "bg-white")}>
                              {formData.isAnonymous && <CheckCircle2 size={16} />}
                           </div>
                           <input 
                             type="checkbox" 
                             className="hidden"
                             checked={formData.isAnonymous}
                             onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                           />
                           <span className="text-xs font-black text-text-main uppercase tracking-tight group-hover:text-primary transition-colors">Desejo que esta manifestação seja ANÔNIMA</span>
                         </label>
                         <label className="flex items-start gap-4 cursor-pointer group">
                           <div className={cn("w-7 h-7 mt-1 rounded-lg border-2 border-border flex items-center justify-center transition-all shrink-0", formData.consent ? "bg-primary border-primary text-white" : "bg-white")}>
                              {formData.consent && <CheckCircle2 size={16} />}
                           </div>
                           <input 
                             type="checkbox" 
                             required
                             className="hidden"
                             checked={formData.consent}
                             onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                           />
                           <span className="text-xs font-medium text-text-muted font-ui leading-relaxed">
                             Ao protocolar, eu atesto a veracidade das informações digitais fornecidas e aceito os termos do Marco Civil e da LGPD para tratamento dos meus dados via <span className="text-primary font-black uppercase">DigitalID Authentication</span>.
                           </span>
                         </label>
                       </div>
                       <div className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 flex items-center gap-6 group">
                          <Fingerprint size={42} className="text-primary opacity-50 group-hover:scale-110 transition-transform" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">Autenticação Biométrica Autêntica</p>
                             <p className="text-xs font-black text-primary uppercase leading-none">Manifestação assinada via DigitalID Protocol v2.6</p>
                          </div>
                       </div>
                     </motion.div>
                   )}
                 </div>

                 <div className="flex gap-6 pt-10 relative z-10">
                   {step > 1 && (
                     <button 
                       type="button"
                       onClick={() => setStep(step - 1)}
                       className="w-1/3 bg-surface border-2 border-border text-text-muted py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-text-muted transition-all active:scale-95 flex items-center justify-center gap-3 shadow-inner group/btn"
                     >
                       <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                       Voltar
                     </button>
                   )}
                   <button 
                     type="submit"
                     className={cn(
                       "flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-95",
                       step === 3 && "bg-text-main shadow-none"
                     )}
                   >
                     {step < 3 ? 'Próximo Estágio' : 'Protocolar Manifestação'}
                     {step < 3 ? <ChevronRight className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                   </button>
                 </div>
                 <FileText className="absolute -left-12 -bottom-12 w-96 h-96 opacity-[0.01] pointer-events-none -rotate-12" />
               </motion.form>
             ) : (
               <motion.div 
                 key="search"
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 30 }}
                 className="space-y-10"
               >
                 <form 
                   onSubmit={handleSearch}
                   className="bg-white p-10 md:p-16 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border shadow-4xl space-y-8 relative overflow-hidden"
                 >
                   <div className="space-y-3 text-center md:text-left relative z-10">
                     <h2 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Rastreio <span className="text-primary">Cidadão.</span></h2>
                     <p className="text-lg font-ui font-medium text-text-muted opacity-60">Monitore em tempo real o status de sua demanda administrativa.</p>
                   </div>
                   
                   <div className="relative z-10">
                     <input 
                       placeholder="CHAVE DE PROTOCOLO (EX: #2847192)" 
                       value={searchId}
                       onChange={(e) => setSearchId(e.target.value)}
                       className="w-full h-20 md:h-24 bg-surface border-2 border-border p-8 pr-24 rounded-3xl font-mono text-2xl md:text-3xl font-black text-text-main focus:border-primary outline-none transition-all shadow-inner placeholder:opacity-10 tracking-widest"
                     />
                     <button 
                       type="submit"
                       className="absolute right-3 top-3 bottom-3 aspect-square bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all active:scale-95 shadow-3xl group"
                     >
                       <Search className="w-8 h-8 group-hover:scale-110 transition-transform" />
                     </button>
                   </div>
                   <Activity className="absolute -right-16 -top-16 w-80 h-80 opacity-[0.02] text-primary rotate-45 pointer-events-none" />
                 </form>

                 {searchedProtocol && (
                   <motion.div 
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white p-10 md:p-16 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border border-b-[20px] border-b-amber-500 shadow-4xl space-y-12 overflow-hidden relative"
                   >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                         <div className="space-y-3">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] leading-none opacity-60">ID do Barramento Institucional</p>
                           <h3 className="text-4xl md:text-5xl font-black text-primary font-mono tracking-tighter underline decoration-double decoration-border underline-offset-[12px]">
                             {searchedProtocol.id}
                           </h3>
                         </div>
                         <div className="px-6 py-3 bg-amber-500 text-white rounded-[1.5rem] border-4 border-white text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-pulse">
                            <Clock className="w-5 h-5" />
                            {searchedProtocol.status === 'RESOLVIDO' ? 'CONCLUÍDO' : 'EM TRIAGEM'}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                         <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner group hover:border-primary transition-all">
                            <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Eixo de Atuação</span>
                            <span className="text-sm font-black uppercase text-text-main group-hover:text-primary transition-colors">{searchedProtocol.subject}</span>
                         </div>
                         <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner group hover:border-primary transition-all">
                            <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Data de Ingresso</span>
                            <span className="text-sm font-black uppercase text-text-main group-hover:text-primary transition-colors">{searchedProtocol.createdAt}</span>
                         </div>
                         <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner col-span-2 md:col-span-1 group hover:border-primary transition-all">
                            <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Modalidade</span>
                            <span className="text-sm font-black uppercase text-text-main group-hover:text-primary transition-colors">{searchedProtocol.type}</span>
                         </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                         <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] border-b border-border pb-4 flex items-center gap-3">
                            <Activity size={18} className="text-primary" />
                            Log Integrado de Atendimento
                         </h4>
                         <ProtocolTimeline status={searchedProtocol.status} onRate={handleRate} />
                      </div>
                      <Layers className="absolute -left-12 -top-12 w-64 h-64 opacity-[0.02] text-primary rotate-12 pointer-events-none" />
                   </motion.div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Success Modal: High Fidelity Confirmation */}
      <Modal 
        isOpen={showSuccess} 
        onClose={() => {
          setShowSuccess(false);
          setFormData({
            subject: '',
            type: 'Reclamação',
            message: '',
            isAnonymous: false,
            consent: false
          });
          setStep(1);
        }}
        title="Protocolo Integrado ao Sistema"
      >
        <div className="space-y-10 p-8 text-center bg-white relative overflow-hidden rounded-[3rem]">
           <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-4xl border-4 border-white group-hover:rotate-12 transition-transform">
              <CheckCircle2 className="w-12 h-12" />
           </div>
           
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-none">Voz Protocolada!</h3>
              <p className="text-base font-ui font-medium text-text-muted leading-relaxed max-w-sm mx-auto opacity-70">
                Sua manifestação foi integrada ao barramento municipal via DigitalID. O número abaixo é sua chave de acesso único.
              </p>
           </div>

           <div className="bg-surface p-10 rounded-[3rem] border-4 border-border border-dashed font-mono text-4xl font-black text-primary tracking-widest shadow-inner relative overflow-hidden group">
              {protocolNumber}
              <motion.div 
                 initial={{ left: '-100%' }}
                 animate={{ left: '100%' }}
                 transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                 className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
              />
           </div>

           <div className="space-y-6">
              <div className="p-6 bg-blue-50 text-blue-700 rounded-[2rem] border-2 border-blue-100 flex items-center gap-5 text-left group">
                 <HelpCircle className="w-8 h-8 shrink-0 text-blue-500 group-hover:scale-110 transition-transform" />
                 <p className="text-xs font-black uppercase leading-relaxed tracking-tight group-hover:text-blue-800 transition-colors">Acompanhe a evolução em sua Central de Notificações. A resposta estima-se em fluxo prioritário.</p>
              </div>
              
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-text-main text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl hover:bg-primary transition-all active:scale-95"
              >
                Retornar ao Painel
              </button>
           </div>
           
           <Award className="absolute -right-12 -top-12 w-48 h-48 opacity-[0.03] text-primary rotate-12" />
        </div>
      </Modal>

      {/* Support CTA */}
      <div className="px-10 py-10 bg-surface rounded-[4rem] border-2 border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-10 group">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-inner border border-border shrink-0 group-hover:rotate-12 transition-transform duration-500">
               <Fingerprint size={36} />
            </div>
            <div className="space-y-1">
               <h4 className="text-xl font-black text-text-main uppercase leading-none">Protocolo DigitalID de Segurança</h4>
               <p className="text-xs font-ui font-medium text-text-muted max-w-lg">
                  Toda manifestação é auditada e criptografada, garantindo que o seu histórico cívico seja preservado e respeitado por todas as instâncias governamentais.
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-border shadow-sm">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Conexão Segura AES-256</span>
         </div>
      </div>

    </div>
  );
}
