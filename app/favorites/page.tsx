"use client";

// ============================================
// Favorites Page
// ============================================

import React, { useState, useMemo } from "react";
import { WaifuImage, Category } from "@/types";
import { CATEGORY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageCard, ImageModal } from "@/components";
import { useFavorites, useToast } from "@/contexts";
import { NativeBannerAd } from "@/components/ads";

export default function FavoritesPage() {
  const { favorites, clearAllFavorites, exportFavorites, importFavorites } =
    useFavorites();
  const toast = useToast();

  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "category">(
    "newest",
  );
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState("");

  // Get unique categories from favorites
  const categories = useMemo(() => {
    const cats = new Set<Category>();
    favorites.forEach((fav) => {
      if (fav.image.category) {
        cats.add(fav.image.category as Category);
      }
    });
    return Array.from(cats).sort();
  }, [favorites]);

  // Filter and sort favorites
  const displayedFavorites = useMemo(() => {
    let filtered = [...favorites];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (fav) => fav.image.category === selectedCategory,
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.addedAt - a.addedAt);
        break;
      case "oldest":
        filtered.sort((a, b) => a.addedAt - b.addedAt);
        break;
      case "category":
        filtered.sort((a, b) => {
          const catA = a.image.category || "";
          const catB = b.image.category || "";
          return catA.localeCompare(catB);
        });
        break;
    }

    return filtered;
  }, [favorites, selectedCategory, sortBy]);

  const handleExport = () => {
    const json = exportFavorites();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waifu-gallery-favorites-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Favorites exported successfully!");
  };

  const handleImport = () => {
    const result = importFavorites(importData);
    if (result) {
      toast.success("Favorites imported successfully!");
      setShowImportModal(false);
      setImportData("");
    } else {
      toast.error("Failed to import favorites. Check the format.");
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all favorites? This cannot be undone.",
      )
    ) {
      clearAllFavorites();
      toast.info("All favorites cleared");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            ❤️ My Favorites
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {favorites.length} saved{" "}
            {favorites.length === 1 ? "image" : "images"}
          </p>
        </div>

        {/* Native Ad - single, unobtrusive */}
        <NativeBannerAd />

        {favorites.length > 0 ? (
          <>
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as Category | "all")
                  }
                  className="px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    return (
                      <option key={cat} value={cat}>
                        {info?.icon} {info?.name || cat}
                      </option>
                    );
                  })}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "newest" | "oldest" | "category",
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="category">By Category</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Export */}
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Export
                </button>

                {/* Import */}
                <button
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Import
                </button>

                {/* Clear All */}
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>

            {/* Stats */}
            {categories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                {categories.slice(0, 6).map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  const count = favorites.filter(
                    (f) => f.image.category === cat,
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-xl transition-colors",
                        selectedCategory === cat
                          ? "bg-pink-500 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800",
                      )}
                    >
                      <span className="text-xl">{info?.icon}</span>
                      <span className="text-xs mt-1 font-medium">
                        {info?.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs mt-0.5",
                          selectedCategory === cat
                            ? "text-pink-100"
                            : "text-zinc-500",
                        )}
                      >
                        {count} saved
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedFavorites.map((fav, index) => (
                <ImageCard
                  key={`${fav.image.id}-${fav.addedAt}-${index}`}
                  image={fav.image}
                  onClick={() => setSelectedImage(fav.image)}
                />
              ))}
            </div>

            {displayedFavorites.length === 0 && selectedCategory !== "all" && (
              <div className="text-center py-20">
                <p className="text-zinc-500">No favorites in this category</p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="mt-4 text-pink-500 hover:text-pink-600"
                >
                  View all favorites
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-6xl mb-4">💔</p>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              Start exploring and save images you love by clicking the heart
              icon!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/gallery" className="btn-primary">
                Browse Gallery
              </a>
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-secondary"
              >
                Import Favorites
              </button>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Import Favorites
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Paste the exported JSON data below to import your favorites.
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON data here..."
                className="w-full h-40 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportData("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
