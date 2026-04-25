'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  CheckCircle2,
  AlertCircle,
  Hospital,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    unit: '',
    date: '28/10/2026',
    time: '10:30'
  });

  const specialties = [
    { name: 'Clínico Geral', icon: Stethoscope },
    { name: 'Pediatria', icon: Hospital },
    { name: 'Ginecologia', icon: Hospital },
    { name: 'Odontologia', icon: Stethoscope },
  ];

  const units = [
    { name: 'UBS Santa Felicidade', distance: '1.2 km' },
    { name: 'UPA Central', distance: '3.5 km' },
    { name: 'UBS Centro', distance: '4.1 km' },
  ];

  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'
  ];

  const availableDates = [
    { day: 'Seg', date: '28 Out' },
    { day: 'Ter', date: '29 Out' },
    { day: 'Qua', date: '30 Out' },
    { day: 'Qui', date: '31 Out' },
  ];

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(5);
      toast('Consulta agendada com sucesso!', 'success');
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ specialty: '', unit: '', date: '28/10/2026', time: '10:30' });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={step === 5 ? "Agendamento Confirmado" : "Novo Agendamento"}
    >
      <div className="space-y-6">
        
        {/* Step Indicator */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all",
                  step === s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-surface text-text-muted border-2 border-border"
                )}>
                  {s}
                </div>
                {s < 4 && <div className="w-8 h-1 bg-border rounded-full" />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Specialty */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Escolha a Especialidade</h4>
              <div className="grid grid-cols-1 gap-3">
                {specialties.map((spec) => (
                  <button 
                    key={spec.name}
                    onClick={() => {
                      setFormData({ ...formData, specialty: spec.name });
                      setStep(2);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-surface rounded-xl text-primary border border-border group-hover:border-primary/30 shadow-sm">
                        <spec.icon className="w-6 h-6" />
                      </div>
                      <span className="font-black text-text-main text-lg tracking-tight">{spec.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Unit */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                 <button onClick={() => setStep(1)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Unidade de Atendimento</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {units.map((unit) => (
                  <button 
                    key={unit.name}
                    onClick={() => {
                      setFormData({ ...formData, unit: unit.name });
                      setStep(3);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-surface rounded-xl text-primary border border-border group-hover:border-primary/30 shadow-sm">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-text-main text-lg tracking-tight leading-none mb-1">{unit.name}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{unit.distance} de distância</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                 <button onClick={() => setStep(2)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Escolha Data e Hora</h4>
              </div>

              <div className="space-y-4">
                 <div className="flex gap-2 overflow-x-auto pb-2">
                    {availableDates.map((d) => (
                       <button
                          key={d.date}
                          onClick={() => setFormData({ ...formData, date: d.date })}
                          className={cn(
                             "flex-none w-20 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                             formData.date === d.date ? "bg-primary border-primary text-white shadow-lg" : "bg-white border-border text-text-muted"
                          )}
                       >
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.day}</span>
                          <span className="text-sm font-black">{d.date}</span>
                       </button>
                    ))}
                 </div>

                 <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((t) => (
                       <button
                          key={t}
                          onClick={() => setFormData({ ...formData, time: t })}
                          className={cn(
                             "py-3 rounded-lg border-2 text-[11px] font-black tracking-widest transition-all",
                             formData.time === t ? "bg-primary border-primary text-white shadow-md" : "bg-white border-border text-text-muted hover:border-primary/50"
                          )}
                       >
                          {t}
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={() => setStep(4)}
                className="w-full btn-tactile bg-primary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 4: Confirm */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                 <button onClick={() => setStep(3)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Confirmação de Horário</h4>
              </div>

              <div className="bg-surface p-6 rounded-2xl border-2 border-border shadow-inner space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Especialidade</span>
                      <span className="text-xl font-black text-text-main tracking-tight uppercase">{formData.specialty}</span>
                   </div>
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border shadow-sm text-primary">
                      <Stethoscope className="w-6 h-6" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Data</span>
                      <div className="flex items-center gap-2 text-text-main font-bold">
                         <Calendar className="w-4 h-4 text-primary" />
                         {formData.date}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Hora</span>
                      <div className="flex items-center gap-2 text-text-main font-bold">
                         <Clock className="w-4 h-4 text-primary" />
                         {formData.time}
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Local</span>
                   <div className="flex items-center gap-2 text-text-main font-bold">
                      <MapPin className="w-4 h-4 text-primary" />
                      {formData.unit}
                   </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border-2 border-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 font-bold font-ui uppercase tracking-tight leading-tight">
                  Importante: Traga seu Cartão do SUS e documento oficial com foto.
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full btn-tactile bg-primary text-white py-5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirmar Agendamento 
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-text-main mb-2 tracking-tight uppercase">Protocolo Gerado!</h4>
              <p className="text-text-muted font-ui font-medium mb-8">
                Agendamento realizado para <strong className="text-text-main">{formData.date} às {formData.time}</strong> na <strong className="text-text-main">{formData.unit}</strong>.
              </p>
              <div className="bg-surface p-4 rounded-xl border-2 border-border border-dashed mb-8">
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Senha de Atendimento</span>
                 <span className="text-3xl font-black text-primary tracking-[0.2em]">GC-8812</span>
              </div>
              <button 
                onClick={handleClose}
                className="w-full btn-tactile bg-text-main text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg"
              >
                Voltar à Página Inicial
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default AppointmentModal;

