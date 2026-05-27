'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, Clock, MapPin, ArrowRight, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

interface IssueCardProps {
  title: string;
  category: string;
  description: string;
  location?: string;
  votes: number;
  time: string;
  status?: 'pending' | 'resolved' | 'analyzing';
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
}

export default function IssueCard({ 
  title, 
  category, 
  description, 
  location, 
  votes, 
  time, 
  status = 'pending',
  imageUrl,
  className,
  onClick 
}: IssueCardProps) {
  const [imgError, setImgError] = useState(false);
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
    resolved: { label: 'Resolvido', color: 'bg-green-100 text-green-800 border-green-200' },
    analyzing: { label: 'Em Análise', color: 'bg-amber-100 text-amber-800 border-amber-200' }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-lg tactile-card overflow-hidden group cursor-pointer flex flex-col sm:flex-row gap-6",
        className
      )}
      onClick={onClick}
    >
      {imageUrl && !imgError && (
        <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container relative">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {imageUrl && imgError && (
        <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-text-muted/40" />
        </div>
      )}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
            {category}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container rounded text-xs font-bold text-primary">
            <ThumbsUp className="w-3 h-3 fill-primary/10" />
            {votes}
          </div>
        </div>
        
        <h4 className="text-name text-lg group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-subname line-clamp-2 mb-4">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted opacity-60 uppercase tracking-tight">
              <Clock className="w-3 h-3" />
              {time}
            </div>
            {location && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted opacity-60 uppercase tracking-tight">
                <MapPin className="w-3 h-3" />
                {location}
              </div>
            )}
          </div>
          <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline font-ui">
            Apoiar <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
