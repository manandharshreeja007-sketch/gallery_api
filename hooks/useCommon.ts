'use client';

// ============================================
// Additional Custom Hooks
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { isClient, debounce } from '@/lib/utils';

// ============================================
// useDebounce Hook
// ============================================

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// useMediaQuery Hook
// ============================================

export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (!isClient()) return false;
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    if (!isClient()) return;

    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value on mount (handles SSR hydration)
    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Preset media query hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

// ============================================
// useKeyPress Hook
// ============================================

export function useKeyPress(targetKey: string, callback?: () => void): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        event.preventDefault();
        setKeyPressed(true);
        callback?.();
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, callback]);

  return keyPressed;
}

// ============================================
// useClickOutside Hook
// ============================================

export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

// ============================================
// useWindowSize Hook
// ============================================

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: isClient() ? window.innerWidth : 1200,
    height: isClient() ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (!isClient()) return;

    const handleResize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ============================================
// useOnlineStatus Hook
// ============================================

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    isClient() ? navigator.onLine : true
  );

  useEffect(() => {
    if (!isClient()) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ============================================
// usePrevious Hook
// ============================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const prevRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    prevRef.current = ref.current;
    ref.current = value;
  }, [value]);

  // Return the previous value from the prevRef
  const [previous, setPrevious] = useState<T | undefined>(undefined);
  
  useEffect(() => {
    setPrevious(prevRef.current);
  }, [value]);

  return previous;
}

// ============================================
// useToggle Hook
// ============================================

export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle, setValue];
}

// ============================================
// useImagePreload Hook
// ============================================

interface ImageLoadState {
  loaded: boolean;
  error: boolean;
  naturalWidth: number;
  naturalHeight: number;
}

export function useImagePreload(src: string): ImageLoadState {
  const [state, setState] = useState<ImageLoadState>({
    loaded: false,
    error: false,
    naturalWidth: 0,
    naturalHeight: 0,
  });

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setState({
        loaded: true,
        error: false,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      setState({
        loaded: false,
        error: true,
        naturalWidth: 0,
        naturalHeight: 0,
      });
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}

// ============================================
// useCopyToClipboard Hook
// ============================================

export function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<boolean>
] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!isClient()) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  return [copied, copy];
}

// ============================================
// useFocus Hook
// ============================================

export function useFocus<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  () => void
] {
  const ref = useRef<T>(null);

  const setFocus = useCallback(() => {
    ref.current?.focus();
  }, []);

  return [ref, setFocus];
}

// ============================================
// useMount Hook
// ============================================

export function useMount(callback: () => void | (() => void)): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return callback();
  }, []);
}

// ============================================
// useUnmount Hook
// ============================================

export function useUnmount(callback: () => void): void {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}
