'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Home, 
  School, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Info,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Responsável', icon: User },
  { id: 2, title: 'Aluno(a)', icon: FileText },
  { id: 3, title: 'Endereço', icon: Home },
  { id: 4, title: 'Unidade', icon: School },
  { id: 5, title: 'Confirmação', icon: CheckCircle2 },
];

export default function MatriculaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    parentName: '',
    parentCpf: '',
    studentName: '',
    studentBirth: '',
    address: '',
    schoolPreference: ''
  });

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    toast('Solicitação de matrícula enviada com sucesso!', 'success');
    setTimeout(() => {
      router.push('/educacao');
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <button 
           onClick={() => router.push('/educacao')}
           className="group flex items-center gap-3 text-text-muted hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
         >
           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
           Voltar para Educação
         </button>
         <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border-2 border-border">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Conexão Segura SSL</span>
         </div>
      </div>

      <div className="space-y-4 text-center md:text-left">
         <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Solicitação de <br /><span className="text-primary">Matrícula 2026.</span></h1>
         <p className="text-sm font-ui font-medium text-text-muted max-w-xl">Preencha os dados abaixo para iniciar o processo de vinculação escolar na rede municipal.</p>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-center bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-sm">
         <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-surface border-y border-border" />
         {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
               <div className={cn(
                 "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                 currentStep >= step.id 
                   ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110" 
                   : "bg-white border-border text-text-muted"
               )}>
                  <step.icon className="w-6 h-6" />
               </div>
               <span className={cn(
                 "hidden md:block text-[9px] font-black uppercase tracking-widest",
                 currentStep >= step.id ? "text-primary" : "text-text-muted opacity-50"
               )}>
                  {step.title}
               </span>
            </div>
         ))}
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-2 border-border shadow-2xl min-h-[400px] flex flex-col">
         <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-grow space-y-8"
            >
               {currentStep === 1 && (
                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-text-main uppercase border-b-2 border-border pb-4">Dados do Responsável</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Nome Completo</label>
                           <input 
                             type="text" 
                             placeholder="Ex: João da Silva"
                             className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">CPF do Responsável</label>
                           <input 
                             type="text" 
                             placeholder="000.000.000-00"
                             className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                           />
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 2 && (
                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-text-main uppercase border-b-2 border-border pb-4">Dados do Aluno(a)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Nome da Criança/Jovem</label>
                           <input 
                             type="text" 
                             placeholder="Nome Completo"
                             className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Data de Nascimento</label>
                           <input 
                             type="date" 
                             className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                           />
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 3 && (
                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-text-main uppercase border-b-2 border-border pb-4">Endereço de Residência</h3>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Busca por CEP</label>
                           <div className="flex gap-4">
                              <input 
                                type="text" 
                                placeholder="00000-000"
                                className="flex-grow p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                              />
                              <button className="bg-primary text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest">Buscar</button>
                           </div>
                        </div>
                        <p className="text-[10px] font-ui font-bold text-text-muted">O zoneamento escolar é baseado no endereço de residência do aluno.</p>
                     </div>
                  </div>
               )}

               {currentStep === 4 && (
                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-text-main uppercase border-b-2 border-border pb-4">Unidade Pretendida</h3>
                     <div className="grid grid-cols-1 gap-4">
                        {['E.M.E.F. Monteiro Lobato', 'E.M. João Paulo II', 'C.E.I. Ciranda da Criança'].map(school => (
                          <button 
                            key={school} 
                            onClick={() => setFormData({...formData, schoolPreference: school})}
                            className={cn(
                              "w-full p-6 border-2 rounded-2xl flex items-center justify-between transition-all font-black text-xs uppercase tracking-tight",
                              formData.schoolPreference === school ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface text-text-muted hover:border-primary/50"
                            )}>
                             {school}
                             {formData.schoolPreference === school && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                        ))}
                     </div>
                  </div>
               )}

               {currentStep === 5 && (
                  <div className="space-y-8 text-center py-6">
                     <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                        <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter">Quase lá!</h3>
                        <p className="text-sm font-ui font-medium text-text-muted max-w-sm mx-auto">
                           Ao clicar em finalizar, sua solicitação será enviada para a central de vagas da Secretaria de Educação.
                        </p>
                     </div>
                     <div className="p-6 bg-surface rounded-3xl border-2 border-border border-dashed flex flex-col items-center gap-3">
                        <Info className="w-6 h-6 text-primary" />
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Lembre-se de anexar os documentos físicos na unidade escolar após convocação.</p>
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>

         <div className="flex justify-between items-center pt-12 border-t border-border mt-auto">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-2 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-surface text-text-muted border-2 border-border hover:border-primary hover:text-primary"
              )}
            >
               <ChevronLeft className="w-4 h-4" />
               Anterior
            </button>
            <button 
              onClick={currentStep === 5 ? handleSubmit : nextStep}
              className="flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
               {currentStep === 5 ? 'Finalizar Solicitação' : 'Próximo Passo'}
               <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>

    </div>
  );
}
