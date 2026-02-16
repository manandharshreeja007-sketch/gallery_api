'use client';

// ============================================
// Providers Wrapper
// ============================================

import React from 'react';
import {
  ThemeProvider,
  NsfwProvider,
  FavoritesProvider,
  AnalyticsProvider,
  ToastProvider,
} from '@/contexts';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AnalyticsProvider>
          <FavoritesProvider>
            <NsfwProvider>
              {children}
            </NsfwProvider>
          </FavoritesProvider>
        </AnalyticsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
