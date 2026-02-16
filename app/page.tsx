'use client';

// ============================================
// Home Page
// ============================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WaifuImage, Category } from '@/types';
import { fetchImagesFromCategories } from '@/lib/api';
import { enhanceImagesWithAI } from '@/lib/ai';
import { FEATURED_CATEGORIES, CATEGORY_INFO } from '@/lib/constants';
import { cn, shuffleArray } from '@/lib/utils';
import { ImageGallery, SearchBar, CategoryShowcase, RecommendationsSection } from '@/components';
import { useAnalytics } from '@/contexts';

export default function HomePage() {
  const [featuredImages, setFeaturedImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackCategoryView } = useAnalytics();

  useEffect(() => {
    async function loadFeaturedImages() {
      try {
        const images = await fetchImagesFromCategories('sfw', FEATURED_CATEGORIES, 5);
        const enhanced = enhanceImagesWithAI(images);
        setFeaturedImages(shuffleArray(enhanced));
      } catch (error) {
        console.error('Failed to load featured images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedImages();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-950/30 dark:via-purple-950/20 dark:to-indigo-950/30" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400/30 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Waifu Gallery
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Discover beautiful anime-style images with AI-powered search,
              personalized recommendations, and infinite exploration.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                placeholder="Search with AI... (e.g., 'cute smiling catgirl')"
                showSuggestions={true}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/gallery"
                className="btn-primary text-lg px-8 py-3"
              >
                <span>🖼️</span>
                Browse Gallery
              </Link>
              <Link
                href="/search"
                className="btn-secondary text-lg px-8 py-3"
              >
                <span>🔍</span>
                Advanced Search
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
            {[
              { value: '31', label: 'Categories' },
              { value: '∞', label: 'Images' },
              { value: 'AI', label: 'Powered' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Explore Categories
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Start browsing your favorite anime image categories
            </p>
          </div>
          <CategoryShowcase categories={FEATURED_CATEGORIES} />
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              View all 31 categories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <RecommendationsSection />

      {/* Featured Images */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                Featured Images
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                A curated selection of beautiful anime images
              </p>
            </div>
            <Link
              href="/gallery"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
            >
              See more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <ImageGallery
            images={featuredImages}
            loading={loading}
            hasMore={false}
            columns={4}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Powerful Features
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Everything you need for the ultimate anime image experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🧠',
                title: 'AI-Powered Search',
                description: 'Search naturally with phrases like "cute smiling catgirl" and let AI find the best matches.',
              },
              {
                icon: '🎨',
                title: '31 Categories',
                description: 'From waifus to nekos, hugs to dances - explore a wide variety of anime image categories.',
              },
              {
                icon: '♾️',
                title: 'Infinite Scroll',
                description: 'Endless images with smart duplicate prevention. Never see the same image twice.',
              },
              {
                icon: '❤️',
                title: 'Favorites Collection',
                description: 'Save your favorite images and access them anytime. Export and share your collection.',
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                description: 'Easy on the eyes with beautiful light and dark themes. Automatically follows your system.',
              },
              {
                icon: '📱',
                title: 'PWA Support',
                description: 'Install as an app on any device. Works offline with cached images.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  'p-6 rounded-2xl',
                  'bg-white dark:bg-zinc-800',
                  'border border-zinc-200 dark:border-zinc-700',
                  'transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
                )}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Dive into the infinite world of beautiful anime images.
            Start your journey now!
          </p>
          <Link
            href="/gallery"
            className="btn-primary text-lg px-10 py-4"
          >
            Start Exploring
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
