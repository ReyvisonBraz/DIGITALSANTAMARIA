'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dsm-accessibility';

interface SavedPrefs {
  fontSize: number;
  layoutScale: number;
  highContrast: boolean;
}

function loadPrefs(): SavedPrefs {
  if (typeof window === 'undefined') {
    return { fontSize: 16, layoutScale: 1, highContrast: false };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { fontSize: 16, layoutScale: 1, highContrast: false };
}

function savePrefs(prefs: SavedPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const prefs = loadPrefs();
    setFontSize(prefs.fontSize);
    setLayoutScale(prefs.layoutScale);
    setHighContrast(prefs.highContrast);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    root.style.setProperty('--layout-scale', `${layoutScale}`);
    document.body.classList.toggle('high-contrast', highContrast);
    savePrefs({ fontSize, layoutScale, highContrast });
  }, [fontSize, layoutScale, highContrast, hydrated]);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(prev + 2, 32));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(prev - 2, 12));
  }, []);

  const increaseLayoutScale = useCallback(() => {
    setLayoutScale(prev => Math.min(prev + 0.1, 1.5));
  }, []);

  const decreaseLayoutScale = useCallback(() => {
    setLayoutScale(prev => Math.max(prev - 0.1, 0.8));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  const resetAccessibility = useCallback(() => {
    setFontSize(16);
    setLayoutScale(1);
    setHighContrast(false);
  }, []);

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
      resetAccessibility,
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
