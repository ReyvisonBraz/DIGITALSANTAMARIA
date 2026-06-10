/**
 * @module auth-context
 * @description Contexto de autenticação do Digital Santa Maria.
 *
 * Fornece:
 * - Estado do usuário autenticado (Firebase Auth User)
 * - Role do usuário (citizen, admin, clerk)
 * - Estado de loading da autenticação
 * - Métodos login() e logout()
 *
 * Fluxo de autenticação:
 * 1. `onAuthStateChanged` detecta mudanças de estado
 * 2. Se novo login, `syncUserProfile` cria perfil no Firestore (se não existe)
 * 3. `fetchUserRole` busca role na coleção `admins`
 *
 * @example
 * ```tsx
 * const { user, userRole, login, logout, loading } = useAuth();
 * ```
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { createLogger } from './logger';
import type { UserRole } from '@/types';

const authLogger = createLogger('Auth');

// ─── Tipos do contexto ──────────────────────────────────────────────

/** Interface pública do contexto de autenticação */
interface AuthContextType {
  /** Usuário do Firebase Auth (null se não autenticado) */
  user: User | null;
  /** Role do usuário no sistema (citizen, admin, clerk) */
  userRole: UserRole;
  /** Se a autenticação ainda está sendo verificada */
  loading: boolean;
  authError: string | null;
  /** Inicia login com Google via popup */
  login: () => Promise<void>;
  /** Faz logout e limpa estado */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Funções auxiliares ─────────────────────────────────────────────

/**
 * Busca a role do usuário na coleção `admins`.
 * Se não encontrado, retorna 'citizen' como padrão.
 */
function fetchUserRole(uid: string): Promise<UserRole> {
  return getDoc(doc(db, 'admins', uid))
    .then((snap) => {
      if (!snap.exists()) return 'citizen' as UserRole;
      const data = snap.data();
      return (data.role === 'admin' || data.role === 'clerk' ? data.role : 'citizen') as UserRole;
    })
    .catch((error: unknown) => {
      const err = error as { code?: string };
      if (err.code === 'permission-denied') {
        return 'citizen' as UserRole;
      }
      throw error;
    });
}

/**
 * Sincroniza o perfil do usuário no Firestore.
 * Cria o documento apenas se não existir (primeiro login).
 */
function syncUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  return getDoc(userRef).then((snap) => {
    if (snap.exists()) return;
    return setDoc(userRef, {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || null,
      role: 'citizen',
      department: null,
      neighborhood: null,
      phone: null,
      cpfVerified: false,
      points: 0,
      level: 'Cidadão',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

// ─── Provider ───────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  /** Escuta mudanças de estado de autenticação */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setAuthError(null);
        authLogger.info('Auth state: user logged in', {
          userId: fbUser.uid,
          email: fbUser.email || '',
        });
        setUser(fbUser);
        // Cookie com ID token real para middleware de protecao server-side
        fbUser.getIdToken().then((token) => {
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=86400; SameSite=Strict`;
        }).catch(() => {});
        try {
          await syncUserProfile(fbUser);
          const role = await fetchUserRole(fbUser.uid);
          setUserRole(role);
        } catch (err) {
          authLogger.error('Failed to sync profile or fetch role', {}, err);
        }
      } else {
        authLogger.info('Auth state: no user (logged out)');
        setUser(null);
        setUserRole('citizen');
        // Remove cookie
        document.cookie = 'firebase-auth-token=; path=/; max-age=0';
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /** Inicia login com Google OAuth via popup */
  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    authLogger.info('Login initiated');
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      authLogger.info('Login successful', {
        userId: result.user.uid,
        email: result.user.email || '',
      });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'auth/popup-blocked') {
        const message = 'Popup bloqueado. Permita popups para este site e tente novamente.';
        setAuthError(message);
        authLogger.error('Popup blocked by browser', {});
        throw new Error(message);
      }
      if (err.code === 'auth/unauthorized-domain') {
        const message = 'Dominio local nao autorizado no Firebase. Adicione localhost em Authentication > Settings > Authorized domains.';
        setAuthError(message);
        authLogger.error('Unauthorized OAuth domain', {});
        throw new Error(message);
      }
      authLogger.error('Login failed', {}, error);
      throw error;
    }
  }, []);

  /** Faz logout do Firebase Auth */
  const logout = useCallback(async () => {
    authLogger.info('Logout initiated', { userId: auth.currentUser?.uid });
    try {
      await signOut(auth);
      authLogger.info('Logout successful');
    } catch (error) {
      authLogger.error('Logout failed', {}, error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────

/**
 * Hook para acessar o contexto de autenticação.
 * Deve ser usado dentro de um `AuthProvider`.
 *
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
