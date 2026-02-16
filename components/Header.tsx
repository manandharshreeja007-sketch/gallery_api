"use client";

// ============================================
// Header Component
// ============================================

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, useNsfw, useFavorites } from "@/contexts";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useScrollPosition, useIsMobile } from "@/hooks";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { nsfwEnabled } = useNsfw();
  const { favoriteCount } = useFavorites();
  const { scrollY, scrollDirection } = useScrollPosition();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isScrolled = scrollY > 50;
  const isHidden =
    scrollDirection === "down" && scrollY > 200 && !mobileMenuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent",
          isHidden && "-translate-y-full",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Image Container */}
              <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
                <Image
                  src="/icons/iconTrasparent.png"
                  alt="Waifu Gallery Logo"
                  fill
                  className="object-contain rounded-md" // rounded-md is optional, looks nice for app icons
                  sizes="(max-width: 768px) 32px, 40px"
                />
              </div>

              {/* Text Brand */}
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Waifu Gallery
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                // Show NSFW nav item to all users - clicking will trigger age gate
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-pink-100 dark:hover:bg-pink-900/30",
                      isActive
                        ? "text-pink-600 dark:text-pink-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400",
                    )}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                    {item.href === "/favorites" && favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteCount > 99 ? "99+" : favoriteCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500",
                )}
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              >
                <span className="text-xl">
                  {resolvedTheme === "dark" ? "☀️" : "🌙"}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-all duration-200",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "focus:outline-none focus:ring-2 focus:ring-pink-500",
                )}
                aria-label="Toggle menu"
              >
                <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-96" : "max-h-0",
          )}
        >
          <nav className="px-4 pb-4 space-y-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
            {NAV_ITEMS.map((item) => {
              // Show NSFW nav item to all users - clicking will trigger age gate
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.href === "/favorites" && favoriteCount > 0 && (
                    <span className="ml-auto bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
