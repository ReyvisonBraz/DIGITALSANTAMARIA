'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  HardHat,
  Leaf,
  Loader2,
  LogIn,
  MoreHorizontal,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { createReport, waitForReportProtocol } from '@/services/reports.service';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import PhotoUpload from './PhotoUpload';
import LocationPicker from './LocationPicker';
import type { GeoLocation, ReportType } from '@/types';

const log = createLogger('ReportForm');

const REPORT_TYPES: { value: ReportType; label: string; hint: string; icon: LucideIcon }[] = [
  { value: 'infrastructure', label: 'Infraestrutura', hint: 'Buracos, iluminação, calçadas', icon: HardHat },
  { value: 'environment', label: 'Meio ambiente', hint: 'Lixo, descarte, áreas verdes', icon: Leaf },
  { value: 'security', label: 'Segurança', hint: 'Riscos, pontos perigosos', icon: Shield },
  { value: 'other', label: 'Outro', hint: 'Qualquer outra ocorrência', icon: MoreHorizontal },
];

const MIN_TITLE = 5;
const MIN_DESCRIPTION = 10;

export default function ReportForm() {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [type, setType] = useState<ReportType>('infrastructure');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [photoURL, setPhotoURL] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState('Enviando...');
  const [createdProtocol, setCreatedProtocol] = useState<string | null>(null);
  const protocolCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (protocolCleanup.current) protocolCleanup.current();
    };
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAddress('');
    setLocation(null);
    setPhotoURL('');
    setCreatedProtocol(null);
    setSubmitLabel('Enviando...');
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      log.error('Login failed before report creation', {}, error);
      toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    if (title.trim().length < MIN_TITLE) {
      toast(`Dê um título com pelo menos ${MIN_TITLE} caracteres.`, 'error');
      return;
    }
    if (description.trim().length < MIN_DESCRIPTION) {
      toast(`Descreva o problema com pelo menos ${MIN_DESCRIPTION} caracteres.`, 'error');
      return;
    }
    if (photoURL.trim() && !photoURL.trim().startsWith('https://')) {
      toast('Informe um link público de imagem iniciando com https://.', 'error');
      return;
    }

    const trimmedAddress = address.trim();
    const finalLocation: GeoLocation | null = location
      ? { ...location, address: location.address || trimmedAddress }
      : trimmedAddress
        ? { lat: 0, lng: 0, address: trimmedAddress }
        : null;

    setSubmitting(true);
    setSubmitLabel('Enviando relato...');
    try {
      const id = await createReport({
        reporterId: user.uid,
        reporterName: user.displayName || 'Cidadão',
        type,
        title: title.trim(),
        description: description.trim(),
        location: finalLocation,
        isPetition: false,
        photoURL: photoURL.trim() || undefined,
      });
      log.info('Report created', { id, type });
      setSubmitLabel('Finalizando protocolo...');

      // Aguarda protocolo real da Cloud Function
      protocolCleanup.current = waitForReportProtocol(id, (protocol) => {
        setCreatedProtocol(protocol);
        setSubmitting(false);
        toast('Relato enviado. Acompanhe pelo seu painel.', 'success');
      });
      return;
    } catch (error) {
      log.error('Failed to create report', {}, error);
      const message = error instanceof Error && error.message
        ? error.message
        : 'Não foi possível enviar agora. Tente novamente em instantes.';
      toast(message, 'error');
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="civic-card flex flex-col items-start gap-4 p-6">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-success/15 text-accent-success">
          <LogIn className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-normal text-text-main">Entre para relatar</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
            Relatos são identificados para que o município possa retornar com a solução. Use sua conta Google para entrar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="action-button-primary"
        >
          <LogIn className="h-4 w-4" />
          Entrar com Google
        </button>
      </div>
    );
  }

  if (createdProtocol) {
    return (
      <div className="civic-card space-y-4 p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50/90 p-4 text-green-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Relato registrado com sucesso.</p>
            <p className="mt-1 break-all font-mono text-base font-semibold text-green-800 sm:text-lg">
              {createdProtocol}
            </p>
            <p className="mt-2 text-xs font-medium leading-5 text-green-900/80">
              A equipe responsável recebeu o aviso. Você acompanha a resposta no seu painel.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/perfil" className="action-button-primary">
            Ver no painel
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={resetForm} className="action-button-secondary">
            Enviar outro relato
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-[11px] font-black uppercase tracking-widest text-text-main">
          Tipo de ocorrência
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {REPORT_TYPES.map((option) => {
            const Icon = option.icon;
            const active = option.value === type;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                aria-pressed={active}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition',
                  active
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-white hover:border-primary/40',
                )}
              >
                <span className={cn(
                  'grid h-9 w-9 place-items-center rounded-xl transition',
                  active ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                )}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold leading-tight text-text-main">{option.label}</span>
                <span className="text-[10px] font-medium leading-4 text-text-muted">{option.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="report-title" className="text-[11px] font-black uppercase tracking-widest text-text-main">
          Título curto
        </label>
        <input
          id="report-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          placeholder="Ex: Buraco grande na Av. Brasil"
          className="w-full rounded-xl border-2 border-border bg-white p-4 font-bold text-text-main outline-none transition focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="report-description" className="text-[11px] font-black uppercase tracking-widest text-text-main">
          Descreva a situação
        </label>
        <textarea
          id="report-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          required
          rows={5}
          placeholder="Conte o que está acontecendo, quando começou e a quem afeta."
          className="w-full rounded-xl border-2 border-border bg-white p-4 font-medium leading-6 text-text-main outline-none transition focus:border-primary"
        />
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {description.length}/1000
        </p>
      </div>

      <LocationPicker
        value={address}
        location={location}
        onChange={(nextAddress, nextLocation) => {
          setAddress(nextAddress);
          setLocation(nextLocation);
        }}
      />

      <PhotoUpload
        imageURL={photoURL}
        onImageURLChange={setPhotoURL}
      />

      <button
        type="submit"
        disabled={submitting}
        className="action-button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {submitLabel}
          </>
        ) : (
          <>
            Enviar relato
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
