import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import TopAppBar from '@/components/TopAppBar';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import RootLayoutLogger from './root-layout-logger';
import ErrorBoundary from '@/components/ErrorBoundary';
import InstallPrompt from '@/components/InstallPrompt';
import ScrollAmbience from '@/components/ScrollAmbience';

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Dancing+Script:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-text-main pt-[env(safe-area-inset-top,0px)]">
        <AccessibilityProvider>
          <AuthProvider>
            <ToastProvider>
              <ErrorBoundary>
                <ScrollAmbience />
                <TopAppBar />
                <main className="relative pt-20 md:pt-24">{children}</main>
                <Footer />
                <BottomNavBar />
                <InstallPrompt />
                <RootLayoutLogger />
              </ErrorBoundary>
            </ToastProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
