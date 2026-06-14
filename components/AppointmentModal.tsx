'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Hospital,
  Loader2,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { createAppointment } from '@/services/appointments.service';
import { createLogger } from '@/lib/logger';
import type { HealthUnit } from '@/types';

const log = createLogger('AppointmentModal');

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: HealthUnit[];
  initialUnit?: HealthUnit | null;
}

const availableTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'];

function getNextBusinessDates(count = 5) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
  const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
  const dates: { day: string; label: string; value: string }[] = [];
  const current = new Date();
  current.setDate(current.getDate() + 1);

  while (dates.length < count) {
    const weekday = current.getDay();
    if (weekday !== 0 && weekday !== 6) {
      dates.push({
        day: weekdayFormatter.format(current).replace('.', ''),
        label: formatter.format(current).replace('.', ''),
        value: current.toISOString().slice(0, 10),
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, units, initialUnit = null }) => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    unit: initialUnit?.id || '',
    unitName: initialUnit?.name || '',
    date: '',
    time: '',
  });
  const availableDates = useMemo(() => getNextBusinessDates(), []);
  const selectedUnit = units.find((unit) => unit.id === formData.unit) || initialUnit || null;
  const specialties = selectedUnit?.specialties?.length
    ? selectedUnit.specialties
    : Array.from(new Set(units.flatMap((unit) => unit.specialties || [])));

  useEffect(() => {
    if (!isOpen) return;
    setFormData((previous) => ({
      ...previous,
      unit: initialUnit?.id || previous.unit,
      unitName: initialUnit?.name || previous.unitName,
    }));
  }, [initialUnit, isOpen]);

  const handleConfirm = async () => {
    if (!formData.specialty || !formData.unit || !formData.date || !formData.time) {
      toast('Escolha especialidade, unidade, data e horario.', 'error');
      return;
    }

    if (!user) {
      try {
        await login();
      } catch (error) {
        log.error('Login failed before appointment creation', {}, error);
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

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
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSuccess(false);
    setFormData({
      specialty: '',
      unit: initialUnit?.id || '',
      unitName: initialUnit?.name || '',
      date: '',
      time: '',
    });
    onClose();
  };

  const goToReview = () => {
    if (!formData.date || !formData.time) {
      toast('Escolha data e horario para continuar.', 'error');
      return;
    }
    setStep(4);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={success ? 'Agendamento confirmado' : 'Novo agendamento'}>
      <div className="space-y-6">
        {!success && (
          <div className="mb-8 flex items-center justify-between">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    step === item
                      ? 'scale-110 bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border-2 border-border bg-surface text-text-muted',
                  )}
                >
                  {item}
                </div>
                {item < 4 && <div className="h-1 w-8 rounded-full bg-border" />}
              </div>
            ))}
          </div>
        )}

        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-100 bg-green-50 text-green-600 shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="mb-2 text-2xl font-semibold uppercase tracking-tight text-text-main">Protocolo gerado</h4>
            <p className="font-ui mb-8 font-medium text-text-muted">
              Agendamento realizado para <strong className="text-text-main">{formData.date} as {formData.time}</strong>.
            </p>
            <button onClick={handleClose} className="btn-tactile w-full rounded-xl bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-lg">
              Voltar
            </button>
          </motion.div>
        ) : step === 1 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h4 className="pl-1 text-xs font-semibold uppercase tracking-widest text-text-muted">Escolha a especialidade</h4>
            {specialties.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-surface p-6 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
                Nenhuma especialidade disponivel no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {specialties.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, specialty });
                    setStep(formData.unit ? 3 : 2);
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border-2 border-border p-4 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-border bg-surface p-3 text-primary shadow-sm">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-text-main">{specialty}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-muted transition-colors group-hover:text-primary" />
                </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : step === 2 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-2">
              <button type="button" onClick={() => setStep(1)} aria-label="Voltar para escolha de serviço" className="rounded-lg p-2 text-text-muted hover:bg-surface">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Unidade de atendimento</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {units.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border bg-surface p-6 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Nenhuma unidade disponivel no momento.
                </div>
              ) : units.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => {
                    const keepSpecialty = unit.specialties.includes(formData.specialty);
                    setFormData({
                      ...formData,
                      unit: unit.id,
                      unitName: unit.name,
                      specialty: keepSpecialty ? formData.specialty : '',
                    });
                    if (!keepSpecialty) {
                      setStep(1);
                      return;
                    }
                    setStep(3);
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border-2 border-border p-4 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-border bg-surface p-3 text-primary shadow-sm">
                      <Hospital className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-text-main">{unit.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-muted transition-colors group-hover:text-primary" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : step === 3 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="mb-2 flex items-center gap-2">
              <button type="button" onClick={() => setStep(2)} aria-label="Voltar para escolha de unidade" className="rounded-lg p-2 text-text-muted hover:bg-surface">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Escolha data e hora</h4>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((dateOption) => (
                  <button
                    key={dateOption.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, date: dateOption.value })}
                    className={cn(
                      'flex w-20 flex-none flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all',
                      formData.date === dateOption.value
                        ? 'border-primary bg-primary text-white shadow-lg'
                        : 'border-border bg-white text-text-muted',
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{dateOption.day}</span>
                    <span className="text-sm font-semibold">{dateOption.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, time })}
                    className={cn(
                      'rounded-lg border-2 py-3 text-[11px] font-semibold tracking-widest transition-all',
                      formData.time === time
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-border bg-white text-text-muted hover:border-primary/50',
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={goToReview} className="btn-tactile flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-white">
              Continuar <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="mb-2 flex items-center gap-2">
              <button type="button" onClick={() => setStep(3)} aria-label="Voltar para escolha de data" className="rounded-lg p-2 text-text-muted hover:bg-surface">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Confirmar agendamento</h4>
            </div>
            <div className="space-y-4 rounded-2xl border-2 border-border bg-surface p-6">
              <div className="border-b border-border pb-4">
                <span className="text-[10px] font-semibold uppercase text-text-muted">Especialidade</span>
                <p className="text-xl font-semibold uppercase text-text-main">{formData.specialty}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="font-bold">{formData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-bold">{formData.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-bold">{formData.unitName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="btn-tactile flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-5 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {loading ? 'Agendando...' : 'Confirmar agendamento'}
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentModal;
