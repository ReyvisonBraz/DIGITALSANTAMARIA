/**
 * @module Footer
 * @description Rodapé institucional do portal Digital Santa Maria.
 *
 * Contém:
 * - Branding e copyright
 * - Links de navegação rápida (sobre, privacidade, serviços)
 * - Links para redes sociais oficiais da prefeitura
 */

'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { Globe, Camera, Share2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';
import { FOOTER_LINKS } from '@/lib/constants';

const log = createLogger('Footer');

export default function Footer() {
  const { toast } = useToast();

  /** Loga clique em link social e mostra feedback ao usuário */
  const handleSocialClick = useCallback((platform: string) => {
    log.info('Social link clicked', { platform });
    toast(`Redirecionando para o ${platform} oficial da Prefeitura...`, 'info');
  }, [toast]);

  return (
    <footer className="bg-white border-t-2 border-primary-light w-full" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Branding e copyright */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xl font-black text-primary uppercase tracking-tighter">
              Digital Santa Maria
            </span>
            <p className="font-ui text-sm text-text-muted">
              © {new Date().getFullYear()} Digital Santa Maria - Portal da Transparência e Serviços Municipais
            </p>
          </div>

          {/* Links de navegação */}
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Links do rodapé">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-text-muted hover:text-primary transition-colors font-ui"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Redes sociais */}
          <div className="flex gap-4" role="group" aria-label="Redes sociais da prefeitura">
            <button
              onClick={() => handleSocialClick('Facebook')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
              aria-label="Facebook oficial da prefeitura"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSocialClick('Instagram')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
              aria-label="Instagram oficial da prefeitura"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSocialClick('Twitter')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
              aria-label="Twitter oficial da prefeitura"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
