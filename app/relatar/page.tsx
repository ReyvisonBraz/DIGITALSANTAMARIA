'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Gavel, 
  AlertCircle, 
  CheckCircle2, 
  Megaphone, 
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';
import { createReport } from '@/services/reports.service';
import { uploadReportPhoto } from '@/services/storage.service';
import LocationPicker from '@/features/relatar/LocationPicker';
import PhotoUpload from '@/features/relatar/PhotoUpload';
import type { ReportType, GeoLocation } from '@/types';

const log = createLogger('RelatarPage');

const categoryMap: Record<string, ReportType> = {
  infra: 'infrastructure',
  saude: 'other',
  seguranca: 'security',
  ambiente: 'environment',
  transito: 'other',
};

export default function RelatarPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    isPetition: false,
  });

  const categories = [
    { id: 'infra', label: 'Infraestrutura', icon: '🚧' },
    { id: 'saude', label: 'Saúde Pública', icon: '🏥' },
    { id: 'seguranca', label: 'Segurança', icon: '🛡️' },
    { id: 'ambiente', label: 'Meio Ambiente', icon: '🌳' },
    { id: 'transito', label: 'Trânsito', icon: '🚦' },
  ];

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.category) {
        log.warn('Validation failed: no category selected', { step: currentStep });
        toast('Selecione uma categoria', 'error');
        return false;
      }
      if (formData.title.length < 5) {
        log.warn('Validation failed: title too short', { step: currentStep, length: formData.title.length });
        toast('O título deve ter pelo menos 5 caracteres', 'error');
        return false;
      }
    }
    if (currentStep === 2) {
      if (formData.description.length < 10) {
        log.warn('Validation failed: description too short', { step: currentStep, length: formData.description.length });
        toast('A descrição deve ter pelo menos 10 caracteres', 'error');
        return false;
      }
      if (!formData.location && !geoLocation) {
        log.warn('Validation failed: no location', { step: currentStep });
        toast('Informe a localização aproximada', 'error');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!user) {
      log.info('Submit blocked: user not authenticated');
      return login();
    }
    if (!validateStep(step)) return;
    
    setLoading(true);
    log.info('Submitting report', { category: formData.category, title: formData.title });
    
    try {
      let photo = null;
      if (photoFile) {
        photo = await uploadReportPhoto(user.uid, photoFile);
      }

      await createReport({
        reporterId: user.uid,
        reporterName: user.displayName || 'Cidadão',
        type: categoryMap[formData.category] || 'other',
        title: formData.title,
        description: formData.description,
        location: geoLocation,
        isPetition: formData.isPetition,
      });
      
      log.info('Report submitted successfully', { category: formData.category });
      setShowSuccessModal(true);
      setFormData({ title: '', category: '', description: '', location: '', isPetition: false });
      setPhotoFile(null);
      setPhotoPreview(null);
      setGeoLocation(null);
      setStep(1);
    } catch (error) {
      log.error('Failed to submit report', { category: formData.category }, error);
      toast('Erro ao enviar relato oficial.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-32">
        
        {/* Step Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">ETAPA {step} DE 3</span>
              <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tighter uppercase">
                {step === 1 && 'O Que Está Acontecendo?'}
                {step === 2 && 'Detalhes e Localização'}
                {step === 3 && 'Finalizar Registro'}
              </h2>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Progresso</span>
              <span className="text-xl font-black text-primary">{Math.round((step / 3) * 100)}%</span>
            </div>
          </div>
          
          <div className="h-3 w-full bg-border rounded-full overflow-hidden shadow-inner border border-white/50">
            <motion.div 
              initial={false}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-primary-light transition-all"
            />
          </div>
        </div>

        {/* Identity Section (Gated) */}
        {!user && step === 1 && (
          <section className="bg-white p-6 md:p-8 rounded-2xl border-2 border-border shadow-sm flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
               <UserIcon className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-text-main uppercase tracking-tight">Login Necessário</h3>
              <p className="text-sm font-medium text-text-muted font-ui">Para garantir a autenticidade dos relatos, conecte sua conta.</p>
            </div>
            <button 
              onClick={login}
              className="w-full max-w-sm flex items-center justify-center gap-3 py-4 bg-white border-2 border-border rounded-xl font-bold hover:bg-surface transition-all active:scale-95 shadow-sm"
            >
               <div className="relative w-5 h-5">
                  <Image src="https://www.google.com/favicon.ico" alt="Google" fill className="object-contain" />
               </div>
              Login com Google
            </button>
          </section>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: CATEGORY AND TITLE */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="font-black text-text-main text-[11px] uppercase tracking-widest flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Qual a natureza do problema?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: c.id })}
                        className={cn(
                          "py-4 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex flex-col items-center gap-2 shadow-sm",
                          formData.category === c.id 
                            ? "bg-primary border-primary text-white scale-[1.02] shadow-primary/20" 
                            : "bg-white border-border text-text-muted hover:border-primary/30"
                        )}
                      >
                        <span className="text-2xl">{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-black text-text-main text-[11px] uppercase tracking-widest">Dê um título curto ao relato</label>
                  <input
                    required
                    placeholder="Ex: Vazamento de água na calçada"
                    className="w-full p-4 bg-white border-b-4 border-primary/20 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-xl text-text-main placeholder:opacity-40"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DESCRIPTION AND LOCATION */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <LocationPicker
                  value={formData.location}
                  location={geoLocation}
                  onChange={(address, loc) => {
                    setFormData({ ...formData, location: address });
                    setGeoLocation(loc);
                  }}
                />

                <div className="flex flex-col gap-3">
                  <label className="font-black text-text-main text-[11px] uppercase tracking-widest">O que está acontecendo? (Mín. 10 letras)</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Descreva a situação detalhadamente..."
                    className="w-full p-5 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none transition-all font-ui font-medium text-text-main placeholder:opacity-40 resize-none shadow-sm"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: MEDIA AND PETITION */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <PhotoUpload
                  file={photoFile}
                  previewUrl={photoPreview}
                  onFileChange={(file, preview) => {
                    setPhotoFile(file);
                    setPhotoPreview(preview);
                  }}
                />
                
                <div 
                  onClick={() => setFormData({ ...formData, isPetition: !formData.isPetition })}
                  className={cn(
                    "p-6 rounded-2xl border-l-[12px] flex items-start gap-4 shadow-sm cursor-pointer transition-all border select-none",
                    formData.isPetition 
                      ? "bg-tertiary/5 border-tertiary" 
                      : "bg-surface-container border-border/50 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors",
                    formData.isPetition ? "bg-tertiary border-tertiary text-white" : "bg-white border-border text-transparent"
                  )}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-black text-lg tracking-tight text-text-main uppercase flex items-center gap-2">
                       Tornar Petição Pública
                       <Megaphone className="w-4 h-4 text-tertiary" />
                    </span>
                    <p className="text-xs text-text-muted font-medium font-ui leading-relaxed">
                      Ao atingir 1.000 assinaturas, este pedido é protocolado automaticamente para discussão orçamentária municipal.
                    </p>
                  </div>
                </div>

                <div className="bg-rose-50 text-rose-700 p-5 rounded-xl flex items-start gap-3 border border-rose-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-tight uppercase tracking-tight">
                    Relatos falsos estão sujeitos a sanções legais. Registre apenas o que for real.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t-2 border-border z-40 md:static md:bg-transparent md:border-0 md:p-0">
          <div className="max-w-2xl mx-auto flex gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="flex-[0.3] btn-tactile bg-white border-2 border-border text-text-muted py-4 md:py-5 rounded-xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                className="flex-1 btn-tactile bg-primary text-white py-4 md:py-5 font-black text-xs md:text-sm tracking-widest uppercase flex items-center justify-center gap-3"
              >
                 Próxima Etapa
                 <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading || !user}
                className="flex-1 btn-tactile bg-primary text-white py-4 md:py-5 font-black text-xs md:text-sm tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {loading ? 'Processando envio...' : (
                   <>
                     ENVIAR RELATO OFICIAL
                     <Send className="w-5 h-5" />
                   </>
                 )}
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Relato Recebido"
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">O protocolo foi gerado!</h3>
          <p className="text-text-muted font-ui font-medium mb-8">
            Sua solicitação será analisada pela equipe técnica municipal em até 72 horas úteis.
          </p>
          
          <div className="bg-surface-container rounded-2xl p-6 w-full border-2 border-border mb-8 shadow-inner">
             <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Status do Registro</span>
             <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-primary tracking-tighter">AGUARDANDO ANALISE</span>
                <span className="bg-white px-3 py-1 rounded-lg border border-border text-[10px] font-black uppercase">Pendente</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => { setShowSuccessModal(false); setStep(1); }}
              className="btn-tactile bg-surface border-2 border-border text-text-muted px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Novo Relato
            </button>
            <button 
              onClick={() => router.push('/')}
              className="btn-tactile bg-primary text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Voltar ao Início
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>

      <footer className="pt-8 pb-32 md:pb-12 text-center hidden md:flex flex-col items-center gap-4 border-t border-border/30 opacity-50">
        <div className="inline-flex items-center gap-2 text-text-muted font-black text-[10px] tracking-widest uppercase">
          <Gavel className="w-4 h-4" />
          Prefeitura Digital • Zeladoria Participativa
        </div>
      </footer>
    </div>
  );
}

