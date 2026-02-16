# Waifu Gallery - Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Documentation](#2-architecture-documentation)
3. [Code Documentation](#3-code-documentation)
4. [Setup & Installation Guide](#4-setup--installation-guide)
5. [Feature Documentation](#5-feature-documentation)
6. [Issues Fixed](#6-issues-fixed)
7. [NSFW Integration Details](#7-nsfw-integration-details)
8. [Developer Guide](#8-developer-guide)
9. [Known Limitations](#9-known-limitations)

---

## 1. Project Overview

### Project Name

**Waifu Gallery** - A modern anime image gallery application

### Purpose

A Progressive Web App (PWA) for browsing, searching, and collecting anime-style images. Features AI-powered semantic search, mood-based filtering, infinite scroll, and favorites management.

### Key Features

- 🖼️ **Image Gallery** - Browse SFW and NSFW anime images with infinite scroll
- 🔍 **AI-Powered Search** - Natural language semantic search ("cute happy catgirl")
- 🎭 **Mood Filtering** - Filter by emotions (happy, sad, romantic, playful, etc.)
- ❤️ **Favorites** - Save up to 500 images with export/import functionality
- 🌙 **Dark Mode** - Full theme support with system preference detection
- 📱 **PWA Support** - Installable app with offline caching
- 🔞 **NSFW Gate** - Age verification for adult content

### Technology Stack

| Component  | Technology                             |
| ---------- | -------------------------------------- |
| Framework  | Next.js 16.1.4 (App Router, Turbopack) |
| UI Library | React 19.2.3                           |
| Language   | TypeScript 5.x                         |
| Styling    | Tailwind CSS v4                        |
| Build Tool | Turbopack                              |
| PWA        | Custom Service Worker                  |
| API        | waifu.pics REST API                    |

### System Requirements

- Node.js 18+
- npm 9+ or pnpm/yarn equivalent
- Modern browser with ES2020+ support

---

## 2. Architecture Documentation

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
├─────────────────────────────────────────────────────────────────┤
│  app/                    │  components/                          │
│  ├─ layout.tsx (Root)    │  ├─ ImageGallery.tsx (Grid + Modal)  │
│  ├─ page.tsx (Home)      │  ├─ ImageCard.tsx (Individual)       │
│  ├─ gallery/page.tsx     │  ├─ SearchBar.tsx (AI Search)        │
│  ├─ search/page.tsx      │  ├─ Header.tsx (Navigation)          │
│  ├─ favorites/page.tsx   │  ├─ AgeGate.tsx (NSFW Consent)       │
│  ├─ nsfw/page.tsx        │  └─ ...                              │
│  └─ providers.tsx        │                                       │
├─────────────────────────────────────────────────────────────────┤
│  contexts/               │  lib/                                 │
│  ├─ ThemeContext         │  ├─ api.ts (API Client + Cache)      │
│  ├─ FavoritesContext     │  ├─ ai.ts (Semantic Search/Tags)     │
│  ├─ NsfwContext          │  ├─ constants.ts (Categories/Config) │
│  ├─ ToastContext         │  └─ utils.ts (Helpers)               │
│  └─ AnalyticsContext     │                                       │
├─────────────────────────────────────────────────────────────────┤
│  hooks/                  │  types/                               │
│  ├─ useWaifu.ts          │  └─ index.ts (All TypeScript types)  │
│  ├─ useInfiniteScroll.ts │                                       │
│  └─ useCommon.ts         │                                       │
├─────────────────────────────────────────────────────────────────┤
│                     External API                                 │
│              https://api.waifu.pics (SFW/NSFW)                  │
│              https://i.waifu.pics (Image CDN)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
waifu-gallery/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── providers.tsx            # Context providers wrapper
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global Tailwind styles
│   ├── gallery/page.tsx         # Main gallery with filters
│   ├── search/page.tsx          # AI-powered search page
│   ├── favorites/page.tsx       # Saved images page
│   ├── nsfw/page.tsx           # Age-gated adult content
│   └── about/page.tsx          # About page
├── components/                   # React components
│   ├── ImageGallery.tsx        # Grid + infinite scroll
│   ├── ImageCard.tsx           # Single image card
│   ├── ImageModal.tsx          # Fullscreen image viewer
│   ├── SearchBar.tsx           # AI search with suggestions
│   ├── CategoryFilter.tsx      # Category/mood tabs
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Page footer
│   ├── AgeGate.tsx             # NSFW consent dialog
│   ├── Toast.tsx               # Notification toasts
│   └── Recommendations.tsx     # AI recommendations
├── contexts/                     # React Context providers
│   ├── ThemeContext.tsx        # Light/dark theme
│   ├── FavoritesContext.tsx    # Favorites management
│   ├── NsfwContext.tsx         # NSFW consent state
│   ├── ToastContext.tsx        # Toast notifications
│   └── AnalyticsContext.tsx    # Usage analytics
├── hooks/                        # Custom React hooks
│   ├── useWaifu.ts             # Image fetching hook
│   ├── useInfiniteScroll.ts    # Scroll-based loading
│   ├── useLocalStorage.ts      # Persistent storage
│   └── useCommon.ts            # Utility hooks
├── lib/                          # Core business logic
│   ├── api.ts                  # API client with caching
│   ├── ai.ts                   # Semantic search + captions
│   ├── constants.ts            # Categories, moods, config
│   └── utils.ts                # Helper functions
├── types/                        # TypeScript definitions
│   └── index.ts                # All type definitions
├── public/                       # Static assets
│   ├── sw.js                   # Service Worker
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # App icons
└── config files                  # Project configuration
    ├── next.config.ts          # Next.js config
    ├── tsconfig.json           # TypeScript config
    ├── eslint.config.mjs       # ESLint config
    └── package.json            # Dependencies
```

### Data Flow

```
User Action → Component → Context/Hook → API Client → External API
                ↓
           State Update
                ↓
           Re-render with new data

Example: Loading Gallery Images
1. GalleryPage mounts
2. useEffect triggers loadImages()
3. loadImages() calls fetchMultipleImages() from lib/api.ts
4. API Client:
   - Checks rate limiter
   - Makes POST to https://api.waifu.pics/many/sfw/{category}
   - Tracks seen images to prevent duplicates
   - Returns array of image URLs
5. enhanceImagesWithAI() adds captions/tags
6. State updates, component re-renders
7. Infinite scroll detects sentinel → loads more
```

### Component Relationships

```
App (layout.tsx)
└── Providers (providers.tsx)
    ├── ThemeProvider
    ├── ToastProvider
    ├── AnalyticsProvider
    ├── FavoritesProvider
    └── NsfwProvider
        └── Page Component
            ├── Header
            │   └── Navigation (shows/hides NSFW based on consent)
            ├── Main Content
            │   ├── SearchBar → semanticSearch() → Categories
            │   ├── CategoryFilter → Mood filtering
            │   └── ImageGallery
            │       ├── ImageCard[] (with unique keys)
            │       │   └── onClick → ImageModal
            │       └── Infinite Scroll Sentinel
            └── Footer
```

---

## 3. Code Documentation

### Main Modules

#### `lib/api.ts` - API Client

Centralized API communication with built-in:

- **Rate Limiting**: Token bucket algorithm (10 tokens, 1/sec refill)
- **Caching**: In-memory cache with 5-minute TTL
- **Seen Tracking**: Prevents duplicate images per category
- **Retry Logic**: Exponential backoff for 429/5xx errors

```typescript
// Key exports
getApiClient(): WaifuApiClient       // Singleton instance
fetchMultipleImages(type, category, excludeSeen): Promise<WaifuImage[]>
fetchSingleImage(type, category): Promise<WaifuImage>
```

#### `lib/ai.ts` - AI Features

Rule-based "AI" for search and content enhancement:

```typescript
// Semantic search - maps natural language to categories
semanticSearch("cute happy catgirl") → ['neko', 'smile', 'happy']

// Mood detection
detectMood("romantic couple") → 'romantic'

// Image enhancement
enhanceImagesWithAI(images) → images with captions/tags/mood
```

#### `lib/constants.ts` - Configuration

All category definitions, moods, and app settings:

```typescript
SFW_CATEGORIES: 31 categories (waifu, neko, hug, smile, etc.)
NSFW_CATEGORIES: 4 categories (waifu, neko, trap, blowjob)
CATEGORY_INFO: Metadata with icons, descriptions, moods
MOOD_CATEGORIES: Maps moods to relevant categories
```

#### `lib/utils.ts` - Utilities

Helper functions for common operations:

```typescript
generateImageId(url): string     // Creates unique ID from URL + hash
createWaifuImage(url, cat, type) // Factory for image objects
cn(...classes): string           // Class name merger
downloadImage(url, filename)     // Triggers image download
```

### Image Data Model

```typescript
interface WaifuImage {
  id: string; // Unique identifier (filename-hash)
  url: string; // Full image URL
  category: Category; // e.g., 'neko', 'waifu'
  type: ContentType; // 'sfw' | 'nsfw'
  caption?: string; // AI-generated caption
  tags?: string[]; // AI-generated tags
  mood?: Mood; // Primary mood
  fetchedAt: number; // Timestamp
}
```

### ID Generation System (Fixed)

**Problem**: Original `generateImageId()` only used filename, causing duplicates when same filename appeared in different paths.

**Solution**: Now combines filename with URL hash:

```typescript
export function generateImageId(url: string): string {
  const filename = url.split("/").pop()?.split(".")[0];

  // Create hash from full URL for uniqueness
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash = hash & hash;
  }

  return `${filename}-${Math.abs(hash).toString(36)}`;
}
```

---

## 4. Setup & Installation Guide

### Prerequisites

- Node.js 18+ installed
- npm 9+ (or pnpm/yarn)
- Git (optional)

### Installation Steps

```bash
# 1. Clone or download the project
cd waifu-gallery

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server with hot reload |
| `npm run build` | Production build                 |
| `npm run start` | Start production server          |
| `npm run lint`  | Run ESLint                       |

### Environment Variables

No environment variables required. API endpoints are hardcoded:

- API: `https://api.waifu.pics`
- Images: `https://i.waifu.pics`

### Configuration Files

| File                 | Purpose                       |
| -------------------- | ----------------------------- |
| `next.config.ts`     | Next.js config, image domains |
| `tsconfig.json`      | TypeScript compiler options   |
| `eslint.config.mjs`  | Linting rules                 |
| `postcss.config.mjs` | PostCSS/Tailwind setup        |

---

## 5. Feature Documentation

### Image Gallery

- **Grid Layout**: Responsive 2-6 columns based on screen size
- **Infinite Scroll**: IntersectionObserver-based loading
- **Lazy Loading**: Images load as they enter viewport
- **Skeleton Loading**: Animated placeholders while loading

### Category Filtering

- **31 SFW Categories**: waifu, neko, hug, smile, pat, dance, etc.
- **4 NSFW Categories**: waifu, neko, trap, blowjob
- **Mood Filter**: Filter by emotion (happy, romantic, playful, etc.)

### AI-Powered Search

```
User Input: "cute smiling catgirl"
↓
semanticSearch() analyzes:
- "cute" → ['neko', 'waifu', 'blush']
- "smiling" → ['smile', 'happy']
- "catgirl" → ['neko']
↓
Combined result: ['neko', 'smile', 'happy', 'waifu', 'blush']
```

### Favorites System

- **Storage**: localStorage with 500 image limit
- **Export**: Download as JSON file
- **Import**: Paste JSON to restore
- **Sorting**: By date or category

### NSFW Access Flow

1. User clicks NSFW in navigation
2. AgeGate modal appears
3. User confirms 18+ checkbox
4. Consent saved to localStorage
5. NSFW content becomes accessible

---

## 6. Issues Fixed

### CRITICAL: Duplicate Key Error

**Error Message**:

```
Encountered two children with the same key, Weau1RP
```

**Root Cause**:
The `generateImageId()` function extracted only the filename without extension:

```typescript
// OLD CODE - PROBLEMATIC
const nameWithoutExt = filename.split(".")[0];
return nameWithoutExt || crypto.randomUUID();
```

Multiple images from the API could share the same filename base (e.g., different extensions, same name in different paths).

**Solution Applied**:

1. **Fixed ID Generation** (`lib/utils.ts`):

```typescript
export function generateImageId(url: string): string {
  const filename = url.split("/").pop()?.split(".")[0];

  // Hash the full URL for uniqueness
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash = hash & hash;
  }

  return filename
    ? `${filename}-${Math.abs(hash).toString(36)}`
    : crypto.randomUUID();
}
```

2. **Added Index Fallback** in all gallery components:

```tsx
// ImageGallery.tsx, search/page.tsx, favorites/page.tsx
{images.map((image, index) => (
  <ImageCard
    key={`${image.id}-${index}`}  // Composite key guarantees uniqueness
    image={image}
    ...
  />
))}
```

**Files Modified**:

- `lib/utils.ts` - ID generation
- `components/ImageGallery.tsx` - Both ImageGallery and MasonryGallery
- `app/search/page.tsx` - Search results
- `app/favorites/page.tsx` - Favorites grid

### React Hooks Lint Errors

**Issues**:

1. `useMediaQuery`: setState during effect causing cascading renders
2. `usePrevious`: Accessing ref.current during render
3. `useMount/useUnmount`: Updating refs during render

**Solutions** (`hooks/useCommon.ts`):

```typescript
// useMediaQuery - Use lazy initialization
const [matches, setMatches] = useState(() => getMatches(query));

// usePrevious - Track with separate state
const [previous, setPrevious] = useState<T | undefined>(undefined);
useEffect(() => setPrevious(prevRef.current), [value]);

// useMount - Simplified without ref
useEffect(() => callback(), []);

// useUnmount - Update ref in separate effect
useEffect(() => {
  callbackRef.current = callback;
});
```

### Unused Variables

- Removed `SearchResult` import from `lib/ai.ts`
- Removed unused `cacheKey` in `lib/api.ts`

---

## 7. NSFW Integration Details

### Location of NSFW Code

| File                       | Purpose                  |
| -------------------------- | ------------------------ |
| `contexts/NsfwContext.tsx` | Consent state management |
| `components/AgeGate.tsx`   | Age verification modal   |
| `app/nsfw/page.tsx`        | NSFW gallery page        |
| `components/Header.tsx`    | Nav item visibility      |
| `lib/constants.ts`         | NSFW categories          |

### Changes Made to Integrate NSFW

1. **Header.tsx**: Removed conditional hiding of NSFW nav:

```tsx
// BEFORE: Hidden unless enabled
if (item.isNsfw && !nsfwEnabled) return null;

// AFTER: Always visible, triggers age gate on click
// Show NSFW nav item to all users
```

2. **nsfw/page.tsx**: Auto-trigger age gate:

```tsx
useEffect(() => {
  if (!hasConsent) {
    openAgeGate();
  }
}, [hasConsent, openAgeGate]);
```

3. **Used correct category info**:

```tsx
// Use NSFW_CATEGORY_INFO instead of CATEGORY_INFO
import { NSFW_CATEGORY_INFO } from "@/lib/constants";
const categoryInfo = NSFW_CATEGORY_INFO[selectedCategory];
```

### Toggle Between SFW and NSFW

- Click "NSFW" in navigation
- Complete age verification (first time only)
- Browse NSFW categories
- Return to SFW by clicking other nav items

### Age Gate Implementation

- Checkbox confirmation required
- Consent stored in localStorage
- Persists across sessions
- Can be revoked via `useNsfw().revokeConsent()`

---

## 8. Developer Guide

### Adding a New Category

1. **Update types** (`types/index.ts`):

```typescript
export type SfwCategory = ... | 'newcategory';
```

2. **Add to array** (`lib/constants.ts`):

```typescript
export const SFW_CATEGORIES: SfwCategory[] = [
  ..., 'newcategory'
];
```

3. **Add metadata** (`lib/constants.ts`):

```typescript
export const CATEGORY_INFO = {
  ...,
  newcategory: {
    id: 'newcategory',
    name: 'New Category',
    description: 'Description here',
    icon: '🆕',
    mood: ['happy', 'cute'],
    isNsfw: false
  }
};
```

4. **Update mood mappings** if applicable:

```typescript
export const MOOD_CATEGORIES = {
  happy: [..., 'newcategory'],
  ...
};
```

### Adding New Images (Ensuring Unique IDs)

Images come from external API. To ensure uniqueness:

1. IDs are auto-generated from URL + hash
2. Always use composite keys in lists:

```tsx
key={`${image.id}-${index}`}
```

### Code Style Conventions

- Use `'use client'` for client components
- Extract reusable logic into hooks
- Use contexts for cross-cutting concerns
- Prefer composition over inheritance
- Use TypeScript strict mode

### Testing Procedures

Currently no automated tests. Manual testing:

1. Run `npm run dev`
2. Test all routes
3. Verify NSFW age gate
4. Check favorites persistence
5. Test search functionality
6. Verify infinite scroll

### Deployment Process

```bash
# Build for production
npm run build

# Verify build
npm run start

# Deploy to Vercel (recommended)
vercel deploy --prod
```

### Best Practices for React Keys

1. **Never use array index alone**:

```tsx
// BAD
key={index}

// GOOD
key={`${item.id}-${index}`}
```

2. **Ensure IDs are truly unique**:

```tsx
// Generate IDs with hash for uniqueness
generateImageId(url); // Returns "filename-abc123"
```

3. **Use composite keys when data may have duplicates**:

```tsx
key={`${image.id}-${image.fetchedAt}-${index}`}
```

---

## 9. Known Limitations

### Current Constraints

1. **API Dependency**: Relies on external waifu.pics API
2. **No Authentication**: No user accounts
3. **Local Storage Only**: Favorites limited to 500, not synced
4. **Rate Limiting**: API may throttle heavy usage
5. **No Tests**: Automated testing not implemented

### Future Improvement Suggestions

1. **Add Vitest/Jest** for unit testing
2. **Implement user accounts** with cloud sync
3. **Add image upload** feature
4. **Implement caching** with IndexedDB
5. **Add keyboard shortcuts** for navigation
6. **Improve accessibility** (ARIA labels, screen reader support)
7. **Add image compression** options for downloads
8. **Implement sharing** to social media

---

## Summary of Changes Made

### Files Modified

| File                          | Changes                                          |
| ----------------------------- | ------------------------------------------------ |
| `lib/utils.ts`                | Fixed `generateImageId()` to include URL hash    |
| `components/ImageGallery.tsx` | Added composite keys for both gallery types      |
| `components/Header.tsx`       | Show NSFW nav to all users                       |
| `app/nsfw/page.tsx`           | Auto-trigger age gate, use correct category info |
| `app/search/page.tsx`         | Added composite keys                             |
| `app/favorites/page.tsx`      | Added composite keys                             |
| `hooks/useCommon.ts`          | Fixed React hooks lint errors                    |
| `lib/ai.ts`                   | Removed unused import                            |
| `lib/api.ts`                  | Removed unused variable                          |

### Data Integrity

- All image keys now guaranteed unique via ID+index composite
- URL hashing ensures different images with same filename have different IDs
- Duplicate prevention handled at both ID generation and React key levels

---

_Documentation generated: January 27, 2026_
_Next.js: 16.1.4 | React: 19.2.3 | TypeScript: 5.x_
