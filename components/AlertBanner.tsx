'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { createLogger } from '@/lib/logger';

const log = createLogger('AlertBanner');

interface AlertBannerProps {
  message: string;
  type?: 'urgent' | 'info';
}

export default function AlertBanner({ message, type = 'urgent' }: AlertBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Default to false and check storage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissedMessages = JSON.parse(localStorage.getItem('civic-dismissed-alerts') || '[]');
    const alreadyDismissed = dismissedMessages.includes(message);
    if (!alreadyDismissed) {
      setIsVisible(true);
    }
    log.info('Alert banner', { type, visible: !alreadyDismissed, message: message.substring(0, 60) });
  }, [message, type]);

  const handleDismiss = () => {
    setIsVisible(false);
    const dismissedMessages = JSON.parse(localStorage.getItem('civic-dismissed-alerts') || '[]');
    if (!dismissedMessages.includes(message)) {
      dismissedMessages.push(message);
      localStorage.setItem('civic-dismissed-alerts', JSON.stringify(dismissedMessages));
    }
    log.info('Alert dismissed', { message: message.substring(0, 60) });
  };

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 md:right-12 z-[100] max-w-[calc(100vw-3rem)] md:max-w-md pointer-events-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto flex items-center gap-3 bg-accent-danger text-white px-5 py-3 rounded-full shadow-2xl border-2 border-white/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <BellRing className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Alerta Ativo</span>
            <ChevronUp className="w-4 h-4 opacity-50" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className="pointer-events-auto bg-text-main text-white p-6 rounded-[2rem] border-2 border-border shadow-2xl relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-accent-danger" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Aviso Urgente</h4>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
                  title="Minimizar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDismiss}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="font-medium text-sm md:text-base leading-relaxed text-slate-200 mb-6">
              {message}
            </p>

            <div className="flex items-center gap-3">
              <Link 
                href="/avisos" 
                className="flex-grow text-center py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Ver Detalhes
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
