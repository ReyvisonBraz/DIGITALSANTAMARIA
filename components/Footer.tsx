'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Camera, Share2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';

const log = createLogger('Footer');

export default function Footer() {
  const { toast } = useToast();

  const handleSocialClick = (platform: string) => {
    log.info('Social link clicked', { platform });
    toast(`Redirecionando para o ${platform} oficial da Prefeitura...`, 'info');
  };
  return (
    <footer className="bg-white border-t-2 border-primary-light w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xl font-black text-primary uppercase tracking-tighter">
              Digital Santa Maria
            </span>
            <p className="font-ui text-sm text-text-muted">
              © 2026 Digital Santa Maria - Portal da Transparência e Serviços Municipais
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Sobre o Portal', href: '/sobre' },
              { label: 'Privacidade', href: '/legal' },
              { label: 'Termos de Uso', href: '/legal' },
              { label: 'Ouvidoria', href: '/ouvidoria' },
              { label: 'Contato', href: '/ouvidoria' },
              { label: 'Eventos', href: '/eventos' },
              { label: 'Educação', href: '/educacao' },
              { label: 'Tributos', href: '/tributos' },
              { label: 'Trânsito', href: '/transito' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-text-muted hover:text-primary transition-colors font-ui"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-4">
            <button 
              onClick={() => handleSocialClick('Facebook')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSocialClick('Instagram')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSocialClick('Twitter')}
              className="p-2 text-text-muted hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
