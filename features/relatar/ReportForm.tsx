'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HardHat,
  ImageIcon,
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
  const [isReviewing, setIsReviewing] = useState(false);
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
    setIsReviewing(false);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      log.error('Login failed before report creation', {}, error);
      toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
    }
  };

  const buildReportPayload = (showErrors = true) => {
    if (title.trim().length < MIN_TITLE) {
      if (showErrors) toast(`Dê um título com pelo menos ${MIN_TITLE} caracteres.`, 'error');
      return null;
    }
    if (description.trim().length < MIN_DESCRIPTION) {
      if (showErrors) toast(`Descreva o problema com pelo menos ${MIN_DESCRIPTION} caracteres.`, 'error');
      return null;
    }
    if (photoURL.trim() && !photoURL.trim().startsWith('https://')) {
      if (showErrors) toast('Informe um link público de imagem iniciando com https://.', 'error');
      return null;
    }

    const trimmedAddress = address.trim();
    const finalLocation: GeoLocation | null = location
      ? { ...location, address: location.address || trimmedAddress }
      : trimmedAddress
        ? { lat: 0, lng: 0, address: trimmedAddress }
        : null;

    return {
      title: title.trim(),
      description: description.trim(),
      location: finalLocation,
      photoURL: photoURL.trim() || undefined,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    if (!isReviewing) {
      if (!buildReportPayload()) return;
      setIsReviewing(true);
      return;
    }

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
      <div className="civic-card flex flex-col items-start gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="flex w-full items-center justify-between gap-3 sm:block">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-success/15 text-accent-success sm:h-12 sm:w-12">
            <LogIn className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="action-button-primary min-h-11 px-4 py-2 sm:hidden"
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </button>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold tracking-normal text-text-main">Entre para relatar</h3>
          <p className="mt-1 hidden text-sm font-medium leading-6 text-text-muted sm:block">
            Relatos são identificados para que o município possa retornar com a solução. Use sua conta Google para entrar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="action-button-primary hidden min-h-11 px-4 py-2 sm:inline-flex"
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

  const reviewPayload = buildReportPayload(false);
  const selectedType = REPORT_TYPES.find((option) => option.value === type) ?? REPORT_TYPES[0];

  if (isReviewing && reviewPayload) {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-primary">Revisão final</p>
          <h3 className="mt-2 text-xl font-semibold tracking-normal text-text-main">Confira antes de publicar</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-text-muted">
            Depois do envio, o relato original fica preservado. Se precisar corrigir algo agora, volte para editar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReviewItem label="Tipo" value={selectedType.label} />
          <ReviewItem label="Título" value={reviewPayload.title} />
          <ReviewItem label="Local" value={reviewPayload.location?.address || 'Sem local informado'} />
          <ReviewItem label="Foto" value={reviewPayload.photoURL ? 'Foto anexada' : 'Sem foto'} />
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted">Descrição</p>
          <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-main">
            {reviewPayload.description}
          </p>
        </div>

        {reviewPayload.photoURL ? (
          <div className="relative h-56 overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={reviewPayload.photoURL}
              alt="Foto anexada ao relato"
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-white text-sm font-bold text-text-muted">
            <ImageIcon className="h-5 w-5" />
            Nenhuma foto anexada
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setIsReviewing(false)}
            disabled={submitting}
            className="action-button-secondary justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Editar dados
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="action-button-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {submitLabel}
              </>
            ) : (
              <>
                Confirmar envio
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
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
                <span className="text-[11px] font-medium leading-4 text-text-muted">{option.hint}</span>
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
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
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
            Revisar relato
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-[11px] font-black uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-text-main">{value}</p>
    </div>
  );
}
