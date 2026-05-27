'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SidePanel({ isOpen, onClose, title, children, className }: SidePanelProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel - Slides from Right. Responsive: w-full on mobile, fixed wide on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 right-0 z-[101] w-full md:w-[450px] lg:w-[500px] bg-white shadow-2xl flex flex-col border-l-2 border-border/50",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b-2 border-border/50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                {/* Mobile back button feels more native than an X on the right sometimes, but we keep X for consistency */}
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 text-text-muted hover:text-text-main hover:bg-surface rounded-full transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {title && <h3 className="text-xl font-semibold text-text-main tracking-tight uppercase">{title}</h3>}
              </div>
              <button
                onClick={onClose}
                className="hidden md:flex p-2 -mr-2 text-text-muted hover:text-text-main hover:bg-surface rounded-full transition-colors"
                aria-label="Sair"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
