'use client';

// ============================================
// ScrollToTop Component
// ============================================

import React from 'react';
import { useScrollToTop } from '@/hooks';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const { showButton, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-12 h-12 rounded-full',
        'bg-gradient-to-r from-pink-500 to-purple-500',
        'text-white shadow-lg shadow-pink-500/30',
        'flex items-center justify-center',
        'transition-all duration-300',
        'hover:shadow-xl hover:scale-110',
        showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
