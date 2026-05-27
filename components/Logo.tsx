'use client';

import { cn } from '@/lib/utils';

/**
 * Logo — marca "Conecta Santa Maria".
 *
 * Emblema de conexão: um arco azul (a cidade que acolhe) envolve
 * o cidadão (ponto central, ciano), ligado por um traço a um nó
 * dourado (os serviços / a gestão). Lê-se como um "C" de Conecta.
 */

interface LogoProps {
  /** Tamanho do emblema em px. */
  size?: number;
  /** Exibe o wordmark ao lado do emblema. */
  withWordmark?: boolean;
  /** Esquema de cor do texto do wordmark. */
  tone?: 'dark' | 'light';
  /** Pulso sutil no nó dourado. */
  animated?: boolean;
  className?: string;
}

export function LogoMark({
  size = 40,
  animated = false,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="Conecta Santa Maria"
      className={className}
    >
      {/* Arco terracota — a cidade que acolhe (C de Conecta) */}
      <path
        d="M28 8.4 A 14 14 0 1 0 28 31.6"
        stroke="var(--color-primary)"
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Traço de conexão cidadão → serviços */}
      <path
        d="M20 20 L29.5 9.2"
        stroke="var(--color-secondary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Cidadão (centro) */}
      <circle cx="20" cy="20" r="3.5" fill="var(--color-secondary)" />
      {/* Nó dourado — serviços / gestão */}
      <circle
        cx="30"
        cy="8.4"
        r="4.4"
        fill="var(--color-accent)"
        className={animated ? 'animate-pulse-glow' : undefined}
        style={{ transformOrigin: '30px 8.4px' }}
      />
    </svg>
  );
}

export default function Logo({
  size = 40,
  withWordmark = true,
  tone = 'dark',
  animated = false,
  className,
}: LogoProps) {
  const radius = Math.round(size * 0.34);

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className="grid place-items-center shadow-[0_10px_24px_rgba(26,86,196,0.30)]"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background:
            'linear-gradient(140deg, var(--color-surface), var(--color-primary-light))',
          border: '1px solid rgba(26,86,196,0.18)',
        }}
      >
        <LogoMark size={Math.round(size * 0.7)} animated={animated} />
      </span>

      {withWordmark && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              'font-display text-[15px] font-semibold tracking-tight',
              tone === 'light' ? 'text-white' : 'text-text-main'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Conecta
          </span>
          <span
            className={cn(
              'mt-0.5 text-[10px] font-bold uppercase tracking-[0.26em]',
              tone === 'light' ? 'text-white/70' : 'text-primary'
            )}
          >
            Santa Maria
          </span>
        </span>
      )}
    </span>
  );
}
