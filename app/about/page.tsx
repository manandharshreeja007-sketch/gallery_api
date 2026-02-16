// ============================================
// About Page
// ============================================

import React from 'react';
import Link from 'next/link';
import { SFW_CATEGORIES, CATEGORY_INFO } from '@/lib/constants';
import { Category } from '@/types';

export const metadata = {
  title: 'About - Waifu Gallery',
  description: 'Learn about Waifu Gallery, our features, and the waifu.pics API that powers our collection.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            About Waifu Gallery
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Your ultimate destination for beautiful anime artwork
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📖</span> Our Story
            </h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p>
                Waifu Gallery was born from a simple idea: create the most beautiful, 
                user-friendly platform for anime art enthusiasts to discover and enjoy 
                high-quality images. We wanted to build something that feels as delightful 
                to use as the art it showcases.
              </p>
              <p>
                Powered by the amazing <a href="https://waifu.pics" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 underline">waifu.pics API</a>, 
                we have access to thousands of curated anime images across dozens of categories. 
                Our platform adds AI-powered features, a beautiful interface, and thoughtful 
                features to enhance your browsing experience.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
            <span>✨</span> Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '🔍',
                title: 'AI-Powered Search',
                description: 'Natural language search that understands context and mood to find exactly what you\'re looking for.'
              },
              {
                icon: '🎭',
                title: 'Mood Filtering',
                description: 'Browse images by mood - happy, sad, romantic, playful, and more.'
              },
              {
                icon: '♾️',
                title: 'Infinite Scroll',
                description: 'Seamless browsing experience with new images loading automatically as you scroll.'
              },
              {
                icon: '❤️',
                title: 'Favorites System',
                description: 'Save your favorite images locally with export/import functionality.'
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                description: 'Easy on the eyes with automatic or manual dark mode toggle.'
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                description: 'Beautiful responsive design that works great on any device.'
              },
              {
                icon: '🚀',
                title: 'Lightning Fast',
                description: 'Smart caching and optimized loading for instant results.'
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'No account required. All data stays in your browser.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🏷️</span> Available Categories
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            We offer {SFW_CATEGORIES.length}+ categories to explore:
          </p>
          <div className="flex flex-wrap gap-2">
            {(SFW_CATEGORIES as Category[]).map((cat) => {
              const info = CATEGORY_INFO[cat];
              if (!info) return null;
              return (
                <Link
                  key={cat}
                  href={`/gallery?category=${cat}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-700 dark:text-zinc-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* API Credit */}
        <section className="mb-16">
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🙏</span> Powered by waifu.pics
            </h2>
            <p className="text-zinc-300 mb-6">
              This project wouldn&apos;t be possible without the incredible{' '}
              <a 
                href="https://waifu.pics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline"
              >
                waifu.pics
              </a>{' '}
              API. It&apos;s a free, open-source API that provides high-quality anime images 
              for developers and enthusiasts alike.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://waifu.pics/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View API Docs
              </a>
              <a
                href="https://github.com/Waifu-pics/waifu-api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🛠️</span> Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 15', desc: 'React Framework' },
              { name: 'TypeScript', desc: 'Type Safety' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'React 19', desc: 'UI Library' },
            ].map((tech, idx) => (
              <div key={idx} className="text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                <div className="font-semibold text-zinc-900 dark:text-white">{tech.name}</div>
                <div className="text-sm text-zinc-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact/Disclaimer */}
        <section>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <span>⚠️</span> Disclaimer
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              All images are sourced from the waifu.pics API and are the property of their 
              respective creators. This is a fan project and is not affiliated with any 
              anime studios or production companies. If you believe any content infringes 
              on your copyright, please contact the waifu.pics team directly.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to explore?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              Browse Gallery
            </Link>
            <Link href="/search" className="btn-secondary">
              Search Images
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
