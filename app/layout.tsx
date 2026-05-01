import type {Metadata} from 'next';
import { Inter, Outfit } from 'next/font/google';
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Digital Santa Maria | Santa Maria do Pará - PA',
  description: 'Plataforma inteligente de governança digital e serviços municipais para Santa Maria do Pará - PA.',
  manifest: '/manifest.json',
  other: {
    'theme-color': '#1e3a5f',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col bg-surface overflow-x-hidden">
        <AccessibilityProvider>
          <AuthProvider>
            <ToastProvider>
              <RootLayoutLogger />
              <TopAppBar />
              <main className="flex-1 mt-16 pb-20 md:pb-0">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              <Footer />
              <BottomNavBar className="md:hidden" />
            </ToastProvider>
          </AuthProvider>
        </AccessibilityProvider>
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js', { scope: '/' });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
