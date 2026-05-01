'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail,
  CheckCircle2,
  Search,
  Clock,
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
import { createLogger } from '@/lib/logger';
import DemandForm from '@/features/ouvidoria/DemandForm';
import ProtocolSearch from '@/features/ouvidoria/ProtocolSearch';
import { generateDemandProtocolId } from '@/lib/utils/protocol';

const log = createLogger('OuvidoriaPage');



export default function OuvidoriaPage() {
  const [viewMode, setViewMode] = useState<'create' | 'search'>('create');
  const [showSuccess, setShowSuccess] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState('');

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
                   onClick={() => setViewMode('create')}
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
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white p-8 md:p-14 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border border-b-[20px] border-b-primary shadow-4xl space-y-10 relative overflow-hidden"
                >
                  <div className="border-b border-border pb-8">
                    <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">
                      Nova Manifestação
                    </h2>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60 mt-2">
                      Registre sua solicitação junto à prefeitura
                    </p>
                  </div>
                  <DemandForm onSuccess={() => {
                    setProtocolNumber(generateDemandProtocolId());
                    setShowSuccess(true);
                  }} />
                  <FileText className="absolute -left-12 -bottom-12 w-96 h-96 opacity-[0.01] pointer-events-none -rotate-12" />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <ProtocolSearch />
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Success Modal: High Fidelity Confirmation */}
      <Modal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
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
