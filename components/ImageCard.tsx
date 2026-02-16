'use client';

// ============================================
// ImageCard Component
// ============================================

import React, { useState, memo } from 'react';
import Image from 'next/image';
import { WaifuImage } from '@/types';
import { cn, getCategoryInfo } from '@/lib/utils';
import { useFavorites, useAnalytics } from '@/contexts';
import { CATEGORY_INFO } from '@/lib/constants';

interface ImageCardProps {
  image: WaifuImage;
  onClick?: () => void;
  showCategory?: boolean;
  showCaption?: boolean;
  priority?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'auto';
}

export const ImageCard = memo(function ImageCard({
  image,
  onClick,
  showCategory = true,
  showCaption = true,
  priority = false,
  aspectRatio = 'portrait',
}: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { trackImageClick } = useAnalytics();
  const isFav = isFavorite(image.id);
  
  const categoryInfo = CATEGORY_INFO[image.category];

  const handleClick = () => {
    trackImageClick();
    onClick?.();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(image.id);
    } else {
      addFavorite(image);
    }
  };

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'relative bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden',
          aspectClasses[aspectRatio]
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
          <span className="text-4xl mb-2">😢</span>
          <span className="text-sm">Failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer',
        'transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
        'hover:shadow-pink-500/20 dark:hover:shadow-pink-500/10',
        aspectClasses[aspectRatio]
      )}
      onClick={handleClick}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Image */}
      <Image
        src={image.url}
        alt={image.caption || `${image.category} anime image`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={cn(
          'object-cover transition-all duration-500',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          'group-hover:scale-110'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        priority={priority}
        unoptimized={image.url.endsWith('.gif')}
      />

      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        )}
      />

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-full transition-all duration-300',
          'transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
          isFav
            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
            : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-pink-500'
        )}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className="w-5 h-5"
          fill={isFav ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Category Badge */}
      {showCategory && categoryInfo && (
        <div
          className={cn(
            'absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium',
            'bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300',
            'transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            'transition-all duration-300'
          )}
        >
          <span className="mr-1">{categoryInfo.icon}</span>
          {categoryInfo.name}
        </div>
      )}

      {/* Caption */}
      {showCaption && image.caption && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4',
            'transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            'transition-all duration-300'
          )}
        >
          <p className="text-white text-sm line-clamp-2 drop-shadow-lg">
            {image.caption}
          </p>
        </div>
      )}
    </div>
  );
});

// Skeleton variant
export function ImageCardSkeleton({ aspectRatio = 'portrait' }: { aspectRatio?: 'square' | 'portrait' | 'auto' }) {
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: 'min-h-[200px]',
  };

  return (
    <div
      className={cn(
        'relative bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden',
        aspectClasses[aspectRatio]
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
    </div>
  );
}
