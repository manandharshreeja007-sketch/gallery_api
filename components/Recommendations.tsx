'use client';

// ============================================
// Recommendations Component
// ============================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/contexts';
import { generateRecommendations, getTrendingCategories } from '@/lib/ai';
import { CATEGORY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Category, Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const info = CATEGORY_INFO[recommendation.category];

  return (
    <Link
      href={`/gallery?category=${recommendation.category}`}
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl',
        'bg-zinc-100 dark:bg-zinc-800/50',
        'hover:bg-pink-50 dark:hover:bg-pink-900/20',
        'transition-all duration-300 hover:shadow-lg'
      )}
    >
      <span className="text-3xl transform group-hover:scale-110 transition-transform">
        {info?.icon || '🎨'}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-zinc-900 dark:text-white">
          {info?.name || recommendation.category}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {recommendation.reason}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-zinc-400 group-hover:text-pink-500 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export function RecommendationsSection() {
  const { analytics } = useAnalytics();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trending, setTrending] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate recommendations only on client side to avoid hydration mismatch
  useEffect(() => {
    setRecommendations(generateRecommendations(analytics.categoryViews));
    setTrending(getTrendingCategories());
    setMounted(true);
  }, [analytics.categoryViews]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0 && trending.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.slice(0, 4).map((rec) => (
                <RecommendationCard key={rec.category} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Trending Now
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {trending.map((category) => {
              const info = CATEGORY_INFO[category];
              return (
                <Link
                  key={category}
                  href={`/gallery?category=${category}`}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                    'bg-gradient-to-r from-pink-500/10 to-purple-500/10',
                    'border border-pink-500/20',
                    'text-pink-600 dark:text-pink-400 font-medium',
                    'hover:from-pink-500 hover:to-purple-500 hover:text-white',
                    'transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30'
                  )}
                >
                  <span>{info?.icon || '🎨'}</span>
                  {info?.name || category}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Category Showcase for Home Page
export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const info = CATEGORY_INFO[category];
        return (
          <Link
            key={category}
            href={`/gallery?category=${category}`}
            className={cn(
              'group relative aspect-square rounded-2xl overflow-hidden',
              'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
              'hover:from-pink-500/40 hover:to-purple-500/40',
              'transition-all duration-300 hover:scale-105 hover:shadow-xl'
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <span className="text-4xl mb-2 transform group-hover:scale-125 transition-transform duration-300">
                {info?.icon || '🎨'}
              </span>
              <span className="font-medium text-zinc-900 dark:text-white text-center">
                {info?.name || category}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
