'use client';

// ============================================
// Footer Component
// ============================================

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎨</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Waifu Gallery
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 max-w-md">
              Discover beautiful anime-style images with our AI-powered gallery.
              Browse waifus, nekos, and more with infinite scroll, semantic search,
              and personalized recommendations.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Waifu-pics/waifu-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-pink-500 transition-colors"
              >
                <span className="text-xl">📂</span>
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://waifu.pics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-pink-500 transition-colors"
              >
                <span className="text-xl">🌐</span>
                <span className="sr-only">waifu.pics</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/search', label: 'Search' },
                { href: '/favorites', label: 'Favorites' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/gallery?category=waifu', label: 'Waifu', icon: '👧' },
                { href: '/gallery?category=neko', label: 'Neko', icon: '🐱' },
                { href: '/gallery?category=hug', label: 'Hug', icon: '🫂' },
                { href: '/gallery?category=smile', label: 'Smile', icon: '😄' },
                { href: '/gallery?category=pat', label: 'Pat', icon: '✋' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 text-sm transition-colors"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 dark:text-zinc-500 text-sm">
              © {currentYear} Waifu Gallery. Powered by{' '}
              <a
                href="https://waifu.pics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline"
              >
                waifu.pics API
              </a>
            </p>
            <p className="text-zinc-400 dark:text-zinc-600 text-xs">
              Made with 💖 for anime fans
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
