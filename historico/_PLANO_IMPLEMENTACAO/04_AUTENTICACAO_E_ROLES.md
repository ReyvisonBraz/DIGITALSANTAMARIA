# 04 — Autenticação, Roles e Proteção de Rotas

---

## Problema Atual

```typescript
// app/gestao/page.tsx:46 — HARDCODED, NÃO ESCALÁVEL
if (!user || user.email !== 'littlefigther50@gmail.com') { ... }
```

**Solução:** roles reais via coleção `/admins/{uid}` no Firestore (já prevista nas rules).

---

## Arquivo: `lib/contexts/auth-context.tsx` (ATUALIZAR)

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
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';
import type { AuthUser, UserRole } from '@/types/user.types';

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  userRole: UserRole;          // 'citizen' | 'admin' | 'clerk'
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: 'citizen',
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(true);

  /**
   * Busca o role do usuário na coleção /admins/{uid}.
   * Se não encontrar, assume 'citizen'.
   */
  const fetchUserRole = useCallback(async (uid: string): Promise<UserRole> => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        return adminDoc.data().role as UserRole;
      }
    } catch {
      // Sem permissão para ler /admins = cidadão comum
    }
    return 'citizen';
  }, []);

  /**
   * Cria ou atualiza o documento do usuário no Firestore.
   * Executado no primeiro login e em logins subsequentes.
   */
  const syncUserProfile = useCallback(async (firebaseUser: User): Promise<void> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Primeiro login — cria perfil base
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'citizen',
        department: null,
        neighborhood: null,
        phone: null,
        cpfVerified: false,
        points: 0,
        level: 'Cidadão Iniciante',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }, []);

  // Listener de estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Mapeia User do Firebase para nosso AuthUser (sem dados sensíveis)
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };

        // Sincroniza perfil e busca role em paralelo
        const [role] = await Promise.all([
          fetchUserRole(firebaseUser.uid),
          syncUserProfile(firebaseUser),
        ]);

        setUser(authUser);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole('citizen');
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [fetchUserRole, syncUserProfile]);

  /**
   * Login com Google via popup.
   * Trata popup bloqueado pelo browser.
   */
  const login = useCallback(async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-blocked') {
        throw new Error('Popup de login bloqueado. Permita popups para este site.');
      }
      if (code === 'auth/popup-closed-by-user') {
        // Usuário fechou o popup — silencioso
        return;
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

---

## Arquivo: `lib/hooks/use-auth-guard.ts` (NOVO)

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import type { UserRole } from '@/types/user.types';

/**
 * Hook de proteção de rota.
 * Redireciona para '/' se o usuário não tiver o role necessário.
 *
 * @param requiredRole - Role mínimo exigido ('citizen' | 'admin' | 'clerk')
 * @returns { authorized, loading }
 *
 * @example
 * // Em app/gestao/page.tsx
 * const { authorized, loading } = useAuthGuard('admin');
 * if (loading) return <LoadingSkeleton />;
 * if (!authorized) return null; // redirect já executado
 */
export function useAuthGuard(requiredRole: UserRole = 'citizen') {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  // Hierarquia de roles: admin > clerk > citizen
  const ROLE_HIERARCHY: Record<UserRole, number> = {
    citizen: 0,
    clerk: 1,
    admin: 2,
  };

  const hasRequiredRole =
    user !== null &&
    ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];

  useEffect(() => {
    if (!loading && !hasRequiredRole) {
      // Redireciona para home se não tiver permissão
      router.replace('/');
    }
  }, [loading, hasRequiredRole, router]);

  return {
    authorized: hasRequiredRole,
    loading,
  };
}
```

---

## Atualização: `app/gestao/page.tsx`

**Remover** o check de e-mail hardcoded e **usar** `useAuthGuard`:

```typescript
'use client';

// Substituir linhas 45-58 (check de e-mail hardcoded) por:
import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function GestaoPage() {
  // Proteção de rota — exige role 'admin' ou 'clerk'
  const { authorized, loading } = useAuthGuard('clerk');

  // Enquanto verifica permissão
  if (loading) {
    return <Skeleton variant="page" />;
  }

  // useAuthGuard já redirecionou — render nulo temporário
  if (!authorized) {
    return null;
  }

  // ... resto do componente com dados reais do Firestore
}
```

---

## Arquivo: `components/ui/Skeleton.tsx` (NOVO)

```typescript
import { cn } from '@/lib/utils/utils';

interface SkeletonProps {
  className?: string;
  /** Variante pré-definida de skeleton */
  variant?: 'line' | 'card' | 'avatar' | 'page';
}

/**
 * Skeleton loader para estados de carregamento.
 * Usa animação pulse do Tailwind.
 */
export function Skeleton({ className, variant = 'line' }: SkeletonProps) {
  if (variant === 'page') {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto animate-pulse">
        {/* Header */}
        <div className="h-8 bg-surface-med rounded-lg w-3/4" />
        {/* Cards */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface-low rounded-xl border border-outline/20" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('animate-pulse rounded-xl border border-outline/20 p-4 bg-surface-low', className)}>
        <div className="h-4 bg-surface-med rounded w-3/4 mb-3" />
        <div className="h-3 bg-surface-med rounded w-full mb-2" />
        <div className="h-3 bg-surface-med rounded w-2/3" />
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn('animate-pulse rounded-full bg-surface-med', className)} />
    );
  }

  // default: line
  return (
    <div className={cn('animate-pulse h-4 bg-surface-med rounded', className)} />
  );
}
```

---

## Arquivo: `app/error.tsx` (NOVO)

```typescript
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary global do Next.js.
 * Exibido quando um componente filho lança um erro não tratado.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log de erro para monitoramento futuro
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface-low">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center max-w-md gap-6"
      >
        {/* Ícone */}
        <div className="w-20 h-20 rounded-[2rem] bg-accent-danger/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-accent-danger" />
        </div>

        {/* Mensagem */}
        <div>
          <h1 className="font-display text-2xl font-black text-text-main uppercase tracking-tight mb-2">
            Prefeitura em Manutenção
          </h1>
          <p className="text-text-muted font-ui text-sm leading-relaxed">
            Encontramos um problema técnico temporário.
            Nossa equipe já foi notificada.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs text-accent-danger font-mono bg-accent-danger/10 px-3 py-2 rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        {/* Ação */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-ui font-semibold text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </button>
      </motion.div>
    </main>
  );
}
```

---

## Arquivo: `app/not-found.tsx` (NOVO)

```typescript
import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

/**
 * Página 404 customizada.
 * Renderizada pelo Next.js quando a rota não existe.
 */
export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface-low">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center">
          <SearchX className="w-10 h-10 text-primary" />
        </div>

        <div>
          <p className="text-primary font-ui font-bold text-sm uppercase tracking-widest mb-1">
            Erro 404
          </p>
          <h1 className="font-display text-2xl font-black text-text-main uppercase tracking-tight mb-2">
            Página Não Encontrada
          </h1>
          <p className="text-text-muted font-ui text-sm leading-relaxed">
            O serviço que você procura não existe ou foi movido.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-ui font-semibold text-sm"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
```
