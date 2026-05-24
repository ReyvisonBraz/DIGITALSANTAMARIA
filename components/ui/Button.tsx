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
      'bg-primary text-white shadow-[0_14px_30px_rgba(11,111,211,0.22)] hover:bg-primary-dark',
    secondary:
      'border border-border bg-white/90 text-text-main shadow-sm hover:border-primary hover:text-primary',
    ghost:
      'text-text-muted hover:bg-primary/10 hover:text-primary',
    danger:
      'bg-accent-danger text-white shadow-[0_14px_30px_rgba(217,45,32,0.18)] hover:brightness-95',
  };

  return (
    <button
      className={cn(
        'relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-sm font-black transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
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
