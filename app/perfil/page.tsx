'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import ActivityHistory from '@/features/perfil/ActivityHistory';
import { getDemandsByUser } from '@/services/demands.service';
import { getReportsByUser } from '@/services/reports.service';
import { getUserProfile } from '@/services/users.service';
import type { UserProfile } from '@/types';

export default function PerfilPage() {
  const { user, login, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [demandsCount, setDemandsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      getUserProfile(user.uid),
      getDemandsByUser(user.uid),
      getReportsByUser(user.uid),
    ])
      .then(([userProfile, demands, reports]) => {
        setProfile(userProfile);
        setDemandsCount(demands.length);
        setReportsCount(reports.length);
      })
      .catch(() => toast('Não foi possível carregar o painel agora.', 'error'))
      .finally(() => setLoading(false));
  }, [toast, user]);

  const displayName = profile?.displayName || user?.displayName || 'Cidadão';
  const email = profile?.email || user?.email || '';
  const photoURL = profile?.photoURL || user?.photoURL || null;

  const stats = useMemo(() => [
    { label: 'Solicitações', value: demandsCount, icon: ClipboardList },
    { label: 'Relatos', value: reportsCount, icon: MessageSquare },
    { label: 'Pontos', value: profile?.points ?? 0, icon: ShieldCheck },
  ], [demandsCount, profile?.points, reportsCount]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-normal text-text-main">
          Painel do Cidadão
        </h1>
        <p className="mt-3 text-base font-medium leading-7 text-text-muted">
          Entre com sua conta Google para acompanhar seus protocolos, dados básicos e atividades no portal.
        </p>
        <button
          onClick={login}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
        >
          Entrar no painel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-center md:px-10 md:py-10 lg:px-12">
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
            <p className="text-xs font-black uppercase tracking-widest text-primary">Painel do Cidadão</p>
            <h1 className="mt-1 truncate text-3xl font-black tracking-normal text-text-main md:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 break-all text-sm font-bold text-text-muted">{email}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <Link
              href="/ouvidoria"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
            >
              Abrir solicitação
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                logout();
                toast('Sessão encerrada com sucesso.', 'info');
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-rose-300 hover:text-rose-600"
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
              <div key={stat.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-black text-text-main">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : stat.value}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Histórico</p>
                <h2 className="mt-1 text-2xl font-black tracking-normal text-text-main">Meus protocolos</h2>
              </div>
              <Link href="/ouvidoria" className="text-xs font-black uppercase tracking-widest text-primary">
                Consultar protocolo
              </Link>
            </div>
            <ActivityHistory />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">Dados básicos</p>
            <div className="mt-4 space-y-3 text-sm font-medium text-text-muted">
              <p><span className="font-black text-text-main">Bairro:</span> {profile?.neighborhood || 'Não informado'}</p>
              <p><span className="font-black text-text-main">Telefone:</span> {profile?.phone || 'Não informado'}</p>
              <p><span className="font-black text-text-main">Perfil:</span> {profile?.role || 'citizen'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-text-main p-5 text-white shadow-sm">
            <FileText className="h-6 w-6 text-primary-light" />
            <h2 className="mt-3 text-lg font-black tracking-normal">Como usar o painel</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-white/70">
              Solicitações abertas com login aparecem aqui automaticamente. Solicitações anônimas podem ser acompanhadas pelo número de protocolo.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
