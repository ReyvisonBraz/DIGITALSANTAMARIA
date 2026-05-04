/**
 * @module RootLayout
 * @description Layout raiz da aplicação Digital Santa Maria.
 *
 * Responsabilidades:
 * - Configuração de fontes (Inter + Outfit via Google Fonts)
 * - Metadata SEO e PWA
 * - Árvore de providers (Accessibility → Auth → Toast)
 * - Estrutura global: TopAppBar, main content, Footer, BottomNavBar
 * - Registro do Service Worker para PWA
 *
 * Ordem dos providers (de fora para dentro):
 * 1. AccessibilityProvider — não depende de ninguém
 * 2. AuthProvider — depende de Firebase (inicializado em lib/firebase)
 * 3. ToastProvider — pode ser usado por todos os filhos
 */

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

// ─── Fontes ─────────────────────────────────────────────────────────

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

// ─── Metadata ───────────────────────────────────────────────────────

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

// ─── Layout ─────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col bg-surface overflow-x-hidden">
        <AccessibilityProvider>
          <AuthProvider>
            <ToastProvider>
              {/* Logger global: monitora navegação, erros e conectividade */}
              <RootLayoutLogger />

              {/* Barra superior com navegação, busca e perfil */}
              <TopAppBar />

              {/* Conteúdo principal com margem para header fixo e nav inferior */}
              <main className="flex-1 mt-16 pb-20 md:pb-0">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>

              {/* Rodapé institucional */}
              <Footer />

              {/* Navegação inferior (apenas mobile) */}
              <BottomNavBar className="md:hidden" />

              {/* Prompt de instalação PWA — agora dentro dos providers */}
              <InstallPrompt />
            </ToastProvider>
          </AuthProvider>
        </AccessibilityProvider>

        {/* Registro do Service Worker para funcionalidade PWA */}
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
