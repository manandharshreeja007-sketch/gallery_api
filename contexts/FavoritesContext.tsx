'use client';

// ============================================
// Favorites Context Provider
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WaifuImage, Favorite } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage, isClient } from '@/lib/utils';

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteCount: number;
  addFavorite: (image: WaifuImage, notes?: string) => void;
  removeFavorite: (imageId: string) => void;
  isFavorite: (imageId: string) => boolean;
  getFavorite: (imageId: string) => Favorite | undefined;
  updateFavoriteNotes: (imageId: string, notes: string) => void;
  clearAllFavorites: () => void;
  exportFavorites: () => string;
  importFavorites: (json: string) => boolean;
}

const defaultFavoritesContext: FavoritesContextType = {
  favorites: [],
  favoriteCount: 0,
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  getFavorite: () => undefined,
  updateFavoriteNotes: () => {},
  clearAllFavorites: () => {},
  exportFavorites: () => '[]',
  importFavorites: () => false,
};

const FavoritesContext = createContext<FavoritesContextType>(defaultFavoritesContext);

const MAX_FAVORITES = 500;

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load favorites from storage on mount
  useEffect(() => {
    if (isClient()) {
      const savedFavorites = storage.get<Favorite[]>(STORAGE_KEYS.FAVORITES, []);
      setFavorites(savedFavorites);
      setMounted(true);
    }
  }, []);

  // Save favorites to storage whenever they change
  useEffect(() => {
    if (mounted) {
      storage.set(STORAGE_KEYS.FAVORITES, favorites);
    }
  }, [favorites, mounted]);

  const addFavorite = useCallback((image: WaifuImage, notes?: string) => {
    setFavorites(prev => {
      // Check if already favorited
      if (prev.some(f => f.image.id === image.id)) {
        return prev;
      }
      
      // Check max limit
      if (prev.length >= MAX_FAVORITES) {
        // Remove oldest favorite
        const newFavorites = [...prev.slice(1)];
        return [
          ...newFavorites,
          { image, addedAt: Date.now(), notes },
        ];
      }
      
      return [...prev, { image, addedAt: Date.now(), notes }];
    });
  }, []);

  const removeFavorite = useCallback((imageId: string) => {
    setFavorites(prev => prev.filter(f => f.image.id !== imageId));
  }, []);

  const isFavorite = useCallback((imageId: string) => {
    return favorites.some(f => f.image.id === imageId);
  }, [favorites]);

  const getFavorite = useCallback((imageId: string) => {
    return favorites.find(f => f.image.id === imageId);
  }, [favorites]);

  const updateFavoriteNotes = useCallback((imageId: string, notes: string) => {
    setFavorites(prev => 
      prev.map(f => 
        f.image.id === imageId ? { ...f, notes } : f
      )
    );
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const exportFavorites = useCallback(() => {
    return JSON.stringify(favorites, null, 2);
  }, [favorites]);

  const importFavorites = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as Favorite[];
      if (!Array.isArray(imported)) return false;
      
      // Validate structure
      const isValid = imported.every(f => 
        f.image && 
        typeof f.image.id === 'string' && 
        typeof f.image.url === 'string' &&
        typeof f.addedAt === 'number'
      );
      
      if (!isValid) return false;
      
      // Merge with existing, avoiding duplicates
      setFavorites(prev => {
        const existingIds = new Set(prev.map(f => f.image.id));
        const newFavorites = imported.filter(f => !existingIds.has(f.image.id));
        return [...prev, ...newFavorites].slice(0, MAX_FAVORITES);
      });
      
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavorite,
        updateFavoriteNotes,
        clearAllFavorites,
        exportFavorites,
        importFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
