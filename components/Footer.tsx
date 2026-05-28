'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { FOOTER_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-white/70 backdrop-blur-sm" role="contentinfo">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-center md:px-10 lg:px-12">
        <div className="space-y-3">
          <Logo size={42} withWordmark />
          <p className="max-w-sm text-sm font-medium leading-relaxed text-text-muted">
            © {new Date().getFullYear()} Conecta Santa Maria — portal do cidadão e serviços municipais de Santa Maria do Pará.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end" aria-label="Links do rodape">
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
      </div>
    </footer>
  );
}
