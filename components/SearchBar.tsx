'use client';

// ============================================
// SearchBar Component
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDebounce, useClickOutside } from '@/hooks';
import { useAnalytics } from '@/contexts';
import { semanticSearch, detectMood, getCategoriesForMood } from '@/lib/ai';
import { CATEGORY_INFO, SEARCH_KEYWORDS } from '@/lib/constants';
import { Category, Mood } from '@/types';

interface SearchBarProps {
  onSearch?: (query: string, categories: Category[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for anime images... (e.g., "cute catgirl", "happy smile")',
  autoFocus = false,
  showSuggestions = true,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [detectedMood, setDetectedMood] = useState<Mood | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { getRecentSearches, trackSearch } = useAnalytics();

  const dropdownRef = useClickOutside<HTMLDivElement>(() => setShowDropdown(false));

  // Get suggestions based on query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setDetectedMood(null);
      return;
    }

    const matchedCategories = semanticSearch(debouncedQuery);
    setSuggestions(matchedCategories);

    const mood = detectMood(debouncedQuery);
    setDetectedMood(mood);
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const categories = semanticSearch(query);
    trackSearch(query, categories.length);

    if (onSearch) {
      onSearch(query, categories);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }

    setShowDropdown(false);
  };

  const handleSuggestionClick = (category: Category) => {
    const info = CATEGORY_INFO[category];
    setQuery(info?.name || category);
    setShowDropdown(false);

    if (onSearch) {
      onSearch(category, [category]);
    } else {
      router.push(`/gallery?category=${category}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  const recentSearches = getRecentSearches(5);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              'w-full px-5 py-4 pl-12 pr-14 rounded-2xl',
              'bg-white dark:bg-zinc-800',
              'border-2 border-zinc-200 dark:border-zinc-700',
              'focus:border-pink-500 dark:focus:border-pink-500',
              'text-zinc-900 dark:text-white placeholder-zinc-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-pink-500/20',
              'text-lg'
            )}
          />

          {/* Search Icon */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
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

          {/* AI Badge */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
              AI
            </span>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && (suggestions.length > 0 || recentSearches.length > 0 || detectedMood) && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-2 p-4',
            'bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl',
            'border border-zinc-200 dark:border-zinc-700',
            'max-h-[400px] overflow-y-auto',
            'animate-slide-down z-50'
          )}
        >
          {/* Detected Mood */}
          {detectedMood && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Detected Mood
              </h4>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                <span className="text-lg">
                  {detectedMood === 'happy' && '😊'}
                  {detectedMood === 'sad' && '😢'}
                  {detectedMood === 'romantic' && '💕'}
                  {detectedMood === 'playful' && '😜'}
                  {detectedMood === 'aggressive' && '😤'}
                  {detectedMood === 'calm' && '😌'}
                  {detectedMood === 'excited' && '🤩'}
                  {detectedMood === 'cute' && '🥰'}
                </span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                  {detectedMood}
                </span>
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Matching Categories
              </h4>
              <div className="space-y-1">
                {suggestions.map((category, index) => {
                  const info = CATEGORY_INFO[category];
                  return (
                    <button
                      key={category}
                      onClick={() => handleSuggestionClick(category)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        index === highlightedIndex
                          ? 'bg-pink-100 dark:bg-pink-900/30'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      )}
                    >
                      <span className="text-xl">{info?.icon || '🎨'}</span>
                      <div className="text-left">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {info?.name || category}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {info?.description || 'Anime images'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Recent Searches
              </h4>
              <div className="space-y-1">
                {recentSearches.map((item, index) => (
                  <button
                    key={`${item.query}-${index}`}
                    onClick={() => {
                      setQuery(item.query);
                      const categories = semanticSearch(item.query);
                      if (onSearch) {
                        onSearch(item.query, categories);
                      } else {
                        router.push(`/search?q=${encodeURIComponent(item.query)}`);
                      }
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-zinc-700 dark:text-zinc-300">{item.query}</span>
                    <span className="text-xs text-zinc-400 ml-auto">
                      {item.resultsCount} results
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          {!query && recentSearches.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Try searching for &quot;cute catgirl&quot; or &quot;happy smile&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
