'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AccessibilityColorMode, AccessibilityPreferences } from '@/types';

const STORAGE_KEY = 'dsm-accessibility';

const DEFAULT_PREFS: AccessibilityPreferences = {
  fontSize: 16,
  layoutScale: 1,
  colorMode: 'default',
  setupCompleted: false,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizePrefs(value: Partial<AccessibilityPreferences> | null | undefined): AccessibilityPreferences {
  const legacyContrast = (value as { highContrast?: boolean } | null | undefined)?.highContrast;
  const colorMode = value?.colorMode ?? (legacyContrast ? 'high-contrast' : DEFAULT_PREFS.colorMode);

  return {
    fontSize: clamp(Number(value?.fontSize ?? DEFAULT_PREFS.fontSize), 12, 32),
    layoutScale: 1,
    colorMode: ['default', 'dark', 'high-contrast'].includes(colorMode) ? colorMode : DEFAULT_PREFS.colorMode,
    setupCompleted: Boolean(value?.setupCompleted ?? DEFAULT_PREFS.setupCompleted),
  };
}

function loadPrefs(): AccessibilityPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizePrefs(JSON.parse(saved)) : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: AccessibilityPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* localStorage can be blocked in private/restricted browser modes. */
  }
}

interface AccessibilityContextType extends AccessibilityPreferences {
  highContrast: boolean;
  isReady: boolean;
  isSetupOpen: boolean;
  setColorMode: (mode: AccessibilityColorMode) => void;
  setAccessibilityPrefs: (prefs: Partial<AccessibilityPreferences>) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  resetAccessibility: () => void;
  completeAccessibilitySetup: () => void;
  openAccessibilitySetup: () => void;
  closeAccessibilitySetup: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    setIsSetupOpen(!loaded.setupCompleted);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${prefs.fontSize}px`);
    root.style.setProperty('--layout-scale', `${prefs.layoutScale}`);

    document.body.classList.toggle('high-contrast', prefs.colorMode === 'high-contrast');
    document.body.classList.toggle('dark-mode', prefs.colorMode === 'dark');
    document.body.dataset.accessibilityMode = prefs.colorMode;

    savePrefs(prefs);
  }, [prefs, hydrated]);

  const setAccessibilityPrefs = useCallback((nextPrefs: Partial<AccessibilityPreferences>) => {
    setPrefs((current) => normalizePrefs({ ...current, ...nextPrefs, layoutScale: 1 }));
    if (nextPrefs.setupCompleted === false) setIsSetupOpen(true);
    if (nextPrefs.setupCompleted === true) setIsSetupOpen(false);
  }, []);

  const setColorMode = useCallback((mode: AccessibilityColorMode) => {
    setAccessibilityPrefs({ colorMode: mode });
  }, [setAccessibilityPrefs]);

  const increaseFontSize = useCallback(() => {
    setPrefs((current) => ({ ...current, fontSize: clamp(current.fontSize + 2, 12, 32) }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setPrefs((current) => ({ ...current, fontSize: clamp(current.fontSize - 2, 12, 32) }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setPrefs((current) => ({
      ...current,
      colorMode: current.colorMode === 'high-contrast' ? 'default' : 'high-contrast',
    }));
  }, []);

  const resetAccessibility = useCallback(() => {
    setPrefs({ ...DEFAULT_PREFS, setupCompleted: true });
  }, []);

  const completeAccessibilitySetup = useCallback(() => {
    setPrefs((current) => ({ ...current, setupCompleted: true }));
    setIsSetupOpen(false);
  }, []);

  const openAccessibilitySetup = useCallback(() => {
    setIsSetupOpen(true);
  }, []);

  const closeAccessibilitySetup = useCallback(() => {
    setIsSetupOpen(false);
  }, []);

  const value = useMemo<AccessibilityContextType>(() => ({
    ...prefs,
    highContrast: prefs.colorMode === 'high-contrast',
    isReady: hydrated,
    isSetupOpen,
    setColorMode,
    setAccessibilityPrefs,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    resetAccessibility,
    completeAccessibilitySetup,
    openAccessibilitySetup,
    closeAccessibilitySetup,
  }), [
    prefs,
    hydrated,
    isSetupOpen,
    setColorMode,
    setAccessibilityPrefs,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    resetAccessibility,
    completeAccessibilitySetup,
    openAccessibilitySetup,
    closeAccessibilitySetup,
  ]);

  return (
    <AccessibilityContext.Provider value={value}>
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
