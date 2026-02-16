'use client';

// ============================================
// CategoryFilter Component
// ============================================

import React, { useState, useMemo } from 'react';
import { Category, SfwCategory, Mood } from '@/types';
import { SFW_CATEGORIES, CATEGORY_INFO, MOOD_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  showMoodFilter?: boolean;
  selectedMood?: Mood | null;
  onMoodChange?: (mood: Mood | null) => void;
  categories?: Category[];
  showSearch?: boolean;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  showMoodFilter = false,
  selectedMood = null,
  onMoodChange,
  categories = SFW_CATEGORIES as Category[],
  showSearch = true,
}: CategoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 200);

  const filteredCategories = useMemo(() => {
    if (!debouncedSearch) return categories;
    
    const query = debouncedSearch.toLowerCase();
    return categories.filter((cat) => {
      const info = CATEGORY_INFO[cat];
      return (
        cat.toLowerCase().includes(query) ||
        (info?.name.toLowerCase().includes(query)) ||
        (info?.description.toLowerCase().includes(query))
      );
    });
  }, [categories, debouncedSearch]);

  const moods: Mood[] = ['happy', 'sad', 'romantic', 'playful', 'aggressive', 'calm', 'excited', 'cute'];

  const moodEmojis: Record<Mood, string> = {
    happy: '😊',
    sad: '😢',
    romantic: '💕',
    playful: '😜',
    aggressive: '😤',
    calm: '😌',
    excited: '🤩',
    cute: '🥰',
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className={cn(
              'w-full px-4 py-3 pl-10 rounded-xl',
              'bg-zinc-100 dark:bg-zinc-800',
              'border border-transparent focus:border-pink-500',
              'text-zinc-900 dark:text-white placeholder-zinc-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-pink-500/20'
            )}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {/* Mood Filter */}
      {showMoodFilter && onMoodChange && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Filter by Mood
          </h3>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => onMoodChange(selectedMood === mood ? null : mood)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  selectedMood === mood
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                )}
              >
                <span className="mr-1">{moodEmojis[mood]}</span>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div>
        {showMoodFilter && (
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Categories
          </h3>
        )}
        <div className="flex flex-wrap gap-2">
          {/* All Button */}
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
            )}
          >
            <span className="mr-1">✨</span>
            All
          </button>

          {/* Category Buttons */}
          {filteredCategories.map((category) => {
            const info = CATEGORY_INFO[category];
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                )}
              >
                {info && <span className="mr-1">{info.icon}</span>}
                {info?.name || category}
              </button>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <p className="text-zinc-400 text-sm py-4">
            No categories found for &quot;{debouncedSearch}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

// Compact horizontal scrollable variant
export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
  categories = SFW_CATEGORIES as Category[],
}: {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  categories?: Category[];
}) {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-2 pb-2 min-w-max">
          {/* All Tab */}
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
            )}
          >
            ✨ All
          </button>

          {/* Category Tabs */}
          {categories.map((category) => {
            const info = CATEGORY_INFO[category];
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                )}
              >
                {info && <span className="mr-1">{info.icon}</span>}
                {info?.name || category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />
    </div>
  );
}
