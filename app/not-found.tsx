// ============================================
// Custom 404 Page
// ============================================

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  // Random anime expressions
  const expressions = [
    { emoji: '😭', text: 'Waaah! Page not found!' },
    { emoji: '🥺', text: 'This page seems to have disappeared...' },
    { emoji: '😵', text: 'Oops! We couldn\'t find that page!' },
    { emoji: '🤷‍♀️', text: 'Hmm, nothing here...' },
  ];
  
  // Pick a random expression (during build time)
  const expression = expressions[Math.floor(Math.random() * expressions.length)];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-zinc-100 dark:text-zinc-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl md:text-9xl animate-bounce">{expression.emoji}</span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          {expression.text}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link href="/gallery" className="btn-secondary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Browse Gallery
          </Link>
        </div>

        {/* Fun suggestion */}
        <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl max-w-md mx-auto">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            💡 <strong>Pro tip:</strong> Try our{' '}
            <Link href="/search" className="text-pink-500 hover:text-pink-600 underline">
              AI-powered search
            </Link>{' '}
            to find exactly what you&apos;re looking for!
          </p>
        </div>
      </div>
    </div>
  );
}
