import type { Metadata } from 'next';
import { Dancing_Script, Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { NotificationsProvider } from '@/lib/notifications-context';
import TopAppBar from '@/components/TopAppBar';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import RootLayoutLogger from './root-layout-logger';
import ErrorBoundary from '@/components/ErrorBoundary';
import RouteSuspensionGate from '@/components/RouteSuspensionGate';
import InstallPrompt from '@/components/InstallPrompt';
import ScrollAmbience from '@/components/ScrollAmbience';
import GuidedHelp from '@/components/GuidedHelp';
import AccessibilitySetup from '@/components/AccessibilitySetup';
import AccessibilityProfileSync from '@/components/AccessibilityProfileSync';

const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const scriptFont = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  weight: ['600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Conecta Santa Maria | Santa Maria do Pará - PA',
    template: '%s | Conecta Santa Maria',
  },
  description: 'Conecta Santa Maria — o portal do cidadão de Santa Maria do Pará. Solicite serviços, acompanhe protocolos e participe das decisões da cidade.',
  manifest: '/manifest.json',
  other: {
    'theme-color': '#1A56C4',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${sansFont.variable} ${scriptFont.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-text-main pt-[env(safe-area-inset-top,0px)]">
        <AccessibilityProvider>
          <AuthProvider>
            <ToastProvider>
              <NotificationsProvider>
                <ErrorBoundary>
                  <ScrollAmbience />
                  <TopAppBar />
                  <main className="relative pt-20 md:pt-24">
                    <RouteSuspensionGate>{children}</RouteSuspensionGate>
                  </main>
                  <Footer />
                  <BottomNavBar />
                  <InstallPrompt />
                  <GuidedHelp />
                  <AccessibilitySetup />
                  <AccessibilityProfileSync />
                  <RootLayoutLogger />
                </ErrorBoundary>
              </NotificationsProvider>
            </ToastProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
