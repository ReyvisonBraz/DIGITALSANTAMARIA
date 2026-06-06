'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  PenLine,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import ProfileSettingsPanel from '@/components/ProfileSettingsPanel';
import ActivityHistory from '@/features/perfil/ActivityHistory';
import MyBusinessesSection from '@/features/perfil/MyBusinessesSection';
import Counter from '@/components/ui/Counter';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { listenToUserDemands } from '@/services/demands.service';
import { listenToUserReports } from '@/services/reports.service';
import { getUserProfile } from '@/services/users.service';
import type { Demand, Report, UserProfile } from '@/types';

export default function PerfilPage() {
  const { user, userRole, login, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [settingsMode, setSettingsMode] = useState<'edit' | 'preferences' | null>(null);

  const loadProfile = useCallback(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    getUserProfile(user.uid)
      .then(setProfile)
      .catch(() => toast('Não foi possível carregar o painel agora.', 'error'))
      .finally(() => setProfileLoading(false));
  }, [toast, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!user) {
      setDemands([]);
      setReports([]);
      setActivityLoading(false);
      return;
    }
    setActivityLoading(true);
    let demandsReady = false;
    let reportsReady = false;
    const markReady = () => {
      if (demandsReady && reportsReady) setActivityLoading(false);
    };
    const unsubDemands = listenToUserDemands(user.uid, (next) => {
      setDemands(next);
      demandsReady = true;
      markReady();
    }, () => {
      setDemands([]);
      demandsReady = true;
      toast('Nao foi possivel carregar suas solicitacoes agora.', 'error');
      markReady();
    });
    const unsubReports = listenToUserReports(user.uid, (next) => {
      setReports(next);
      reportsReady = true;
      markReady();
    }, () => {
      setReports([]);
      reportsReady = true;
      toast('Nao foi possivel carregar seus relatos agora.', 'error');
      markReady();
    });
    return () => {
      unsubDemands();
      unsubReports();
    };
  }, [user, toast]);

  const displayName = profile?.displayName || user?.displayName || 'Cidadao';
  const email = profile?.email || user?.email || '';
  const photoURL = profile?.photoURL || user?.photoURL || null;
  const isStaff = userRole === 'admin' || userRole === 'clerk';
  const loading = profileLoading || activityLoading;
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Nao foi possivel iniciar o login.', 'error');
    }
  };

  const stats = useMemo(() => [
    { label: 'Solicitacoes', value: demands.length, icon: ClipboardList },
    { label: 'Relatos', value: reports.length, icon: MessageSquare },
    { label: 'Pontos', value: profile?.points ?? 0, icon: ShieldCheck },
  ], [demands.length, reports.length, profile?.points]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-normal text-text-main">
          Painel do Cidadao
        </h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Entre com sua conta Google para acompanhar protocolos, dados basicos e atividades no portal.
        </p>
        <button
          onClick={handleLogin}
          className="action-button-primary mt-6"
        >
          Entrar no painel
        </button>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border bg-surface">
            {photoURL ? (
              <Image src={photoURL} alt={displayName} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <UserRound className="h-9 w-9" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Painel do Cidadao</p>
            <h1 className="mt-1 truncate text-3xl font-semibold tracking-normal text-text-main md:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 break-all text-sm font-bold text-text-muted">{email}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <button
              onClick={() => setSettingsMode('edit')}
              className="action-button-secondary min-h-11 px-4 py-2 text-xs"
            >
              <PenLine className="h-4 w-4" />
              Editar perfil
            </button>
            <Link
              href="/ouvidoria"
              className="action-button-primary min-h-11 px-4 py-2 text-xs"
            >
              Abrir solicitacao
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                logout();
                toast('Sessao encerrada com sucesso.', 'info');
              }}
              className="action-button-secondary min-h-11 px-4 py-2 text-xs hover:border-rose-300 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:px-10 lg:grid-cols-[1fr_0.38fr] lg:px-12">
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="civic-card p-5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Counter value={stat.value} />}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Historico</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">Meus protocolos</h2>
              </div>
              <Link href="/ouvidoria" className="text-xs font-semibold uppercase tracking-widest text-primary">
                Consultar protocolo
              </Link>
            </div>
            <ActivityHistory demands={demands} reports={reports} loading={activityLoading} />
          </div>

          <MyBusinessesSection />
        </section>

        <aside className="space-y-4">
          {isStaff && (
            <div className="civic-card border-primary/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Acesso administrativo</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                <Link
                  href="/gestao"
                  className="action-button-primary min-h-11 justify-between px-4 py-2 text-xs"
                >
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Gestao
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/peticoes"
                  className="inline-flex min-h-11 items-center justify-between rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Peticoes
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/ouvidoria"
                  className="inline-flex min-h-11 items-center justify-between rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Solicitacoes
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="civic-card p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Dados basicos</p>
              <button
                onClick={() => setSettingsMode('edit')}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
              >
                <Settings className="h-3.5 w-3.5" />
                Editar
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm font-medium text-text-muted">
              <p><span className="font-semibold text-text-main">Bairro:</span> {profile?.neighborhood || 'Nao informado'}</p>
              <p><span className="font-semibold text-text-main">Telefone:</span> {profile?.phone || 'Nao informado'}</p>
              <p><span className="font-semibold text-text-main">Perfil:</span> {profile?.role || 'citizen'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary-dark p-5 text-white shadow-[0_8px_24px_rgba(26,86,196,0.22)]">
            <FileText className="h-6 w-6 text-primary-light" />
            <h2 className="mt-3 text-lg font-semibold tracking-normal">Como usar o painel</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-white/70">
              Solicitacoes abertas com login aparecem aqui automaticamente. Solicitacoes anonimas podem ser acompanhadas pelo numero de protocolo.
            </p>
          </div>
        </aside>
      </main>

      <ProfileSettingsPanel
        isOpen={!!settingsMode}
        onClose={() => {
          setSettingsMode(null);
          loadProfile();
        }}
        mode={settingsMode === 'preferences' ? 'preferences' : 'edit'}
      />
    </div>
  );
}
