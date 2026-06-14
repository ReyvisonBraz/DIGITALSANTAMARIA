'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Shield, Siren } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import ContentCard from '@/components/ui/ContentCard';
import { createEmergencyAlert } from '@/services/emergency.service';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { EmergencyAlertType, SafetyZone } from '@/types';

/**
 * SegurancaPage — Delegacias, postos policiais e serviços de emergência.
 *
 * Carrega dados da coleção Firestore 'safety_zones' via useContent().
 * Exibe loading/error/empty states automaticamente via ContentPage.
 */

export default function SegurancaPage() {
  const { data, loading, error, refresh } = useContent<SafetyZone>('safety_zones');
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [alertType, setAlertType] = useState<EmergencyAlertType>('panic');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleEmergencySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location.trim() || !description.trim()) {
      toast('Informe localização e descrição do alerta.', 'error');
      return;
    }

    if (!user) {
      try {
        await login();
      } catch (loginError) {
        toast(loginError instanceof Error ? loginError.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    setSubmitting(true);
    try {
      const protocol = await createEmergencyAlert({
        userId: user.uid,
        userName: user.displayName || user.email || 'Cidadão',
        userEmail: user.email || '',
        type: alertType,
        location: location.trim(),
        description: description.trim(),
      });
      setLocation('');
      setDescription('');
      toast(`Alerta enviado. Protocolo ${protocol}.`, 'success');
    } catch {
      toast('Não foi possível enviar o alerta agora.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10">

      <ContentHero
        icon={Shield}
        label="Proteção"
        title="Rede de Segurança"
        subtitle="Delegacias, postos policiais e serviços de emergência."
        accent="primary-dark"
      />

      <section className="grid gap-5 rounded-3xl border border-red-200 bg-red-50 p-5 md:grid-cols-[0.8fr_1.2fr] md:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-600 text-white">
            <Siren className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-700">Alerta emergencial</p>
            <h2 className="mt-1 text-xl font-semibold text-text-main">Acione a equipe de seguranca</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-red-900/70">
              Use este canal para registrar uma ocorrência urgente com localização e descrição objetiva.
            </p>
          </div>
        </div>

        <form onSubmit={handleEmergencySubmit} className="grid gap-3 md:grid-cols-2">
          <label htmlFor="alert-type" className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-800">Tipo</span>
            <select
              id="alert-type"
              value={alertType}
              onChange={(event) => setAlertType(event.target.value as EmergencyAlertType)}
              className="h-11 w-full rounded-xl border border-red-200 bg-white px-3 text-sm font-bold outline-none focus:border-red-600"
            >
              <option value="panic">Panico</option>
              <option value="violence">Violencia</option>
              <option value="fire">Incendio</option>
              <option value="medical">Atendimento médico</option>
              <option value="flood">Alagamento</option>
              <option value="other">Outro</option>
            </select>
          </label>
          <label htmlFor="alert-location" className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-800">Localização</span>
            <input
              id="alert-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={200}
              placeholder="Rua, bairro ou ponto de referência"
              className="h-11 w-full rounded-xl border border-red-200 bg-white px-3 text-sm font-medium outline-none focus:border-red-600"
            />
          </label>
          <label htmlFor="alert-description" className="space-y-1.5 md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-800">Descrição</span>
            <textarea
              id="alert-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Descreva o que está acontecendo"
              className="w-full resize-none rounded-xl border border-red-200 bg-white p-3 text-sm font-medium leading-6 outline-none focus:border-red-600"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Siren className="h-4 w-4" />}
              Enviar alerta
            </button>
          </div>
        </form>
      </section>

      <ContentPage
        isEmpty={data.length === 0}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhum ponto de segurança cadastrado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              badge={{ text: item.type, color: 'bg-red-600/10 text-red-600 border border-red-600/20' }}
              address={item.address}
              phone={item.emergencyPhone}
              extra={
                item.is24h ? (
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-semibold uppercase tracking-widest mt-2 border border-emerald-200">
                    24h
                  </span>
                ) : null
              }
            />
          ))}
        </div>
      </ContentPage>

    </div>
  );
}
