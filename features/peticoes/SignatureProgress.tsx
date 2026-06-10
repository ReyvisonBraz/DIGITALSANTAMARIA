'use client';

import { motion } from 'motion/react';

interface SignatureProgressProps {
  current: number;
  goal: number;
}

export default function SignatureProgress({ current, goal }: SignatureProgressProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em]">
        <span className="text-tertiary">
          {current.toLocaleString()} / {goal.toLocaleString()} assinaturas
        </span>
        <span className="text-text-muted">{percentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={`${current} de ${goal} assinaturas`}
        className="h-2.5 w-full bg-surface border border-border rounded-full p-0.5 overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-tertiary rounded-full"
        />
      </div>
    </div>
  );
}
