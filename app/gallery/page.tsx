'use client';

// ============================================
// Gallery Page
// ============================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { WaifuImage, Category, Mood } from '@/types';
import { fetchMultipleImages } from '@/lib/api';
import { enhanceImagesWithAI, getCategoriesForMood } from '@/lib/ai';
import { SFW_CATEGORIES, CATEGORY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ImageGallery, CategoryFilter, CategoryTabs } from '@/components';
import { useAnalytics } from '@/contexts';

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    initialCategory && SFW_CATEGORIES.includes(initialCategory as never) ? initialCategory : 'all'
  );
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const { trackCategoryView } = useAnalytics();

  // Get filtered categories based on mood
  const filteredCategories = useMemo(() => {
    if (!selectedMood) return SFW_CATEGORIES as Category[];
    return getCategoriesForMood(selectedMood) as Category[];
  }, [selectedMood]);

  // Load images
  const loadImages = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    
    try {
      let newImages: WaifuImage[] = [];
      
      if (selectedCategory === 'all') {
        // Load from multiple random categories
        const categoriesToLoad = filteredCategories.slice(0, 6);
        const promises = categoriesToLoad.map(cat => 
          fetchMultipleImages('sfw', cat).catch(() => [])
        );
        const results = await Promise.all(promises);
        newImages = results.flat().slice(0, 30);
      } else {
        newImages = await fetchMultipleImages('sfw', selectedCategory);
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
  }, [selectedCategory, filteredCategories, trackCategoryView]);

  // Initial load
  useEffect(() => {
    setImages([]);
    setHasMore(true);
    loadImages(true);
  }, [selectedCategory, selectedMood]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadImages(false);
    }
  }, [loading, hasMore, loadImages]);

  const handleCategoryChange = useCallback((category: Category | 'all') => {
    setSelectedCategory(category);
    // Update URL without navigation
    const url = category === 'all' 
      ? '/gallery' 
      : `/gallery?category=${category}`;
    window.history.pushState({}, '', url);
  }, []);

  const handleMoodChange = useCallback((mood: Mood | null) => {
    setSelectedMood(mood);
    // Reset to 'all' when mood changes to show mood-filtered categories
    if (mood && selectedCategory !== 'all') {
      const moodCategories = getCategoriesForMood(mood);
      if (!moodCategories.includes(selectedCategory as never)) {
        setSelectedCategory('all');
      }
    }
  }, [selectedCategory]);

  const categoryInfo = selectedCategory !== 'all' ? CATEGORY_INFO[selectedCategory] : null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                {categoryInfo ? (
                  <>
                    <span className="mr-2">{categoryInfo.icon}</span>
                    {categoryInfo.name}
                  </>
                ) : (
                  'Gallery'
                )}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {categoryInfo 
                  ? categoryInfo.description 
                  : `Browse ${images.length}+ beautiful anime images`
                }
              </p>
            </div>
            
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Category Tabs (Desktop) */}
          <div className="hidden md:block">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={filteredCategories}
            />
          </div>
        </div>

        {/* Mobile Filters */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          showFilters ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              showMoodFilter={true}
              selectedMood={selectedMood}
              onMoodChange={handleMoodChange}
              categories={filteredCategories}
            />
          </div>
        </div>

        {/* Desktop Sidebar + Gallery Grid */}
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Mood Filter */}
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎭</span> Filter by Mood
                </h3>
                <div className="space-y-2">
                  {(['happy', 'sad', 'romantic', 'playful', 'aggressive', 'calm', 'excited', 'cute'] as Mood[]).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodChange(selectedMood === mood ? null : mood)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedMood === mood
                          ? 'bg-pink-500 text-white'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      )}
                    >
                      {mood === 'happy' && '😊 '}
                      {mood === 'sad' && '😢 '}
                      {mood === 'romantic' && '💕 '}
                      {mood === 'playful' && '😜 '}
                      {mood === 'aggressive' && '😤 '}
                      {mood === 'calm' && '😌 '}
                      {mood === 'excited' && '🤩 '}
                      {mood === 'cute' && '🥰 '}
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <button
                    onClick={() => handleMoodChange(null)}
                    className="mt-3 text-sm text-pink-500 hover:text-pink-600"
                  >
                    Clear mood filter
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📊</span> Stats
                </h3>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Images loaded: <span className="font-medium text-zinc-900 dark:text-white">{images.length}</span></p>
                  <p>Category: <span className="font-medium text-zinc-900 dark:text-white">{selectedCategory === 'all' ? 'All' : categoryInfo?.name}</span></p>
                  {selectedMood && (
                    <p>Mood: <span className="font-medium text-zinc-900 dark:text-white capitalize">{selectedMood}</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 min-w-0">
            <ImageGallery
              images={images}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              columns={4}
              emptyMessage="No images found. Try a different category or mood."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
