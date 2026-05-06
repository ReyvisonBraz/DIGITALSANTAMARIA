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
  ShieldCheck,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { createEnrollment } from '@/services/educacao.service';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Responsável', icon: User },
  { id: 2, title: 'Aluno(a)', icon: FileText },
  { id: 3, title: 'Endereço', icon: Home },
  { id: 4, title: 'Unidade', icon: School },
  { id: 5, title: 'Confirmação', icon: CheckCircle2 },
];

const schools = [
  'E.M.E.F. Monteiro Lobato',
  'E.M. João Paulo II',
  'C.E.I. Ciranda da Criança',
  'E.M.E.F. Santa Maria',
  'C.E.I. Pequeno Aprendiz',
];

export default function MatriculaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [formData, setFormData] = useState({
    parentName: '',
    parentCpf: '',
    studentName: '',
    studentBirth: '',
    cep: '',
    address: '',
    schoolPreference: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.parentName.trim() && formData.parentCpf.trim();
      case 2: return formData.studentName.trim() && formData.studentBirth.trim();
      case 3: return formData.address.trim();
      case 4: return formData.schoolPreference.trim();
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && canProceed()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      await login();
      return;
    }
    setSubmitting(true);
    try {
      await createEnrollment({
        userId: user.uid,
        parentName: formData.parentName,
        parentCpf: formData.parentCpf,
        studentName: formData.studentName,
        studentBirth: formData.studentBirth,
        address: formData.address,
        cep: formData.cep,
        schoolPreference: formData.schoolPreference,
      });
      setProtocol(formData.parentCpf.replace(/\D/g, '').slice(0, 6));
      setSubmitted(true);
    } catch {
      toast('Erro ao enviar solicitação. Tente novamente.', 'error');
    }
    setSubmitting(false);
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
                              value={formData.parentName}
                              onChange={(e) => updateField('parentName', e.target.value)}
                              className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">CPF do Responsável</label>
                            <input 
                              type="text" 
                              placeholder="000.000.000-00"
                              value={formData.parentCpf}
                              onChange={(e) => updateField('parentCpf', e.target.value)}
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
                              value={formData.studentName}
                              onChange={(e) => updateField('studentName', e.target.value)}
                              className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Data de Nascimento</label>
                            <input 
                              type="date"
                              value={formData.studentBirth}
                              onChange={(e) => updateField('studentBirth', e.target.value)}
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
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">CEP</label>
                            <input 
                              type="text" 
                              placeholder="00000-000"
                              value={formData.cep}
                              onChange={(e) => updateField('cep', e.target.value)}
                              className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Logradouro, Número, Bairro</label>
                            <input 
                              type="text" 
                              placeholder="Rua Exemplo, 123, Centro"
                              value={formData.address}
                              onChange={(e) => updateField('address', e.target.value)}
                              className="w-full p-4 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-sm"
                            />
                         </div>
                         <p className="text-[10px] font-ui font-bold text-text-muted">O zoneamento escolar é baseado no endereço de residência do aluno.</p>
                      </div>
                   </div>
                )}

                {currentStep === 4 && (
                   <div className="space-y-6">
                      <h3 className="text-2xl font-black text-text-main uppercase border-b-2 border-border pb-4">Unidade Pretendida</h3>
                      <div className="grid grid-cols-1 gap-4">
                         {schools.map(school => (
                           <button 
                             key={school} 
                             onClick={() => updateField('schoolPreference', school)}
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
                      {submitted ? (
                        <>
                          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                             <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter">Solicitação Enviada!</h3>
                             <p className="text-sm font-ui font-medium text-text-muted max-w-sm mx-auto">
                                Sua solicitação de matrícula foi registrada na Secretaria de Educação.
                             </p>
                          </div>
                          <div className="bg-surface p-6 rounded-3xl border-2 border-border border-dashed">
                             <div className="flex items-center gap-3 justify-center">
                                <ClipboardList className="w-6 h-6 text-primary" />
                                <div className="text-left">
                                   <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Protocolo</p>
                                   <p className="text-xl font-black text-text-main tracking-wider font-mono">MAT-{protocol}</p>
                                </div>
                             </div>
                          </div>
                          <button
                            onClick={() => router.push('/educacao')}
                            className="bg-primary text-white px-10 py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                          >
                            Voltar para Educação
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-primary-500/10 text-primary rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                             <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter">Quase lá!</h3>
                             <p className="text-sm font-ui font-medium text-text-muted max-w-sm mx-auto">
                                Ao clicar em finalizar, sua solicitação será enviada para a central de vagas da Secretaria de Educação.
                             </p>
                          </div>
                          <div className="p-4 bg-surface rounded-3xl border-2 border-border border-dashed text-left space-y-2">
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-text-muted">Responsável:</span><span className="text-xs font-black">{formData.parentName}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-text-muted">Aluno(a):</span><span className="text-xs font-black">{formData.studentName}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-text-muted">Nascimento:</span><span className="text-xs font-black">{formData.studentBirth}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-text-muted">Escola:</span><span className="text-xs font-black">{formData.schoolPreference}</span></div>
                          </div>
                          <div className="p-6 bg-surface rounded-3xl border-2 border-border border-dashed flex flex-col items-center gap-3">
                             <Info className="w-6 h-6 text-primary" />
                             <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Lembre-se de anexar os documentos físicos na unidade escolar após convocação.</p>
                          </div>
                        </>
                      )}
                   </div>
                )}
            </motion.div>
         </AnimatePresence>

          <div className="flex justify-between items-center pt-12 border-t border-border mt-auto">
             <button 
               onClick={prevStep}
               disabled={currentStep === 1 || submitted}
               className={cn(
                 "flex items-center gap-2 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                 (currentStep === 1 || submitted) ? "opacity-0 pointer-events-none" : "bg-surface text-text-muted border-2 border-border hover:border-primary hover:text-primary"
               )}
             >
                <ChevronLeft className="w-4 h-4" />
                Anterior
             </button>
             {submitted ? null : (
               <button 
                 onClick={currentStep === 5 ? handleSubmit : nextStep}
                 disabled={!canProceed() || submitting}
                 className={cn(
                   "flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all",
                   canProceed() && !submitting ? "hover:scale-105 active:scale-95" : "opacity-50 cursor-not-allowed"
                 )}
               >
                 {submitting ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                 ) : currentStep === 5 ? (
                   <>Finalizar Solicitação<ChevronRight className="w-4 h-4" /></>
                 ) : (
                   <>Próximo Passo<ChevronRight className="w-4 h-4" /></>
                 )}
               </button>
             )}
          </div>
      </div>

    </div>
  );
}
