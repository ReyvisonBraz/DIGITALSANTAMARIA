'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import AdminOverview from '@/features/gestao/AdminOverview';
import AdminSectionNav, { type AdminMainSection } from '@/features/gestao/AdminSectionNav';
import { LoginGate, RestrictedGate } from '@/features/gestao/AuthGates';
import type { ContentTab } from '@/features/gestao/ContentAdminPanel';
import DemandsSection from '@/features/gestao/DemandsSection';
import ReportsSection from '@/features/gestao/ReportsSection';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import { useAuth } from '@/lib/auth-context';

const ContentAdminPanel = dynamic(() => import('@/features/gestao/ContentAdminPanel'), {
  loading: () => <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>,
  ssr: false,
});
const PetitionsAdminPanel = dynamic(() => import('@/features/gestao/PetitionsAdminPanel'), { ssr: false });
const AdminAuditPanel = dynamic(() => import('@/features/gestao/AdminAuditPanel'), { ssr: false });
const UsersAdminPanel = dynamic(() => import('@/features/gestao/UsersAdminPanel'), { ssr: false });


type ActiveSection = AdminMainSection;

export default function GestãoPage() {
  const { user, userRole, loading: authLoading, authError, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStaff = userRole === 'admin' || userRole === 'clerk';
  const canManageAdminCatalog = userRole === 'admin';
  const { demands, reports, loading, error, refresh } = useAdminData(!!user && isStaff);
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [contentTab, setContentTab] = useState<ContentTab>('notices');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Clerks podem ver apenas um subconjunto de seções; redireciona se necessário.
  useEffect(() => {
    const allowedForClerk: ActiveSection[] = ['overview', 'demands', 'reports', 'content'];
    if (!canManageAdminCatalog && !allowedForClerk.includes(activeSection)) {
      setActiveSection('overview');
    }
  }, [activeSection, canManageAdminCatalog]);

  const reportPendingCount = useMemo(
    () => reports.filter((r) => r.status === 'pending').length,
    [reports],
  );

  const visibleSection: ActiveSection =
    canManageAdminCatalog ||
    activeSection === 'overview' ||
    activeSection === 'demands' ||
    activeSection === 'reports' ||
    activeSection === 'content'
      ? activeSection
      : 'overview';

  const clerkName = user?.displayName || user?.email || 'Gestor';

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
      const redirect = searchParams.get('redirect');
      if (redirect) router.replace(redirect);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Não foi possível iniciar o login.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <LoginGate authError={authError} loginError={loginError} onLogin={handleLogin} />;
  if (!isStaff) return <RestrictedGate />;

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel relative p-5 sm:p-7 md:p-9">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative z-10">
            <div className="soft-chip">
              <ShieldCheck className="h-4 w-4" />
              Gestão municipal
            </div>
            <h1
              className="mt-4 text-3xl font-semibold tracking-tight text-text-main md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Painel de <span className="text-gradient">operação</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-text-muted">
              Acompanhe solicitações, responda protocolos, gerencie conteúdo público e mantenha os cadastros administrativos em ordem.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-7 sm:px-6 md:px-10 lg:px-12">
        <AdminSectionNav
          activeSection={visibleSection}
          demandCount={demands.length}
          reportCount={reports.length}
          reportPendingCount={reportPendingCount}
          canManageAdminCatalog={canManageAdminCatalog}
          onChange={setActiveSection}
        />

        {visibleSection === 'overview' && (
          <AdminOverview
            demands={demands}
            reports={reports}
            loadingBase={loading}
            errorBase={error}
            canManageCatalog={canManageAdminCatalog}
            onNavigate={setActiveSection}
            onOpenContentTab={(tab) => { setContentTab(tab); setActiveSection('content'); }}
            onRefreshBase={refresh}
          />
        )}
        {visibleSection === 'demands' && (
          <DemandsSection
            demands={demands}
            loading={loading}
            error={error}
            userId={user.uid}
            clerkName={clerkName}
            onRefresh={refresh}
          />
        )}
        {visibleSection === 'reports' && (
          <ReportsSection
            reports={reports}
            loading={loading}
            error={error}
            userId={user.uid}
            clerkName={clerkName}
            onRefresh={refresh}
          />
        )}
        {visibleSection === 'content' && (
          <ContentAdminPanel
            activeTab={contentTab}
            canManageCatalog={canManageAdminCatalog}
            onTabChange={setContentTab}
          />
        )}
        {visibleSection === 'petitions' && <PetitionsAdminPanel />}
        {visibleSection === 'audit'    && <AdminAuditPanel />}
        {visibleSection === 'users'    && <UsersAdminPanel />}
      </main>
    </div>
  );
}
