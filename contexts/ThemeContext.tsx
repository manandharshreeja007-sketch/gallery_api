'use client';

// ============================================
// Theme Context Provider
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage, isClient } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

function getSystemTheme(): 'light' | 'dark' {
  if (!isClient()) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = storage.get<Theme>(STORAGE_KEYS.THEME, 'system');
    setThemeState(savedTheme);
    setMounted(true);
  }, []);

  // Update resolved theme when theme or system preference changes
  useEffect(() => {
    if (!mounted) return;

    const updateResolvedTheme = () => {
      const resolved = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(resolved);
      
      // Update document class
      if (isClient()) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    if (theme === 'system' && isClient()) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateResolvedTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Always render with Provider, use default/current values
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {mounted ? children : (
        <div className="min-h-screen bg-zinc-950">
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
