'use client';

// ============================================
// Search Page - AI-Powered Semantic Search
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { WaifuImage, Category } from '@/types';
import { fetchMultipleImages } from '@/lib/api';
import { semanticSearch, enhanceImagesWithAI } from '@/lib/ai';
import { SFW_CATEGORIES, CATEGORY_INFO, SEARCH_KEYWORDS } from '@/lib/constants';
import { ImageCard } from '@/components';
import { useAnalytics } from '@/contexts';

// Popular search suggestions
const POPULAR_SEARCHES = [
  { query: 'cute anime girl', icon: '🥰' },
  { query: 'happy smile', icon: '😊' },
  { query: 'romantic couple', icon: '💕' },
  { query: 'cool action', icon: '⚡' },
  { query: 'crying sad', icon: '😢' },
  { query: 'blushing shy', icon: '😳' },
  { query: 'dancing happy', icon: '💃' },
  { query: 'sleepy tired', icon: '😴' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [matchedCategories, setMatchedCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { trackSearch } = useAnalytics();

  // Generate search suggestions based on input
  const updateSuggestions = useCallback((input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const lowerInput = input.toLowerCase();
    const allKeywords = Object.values(SEARCH_KEYWORDS).flat();
    const matched = allKeywords
      .filter(keyword => keyword.toLowerCase().includes(lowerInput))
      .slice(0, 5);
    setSuggestions(matched);
  }, []);

  // Debounced update for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSuggestions(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput, updateSuggestions]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setQuery(searchQuery);
    
    // Update URL
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
    
    try {
      // Get matching categories using semantic search
      const categories = semanticSearch(searchQuery) as Category[];
      setMatchedCategories(categories.slice(0, 5));
      
      // Track the search
      trackSearch(searchQuery, categories.length);
      
      if (categories.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Fetch images from matched categories
      const promises = categories.slice(0, 3).map(cat =>
        fetchMultipleImages('sfw', cat).catch(() => [])
      );
      const imageResults = await Promise.all(promises);
      const allImages = enhanceImagesWithAI(imageResults.flat());
      
      // Sort by relevance (images from first matched category appear first)
      const sortedImages = allImages.sort((a, b) => {
        const aIdx = categories.indexOf(a.category as Category);
        const bIdx = categories.indexOf(b.category as Category);
        return aIdx - bIdx;
      });
      
      setResults(sortedImages.slice(0, 50));
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [router, trackSearch]);

  // Search on initial load if query exists
  useEffect(() => {
    if (initialQuery && !searched) {
      performSearch(initialQuery);
    }
  }, [initialQuery, searched, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch(searchInput);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const handlePopularSearch = (searchQuery: string) => {
    setSearchInput(searchQuery);
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white text-center mb-4">
            🔍 AI-Powered Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
            Search for anime images using natural language. Our AI understands context and mood!
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Try 'cute happy girl' or 'romantic couple'..."
                className="w-full px-6 py-4 pl-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <span className="text-zinc-400 mr-2">🔍</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Show results or suggestions */}
        {!searched ? (
          /* Popular Searches */
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              ✨ Popular Searches
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {POPULAR_SEARCHES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePopularSearch(item.query)}
                  className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.query}</span>
                </button>
              ))}
            </div>

            {/* Browse Categories */}
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mt-12 mb-4">
              🏷️ Or Browse Categories
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {(SFW_CATEGORIES.slice(0, 12) as Category[]).map((cat) => {
                const info = CATEGORY_INFO[cat];
                if (!info) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => router.push(`/gallery?category=${cat}`)}
                    className="flex flex-col items-center gap-2 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Query Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Results for &quot;{query}&quot;
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Found {results.length} images
                {matchedCategories.length > 0 && (
                  <> in categories: {matchedCategories.map(cat => CATEGORY_INFO[cat]?.name).join(', ')}</>
                )}
              </p>
            </div>

            {/* Matched Categories Pills */}
            {matchedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {matchedCategories.map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  if (!info) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => router.push(`/gallery?category=${cat}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                    >
                      <span>{info.icon}</span>
                      <span>{info.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-zinc-600 dark:text-zinc-400">Searching...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((image, index) => (
                  <ImageCard key={`${image.id}-${index}`} image={image} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Try different keywords or browse our categories
                </p>
                <button
                  onClick={() => {
                    setSearched(false);
                    setSearchInput('');
                    setQuery('');
                    router.push('/search');
                  }}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
