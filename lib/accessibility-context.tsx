'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  layoutScale: number;
  highContrast: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  increaseLayoutScale: () => void;
  decreaseLayoutScale: () => void;
  toggleHighContrast: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(16);
  const [layoutScale, setLayoutScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    
    // Apply layout scale using a CSS variable to be used in globals.css
    root.style.setProperty('--layout-scale', `${layoutScale}`);
    
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontSize, layoutScale, highContrast]);

  const increaseFontSize = () => {
    setFontSize(prev => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const max = isMobile ? 22 : 32; 
      return Math.min(prev + 2, max);
    });
  };

  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  const increaseLayoutScale = () => {
    setLayoutScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const decreaseLayoutScale = () => {
    setLayoutScale(prev => Math.max(prev - 0.1, 0.8));
  };

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  
  const resetAccessibility = () => {
    setFontSize(16);
    setLayoutScale(1);
    setHighContrast(false);
  };

  return (
    <AccessibilityContext.Provider value={{ 
      fontSize, 
      layoutScale,
      highContrast, 
      increaseFontSize, 
      decreaseFontSize, 
      increaseLayoutScale,
      decreaseLayoutScale,
      toggleHighContrast,
      resetAccessibility 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
