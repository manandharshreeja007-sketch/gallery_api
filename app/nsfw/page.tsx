'use client';

// ============================================
// NSFW Page - Age-Gated Content
// ============================================

import React, { useState, useEffect, useCallback, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import { WaifuImage, NsfwCategory } from '@/types';
import { fetchMultipleImages } from '@/lib/api';
import { enhanceImagesWithAI } from '@/lib/ai';
import { NSFW_CATEGORIES, NSFW_CATEGORY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ImageGallery, AgeGate } from '@/components';
import { useNsfw, useAnalytics } from '@/contexts';

// --- 1. The Wrapper Component (Fixes the build error) ---
export default function NsfwPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <NSFWContent />
    </Suspense>
  );
}

// --- 2. The Actual Content Logic ---
function NSFWContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as NsfwCategory | null;
  
  const { hasConsent, openAgeGate } = useNsfw();
  const { trackCategoryView } = useAnalytics();
  
  // Automatically open age gate if user doesn't have consent
  useEffect(() => {
    if (!hasConsent) {
      openAgeGate();
    }
  }, [hasConsent, openAgeGate]);
  
  const [selectedCategory, setSelectedCategory] = useState<NsfwCategory | 'all'>(
    initialCategory && NSFW_CATEGORIES.includes(initialCategory as never) ? initialCategory : 'all'
  );
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Load images
  const loadImages = useCallback(async (reset: boolean = false) => {
    if (!hasConsent) return;
    
    setLoading(true);
    
    try {
      let newImages: WaifuImage[] = [];
      
      if (selectedCategory === 'all') {
        const promises = NSFW_CATEGORIES.map(cat => 
          fetchMultipleImages('nsfw', cat).catch(() => [])
        );
        const results = await Promise.all(promises);
        newImages = results.flat().slice(0, 30);
      } else {
        newImages = await fetchMultipleImages('nsfw', selectedCategory);
        trackCategoryView(selectedCategory);
      }
      
      const enhanced = enhanceImagesWithAI(newImages);
      
      if (reset) {
        setImages(enhanced);
      } else {
        setImages(prev => [...prev, ...enhanced]);
      }
      
      setHasMore(newImages.length > 0);
    } catch (error) {
      console.error('Failed to load images:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasConsent, selectedCategory, trackCategoryView]);

  // Initial load when consent is given
  useEffect(() => {
    if (hasConsent) {
      setImages([]);
      setHasMore(true);
      loadImages(true);
    }
  }, [hasConsent, selectedCategory, loadImages]); // Added loadImages to dependency array

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadImages(false);
    }
  }, [loading, hasMore, loadImages]);

  const handleCategoryChange = useCallback((category: NsfwCategory | 'all') => {
    setSelectedCategory(category);
    const url = category === 'all' 
      ? '/nsfw' 
      : `/nsfw?category=${category}`;
    window.history.pushState({}, '', url);
  }, []);

  // Show age gate if no consent
  if (!hasConsent) {
    return <AgeGate />;
  }

  const categoryInfo = selectedCategory !== 'all' ? NSFW_CATEGORY_INFO[selectedCategory] : null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Warning Banner */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Adult Content Warning
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This section contains mature content intended for adults only (18+). 
                By continuing, you confirm that you are of legal age in your jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            {categoryInfo ? (
              <>
                <span className="mr-2">{categoryInfo.icon}</span>
                {categoryInfo.name}
              </>
            ) : (
              '🔞 NSFW Gallery'
            )}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {categoryInfo 
              ? categoryInfo.description 
              : 'Browse adult anime content'
            }
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={cn(
                'px-4 py-2 rounded-xl font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              )}
            >
              All
            </button>
            {(NSFW_CATEGORIES as NsfwCategory[]).map((cat) => {
              const info = NSFW_CATEGORY_INFO[cat];
              if (!info) return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    'px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
                    selectedCategory === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  )}
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <ImageGallery
          images={images}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          columns={4}
          emptyMessage="No images found in this category."
        />
      </div>
    </div>
  );
}