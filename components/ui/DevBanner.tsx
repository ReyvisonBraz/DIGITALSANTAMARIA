'use client';

import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevBannerProps {
  title: string;
  description: string;
  className?: string;
}

export default function DevBanner({ title, description, className }: DevBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/80 p-4',
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-700">
        <Wrench className="h-4 w-4" />
      </span>
      <div>
        <span className="text-sm font-bold text-amber-800">{title}</span>
        <p className="mt-0.5 text-xs font-medium leading-relaxed text-amber-700/80">{description}</p>
      </div>
    </div>
  );
}
