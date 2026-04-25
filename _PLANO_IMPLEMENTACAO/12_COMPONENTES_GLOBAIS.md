# 12 — Componentes Globais com Dados Reais

---

## Arquivo: `lib/hooks/use-firestore-doc.ts` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, type DocumentReference } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

/**
 * Hook genérico para escutar um documento Firestore em tempo real.
 * Retorna { data, loading, error }.
 *
 * @example
 * const { data: user } = useFirestoreDoc<UserProfile>('users', uid);
 */
export function useFirestoreDoc<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const ref = doc(db, collectionName, docId) as DocumentReference<T>;

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setData(snapshot.exists() ? (snapshot.data() as T) : null);
        setLoading(false);
      },
      (err) => {
        console.error(`[useFirestoreDoc] ${collectionName}/${docId}:`, err);
        setError('Não foi possível carregar os dados.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  return { data, loading, error };
}
```

---

## Correção: `lib/contexts/accessibility-context.tsx`

**Problema:** `window.innerWidth` no render causa hydration mismatch.  
**Solução:** mover para `useEffect` + persistir com `localStorage`.

```typescript
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

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

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// Chave para persistência no localStorage
const STORAGE_KEY = 'digitalsm_accessibility';

const DEFAULTS = { fontSize: 16, layoutScale: 1, highContrast: false };

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Carrega preferências salvas ou usa padrões
  const [fontSize, setFontSize] = useState(DEFAULTS.fontSize);
  const [layoutScale, setLayoutScale] = useState(DEFAULTS.layoutScale);
  const [highContrast, setHighContrast] = useState(DEFAULTS.highContrast);

  // Carrega do localStorage após hydration (evita SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFontSize(parsed.fontSize ?? DEFAULTS.fontSize);
        setLayoutScale(parsed.layoutScale ?? DEFAULTS.layoutScale);
        setHighContrast(parsed.highContrast ?? DEFAULTS.highContrast);
      }
    } catch {
      // localStorage não disponível (ex: modo privado restrito)
    }
  }, []);

  // Aplica CSS variables e salva no localStorage quando mudam
  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--layout-scale', String(layoutScale));

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Persiste no localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, layoutScale, highContrast }));
    } catch {
      // silencioso
    }
  }, [fontSize, layoutScale, highContrast]);

  // Limites calculados após hydration (sem window no render)
  const getMaxFontSize = useCallback(() => {
    // Detecta mobile pelo viewport width
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 22;
    return 32;
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((s) => Math.min(s + 2, getMaxFontSize()));
  }, [getMaxFontSize]);

  const decreaseFontSize = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, 12));
  }, []);

  const increaseLayoutScale = useCallback(() => {
    setLayoutScale((s) => Math.min(+(s + 0.1).toFixed(1), 1.5));
  }, []);

  const decreaseLayoutScale = useCallback(() => {
    setLayoutScale((s) => Math.max(+(s - 0.1).toFixed(1), 0.8));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((c) => !c);
  }, []);

  const resetAccessibility = useCallback(() => {
    setFontSize(DEFAULTS.fontSize);
    setLayoutScale(DEFAULTS.layoutScale);
    setHighContrast(DEFAULTS.highContrast);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize, layoutScale, highContrast,
        increaseFontSize, decreaseFontSize,
        increaseLayoutScale, decreaseLayoutScale,
        toggleHighContrast, resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextType {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  return ctx;
}
```

---

## Correção: `hooks/use-mobile.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Hook de detecção de dispositivo móvel.
 * CORRIGIDO: estado inicial false (não undefined) para evitar hydration mismatch.
 */
export function useIsMobile(): boolean {
  // Inicia com false para SSR — useEffect corrige no cliente
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Define valor inicial correto no cliente
    setIsMobile(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
```

---

## Atualização: `components/shared/NotificationsPanel.tsx`

**Conectar ao Firestore** — buscar avisos da coleção `notices` (futura):

```typescript
// Abordagem transitória: manter mock mas estruturar para dados reais
// Quando coleção 'notices' existir, substituir por:

import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

// Hook futuro:
export function useNotifications(userId: string) {
  // 1. Avisos municipais globais (coleção notices)
  // 2. Atualizações de status dos protocolos do usuário
  // Combinar e retornar ordenado por data
}
```

---

## Atualização: `components/shared/GlobalStatsModal.tsx`

**Conectar ao Firestore** — contar documentos reais:

```typescript
// Importar e usar:
import { getCountFromServer, collection } from 'firebase/firestore';

async function fetchRealStats() {
  const [reportsCount, petitionsCount] = await Promise.all([
    getCountFromServer(collection(db, 'reports')),
    getCountFromServer(collection(db, 'petitions')),
  ]);

  return {
    totalReports: reportsCount.data().count,
    totalPetitions: petitionsCount.data().count,
  };
}
```

---

## Novos Primitivos de UI

### `components/ui/Button.tsx`

```typescript
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-surface-low border-2 border-outline/30 text-text-main hover:border-primary hover:text-primary',
  ghost: 'text-text-muted hover:text-text-main hover:bg-surface-low',
  danger: 'bg-accent-danger text-white hover:bg-accent-danger/90',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs rounded-lg',
  md: 'px-5 py-3 text-sm rounded-xl',
  lg: 'px-6 py-4 text-base rounded-xl',
};

/**
 * Botão padronizado com variantes e estado de loading.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'font-ui font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### `components/ui/EmptyState.tsx`

```typescript
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Estado vazio padronizado para listas sem dados.
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-16 h-16 bg-surface-med rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <div>
        <p className="font-display font-bold text-text-main">{title}</p>
        {description && (
          <p className="text-sm text-text-muted font-ui mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```
