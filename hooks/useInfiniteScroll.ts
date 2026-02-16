'use client';

// ============================================
// useInfiniteScroll Hook
// ============================================

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  initialDelay?: number;
}

export function useInfiniteScroll(
  callback: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '200px',
    enabled = true,
    initialDelay = 500,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const mountedRef = useRef(false);

  const handleIntersect = useCallback(async (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    setIsIntersecting(entry.isIntersecting);

    if (entry.isIntersecting && !isLoadingRef.current && enabled && mountedRef.current) {
      isLoadingRef.current = true;
      try {
        await callback();
      } finally {
        // Small delay to prevent rapid consecutive loads
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 300);
      }
    }
  }, [callback, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Small delay before setting up observer to prevent immediate trigger
    const setupTimeout = setTimeout(() => {
      if (!loadMoreRef.current || !enabled) return;

      observerRef.current = new IntersectionObserver(handleIntersect, {
        threshold,
        rootMargin,
      });

      observerRef.current.observe(loadMoreRef.current);
    }, initialDelay);

    return () => {
      mountedRef.current = false;
      clearTimeout(setupTimeout);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, threshold, rootMargin, enabled, initialDelay]);

  const setLoadMoreRef = useCallback((node: HTMLDivElement | null) => {
    // Disconnect from old element
    if (observerRef.current && loadMoreRef.current) {
      observerRef.current.unobserve(loadMoreRef.current);
    }

    loadMoreRef.current = node;

    // Observe new element
    if (observerRef.current && node) {
      observerRef.current.observe(node);
    }
  }, []);

  return {
    loadMoreRef: setLoadMoreRef,
    isIntersecting,
  };
}

// Scroll to top hook
export function useScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return { showButton, scrollToTop };
}

// Scroll position hook
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, scrollDirection };
}
