"use client";

// ============================================
// Dynamic Category Page
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WaifuImage, SfwCategory, Category } from "@/types";
import { fetchMultipleImages } from "@/lib/api";
import { enhanceImagesWithAI } from "@/lib/ai";
import { SFW_CATEGORIES, CATEGORY_INFO } from "@/lib/constants";
import { ImageGallery } from "@/components";
import { useAnalytics } from "@/contexts";
import { HorizontalBannerAd, SkyscraperAd } from "@/components/ads";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const categoryInfo = CATEGORY_INFO[category];
  const isValidCategory = SFW_CATEGORIES.includes(category as SfwCategory);

  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { trackCategoryView } = useAnalytics();

  const loadImages = useCallback(
    async (reset: boolean = false) => {
      if (!isValidCategory) return;
      setLoading(true);
      try {
        const newImages = await fetchMultipleImages(
          "sfw",
          category as SfwCategory,
        );
        trackCategoryView(category as Category);
        const enhanced = enhanceImagesWithAI(newImages);
        if (reset) {
          setImages(enhanced);
        } else {
          setImages((prev) => [...prev, ...enhanced]);
        }
        setHasMore(newImages.length > 0);
      } catch (error) {
        console.error("Failed to load images:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [category, isValidCategory, trackCategoryView],
  );

  useEffect(() => {
    setImages([]);
    setHasMore(true);
    loadImages(true);
  }, [category, loadImages]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadImages(false);
    }
  }, [loading, hasMore, loadImages]);

  if (!isValidCategory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20">
        <span className="text-6xl mb-4">😵</span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Category Not Found
        </h1>
        <p className="text-zinc-500 mb-6">
          The category &quot;{category}&quot; doesn&apos;t exist.
        </p>
        <Link href="/gallery" className="btn-primary">
          Browse All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-pink-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link
                href="/gallery"
                className="hover:text-pink-500 transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li className="text-pink-500 font-medium">
              {categoryInfo?.name || category}
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            <span className="mr-2">{categoryInfo?.icon}</span>
            {categoryInfo?.name} Anime Images
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {categoryInfo?.description}
          </p>
        </div>

        {/* About Section for SEO */}
        <section className="mb-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            About {categoryInfo?.name} Images
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Browse our curated collection of {categoryInfo?.name?.toLowerCase()}{" "}
            anime images. This category features{" "}
            {categoryInfo?.description?.toLowerCase()} from the anime and manga
            community. Enjoy high-quality artwork with infinite scroll, save
            your favorites, and discover related categories.
          </p>
        </section>

        {/* Horizontal Banner above gallery on desktop */}
        <HorizontalBannerAd id="category-top" />

        {/* Gallery with optional sidebar */}
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <ImageGallery
              images={images}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              columns={4}
              emptyMessage={`No ${categoryInfo?.name || category} images found.`}
              showInFeedAds={true}
            />
            <HorizontalBannerAd id="category-bottom" />
          </div>
          {/* Desktop Skyscraper Sidebar */}
          <div className="hidden xl:block w-[180px] flex-shrink-0">
            <SkyscraperAd />
          </div>
        </div>
      </div>
    </div>
  );
}
