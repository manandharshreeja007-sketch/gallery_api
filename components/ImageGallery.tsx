'use client';

// ============================================
// ImageGallery Component
// ============================================

import React, { useState, useCallback, useMemo } from 'react';
import { WaifuImage, Category, ContentType } from '@/types';
import { ImageCard, ImageCardSkeleton } from './ImageCard';
import { ImageModal } from './ImageModal';
import { cn } from '@/lib/utils';
import { useInfiniteScroll } from '@/hooks';

interface ImageGalleryProps {
  images: WaifuImage[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  columns?: 2 | 3 | 4 | 5 | 6;
  showCategory?: boolean;
  showCaption?: boolean;
  emptyMessage?: string;
}

export function ImageGallery({
  images,
  loading = false,
  hasMore = true,
  onLoadMore,
  columns = 4,
  showCategory = true,
  showCaption = true,
  emptyMessage = 'No images found',
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { loadMoreRef } = useInfiniteScroll(
    async () => {
      if (hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    { enabled: hasMore && !loading && !!onLoadMore }
  );

  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );
  }, [images.length]);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  };

  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🎨</span>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('grid gap-4', columnClasses[columns])}>
        {images.map((image, index) => (
          <ImageCard
            key={`${image.id}-${index}`}
            image={image}
            onClick={() => handleImageClick(index)}
            showCategory={showCategory}
            showCaption={showCaption}
            priority={index < 8}
          />
        ))}
        
        {/* Loading Skeletons */}
        {loading &&
          Array.from({ length: columns * 2 }).map((_, i) => (
            <ImageCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Load More Trigger */}
      {hasMore && !loading && onLoadMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* End Message */}
      {!hasMore && images.length > 0 && (
        <div className="py-8 text-center text-zinc-400">
          <p>You&apos;ve seen all images in this category! 🎉</p>
        </div>
      )}

      {/* Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={selectedIndex !== null}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < images.length - 1}
      />
    </>
  );
}

// Masonry variant (for more organic layouts)
export function MasonryGallery({
  images,
  loading = false,
  hasMore = true,
  onLoadMore,
  columns = 4,
}: Omit<ImageGalleryProps, 'showCategory' | 'showCaption' | 'emptyMessage'>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { loadMoreRef } = useInfiniteScroll(
    async () => {
      if (hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    { enabled: hasMore && !loading && !!onLoadMore }
  );

  // Distribute images into columns
  const columnData = useMemo(() => {
    const cols: WaifuImage[][] = Array.from({ length: columns }, () => []);
    images.forEach((image, index) => {
      cols[index % columns].push(image);
    });
    return cols;
  }, [images, columns]);

  const handleCloseModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );
  }, [images.length]);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className="flex gap-4">
        {columnData.map((colImages, colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-4">
            {colImages.map((image, imgIndex) => {
              const globalIndex = imgIndex * columns + colIndex;
              return (
                <ImageCard
                  key={`${image.id}-${globalIndex}`}
                  image={image}
                  onClick={() => setSelectedIndex(globalIndex)}
                  aspectRatio="auto"
                  priority={globalIndex < 8}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Load More Trigger */}
      {hasMore && !loading && onLoadMore && (
        <div ref={loadMoreRef} className="h-20" />
      )}

      {/* Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={selectedIndex !== null}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < images.length - 1}
      />
    </>
  );
}
