'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Hospital,
  MapPin,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { createAppointment } from '@/services/appointments.service';
import { createLogger } from '@/lib/logger';

const log = createLogger('AppointmentModal');

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    unit: '',
    unitName: '',
    date: '',
    time: '',
  });

  const specialties = ['Clínico Geral', 'Pediatria', 'Ginecologia', 'Odontologia'];
  const units = [
    { id: 'ubs-felicidade', name: 'UBS Santa Felicidade' },
    { id: 'upa-central', name: 'UPA Central' },
    { id: 'ubs-centro', name: 'UBS Centro' },
  ];
  const availableTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'];
  const availableDates = [
    { day: 'Seg', date: '28 Out' },
    { day: 'Ter', date: '29 Out' },
    { day: 'Qua', date: '30 Out' },
  ];

  const handleConfirm = async () => {
    if (!user) { await login(); return; }
    setLoading(true);
    try {
      await createAppointment({
        userId: user.uid,
        userName: user.displayName || 'Cidadão',
        unitId: formData.unit,
        unitName: formData.unitName,
        specialty: formData.specialty,
        date: formData.date,
        time: formData.time,
        notes: null,
      });
      setSuccess(true);
    } catch {
      toast('Erro ao agendar consulta.', 'error');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setStep(1);
    setSuccess(false);
    setFormData({ specialty: '', unit: '', unitName: '', date: '', time: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={success ? 'Agendamento Confirmado' : 'Novo Agendamento'}>
      <div className="space-y-6">
        {!success && (
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all',
                  step === s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-surface text-text-muted border-2 border-border'
                )}>
                  {s}
                </div>
                {s < 4 && <div className="w-8 h-1 bg-border rounded-full" />}
              </div>
            ))}
          </div>
        )}

        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-semibold text-text-main mb-2 tracking-tight uppercase">Protocolo Gerado!</h4>
            <p className="text-text-muted font-ui font-medium mb-8">
              Agendamento realizado para <strong className="text-text-main">{formData.date} às {formData.time}</strong>.
            </p>
            <button onClick={handleClose} className="w-full btn-tactile bg-text-main text-white py-4 rounded-xl font-semibold uppercase text-xs tracking-widest shadow-lg">
              Voltar
            </button>
          </motion.div>
        ) : step === 1 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-widest pl-1">Escolha a Especialidade</h4>
            <div className="grid grid-cols-1 gap-3">
              {specialties.map((spec) => (
                <button key={spec} onClick={() => { setFormData({ ...formData, specialty: spec }); setStep(2); }}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface rounded-xl text-primary border border-border shadow-sm">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-text-main text-lg tracking-tight">{spec}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : step === 2 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(1)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-widest">Unidade de Atendimento</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {units.map((unit) => (
                <button key={unit.id} onClick={() => { setFormData({ ...formData, unit: unit.id, unitName: unit.name }); setStep(3); }}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface rounded-xl text-primary border border-border shadow-sm">
                      <Hospital className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-text-main text-lg tracking-tight">{unit.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : step === 3 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(2)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-widest">Escolha Data e Hora</h4>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((d) => (
                  <button key={d.date} onClick={() => setFormData({ ...formData, date: d.date })}
                    className={cn('flex-none w-20 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                      formData.date === d.date ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-border text-text-muted')}>
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{d.day}</span>
                    <span className="text-sm font-semibold">{d.date}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((t) => (
                  <button key={t} onClick={() => setFormData({ ...formData, time: t })}
                    className={cn('py-3 rounded-lg border-2 text-[11px] font-semibold tracking-widest transition-all',
                      formData.time === t ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-border text-text-muted hover:border-primary/50')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(4)} className="w-full btn-tactile bg-primary text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-3">
              Continuar <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(3)} className="p-2 hover:bg-surface rounded-lg text-text-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-widest">Confirmar Agendamento</h4>
            </div>
            <div className="bg-surface p-6 rounded-2xl border-2 border-border space-y-4">
              <div className="flex justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted uppercase">Especialidade</span>
                  <p className="text-xl font-semibold text-text-main uppercase">{formData.specialty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="font-bold">{formData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-bold">{formData.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-bold">{formData.unitName}</span>
              </div>
            </div>
            <button onClick={handleConfirm} disabled={loading}
              className="w-full btn-tactile bg-primary text-white py-5 rounded-xl text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentModal;
