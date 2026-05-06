import type { Metadata } from 'next';
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
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Digital Santa Maria | Santa Maria do Pará - PA',
    template: '%s | Digital Santa Maria',
  },
  description: 'Plataforma inteligente de governança digital e serviços municipais para Santa Maria do Pará - PA.',
  manifest: '/manifest.json',
  other: {
    'theme-color': '#1e3a5f',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen bg-background text-text-main font-display">
        <AccessibilityProvider>
          <AuthProvider>
            <ToastProvider>
              <ErrorBoundary>
                <TopAppBar />
                <main className="relative">{children}</main>
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
