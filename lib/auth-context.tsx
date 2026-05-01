'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function fetchUserRole(uid: string): Promise<UserRole> {
  return getDoc(doc(db, 'admins', uid)).then((snap) => {
    if (!snap.exists()) return 'citizen' as UserRole;
    const data = snap.data();
    return (data.role === 'admin' || data.role === 'clerk' ? data.role : 'citizen') as UserRole;
  });
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        authLogger.info('Auth state: user logged in', {
          userId: fbUser.uid,
          email: fbUser.email || '',
        });
        setUser(fbUser);
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
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    authLogger.info('Login initiated');
    try {
      const result = await signInWithPopup(auth, provider);
      authLogger.info('Login successful', {
        userId: result.user.uid,
        email: result.user.email || '',
      });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'auth/popup-blocked') {
        authLogger.error('Popup blocked by browser', {});
        throw new Error('Popup bloqueado. Permita popups para este site e tente novamente.');
      }
      authLogger.error('Login failed', {}, error);
      throw error;
    }
  };

  const logout = async () => {
    authLogger.info('Logout initiated', { userId: auth.currentUser?.uid });
    try {
      await signOut(auth);
      authLogger.info('Logout successful');
    } catch (error) {
      authLogger.error('Logout failed', {}, error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
