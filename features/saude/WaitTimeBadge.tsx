'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WaitTimeLevel } from '@/types';

interface WaitTimeBadgeProps {
  waitTime: string;
  level: WaitTimeLevel;
}

const colors: Record<WaitTimeLevel, string> = {
  low: 'bg-green-50 text-green-600 border-green-200',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  high: 'bg-orange-50 text-orange-600 border-orange-200',
  critical: 'bg-red-50 text-red-600 border-red-200',
};

export default function WaitTimeBadge({ waitTime, level }: WaitTimeBadgeProps) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border',
      colors[level]
    )}>
      <Clock className="w-3 h-3" />
      {waitTime}
    </div>
  );
}
