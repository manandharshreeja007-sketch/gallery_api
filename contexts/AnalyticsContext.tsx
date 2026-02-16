'use client';

// ============================================
// Analytics Context Provider
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AnalyticsData, SearchHistoryItem, Category } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage, isClient } from '@/lib/utils';

interface AnalyticsContextType {
  analytics: AnalyticsData;
  trackCategoryView: (category: Category) => void;
  trackSearch: (query: string, resultsCount: number) => void;
  trackImageClick: () => void;
  getTopCategories: (limit?: number) => { category: string; views: number }[];
  getRecentSearches: (limit?: number) => SearchHistoryItem[];
  getSearchTrends: () => { query: string; count: number }[];
  clearAnalytics: () => void;
}

const initialAnalytics: AnalyticsData = {
  categoryViews: {},
  searchHistory: [],
  imageClicks: 0,
  sessionStart: Date.now(),
  totalSessions: 1,
};

const defaultAnalyticsContext: AnalyticsContextType = {
  analytics: initialAnalytics,
  trackCategoryView: () => {},
  trackSearch: () => {},
  trackImageClick: () => {},
  getTopCategories: () => [],
  getRecentSearches: () => [],
  getSearchTrends: () => [],
  clearAnalytics: () => {},
};

const AnalyticsContext = createContext<AnalyticsContextType>(defaultAnalyticsContext);

const MAX_SEARCH_HISTORY = 100;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [mounted, setMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load analytics from storage on mount
  useEffect(() => {
    if (isClient()) {
      const savedAnalytics = storage.get<AnalyticsData>(STORAGE_KEYS.ANALYTICS, initialAnalytics);
      setAnalytics({
        ...savedAnalytics,
        sessionStart: Date.now(),
        totalSessions: (savedAnalytics.totalSessions || 0) + 1,
      });
      setMounted(true);
    }
  }, []);

  // Debounced save to storage
  const saveAnalytics = useCallback((data: AnalyticsData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      storage.set(STORAGE_KEYS.ANALYTICS, data);
    }, 1000);
  }, []);

  // Save analytics whenever they change
  useEffect(() => {
    if (mounted) {
      saveAnalytics(analytics);
    }
  }, [analytics, mounted, saveAnalytics]);

  const trackCategoryView = useCallback((category: Category) => {
    setAnalytics(prev => ({
      ...prev,
      categoryViews: {
        ...prev.categoryViews,
        [category]: (prev.categoryViews[category] || 0) + 1,
      },
    }));
  }, []);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    const searchItem: SearchHistoryItem = {
      query: query.toLowerCase().trim(),
      timestamp: Date.now(),
      resultsCount,
    };

    setAnalytics(prev => ({
      ...prev,
      searchHistory: [
        searchItem,
        ...prev.searchHistory.slice(0, MAX_SEARCH_HISTORY - 1),
      ],
    }));
  }, []);

  const trackImageClick = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      imageClicks: prev.imageClicks + 1,
    }));
  }, []);

  const getTopCategories = useCallback((limit: number = 10) => {
    return Object.entries(analytics.categoryViews)
      .map(([category, views]) => ({ category, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }, [analytics.categoryViews]);

  const getRecentSearches = useCallback((limit: number = 10) => {
    return analytics.searchHistory.slice(0, limit);
  }, [analytics.searchHistory]);

  const getSearchTrends = useCallback(() => {
    const queryCount: Record<string, number> = {};
    
    analytics.searchHistory.forEach(item => {
      queryCount[item.query] = (queryCount[item.query] || 0) + 1;
    });

    return Object.entries(queryCount)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [analytics.searchHistory]);

  const clearAnalytics = useCallback(() => {
    setAnalytics({
      ...initialAnalytics,
      sessionStart: Date.now(),
      totalSessions: 1,
    });
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        trackCategoryView,
        trackSearch,
        trackImageClick,
        getTopCategories,
        getRecentSearches,
        getSearchTrends,
        clearAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
