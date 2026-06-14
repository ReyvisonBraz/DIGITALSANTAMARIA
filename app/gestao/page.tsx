'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import AdminAuditPanel from '@/features/gestao/AdminAuditPanel';
import AdminOverview from '@/features/gestao/AdminOverview';
import AdminSectionNav, { type AdminMainSection } from '@/features/gestao/AdminSectionNav';
import { LoginGate, RestrictedGate } from '@/features/gestao/AuthGates';
import ContentAdminPanel, { type ContentTab } from '@/features/gestao/ContentAdminPanel';
import DemandsSection from '@/features/gestao/DemandsSection';
import PetitionsAdminPanel from '@/features/gestao/PetitionsAdminPanel';
import ReportsSection from '@/features/gestao/ReportsSection';
import UsersAdminPanel from '@/features/gestao/UsersAdminPanel';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import { useAuth } from '@/lib/auth-context';


type ActiveSection = AdminMainSection;

export default function GestãoPage() {
  const { user, userRole, loading: authLoading, authError, login } = useAuth();
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
        <div className="hero-panel p-5 sm:p-7 md:p-9">
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
