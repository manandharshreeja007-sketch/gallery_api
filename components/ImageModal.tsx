'use client';

// ============================================
// ImageModal Component
// ============================================

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { WaifuImage } from '@/types';
import { cn, downloadImage, generateDownloadFilename, copyToClipboard, canShare, shareContent, getSocialShareUrls } from '@/lib/utils';
import { CATEGORY_INFO } from '@/lib/constants';
import { useFavorites, useToast } from '@/contexts';
import { useKeyPress } from '@/hooks';

interface ImageModalProps {
  image: WaifuImage | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function ImageModal({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: ImageModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { success, error } = useToast();

  const isFav = image ? isFavorite(image.id) : false;
  const categoryInfo = image ? CATEGORY_INFO[image.category] : null;

  // Keyboard navigation
  useKeyPress('Escape', onClose);
  useKeyPress('ArrowLeft', () => hasPrevious && onPrevious?.());
  useKeyPress('ArrowRight', () => hasNext && onNext?.());

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset loaded state when image changes
  useEffect(() => {
    setIsLoaded(false);
    setShowShareMenu(false);
  }, [image?.id]);

  const handleDownload = useCallback(async () => {
    if (!image) return;
    
    setIsDownloading(true);
    try {
      const filename = generateDownloadFilename(image);
      const result = await downloadImage(image.url, filename);
      if (result) {
        success('Image downloaded successfully!');
      } else {
        error('Failed to download image');
      }
    } catch {
      error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  }, [image, success, error]);

  const handleCopyLink = useCallback(async () => {
    if (!image) return;
    
    const result = await copyToClipboard(image.url);
    if (result) {
      success('Link copied to clipboard!');
    } else {
      error('Failed to copy link');
    }
    setShowShareMenu(false);
  }, [image, success, error]);

  const handleShare = useCallback(async () => {
    if (!image) return;

    if (canShare()) {
      const shared = await shareContent({
        title: `${categoryInfo?.name || 'Anime'} Image`,
        text: image.caption || 'Check out this awesome anime image!',
        url: image.url,
      });
      if (!shared) {
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  }, [image, categoryInfo]);

  const handleFavorite = useCallback(() => {
    if (!image) return;
    
    if (isFav) {
      removeFavorite(image.id);
      success('Removed from favorites');
    } else {
      addFavorite(image);
      success('Added to favorites!');
    }
  }, [image, isFav, addFavorite, removeFavorite, success]);

  const socialUrls = image
    ? getSocialShareUrls(image.url, image.caption || 'Awesome anime image!')
    : null;

  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 md:top-6 md:right-6 z-20',
            'p-3 rounded-full bg-white/10 hover:bg-white/20',
            'text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-pink-500'
          )}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className={cn(
              'absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20',
              'p-3 rounded-full bg-white/10 hover:bg-white/20',
              'text-white transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-pink-500'
            )}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className={cn(
              'absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20',
              'p-3 rounded-full bg-white/10 hover:bg-white/20',
              'text-white transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-pink-500'
            )}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image Container */}
        <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
          )}
          
          <Image
            src={image.url}
            alt={image.caption || `${image.category} anime image`}
            fill
            className={cn(
              'object-contain transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setIsLoaded(true)}
            priority
          />
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Image Info */}
            <div className="text-white text-center md:text-left">
              {categoryInfo && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <span className="font-medium">{categoryInfo.name}</span>
                  <span className="text-white/60 text-sm">• {image.type.toUpperCase()}</span>
                </div>
              )}
              {image.caption && (
                <p className="text-white/80 text-sm max-w-md">{image.caption}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Favorite */}
              <button
                onClick={handleFavorite}
                className={cn(
                  'p-3 rounded-full transition-all duration-200',
                  isFav
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
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

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={cn(
                  'p-3 rounded-full bg-white/10 hover:bg-white/20 text-white',
                  'transition-all duration-200 disabled:opacity-50'
                )}
                aria-label="Download image"
              >
                {isDownloading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>

              {/* Share */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                  aria-label="Share image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Share Menu */}
                {showShareMenu && socialUrls && (
                  <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 overflow-hidden animate-slide-up">
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2 text-left text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <span>📋</span> Copy Link
                    </button>
                    <a
                      href={socialUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <span>𝕏</span> Twitter
                    </a>
                    <a
                      href={socialUrls.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <span>📘</span> Facebook
                    </a>
                    <a
                      href={socialUrls.reddit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <span>🔴</span> Reddit
                    </a>
                    <a
                      href={socialUrls.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <span>✈️</span> Telegram
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
