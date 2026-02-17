"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react"; // Added Suspense
import { useSearchParams } from "next/navigation";
import { WaifuImage, Category, Mood } from "@/types";
import { fetchMultipleImages } from "@/lib/api";
import { enhanceImagesWithAI, getCategoriesForMood } from "@/lib/ai";
import { SFW_CATEGORIES, CATEGORY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageGallery, CategoryFilter, CategoryTabs } from "@/components";
import { useAnalytics } from "@/contexts";
import { HorizontalBannerAd, SkyscraperAd } from "@/components/ads";

// --- 1. The Wrapper Component (This is what Next.js sees first) ---
export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}

// --- 2. Your actual Gallery logic ---
function GalleryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    initialCategory && SFW_CATEGORIES.includes(initialCategory as never)
      ? initialCategory
      : "all",
  );
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { trackCategoryView } = useAnalytics();

  // ... (Keep all your existing useEffects and functions exactly as they were) ...

  const filteredCategories = useMemo(() => {
    if (!selectedMood) return SFW_CATEGORIES as Category[];
    return getCategoriesForMood(selectedMood) as Category[];
  }, [selectedMood]);

  const loadImages = useCallback(
    async (reset: boolean = false) => {
      setLoading(true);
      try {
        let newImages: WaifuImage[] = [];
        if (selectedCategory === "all") {
          const categoriesToLoad = filteredCategories.slice(0, 6);
          const promises = categoriesToLoad.map((cat) =>
            fetchMultipleImages("sfw", cat).catch(() => []),
          );
          const results = await Promise.all(promises);
          newImages = results.flat().slice(0, 30);
        } else {
          newImages = await fetchMultipleImages("sfw", selectedCategory);
          trackCategoryView(selectedCategory);
        }
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
    [selectedCategory, filteredCategories, trackCategoryView],
  );

  useEffect(() => {
    setImages([]);
    setHasMore(true);
    loadImages(true);
  }, [selectedCategory, selectedMood, loadImages]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadImages(false);
    }
  }, [loading, hasMore, loadImages]);

  const handleCategoryChange = useCallback((category: Category | "all") => {
    setSelectedCategory(category);
    const url =
      category === "all" ? "/gallery" : `/gallery?category=${category}`;
    window.history.pushState({}, "", url);
  }, []);

  const handleMoodChange = useCallback(
    (mood: Mood | null) => {
      setSelectedMood(mood);
      if (mood && selectedCategory !== "all") {
        const moodCategories = getCategoriesForMood(mood);
        if (!moodCategories.includes(selectedCategory as never)) {
          setSelectedCategory("all");
        }
      }
    },
    [selectedCategory],
  );

  const categoryInfo =
    selectedCategory !== "all" ? CATEGORY_INFO[selectedCategory] : null;

  return (
    <div className="min-h-screen py-8">
      {/* ... Your existing JSX (Header, Filters, Grid) ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                {categoryInfo ? (
                  <>
                    <span className="mr-2">{categoryInfo.icon}</span>
                    {categoryInfo.name}
                  </>
                ) : (
                  "Gallery"
                )}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {categoryInfo
                  ? categoryInfo.description
                  : `Browse ${images.length}+ beautiful anime images`}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-secondary"
            >
              Filters
            </button>
          </div>
          <div className="hidden md:block">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={filteredCategories}
            />
          </div>
          {/* Horizontal banner above gallery grid on desktop */}
          <HorizontalBannerAd id="gallery-top" />
        </div>
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
                  🎭 Filter by Mood
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      "happy",
                      "sad",
                      "romantic",
                      "playful",
                      "aggressive",
                      "calm",
                      "excited",
                      "cute",
                    ] as Mood[]
                  ).map((mood) => (
                    <button
                      key={mood}
                      onClick={() =>
                        handleMoodChange(selectedMood === mood ? null : mood)
                      }
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedMood === mood
                          ? "bg-pink-500 text-white"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
                      )}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <ImageGallery
              images={images}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              columns={4}
              emptyMessage="No images found."
              showInFeedAds={true}
            />
            {/* Horizontal banner below gallery grid on desktop */}
            <HorizontalBannerAd id="gallery-bottom" />
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
