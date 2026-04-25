'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Barcode,
  PieChart,
  ChevronRight,
  Zap,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
  History,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';

const taxes = [
  { id: '1', title: 'IPTU • Exercício 2026', due: '15 Mai', value: 450.00, status: 'pending', category: 'Imobiliário' },
  { id: '2', title: 'Taxa de Coleta Residencial', due: '20 Jun', value: 85.00, status: 'pending', category: 'Serviços' },
  { id: '3', title: 'ISS • Competência Março', due: '10 Abr', value: 1200.00, status: 'paid', category: 'Profissional' },
  { id: '4', title: 'Taxa de Licenciamento MEI', due: '05 Jul', value: 120.00, status: 'pending', category: 'Empresarial' }
];

export default function TributosPage() {
  const { toast } = useToast();
  const [selectedTax, setSelectedTax] = useState<any>(null);
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'pagos'>('todos');

  const filteredTaxes = taxes.filter(t => {
    if (filter === 'todos') return true;
    if (filter === 'pendentes') return t.status === 'pending';
    return t.status === 'paid';
  });

  const handlePay = (id: string) => {
    toast('Autenticando transação DigitalPay...', 'info');
    setTimeout(() => {
      toast('Pagamento processado com sucesso!', 'success');
      setSelectedTax(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-12 bg-background">
      
      {/* Finance Hero - Wallet Style */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
         <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <ShieldCheck className="w-4 h-4" />
                  Ambiente Fiscal Seguro e Auditado
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">
                  Gestão <br /> <span className="text-primary">Financeira.</span>
               </h1>
            </div>
            <p className="text-base md:text-xl font-medium text-text-muted font-ui max-w-2xl leading-relaxed">
               Monitore sua regularidade fiscal, emita guias de pagamento e visualize o impacto real dos seus impostos no desenvolvimento do seu bairro.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <button className="bg-text-main text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary transition-all active:scale-95 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Emitir Certidão de Regularidade
               </button>
               <button className="bg-surface border-2 border-border text-text-main px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-primary transition-all active:scale-95">
                  Extrato Anual 2025
               </button>
            </div>
         </div>

         {/* Wallet Status Card */}
         <div className="lg:col-span-4 bg-primary p-8 md:p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(var(--primary),0.3)] border-2 border-white/10 group">
            <div className="space-y-1 relative z-10">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Débito Total Previsto</span>
               <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter">R$ 655,00</span>
                  <div className="mb-2 p-1 bg-white/20 rounded-lg backdrop-blur">
                     <TrendingUp className="w-4 h-4 text-white" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 relative z-10 pt-4 border-t border-white/10">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status de Regularidade</span>
                  <span className="px-3 py-1 bg-white text-primary text-[9px] font-black rounded-full uppercase tracking-widest">Excelente</span>
               </div>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[100%] h-full bg-white" />
               </div>
               <p className="text-[10px] font-bold italic opacity-70">Você possui 100% de desconto em juros por manter seus pagamentos em dia.</p>
            </div>

            <PieChart className="absolute -right-12 -bottom-12 w-48 h-48 opacity-[0.05] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform" />
         </div>
      </section>

      {/* Main Fiscal Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14">
         
         {/* LEFT: Taxes List */}
         <main className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-border pb-6">
               <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tighter uppercase">Fluxo Fiscal</h2>
               <div className="flex bg-surface p-1 rounded-xl border border-border">
                  {['todos', 'pendentes', 'pagos'].map((t) => (
                     <button
                        key={t}
                        onClick={() => setFilter(t as any)}
                        className={cn(
                           "px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all",
                           filter === t ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-main"
                        )}
                     >
                        {t}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <AnimatePresence mode="popLayout">
                  {filteredTaxes.map((tax) => (
                     <motion.div 
                        key={tax.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                           "bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:border-primary/40 transition-all group",
                           tax.status === 'paid' && "bg-surface opacity-60 border-dashed"
                        )}
                     >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                           <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-inner group-hover:scale-110 transition-transform duration-500",
                              tax.status === 'paid' ? "bg-green-50 border-green-100 text-green-500" : "bg-primary/5 border-primary/10 text-primary"
                           )}>
                              {tax.status === 'paid' ? <CheckCircle2 size={28} /> : <div className="text-xl font-black">{tax.due.split(' ')[0]}</div>}
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-lg font-black text-text-main uppercase leading-none group-hover:text-primary transition-colors">{tax.title}</h4>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                 <Building2 className="w-3 h-3" />
                                 Setor {tax.category}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
                           <div className="text-center md:text-right flex-grow md:flex-grow-0">
                              <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Valor do Tributo</p>
                              <p className={cn(
                                 "text-2xl font-black tabular-nums leading-none",
                                 tax.status === 'paid' ? "text-text-muted" : "text-text-main"
                              )}>R$ {tax.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                           </div>

                           <div className="flex gap-2">
                              {tax.status === 'pending' ? (
                                 <>
                                    <button 
                                       onClick={() => toast('Gerando guia em PDF...', 'info')}
                                       className="p-4 bg-surface border-2 border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                                    >
                                       <Download size={20} />
                                    </button>
                                    <button 
                                       onClick={() => setSelectedTax(tax)}
                                       className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-Tactile active:scale-95 group-hover:brightness-110"
                                    >
                                       Pagar Agora
                                    </button>
                                 </>
                              ) : (
                                 <button className="flex items-center gap-2 px-6 py-4 bg-green-50 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-default">
                                    Concluído
                                    <Zap className="w-3 h-3 fill-green-600" />
                                 </button>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </main>

         {/* RIGHT: Fiscal Timeline & Info */}
         <aside className="lg:col-span-4 space-y-8">
            <div className="bg-text-main p-8 md:p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
               <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 relative z-10 border-b border-white/10 pb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  Exercício 2026
               </h3>
               <div className="space-y-6 relative z-10">
                  {[
                    { month: 'Janeiro', event: 'Vencimento Cota Única (15% OFF)', status: 'past' },
                    { month: 'Março', event: 'Entrega da DIRB Municipal', status: 'past' },
                    { month: 'Maio', event: '1ª Parcela IPTU Residencial', status: 'now' },
                    { month: 'Julho', event: 'Taxa de Alvará MEI/Empresas', status: 'future' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                       <div className="flex flex-col items-center">
                          <div className={cn(
                             "w-3 h-3 rounded-full border-2 border-white transition-all duration-500",
                             step.status === 'past' ? "bg-white" : step.status === 'now' ? "bg-primary animate-ping" : "bg-transparent opacity-30"
                          )} />
                          {idx !== 3 && <div className="w-[1px] h-10 bg-white/10 mt-1" />}
                       </div>
                       <div className="space-y-0.5">
                          <h4 className={cn("text-[9px] font-black uppercase tracking-widest", step.status === 'future' ? "opacity-30" : "opacity-60")}>{step.month}</h4>
                          <p className={cn("text-xs font-bold font-ui italic leading-tight", step.status === 'future' && "opacity-30")}>{step.event}</p>
                       </div>
                    </div>
                  ))}
               </div>
               
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 relative z-10">
                  <History className="w-4 h-4" />
                  Histórico de Exercícios
               </button>
               
               <Building2 className="absolute -right-16 -bottom-16 w-64 h-64 opacity-[0.03] -rotate-12 pointer-events-none" />
            </div>

            <div className="bg-white p-8 rounded-[3rem] border-2 border-border space-y-6 shadow-sm">
               <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-primary" />
                  <h4 className="font-black text-text-main uppercase text-sm tracking-tight">Políticas de Incentivo</h4>
               </div>
               <p className="text-xs font-ui font-medium text-text-muted leading-relaxed border-l-2 border-primary/20 pl-4">
                 Candidatos ao programa "Cidadão Pontual" têm prioridade em agendamentos de saúde e descontos em eventos culturais municipais.
               </p>
               <button 
                  onClick={() => toast('Abrindo termos do Cidadão Pontual...', 'info')}
                  className="w-full py-3 bg-surface rounded-xl font-black text-[9px] uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
               >
                  Ver Benefícios Adicionais
               </button>
            </div>
         </aside>
      </div>

      {/* Tax Destination Impact - Transparent Dashboard */}
      <section className="bg-white p-10 md:p-20 rounded-[4rem] border-4 border-surface shadow-inner flex flex-col lg:flex-row items-center gap-16">
         <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
               <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">Seu imposto <br/> <span className="text-primary">Transformado.</span></h2>
               <p className="text-base md:text-lg font-ui font-medium text-text-muted leading-relaxed max-w-lg">
                  A transparencia absoluta do Digital Santa Maria permite que você acompanhe em tempo real a destinação de cada Real arrecadado.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { label: 'Educação Municipal', p: '28%', icon: GraduationCap, color: 'text-orange-500' },
                 { label: 'Rede de Saúde', p: '25%', icon: Zap, color: 'text-primary' },
                 { label: 'Infraestrutura', p: '15%', icon: Building2, color: 'text-green-500' },
                 { label: 'Segurança & Monitor.', p: '12%', icon: ShieldCheck, color: 'text-rose-500' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 group cursor-help">
                    <div className={cn("w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-border group-hover:scale-110 transition-transform", item.color)}>
                       <item.icon size={20} />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{item.label}</p>
                       <p className="text-2xl font-black text-text-main italic leading-none">{item.p}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
               {/* Visual Donut Chart */}
               <div className="absolute inset-0 rounded-full border-[2.5rem] border-surface border-dashed opacity-50" />
               <div className="w-full h-full rounded-full border-[2rem] border-primary relative flex items-center justify-center shadow-2xl animate-spin-slow" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 0)' }} />
               <div className="absolute inset-4 rounded-full border-[2rem] border-orange-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0, 100% 0)' }} />
               
               <div className="absolute z-10 w-2/3 h-2/3 bg-white rounded-full border-4 border-surface shadow-2xl flex flex-col items-center justify-center text-center p-8">
                  <TrendingUp className="w-12 h-12 text-primary/10 mb-2" />
                  <span className="text-4xl font-black text-text-main tracking-tighter tabular-nums leading-none">2026</span>
                  <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mt-1">Orçamento Ativo</span>
               </div>
            </div>
         </div>
      </section>

      {/* Modal: Payment Details (Fintech Style) */}
      <Modal 
        isOpen={!!selectedTax} 
        onClose={() => setSelectedTax(null)}
        title="Gateway de Pagamento DigitalPay"
      >
        {selectedTax && (
          <div className="space-y-10 p-4">
            <div className="flex flex-col items-center gap-6 text-center">
               <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl animate-float relative overflow-hidden border-4 border-white/20">
                  <DollarSign size={40} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-none">{selectedTax.title}</h3>
                  <div className="flex items-center justify-center gap-2">
                     <Clock className="w-4 h-4 text-primary" />
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Aguardando Confirmação</p>
                  </div>
               </div>
            </div>

            <div className="bg-surface p-8 rounded-[2.5rem] border-2 border-border border-dashed space-y-6 relative group overflow-hidden">
               <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">ID Fiscal do Lançamento</span>
                  <span className="font-mono text-xs font-bold text-text-main">{selectedTax.id.padStart(8, '0')}</span>
               </div>
               <div className="flex justify-between items-end relative z-10">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Data de Vencimento</span>
                     <p className="text-lg font-black text-text-main tabular-nums leading-none">{selectedTax.due} 2026</p>
                  </div>
                  <div className="text-right space-y-1">
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Total Líquido</span>
                     <p className="text-3xl font-black text-primary tabular-nums leading-none">R$ {selectedTax.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
               </div>
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="space-y-6">
               <div className="flex flex-col items-center gap-6 p-10 bg-white border-2 border-border rounded-[3rem] shadow-inner">
                  <div className="relative w-48 h-48 group cursor-cell">
                     <Image 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PIX-PAYMENT-CIVIC-${selectedTax.id}`} 
                        alt="PIX QR Code" 
                        fill 
                        className="object-contain"
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Escaneie no seu App Bank</span>
                     </div>
                  </div>
                  <div className="w-full space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Código Pix Copia e Cola</span>
                        <button className="text-[9px] font-black text-primary uppercase border-b border-primary/30">Copiar Código</button>
                     </div>
                     <p className="text-[9px] font-mono bg-surface p-4 rounded-2xl border border-border break-all leading-tight opacity-70">
                        00020126580014BR.GOV.BCB.PIX011400010002000300045204000053039865802BR5913PREF_MUNICIP6008CURITIBA62070503***6304
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handlePay(selectedTax.id)}
                    className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3"
                  >
                     Confirmar Pagamento via DigitalID
                     <ChevronRight size={24} />
                  </button>
                  <p className="text-[10px] font-bold text-text-muted text-center opacity-60">Seu comprovante será emitido instantaneamente no Portal DSM.</p>
               </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
