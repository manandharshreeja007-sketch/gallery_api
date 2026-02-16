'use client';

// ============================================
// NSFW Context Provider
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage, isClient } from '@/lib/utils';

interface NsfwConsent {
  hasConsent: boolean;
  timestamp: number;
}

interface NsfwContextType {
  nsfwEnabled: boolean;
  hasConsent: boolean;
  consentTimestamp: number | null;
  showAgeGate: boolean;
  setNsfwEnabled: (enabled: boolean) => void;
  grantConsent: () => void;
  revokeConsent: () => void;
  openAgeGate: () => void;
  closeAgeGate: () => void;
}

const defaultNsfwContext: NsfwContextType = {
  nsfwEnabled: false,
  hasConsent: false,
  consentTimestamp: null,
  showAgeGate: false,
  setNsfwEnabled: () => {},
  grantConsent: () => {},
  revokeConsent: () => {},
  openAgeGate: () => {},
  closeAgeGate: () => {},
};

const NsfwContext = createContext<NsfwContextType>(defaultNsfwContext);

export function NsfwProvider({ children }: { children: React.ReactNode }) {
  const [nsfwEnabled, setNsfwEnabledState] = useState(false);
  const [consent, setConsent] = useState<NsfwConsent>({ hasConsent: false, timestamp: 0 });
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load consent from storage on mount
  useEffect(() => {
    if (isClient()) {
      const savedConsent = storage.get<NsfwConsent>(STORAGE_KEYS.NSFW_CONSENT, {
        hasConsent: false,
        timestamp: 0,
      });
      setConsent(savedConsent);
      setMounted(true);
    }
  }, []);

  const setNsfwEnabled = useCallback((enabled: boolean) => {
    if (enabled && !consent.hasConsent) {
      setShowAgeGate(true);
      return;
    }
    setNsfwEnabledState(enabled);
  }, [consent.hasConsent]);

  const grantConsent = useCallback(() => {
    const newConsent: NsfwConsent = {
      hasConsent: true,
      timestamp: Date.now(),
    };
    setConsent(newConsent);
    storage.set(STORAGE_KEYS.NSFW_CONSENT, newConsent);
    setNsfwEnabledState(true);
    setShowAgeGate(false);
  }, []);

  const revokeConsent = useCallback(() => {
    const newConsent: NsfwConsent = {
      hasConsent: false,
      timestamp: 0,
    };
    setConsent(newConsent);
    storage.set(STORAGE_KEYS.NSFW_CONSENT, newConsent);
    setNsfwEnabledState(false);
  }, []);

  const openAgeGate = useCallback(() => {
    setShowAgeGate(true);
  }, []);

  const closeAgeGate = useCallback(() => {
    setShowAgeGate(false);
  }, []);

  return (
    <NsfwContext.Provider
      value={{
        nsfwEnabled,
        hasConsent: consent.hasConsent,
        consentTimestamp: consent.timestamp || null,
        showAgeGate,
        setNsfwEnabled,
        grantConsent,
        revokeConsent,
        openAgeGate,
        closeAgeGate,
      }}
    >
      {children}
    </NsfwContext.Provider>
  );
}

export function useNsfw() {
  return useContext(NsfwContext);
}
