'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Camera, Globe, Share2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { FOOTER_LINKS } from '@/lib/constants';
import { createLogger } from '@/lib/logger';
import { useToast } from '@/lib/toast-context';

const log = createLogger('Footer');

export default function Footer() {
  const { toast } = useToast();

  const handleSocialClick = useCallback((platform: string) => {
    log.info('Social link clicked', { platform });
    toast(`Redirecionando para o ${platform} oficial da Prefeitura...`, 'info');
  }, [toast]);

  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-white/70 backdrop-blur-sm" role="contentinfo">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_auto_auto] md:items-center md:px-10 lg:px-12">
        <div className="space-y-3">
          <Logo size={42} withWordmark />
          <p className="max-w-sm text-sm font-medium leading-relaxed text-text-muted">
            © {new Date().getFullYear()} Conecta Santa Maria — portal do cidadão e serviços municipais de Santa Maria do Pará.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Links do rodape">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="link-underline text-sm font-medium text-text-muted transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-2" role="group" aria-label="Redes sociais da prefeitura">
          {[
            { label: 'Facebook', icon: Globe },
            { label: 'Instagram', icon: Camera },
            { label: 'Compartilhar', icon: Share2 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleSocialClick(item.label)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border text-text-muted transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              aria-label={`${item.label} oficial da prefeitura`}
            >
              <item.icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
