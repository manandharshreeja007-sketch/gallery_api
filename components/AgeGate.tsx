'use client';

// ============================================
// AgeGate Component
// ============================================

import React, { useState } from 'react';
import { useNsfw } from '@/contexts';
import { cn } from '@/lib/utils';

export function AgeGate() {
  const { showAgeGate, closeAgeGate, grantConsent } = useNsfw();
  const [confirmed, setConfirmed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleContinue = () => {
    if (!confirmed) {
      setShowWarning(true);
      return;
    }
    grantConsent();
  };

  if (!showAgeGate) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Warning Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Age Verification Required</h2>
              <p className="text-red-100 text-sm">NSFW Content Warning</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The section you are about to enter contains{' '}
            <strong className="text-red-500">explicit adult content</strong> that is only
            suitable for individuals who are{' '}
            <strong className="text-red-500">18 years of age or older</strong>.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
              By continuing, you confirm that:
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                You are at least 18 years old
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                It is legal to view such content in your jurisdiction
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                You understand the nature of the content
              </li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group mb-4">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  setShowWarning(false);
                }}
                className="sr-only peer"
              />
              <div className={cn(
                'w-5 h-5 rounded border-2 transition-all duration-200',
                confirmed
                  ? 'bg-pink-500 border-pink-500'
                  : 'border-zinc-300 dark:border-zinc-600 group-hover:border-pink-400'
              )}>
                {confirmed && (
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              I confirm that I am <strong>18 years of age or older</strong> and I consent to viewing adult content.
            </span>
          </label>

          {showWarning && (
            <p className="text-red-500 text-sm mb-4 animate-shake">
              Please confirm that you are 18+ to continue.
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closeAgeGate}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
                'hover:bg-zinc-200 dark:hover:bg-zinc-700'
              )}
            >
              Go Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!confirmed}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                confirmed
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/30'
                  : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed'
              )}
            >
              Enter (18+)
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeAgeGate}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
