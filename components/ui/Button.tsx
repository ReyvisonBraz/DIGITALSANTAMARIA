'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_14px_30px_rgba(26,86,196,0.26)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(26,86,196,0.34)]',
    secondary:
      'border border-border bg-white/90 text-text-main shadow-sm hover:-translate-y-0.5 hover:border-primary hover:text-primary',
    ghost:
      'text-text-muted hover:bg-primary/10 hover:text-primary',
    danger:
      'bg-accent-danger text-white shadow-[0_14px_30px_rgba(192,57,43,0.20)] hover:brightness-95',
  };

  return (
    <button
      className={cn(
        'relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
