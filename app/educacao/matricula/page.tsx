'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  Info,
  Loader2,
  School,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { useContent } from '@/lib/hooks/use-content';
import type { EducationSchool } from '@/types';
import { createEnrollment } from '@/services/educacao.service';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Responsavel', icon: User },
  { id: 2, title: 'Aluno(a)', icon: FileText },
  { id: 3, title: 'Endereco', icon: Home },
  { id: 4, title: 'Unidade', icon: School },
  { id: 5, title: 'Confirmação', icon: CheckCircle2 },
] as const;

const FALLBACK_SCHOOLS = [
  'E.M.E.F. Monteiro Lobato',
  'E.M. Joao Paulo II',
  'C.E.I. Ciranda da Crianca',
  'E.M.E.F. Santa Maria',
  'C.E.I. Pequeno Aprendiz',
];

const emptyForm = {
  parentName: '',
  parentCpf: '',
  studentName: '',
  studentBirth: '',
  cep: '',
  address: '',
  schoolPreference: '',
};

type FormData = typeof emptyForm;
type FormField = keyof FormData;

export default function MatriculaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const { data: firestoreSchools } = useContent<EducationSchool>('education_schools');
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const schools = useMemo(
    () =>
      firestoreSchools && firestoreSchools.length > 0
        ? firestoreSchools.map((s) => s.title)
        : FALLBACK_SCHOOLS,
    [firestoreSchools],
  );
  const [protocol, setProtocol] = useState('');
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const updateField = (field: FormField, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.parentName.trim() && formData.parentCpf.trim());
      case 2:
        return Boolean(formData.studentName.trim() && formData.studentBirth.trim());
      case 3:
        return Boolean(formData.address.trim());
      case 4:
        return Boolean(formData.schoolPreference.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!canProceed()) {
      toast('Preencha os campos obrigatórios desta etapa.', 'error');
      return;
    }
    if (currentStep < 5) setCurrentStep((step) => step + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast('Revise os dados antes de finalizar.', 'error');
      return;
    }

    if (!user) {
      try {
        await login();
      } catch (error) {
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    setSubmitting(true);
    try {
      const enrollmentProtocol = await createEnrollment({
        userId: user.uid,
        parentName: formData.parentName.trim(),
        parentCpf: formData.parentCpf.trim(),
        studentName: formData.studentName.trim(),
        studentBirth: formData.studentBirth,
        address: formData.address.trim(),
        cep: formData.cep.trim(),
        schoolPreference: formData.schoolPreference,
      });
      setProtocol(enrollmentProtocol);
      setSubmitted(true);
      toast('Solicitação de matrícula enviada.', 'success');
    } catch {
      toast('Erro ao enviar solicitação. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-12 p-6 pb-32 md:p-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => router.push('/educacao')}
          className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Voltar para Educação
        </button>
        <div className="flex items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Conexao segura SSL</span>
        </div>
      </div>

      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-semibold uppercase leading-none tracking-tighter text-text-main md:text-5xl">
          Solicitação de <br />
          <span className="text-primary">Matrícula 2026.</span>
        </h1>
        <p className="font-ui max-w-xl text-sm font-medium text-text-muted">
          Preencha os dados abaixo para iniciar o processo de vinculação escolar na rede municipal.
        </p>
      </div>

      <div className="relative flex items-center justify-between rounded-[2.5rem] border-2 border-border bg-white p-8 shadow-sm">
        <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 border-y border-border bg-surface" />
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-500',
                currentStep >= step.id
                  ? 'scale-110 border-primary bg-primary text-white shadow-lg shadow-primary/20'
                  : 'border-border bg-white text-text-muted',
              )}
            >
              <step.icon className="h-6 w-6" />
            </div>
            <span
              className={cn(
                'hidden text-[9px] font-semibold uppercase tracking-widest md:block',
                currentStep >= step.id ? 'text-primary' : 'text-text-muted opacity-50',
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="flex min-h-[400px] flex-col rounded-[3.5rem] border-2 border-border bg-white p-8 shadow-2xl md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            {currentStep === 1 && (
              <FormStep title="Dados do responsavel">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TextField
                    label="Nome completo"
                    placeholder="Ex: Joao da Silva"
                    value={formData.parentName}
                    onChange={(value) => updateField('parentName', value)}
                  />
                  <TextField
                    label="CPF do responsavel"
                    placeholder="000.000.000-00"
                    value={formData.parentCpf}
                    onChange={(value) => updateField('parentCpf', value)}
                  />
                </div>
              </FormStep>
            )}

            {currentStep === 2 && (
              <FormStep title="Dados do aluno(a)">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TextField
                    label="Nome da crianca/jovem"
                    placeholder="Nome completo"
                    value={formData.studentName}
                    onChange={(value) => updateField('studentName', value)}
                  />
                  <TextField
                    label="Data de nascimento"
                    type="date"
                    value={formData.studentBirth}
                    onChange={(value) => updateField('studentBirth', value)}
                  />
                </div>
              </FormStep>
            )}

            {currentStep === 3 && (
              <FormStep title="Endereco de residencia">
                <div className="space-y-4">
                  <TextField
                    label="CEP"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(value) => updateField('cep', value)}
                  />
                  <TextField
                    label="Logradouro, número, bairro"
                    placeholder="Rua Exemplo, 123, Centro"
                    value={formData.address}
                    onChange={(value) => updateField('address', value)}
                  />
                  <p className="font-ui text-[10px] font-bold text-text-muted">
                    O zoneamento escolar e baseado no endereco de residencia do aluno.
                  </p>
                </div>
              </FormStep>
            )}

            {currentStep === 4 && (
              <FormStep title="Unidade pretendida">
                <div className="grid grid-cols-1 gap-4">
                  {schools.map((school) => (
                    <button
                      key={school}
                      type="button"
                      onClick={() => updateField('schoolPreference', school)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl border-2 p-6 text-xs font-semibold uppercase tracking-tight transition-all',
                        formData.schoolPreference === school
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-surface text-text-muted hover:border-primary/50',
                      )}
                    >
                      {school}
                      {formData.schoolPreference === school && <CheckCircle2 className="h-5 w-5" />}
                    </button>
                  ))}
                </div>
              </FormStep>
            )}

            {currentStep === 5 && (
              <div className="space-y-8 py-6 text-center">
                {submitted ? (
                  <SuccessView protocol={protocol} onBack={() => router.push('/educacao')} />
                ) : (
                  <ReviewView formData={formData} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-12">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || submitted}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-4 text-[10px] font-semibold uppercase tracking-widest transition-all',
              currentStep === 1 || submitted
                ? 'pointer-events-none opacity-0'
                : 'border-2 border-border bg-surface text-text-muted hover:border-primary hover:text-primary',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          {submitted ? null : (
            <button
              type="button"
              onClick={currentStep === 5 ? handleSubmit : nextStep}
              disabled={!canProceed() || submitting}
              className={cn(
                'flex items-center gap-2 rounded-xl bg-primary px-10 py-5 text-xs font-semibold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all',
                canProceed() && !submitting ? 'hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-50',
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : currentStep === 5 ? (
                <>
                  Finalizar solicitação
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Proximo passo
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormStep({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="border-b border-border pb-4 text-2xl font-semibold text-text-main">{title}</h3>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-2 border-border bg-surface p-4 text-sm font-bold outline-none transition-all focus:border-primary"
      />
    </label>
  );
}

function ReviewView({ formData }: { formData: FormData }) {
  return (
    <>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-primary/10 text-primary shadow-xl">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-semibold tracking-tight text-text-main">Quase la</h3>
        <p className="font-ui mx-auto max-w-sm text-sm font-medium text-text-muted">
          Ao finalizar, sua solicitação será enviada para a central de vagas da Secretaria de Educação.
        </p>
      </div>
      <div className="space-y-2 rounded-3xl border-2 border-dashed border-border bg-surface p-4 text-left">
        <ReviewRow label="Responsavel" value={formData.parentName} />
        <ReviewRow label="Aluno(a)" value={formData.studentName} />
        <ReviewRow label="Nascimento" value={formData.studentBirth} />
        <ReviewRow label="Escola" value={formData.schoolPreference} />
      </div>
      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border bg-surface p-6">
        <Info className="h-6 w-6 text-primary" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Lembre-se de apresentar os documentos físicos na unidade escolar após convocação.
        </p>
      </div>
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[10px] font-bold text-text-muted">{label}:</span>
      <span className="text-right text-xs font-semibold">{value}</span>
    </div>
  );
}

function SuccessView({ protocol, onBack }: { protocol: string; onBack: () => void }) {
  return (
    <>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-green-500/10 text-green-500 shadow-xl">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-semibold tracking-tight text-text-main">Solicitacao enviada</h3>
        <p className="font-ui mx-auto max-w-sm text-sm font-medium text-text-muted">
          Sua solicitação de matrícula foi registrada na Secretaria de Educação.
        </p>
      </div>
      <div className="rounded-3xl border-2 border-dashed border-border bg-surface p-6">
        <div className="flex items-center justify-center gap-3">
          <ClipboardList className="h-6 w-6 text-primary" />
          <div className="text-left">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Protocolo</p>
            <p className="font-mono text-xl font-semibold tracking-wider text-text-main">{protocol}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl bg-primary px-10 py-5 text-xs font-semibold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
      >
        Voltar para Educação
      </button>
    </>
  );
}
