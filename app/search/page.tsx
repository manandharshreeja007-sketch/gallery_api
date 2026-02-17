"use client";

// ============================================
// Search Page - AI-Powered Semantic Search
// ============================================

import React, { useState, useEffect, useCallback, Suspense } from "react"; // Added Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { WaifuImage, Category } from "@/types";
import { fetchMultipleImages } from "@/lib/api";
import { semanticSearch, enhanceImagesWithAI } from "@/lib/ai";
import {
  SFW_CATEGORIES,
  CATEGORY_INFO,
  SEARCH_KEYWORDS,
} from "@/lib/constants";
import { ImageCard } from "@/components";
import { useAnalytics } from "@/contexts";
import { SkyscraperAd } from "@/components/ads";

// Popular search suggestions
const POPULAR_SEARCHES = [
  { query: "cute anime girl", icon: "🥰" },
  { query: "happy smile", icon: "😊" },
  { query: "romantic couple", icon: "💕" },
  { query: "cool action", icon: "⚡" },
  { query: "crying sad", icon: "😢" },
  { query: "blushing shy", icon: "😳" },
  { query: "dancing happy", icon: "💃" },
  { query: "sleepy tired", icon: "😴" },
];

// --- 1. The Wrapper Component (Fixes the build error) ---
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

// --- 2. The Actual Content Logic ---
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [matchedCategories, setMatchedCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { trackSearch } = useAnalytics();

  const updateSuggestions = useCallback((input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    const lowerInput = input.toLowerCase();
    const allKeywords = Object.values(SEARCH_KEYWORDS).flat();
    const matched = allKeywords
      .filter((keyword) => keyword.toLowerCase().includes(lowerInput))
      .slice(0, 5);
    setSuggestions(matched);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSuggestions(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput, updateSuggestions]);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      setSearched(true);
      setQuery(searchQuery);

      router.push(`/search?q=${encodeURIComponent(searchQuery)}`, {
        scroll: false,
      });

      try {
        const categories = semanticSearch(searchQuery) as Category[];
        setMatchedCategories(categories.slice(0, 5));
        trackSearch(searchQuery, categories.length);

        if (categories.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        const promises = categories
          .slice(0, 3)
          .map((cat) => fetchMultipleImages("sfw", cat).catch(() => []));
        const imageResults = await Promise.all(promises);
        const allImages = enhanceImagesWithAI(imageResults.flat());

        const sortedImages = allImages.sort((a, b) => {
          const aIdx = categories.indexOf(a.category as Category);
          const bIdx = categories.indexOf(b.category as Category);
          return aIdx - bIdx;
        });

        setResults(sortedImages.slice(0, 50));
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [router, trackSearch],
  );

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
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white text-center mb-4">
            🔍 AI-Powered Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
            Search for anime images using natural language. Our AI understands
            context and mood!
          </p>

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

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

        {!searched ? (
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
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Results for &quot;{query}&quot;
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  Found {results.length} images
                </p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {results.map((image, index) => (
                    <ImageCard key={`${image.id}-${index}`} image={image} />
                  ))}
                </div>
              )}
            </div>
            {/* Desktop Skyscraper Sidebar */}
            <div className="hidden xl:block w-[180px] flex-shrink-0">
              <SkyscraperAd />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
