'use client';

// ============================================
// Toast Component
// ============================================

import React from 'react';
import { useToast } from '@/contexts';
import { cn } from '@/lib/utils';

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const toastColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg',
            'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700',
            'animate-slide-in-right'
          )}
          role="alert"
        >
          <span
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold',
              toastColors[toast.type]
            )}
          >
            {toastIcons[toast.type]}
          </span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
