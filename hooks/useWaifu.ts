'use client';

// ============================================
// useWaifu Hook - Image Fetching
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { WaifuImage, Category, ContentType, ApiError } from '@/types';
import { fetchMultipleImages, fetchSingleImage, getApiClient } from '@/lib/api';
import { enhanceImagesWithAI } from '@/lib/ai';

interface UseWaifuOptions {
  type?: ContentType;
  category: Category;
  autoFetch?: boolean;
  enhanceWithAI?: boolean;
  count?: number;
}

interface UseWaifuReturn {
  images: WaifuImage[];
  loading: boolean;
  error: ApiError | null;
  hasMore: boolean;
  fetchImages: () => Promise<void>;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearImages: () => void;
}

export function useWaifu({
  type = 'sfw',
  category,
  autoFetch = true,
  enhanceWithAI = true,
  count = 30,
}: UseWaifuOptions): UseWaifuReturn {
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  const fetchImages = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const newImages = await fetchMultipleImages(type, category, true);
      const processedImages = enhanceWithAI ? enhanceImagesWithAI(newImages) : newImages;
      setImages(processedImages.slice(0, count));
      setHasMore(true);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [type, category, enhanceWithAI, count]);

  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const newImages = await fetchMultipleImages(type, category, true);
      
      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        const processedImages = enhanceWithAI ? enhanceImagesWithAI(newImages) : newImages;
        setImages(prev => [...prev, ...processedImages]);
      }
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [type, category, enhanceWithAI, hasMore]);

  const refresh = useCallback(async () => {
    getApiClient().clearSeenImages(category);
    setImages([]);
    setHasMore(true);
    setError(null);
    await fetchImages();
  }, [category, fetchImages]);

  const clearImages = useCallback(() => {
    setImages([]);
    setHasMore(true);
    setError(null);
  }, []);

  // Auto fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchImages();
    }
  }, [autoFetch, fetchImages]);

  // Reset when category changes
  useEffect(() => {
    if (initialFetchDoneRef.current) {
      setImages([]);
      setHasMore(true);
      setError(null);
      initialFetchDoneRef.current = false;
      if (autoFetch) {
        initialFetchDoneRef.current = true;
        fetchImages();
      }
    }
  }, [category, type, autoFetch, fetchImages]);

  return {
    images,
    loading,
    error,
    hasMore,
    fetchImages,
    fetchMore,
    refresh,
    clearImages,
  };
}

// Single image hook
export function useRandomImage(type: ContentType = 'sfw', category: Category) {
  const [image, setImage] = useState<WaifuImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newImage = await fetchSingleImage(type, category);
      setImage(newImage);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [type, category]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { image, loading, error, refresh: fetchImage };
}
