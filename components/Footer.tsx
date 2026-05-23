'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Camera, Globe, Share2 } from 'lucide-react';
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
    <footer className="w-full border-t border-border bg-white" role="contentinfo">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto_auto] md:items-center md:px-10 lg:px-12">
        <div>
          <span className="text-lg font-black uppercase tracking-normal text-primary">
            Digital Santa Maria
          </span>
          <p className="mt-1 text-sm font-medium text-text-muted">
            © {new Date().getFullYear()} Digital Santa Maria - Portal publico e servicos municipais.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Links do rodape">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-sm font-bold text-text-muted transition hover:text-primary"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-muted transition hover:border-primary hover:text-primary"
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
