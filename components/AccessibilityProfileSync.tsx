'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useAuth } from '@/lib/auth-context';
import { createLogger } from '@/lib/logger';
import { getUserProfile, updateUserAccessibilityPreferences } from '@/services/users.service';

const log = createLogger('AccessibilityProfileSync');

export default function AccessibilityProfileSync() {
  const { user, loading } = useAuth();
  const {
    fontSize,
    layoutScale,
    colorMode,
    contentMode,
    setupCompleted,
    isReady,
    setAccessibilityPrefs,
  } = useAccessibility();
  const [profileLoadedFor, setProfileLoadedFor] = useState<string | null>(null);
  const lastSaved = useRef<string>('');
  const applyingRemote = useRef(false);

  useEffect(() => {
    if (loading || !isReady) return;

    if (!user) {
      setProfileLoadedFor(null);
      lastSaved.current = '';
      return;
    }

    let cancelled = false;
    getUserProfile(user.uid)
      .then((profile) => {
        if (cancelled) return;
        if (profile?.accessibility) {
          applyingRemote.current = true;
          setAccessibilityPrefs(profile.accessibility);
          lastSaved.current = JSON.stringify(profile.accessibility);
          window.setTimeout(() => {
            applyingRemote.current = false;
          }, 0);
        }
        setProfileLoadedFor(user.uid);
      })
      .catch((error) => {
        log.error('Failed to load accessibility preferences', { userId: user.uid }, error);
        setProfileLoadedFor(user.uid);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, isReady, user, setAccessibilityPrefs]);

  useEffect(() => {
    if (!user || profileLoadedFor !== user.uid || applyingRemote.current) return;

    const accessibility = { fontSize, layoutScale, colorMode, contentMode, setupCompleted };
    const serialized = JSON.stringify(accessibility);
    if (serialized === lastSaved.current) return;

    const timeout = window.setTimeout(() => {
      updateUserAccessibilityPreferences(user.uid, accessibility)
        .then(() => {
          lastSaved.current = serialized;
        })
        .catch((error) => {
          log.error('Failed to save accessibility preferences', { userId: user.uid }, error);
        });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [user, profileLoadedFor, fontSize, layoutScale, colorMode, contentMode, setupCompleted]);

  return null;
}
