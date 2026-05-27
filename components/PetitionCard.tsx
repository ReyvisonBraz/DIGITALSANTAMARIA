'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PetitionCardProps {
  title: string;
  category: string;
  description: string;
  signatures: number;
  goal: number;
  imageUrl?: string;
  className?: string;
  onSign?: () => void;
  onDetails?: () => void;
}

export default function PetitionCard({
  title,
  category,
  description,
  signatures,
  goal,
  imageUrl,
  className,
  onSign,
  onDetails
}: PetitionCardProps) {
  const progress = Math.min((signatures / goal) * 100, 100);

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg tactile-card group flex flex-col md:flex-row gap-6",
      className
    )}>
      {imageUrl && (
        <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container relative">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="flex-grow flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-tertiary">
          {category}
        </span>
        <h4 className="font-display font-bold text-xl text-text-main mt-1 mb-2">
          {title}
        </h4>
        <p className="text-sm text-text-muted mb-4 font-sans line-clamp-2">
          {description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-primary">{signatures.toLocaleString()} / {goal.toLocaleString()} assinaturas</span>
            <span className="text-text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col justify-center gap-3">
        <button 
          onClick={onSign}
          className="flex-1 md:flex-none bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          Assinar
        </button>
        <button 
          onClick={onDetails}
          className="flex-1 md:flex-none border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary-light transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          Detalhes
        </button>
      </div>
    </div>
  );
}
