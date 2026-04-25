'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, FileText, Layout, ShieldCheck, Send, 
  CheckCircle2, ChevronRight, X, Image as ImageIcon, 
  ArrowLeft, Upload, Target 
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';

interface CreatePetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePetitionModal({ isOpen, onClose }: CreatePetitionModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infraestrutura',
    goal: '5000',
    description: '',
    hasImage: false
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Título da Causa</label>
               <input 
                 className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner" 
                 placeholder="Ex: Reforma da Praça Central" 
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
                 required 
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Categoria</label>
                  <select 
                    className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                     <option>Infraestrutura</option>
                     <option>Segurança</option>
                     <option>Cultura</option>
                     <option>Saúde</option>
                     <option>Meio Ambiente</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Meta Desejada</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-surface border-2 border-border p-4 pl-12 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner" 
                      placeholder="5000" 
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    />
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-40" />
                  </div>
               </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={!formData.title}
              className="w-full btn-tactile bg-text-main text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              Próxima Etapa
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">O Manifesto (Seu Texto)</label>
               <textarea 
                 rows={6}
                 className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner resize-none font-ui" 
                 placeholder="Descreva detalhadamente sua proposta e como ela ajudará a comunidade..."
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 required
               />
            </div>

            <div className="flex gap-4">
               <button 
                onClick={prevStep}
                className="w-20 btn-tactile bg-surface border-2 border-border text-text-muted p-4 rounded-xl flex items-center justify-center"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <button 
                 onClick={nextStep}
                 disabled={!formData.description}
                 className="flex-1 btn-tactile bg-text-main text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 Adicionar Mídia
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Evidências (Opcional)</label>
               <div 
                 onClick={() => setFormData({...formData, hasImage: true})}
                 className={cn(
                   "w-full h-40 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                   formData.hasImage ? "border-green-500 bg-green-50 text-green-600" : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
                 )}
               >
                  {formData.hasImage ? (
                    <>
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-xs font-black uppercase">Imagem Carregada!</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10" />
                      <div className="text-center">
                        <span className="block text-xs font-black uppercase">Clique para Carregar</span>
                        <span className="block text-[8px] font-bold opacity-50 uppercase tracking-widest">JPG, PNG até 5MB</span>
                      </div>
                    </>
                  )}
               </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border-2 border-primary/10 border-dashed flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] text-primary/70 font-ui font-bold leading-tight">
                 Ao publicar, você assume a responsabilidade pela veracidade dos fatos narrados.
               </p>
            </div>

            <div className="flex gap-4">
               <button 
                onClick={prevStep}
                className="w-20 btn-tactile bg-surface border-2 border-border text-text-muted p-4 rounded-xl flex items-center justify-center"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <button 
                 onClick={handleSubmit}
                 className="flex-1 btn-tactile bg-primary text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
               >
                 Publicar Causa 
                 <Send className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
    <Modal
      isOpen={isOpen && !showSuccess}
      onClose={onClose}
      title="Propor Nova Causa"
    >
      <div className="space-y-8 p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                 <Megaphone className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-text-main tracking-tight uppercase leading-none">Manifesto Cidadão</h3>
                 <p className="text-xs font-medium text-text-muted font-ui">Mobilize sua comunidade hoje.</p>
              </div>
           </div>
           
           <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  s === step ? "w-8 bg-primary" : (s < step ? "w-4 bg-green-500" : "w-4 bg-border")
                )} />
              ))}
           </div>
        </div>

        {renderStep()}
      </div>
    </Modal>

    <Modal 
       isOpen={showSuccess} 
       onClose={() => { setShowSuccess(false); onClose(); }} 
       title="Petição em Análise"
    >
       <div className="space-y-8 p-4 text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center border-2 border-primary/20 mx-auto">
             <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
             <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Proposta Recebida!</h3>
             <p className="text-sm font-medium text-text-muted font-ui">Seu manifesto foi enviado para a Procuradoria Municipal. Você receberá um e-mail quando a petição estiver disponível para assinaturas.</p>
          </div>
          <button 
             onClick={() => { setShowSuccess(false); onClose(); }}
             className="w-full btn-tactile bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest"
          >
             Voltar para Petições
          </button>
       </div>
    </Modal>
    </>
  );
}
