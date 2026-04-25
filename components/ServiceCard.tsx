'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  onClick?: () => void;
}

export default function ServiceCard({ icon: Icon, title, description, className, onClick }: ServiceCardProps & { description?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-4 tactile-card text-left group w-full",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300 shadow-sm border border-primary/10">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-name text-lg leading-snug mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-subname line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.button>
  );
}
