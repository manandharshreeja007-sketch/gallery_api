# 🤖 OPUS AGENT PROMPT — Waifu Gallery: SEO + Ads + Mobile UX Implementation

---

## 🧠 STEP 1: UNDERSTAND THE PROJECT FIRST (DO THIS BEFORE ANY CODING)

You are working on a Next.js 16 (App Router) anime image gallery called **Waifu Gallery**.

Before writing a single line of code, do the following:

1. **Scan the entire workspace** — read every file in `app/`, `components/`, `lib/`, `hooks/`, `contexts/`, `types/`, and `public/`
2. **Read `package.json`** to understand all dependencies
3. **Read `next.config.ts`** to understand existing configuration
4. **Read `app/layout.tsx`** — root layout, critical for SEO and ads
5. **Read `lib/constants.ts`** — contains `SEO_DEFAULTS`, categories, and all app config
6. **Read `components/index.ts`** (or barrel file) to understand all available components
7. **Map the full route structure** — identify every page in `app/`
8. **Understand the data flow** — how images are fetched, displayed, and paginated
9. **Check the existing CSS / Tailwind config** — understand spacing, breakpoints, and theme tokens
10. **Check `components/Header.tsx` and `components/Footer.tsx`** — understand mobile nav patterns already in use

Only after you have a complete mental model of the codebase, proceed to implementation.

---

## 📋 TASK OVERVIEW

You have **three major tasks**:

| Task                  | Goal                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| **Task 1: Mobile UX** | First-class mobile experience — the primary device for this audience |
| **Task 2: SEO**       | Maximum search engine visibility to drive traffic                    |
| **Task 3: Ads**       | Strategic, non-intrusive Adsterra monetization                       |

After all tasks are complete, you will **generate a documentation file**.

> ### Core Philosophy (Apply to Every Decision)
>
> **"Users first. Always."**
>
> - Mobile users are the majority audience. Every feature, ad, and layout decision must work beautifully on a 390px screen.
> - Ads are a business need, not a punishment for users. If an ad placement makes the app feel worse, disable it.
> - Revenue grows from happy, returning users — not from cramming ads onto every pixel.

---

## ✅ TASK 1: MOBILE UX AUDIT & IMPROVEMENTS

### Objective

This is an anime image gallery. The majority of users are on mobile. The experience must feel native, fast, and delightful on small screens. Audit the entire app and fix everything that falls short.

---

### 1.1 — Mobile Audit Checklist

Before making changes, **audit every page on a 390px viewport** (iPhone 14 size). Check for:

- [ ] Text that overflows or gets cut off
- [ ] Buttons too small to tap (minimum 44×44px touch target)
- [ ] Images that don't fit properly
- [ ] Modals or overlays that don't close properly on mobile
- [ ] Horizontal scroll anywhere it shouldn't exist
- [ ] Navigation that's hard to use with a thumb
- [ ] Any element that assumes a hover state (hover-only UX doesn't work on mobile)
- [ ] Bottom of screen covered by browser chrome (use `pb-safe`, `env(safe-area-inset-bottom)`)
- [ ] Font sizes below 14px (unreadable on mobile)
- [ ] Gallery grid too cramped or too spread out

---

### 1.2 — Image Gallery Grid (Most Critical)

The gallery grid must be optimized for mobile:

```
Mobile (< 640px):   2 columns — compact, fast loading
Tablet (640-1024px): 3 columns
Desktop (> 1024px):  4 columns (or current behavior)
```

```typescript
// Gallery grid classes
className =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4";
```

Image cards on mobile:

- Aspect ratio must be consistent — use `aspect-[3/4]` or `aspect-square`
- Image must fill the card without cropping weirdly — use `object-cover`
- Tap target for the heart/favorite button must be at least 44×44px
- The heart/action buttons should be visible on mobile WITHOUT needing to hover (show them always or on first tap)

---

### 1.3 — Mobile Navigation

Check the existing Header component. Ensure:

- Hamburger menu or bottom nav works correctly on all phones
- Active route is clearly indicated
- Navigation items are easily tappable (min 48px height)
- The header does NOT take up excessive vertical space on mobile
- Logo + nav fits without overflow on 375px screens

**If a bottom navigation bar doesn't exist, consider adding one for mobile:**

```
Bottom Nav (mobile only, hidden on lg+):
[ 🏠 Home ] [ 🖼️ Gallery ] [ 🔍 Search ] [ ❤️ Favorites ]
```

This is a common pattern for media apps and drastically improves mobile UX.

---

### 1.4 — Image Modal (Fullscreen Viewer)

When a user taps an image on mobile:

- The modal should open **fullscreen** (100vw × 100vh)
- Close button must be in the **top-right corner** and at least 44×44px
- Support **swipe gestures**: swipe left/right to go to next/previous image
- Support **pinch-to-zoom** if feasible (or at minimum, don't block it)
- The modal should NOT have horizontal padding issues
- On very tall images, user should be able to scroll within the modal
- Download and favorite buttons should be accessible without scrolling

---

### 1.5 — Search Page on Mobile

- The search input should be full-width on mobile
- The keyboard should not push content off screen (handle `viewport-fit=cover`)
- Search suggestions/autocomplete should appear above the keyboard, not behind it
- Results grid follows the same 2-column mobile grid

---

### 1.6 — Category Filter / Tabs

If there's a horizontal scrollable tab bar for categories:

- Add `-webkit-overflow-scrolling: touch` for smooth iOS scrolling
- Hide the scrollbar visually but keep it scrollable:
  ```css
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
  &::-webkit-scrollbar {
    display: none;
  } /* Chrome/Safari */
  ```
- Add a subtle gradient fade on the right edge to indicate more items exist
- Active tab must be visually prominent and scroll into view automatically

---

### 1.7 — Touch & Gesture Improvements

- Remove any `cursor-pointer` only interactions — use `onClick` properly
- Ensure there's no 300ms tap delay (Next.js and modern browsers handle this, but verify)
- Scrolling should be smooth — use `scroll-smooth` where appropriate
- Pull-to-refresh should NOT interfere with infinite scroll
- Loading spinners should be centered and visible on all screen sizes

---

### 1.8 — Safe Areas (Notch / Dynamic Island / Home Indicator)

For iOS devices with notch or Dynamic Island:

- Header: add `pt-safe` or `padding-top: env(safe-area-inset-top)`
- Bottom nav (if added): add `pb-safe` or `padding-bottom: env(safe-area-inset-bottom)`
- Add to `tailwind.config.ts`:
  ```typescript
  theme: {
    extend: {
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      }
    }
  }
  ```

---

### 1.9 — Performance on Mobile Networks

Mobile users are often on slower connections:

- Implement progressive image loading (blur-up or skeleton placeholder)
- The infinite scroll should load **fewer images per batch on mobile** — detect viewport and adjust:
  ```typescript
  const batchSize = window.innerWidth < 640 ? 6 : 12;
  ```
- Images should use `loading="lazy"` and proper `sizes` attribute:
  ```typescript
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
  ```

---

## ✅ TASK 2: SEO IMPLEMENTATION

### Objective

Make this site rank as high as possible on Google and other search engines. Every page must be perfectly optimized. More traffic = more ad revenue.

---

### 2.1 — Metadata & Open Graph

**Check if `SEO_DEFAULTS` exists in `lib/constants.ts`.** If not, create it.

Ensure the following exists and is correct:

```typescript
export const SEO_DEFAULTS = {
  title: "Waifu Gallery - Free Anime Image Gallery & AI Search",
  description:
    "Discover and collect beautiful anime-style images with AI-powered search. Browse 30+ categories: waifu, neko, hug, smile and more. Free, fast, and beautiful.",
  keywords: [
    "anime images",
    "waifu gallery",
    "neko pictures",
    "anime art",
    "manga images",
    "kawaii pictures",
    "anime collection",
    "anime image search",
    "AI anime search",
    "otaku gallery",
    "anime wallpapers",
    "free anime images",
  ],
  url: "https://waifugallery.netlify.app",
  image: "/og-image.png",
};
```

Update `app/layout.tsx` metadata with:

- `metadataBase`, `title` template, `description`, `keywords`, `authors`, `creator`
- Full `openGraph` block (type, locale, url, siteName, title, description, images)
- Full `twitter` card block
- Full `robots` + `googleBot` config:
  ```typescript
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
  ```
- `icons`, `manifest`, `applicationName`, `appleWebApp`

---

### 2.2 — Per-Page Metadata

| Page                     | Title                                                     | Notes                             |
| ------------------------ | --------------------------------------------------------- | --------------------------------- |
| `app/page.tsx`           | "Waifu Gallery - Free Anime Image Gallery with AI Search" | Homepage                          |
| `app/gallery/page.tsx`   | "Anime Gallery - Browse 30+ Categories"                   | Main gallery                      |
| `app/search/page.tsx`    | "AI Anime Image Search - Find Any Style"                  | Search                            |
| `app/favorites/page.tsx` | "Your Favorite Anime Images"                              | `noIndex: true`                   |
| `app/about/page.tsx`     | "About Waifu Gallery"                                     | If page exists                    |
| `app/nsfw/page.tsx`      | "NSFW Gallery (18+)"                                      | `noIndex: true`, `noFollow: true` |

Each page must have `alternates: { canonical: 'https://waifugallery.netlify.app/[path]' }`.

---

### 2.3 — Dynamic Category Pages

**Create `app/gallery/[category]/page.tsx`** with:

- `generateStaticParams()` for all SFW categories
- `generateMetadata()` using `CATEGORY_INFO` from `lib/constants.ts`
- Canonical URL per category
- Visually hidden `<h1>` with category name
- Breadcrumb navigation component
- "About [Category]" section with 2-3 sentences of real text content
- `export const revalidate = 86400`

---

### 2.4 — Structured Data (JSON-LD)

Create `components/seo/JsonLd.tsx`:

- **Root layout**: `WebSite` (with SearchAction) + `Organization` schemas
- **Category pages**: `ImageGallery` + `BreadcrumbList` schemas
- **About page**: `FAQPage` schema with 5+ real questions

---

### 2.5 — Technical SEO Files

**`app/sitemap.ts`** priorities:

- `/` → 1.0 daily
- `/gallery` → 0.9 daily
- `/search` → 0.8 weekly
- `/gallery/[category]` → 0.7 daily
- `/about` → 0.5 monthly
- `/contact`, `/privacy`, `/terms` → 0.3 yearly

**`app/robots.ts`:**

- Allow good bots on all public pages
- Disallow: `/favorites`, `/nsfw`, `/api/`, `/_next/`
- Block AI training bots: `GPTBot`, `ChatGPT-User`, `CCBot`, `anthropic-ai`, `Google-Extended`

---

### 2.6 — Image SEO

In image components:

- Always use descriptive `alt` text: `image.aiCaption ?? \`${image.category} anime image\``
- Always use Next.js `<Image>` (never raw `<img>`)
- Proper `sizes` attribute for responsive loading
- `next.config.ts` must have `images.remotePatterns` for `i.waifu.pics`
- `formats: ['image/avif', 'image/webp']`

---

### 2.7 — Performance (Core Web Vitals = Better Rankings)

- Font loading: `display: 'swap'`
- Lazy load: `ImageModal`, `Recommendations` using `next/dynamic`
- Image batch size adjusted by viewport (as per Task 1.9)
- Keep existing `<link rel="preconnect">` tags

---

### 2.8 — About Page Content

Create or update `app/about/page.tsx` with 400+ words:

- What is Waifu Gallery
- Full features list (AI search, 30+ categories, favorites, dark mode, PWA)
- How to use the search feature
- About the waifu.pics API
- FAQ section (5+ questions) using `FAQJsonLd`

---

## ✅ TASK 3: ADS IMPLEMENTATION

### Core Ad Philosophy

> **UX > Revenue. Always.**
>
> A user who leaves never comes back. A happy user returns daily and earns more over time.
> Only place ads where they add zero friction to the experience.
> When in doubt — leave it out.

---

### 3.1 — The 5 Ad Types Available

You have been given the following Adsterra ad codes. Here is how to use each one:

---

#### AD TYPE 1: Popunder

```html
<script src="https://pl28729018.effectivegatecpm.com/84/16/bb/8416bb68c10151b820219f267ab089da.js"></script>
```

**What it does:** Opens a new browser tab/window behind the current page when user first clicks anywhere on the site.

**UX Impact:** HIGH — very intrusive. Users dislike this.

**Decision: USE, but with strict limits.**

- Fire ONCE per user session maximum (use `sessionStorage` to track)
- Fire ONLY on desktop — **completely disabled on mobile**
- Fire ONLY after user has interacted with the site (clicked at least one image) — not on page load
- Add to `app/layout.tsx` as a `<Script>` with `strategy="lazyOnload"`
- Wrap the script in a client component that checks: `if mobile → don't load`, `if already fired this session → don't fire again`

**Implementation:**
Create `components/ads/PopunderAd.tsx`:

```typescript
'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export function PopunderAd() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 1024) return;
    // Only once per session
    if (sessionStorage.getItem('popunder_fired')) return;
    // Mark as fired
    sessionStorage.setItem('popunder_fired', 'true');
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      id="adsterra-popunder"
      src="https://pl28729018.effectivegatecpm.com/84/16/bb/8416bb68c10151b820219f267ab089da.js"
      strategy="lazyOnload"
    />
  );
}
```

Add `<PopunderAd />` inside `<Providers>` in `app/layout.tsx`.

---

#### AD TYPE 2: Social Bar

```html
<script src="https://pl28728712.effectivegatecpm.com/e8/db/2e/e8db2ed739d29d3e7aee42d2768daa81.js"></script>
```

**What it does:** Renders a sticky bar (usually bottom of screen) with social-style ads. Less intrusive than popunder.

**UX Impact:** MEDIUM — floats over content if not handled.

**Decision: USE on desktop only. Disable on mobile.**

Mobile already has a bottom nav bar (or browser chrome) — a Social Bar on top of that = disaster.

**Implementation:**
Add to `app/layout.tsx`:

```typescript
// Desktop only social bar
{/* Hidden on mobile via CSS, loaded globally */}
<div className="hidden lg:block">
  <Script
    id="adsterra-social-bar"
    src="https://pl28728712.effectivegatecpm.com/e8/db/2e/e8db2ed739d29d3e7aee42d2768daa81.js"
    strategy="afterInteractive"
  />
</div>
```

**Note:** `hidden lg:block` only hides the wrapper div — the script itself may still load. For true mobile disabling, use the same `useEffect` + `window.innerWidth` check pattern as PopunderAd. Create `components/ads/SocialBarAd.tsx` mirroring the PopunderAd pattern but checking `width >= 1024` before loading the script.

---

#### AD TYPE 3: Banner 160×600 (Wide Skyscraper)

```html
<script>
  atOptions = {
    key: "ef0e30cdce21c747b2e9624726f3f28e",
    format: "iframe",
    height: 600,
    width: 160,
    params: {},
  };
</script>
<script src="https://www.highperformanceformat.com/ef0e30cdce21c747b2e9624726f3f28e/invoke.js"></script>
```

**What it does:** A tall, narrow vertical banner (160px wide × 600px tall).

**UX Impact:** LOW on desktop (fits in sidebar perfectly). ZERO on mobile (never show).

**Decision: USE on desktop sidebar only.**

This is your **sidebar ad**. It fits perfectly in a 160-200px wide sidebar column. It must NEVER appear on mobile.

**Implementation:**
Create `components/ads/SkyscraperAd.tsx`:

```typescript
'use client';
import Script from 'next/script';

export function SkyscraperAd() {
  return (
    // Completely hidden on mobile and tablet
    <div className="hidden xl:block sticky top-20">
      <p className="text-xs text-zinc-400 text-center mb-2">Advertisement</p>
      <div style={{ width: 160, height: 600 }}>
        <Script
          id="adsterra-skyscraper-options"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'ef0e30cdce21c747b2e9624726f3f28e',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            `
          }}
        />
        <Script
          id="adsterra-skyscraper-invoke"
          src="https://www.highperformanceformat.com/ef0e30cdce21c747b2e9624726f3f28e/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
```

Use `xl:` breakpoint (1280px+) since the sidebar + gallery needs enough space. On anything smaller, `hidden`.

---

#### AD TYPE 4: Banner 468×60 (Horizontal Banner)

```html
<script>
  atOptions = {
    key: "02f6d308d378d094580b21afa3ffb2e8",
    format: "iframe",
    height: 60,
    width: 468,
    params: {},
  };
</script>
<script src="https://www.highperformanceformat.com/02f6d308d378d094580b21afa3ffb2e8/invoke.js"></script>
```

**What it does:** A classic horizontal banner, 468px wide × 60px tall.

**UX Impact:** LOW — slim, familiar format. Like a letterbox at the top/bottom of content.

**Decision: USE on desktop only. Disable on mobile.**

468px is wider than most mobile screens (390px). It would cause horizontal scroll or get clipped on mobile. Desktop-only placement.

**Implementation:**
Create `components/ads/HorizontalBannerAd.tsx`:

```typescript
'use client';
import Script from 'next/script';

export function HorizontalBannerAd({ id }: { id: string }) {
  return (
    // Show on md+ (768px+) where 468px fits comfortably
    <div className="hidden md:flex flex-col items-center py-4">
      <p className="text-xs text-zinc-400 mb-2">Advertisement</p>
      <div style={{ width: 468, height: 60 }}>
        <Script
          id={`adsterra-banner-options-${id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '02f6d308d378d094580b21afa3ffb2e8',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            `
          }}
        />
        <Script
          id={`adsterra-banner-invoke-${id}`}
          src="https://www.highperformanceformat.com/02f6d308d378d094580b21afa3ffb2e8/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
```

The `id` prop ensures unique script IDs when used multiple times per page.

---

#### AD TYPE 5: Native Banner

```html
<script
  async="async"
  data-cfasync="false"
  src="https://pl28730247.effectivegatecpm.com/c32afab8b031dc1f4a7d81b36d14ad2a/invoke.js"
></script>
<div id="container-c32afab8b031dc1f4a7d81b36d14ad2a"></div>
```

**What it does:** A native-style ad that blends with the page content. Looks like a content recommendation widget.

**UX Impact:** VERY LOW — native ads feel like content, not ads.

**Decision: USE everywhere including mobile. This is your best UX-friendly ad.**

Native ads are the most user-friendly format. They can be placed inside the image feed on both mobile and desktop without feeling intrusive.

**Implementation:**
Create `components/ads/NativeBannerAd.tsx`:

```typescript
'use client';
import Script from 'next/script';

export function NativeBannerAd() {
  return (
    <div className="w-full my-4 rounded-xl overflow-hidden">
      <p className="text-xs text-zinc-400 text-center mb-2">Sponsored</p>
      <div id="container-c32afab8b031dc1f4a7d81b36d14ad2a" className="w-full" />
      <Script
        id="adsterra-native-banner"
        async
        data-cfasync="false"
        src="https://pl28730247.effectivegatecpm.com/c32afab8b031dc1f4a7d81b36d14ad2a/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
```

---

### 3.2 — Ad Placement Map Per Page

#### Mobile-First Decision Table

| Ad Type            | Mobile   | Tablet   | Desktop         | Notes                      |
| ------------------ | -------- | -------- | --------------- | -------------------------- |
| Popunder           | ❌ NEVER | ❌ NEVER | ✅ Once/session | Too intrusive on mobile    |
| Social Bar         | ❌ NEVER | ❌ NEVER | ✅ Yes          | Conflicts with mobile nav  |
| Skyscraper 160×600 | ❌ NEVER | ❌ NEVER | ✅ xl+ only     | Too wide for mobile        |
| Banner 468×60      | ❌ NEVER | ✅ md+   | ✅ Yes          | Wider than mobile screen   |
| Native Banner      | ✅ Yes   | ✅ Yes   | ✅ Yes          | Best UX across all devices |

---

#### Page-by-Page Placement

**Homepage (`app/page.tsx`):**

```
[HEADER]
[Hero / Featured Section]
[NativeBannerAd] ← after hero, before categories
[Category Showcase]
[FOOTER]
```

- Mobile: NativeBannerAd only
- Desktop: NativeBannerAd + HorizontalBannerAd below the category section

---

**Gallery Page (`app/gallery/page.tsx`):**

```
DESKTOP layout:
[HEADER]
[HorizontalBannerAd - 468x60] ← above filters
[Category Filter Tabs]
[  GALLERY GRID (flex-1)  ] [SkyscraperAd - 160x600, xl+ only]
[  In-feed NativeBannerAd every 12th image  ]
[HorizontalBannerAd - 468x60] ← below gallery
[FOOTER]

MOBILE layout:
[HEADER]
[Category Filter Tabs]  ← No banner above tabs on mobile (too cramped)
[  GALLERY GRID 2-col  ]
[  NativeBannerAd every 12th image  ]
[FOOTER]
```

In-feed ad logic:

```typescript
// Show NativeBannerAd every 12 images (not 9 — give more breathing room)
// On mobile: every 12th
// On desktop: every 12th (sidebar handles extra revenue)
// Minimum 12 images before first ad appears
{(index + 1) % 12 === 0 && images.length > 12 && (
  <div className="col-span-2 sm:col-span-3 lg:col-span-4">
    <NativeBannerAd />
  </div>
)}
```

Note the `col-span-full` trick — the native ad spans the full grid width, not taking up an image slot. It sits as a row between image rows, which is less disruptive than replacing an image with an ad.

---

**Category Pages (`app/gallery/[category]/page.tsx`):**

- Same layout as Gallery Page

---

**Search Page (`app/search/page.tsx`):**

```
DESKTOP:
[HEADER]
[Search Input - full width]
[  RESULTS GRID  ] [SkyscraperAd - xl+ only]
[FOOTER]

MOBILE:
[HEADER]
[Search Input - full width]
[RESULTS GRID]
[FOOTER]
```

- No in-feed ads on search — it breaks the search experience
- Desktop sidebar only

---

**Favorites Page (`app/favorites/page.tsx`):**

```
[HEADER]
[NativeBannerAd] ← single, unobtrusive, top of page content
[Favorites Grid]
[FOOTER]
```

- One native ad only — this is a personal page
- No sidebar, no in-feed ads
- Respect the user's personal space

---

**About Page (`app/about/page.tsx`):**

```
[HEADER]
[About Content]
[NativeBannerAd] ← middle of content, feels natural
[More Content / FAQ]
[FOOTER]
```

---

**NSFW Page (`app/nsfw/page.tsx`):**

```
NO ADS WHATSOEVER
```

- Adsterra may violate their ToS if adult content + their ads appear together
- Skip all ad components on this page entirely

---

### 3.3 — Global Ad Script Setup

In `app/layout.tsx`, the Social Bar script:

```typescript
import Script from 'next/script';
// ...

// Inside <body>, after </Providers>, before </body>:
<SocialBarAd /> {/* Desktop-only client component */}
<PopunderAd /> {/* Desktop-only, once per session */}
```

Do NOT inline script tags directly — always use the component pattern above for proper Next.js hydration and control.

---

### 3.4 — The Master Ad Config File

Create `lib/ads.config.ts` — a single source of truth for all ad settings:

```typescript
// lib/ads.config.ts
export const ADS_CONFIG = {
  // Master kill switch — set to false to disable ALL ads sitewide instantly
  enabled: true,

  // Individual ad type toggles
  popunder: {
    enabled: true,
    desktopOnly: true,
    oncePerSession: true,
  },
  socialBar: {
    enabled: true,
    desktopOnly: true,
  },
  skyscraper: {
    enabled: true,
    minBreakpoint: "xl", // 1280px
  },
  horizontalBanner: {
    enabled: true,
    minBreakpoint: "md", // 768px
  },
  nativeBanner: {
    enabled: true,
    showOnMobile: true,
    inFeedEveryN: 12, // Show in feed every N images
    minImagesBeforeFirstAd: 12,
  },
} as const;

// Page-level ad controls
export const PAGE_ADS = {
  "/": {
    nativeBanner: true,
    horizontalBanner: true,
    skyscraper: false,
    inFeed: false,
  },
  "/gallery": {
    nativeBanner: true,
    horizontalBanner: true,
    skyscraper: true,
    inFeed: true,
  },
  "/search": {
    nativeBanner: false,
    horizontalBanner: false,
    skyscraper: true,
    inFeed: false,
  },
  "/favorites": {
    nativeBanner: true,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
  "/about": {
    nativeBanner: true,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
  "/nsfw": {
    nativeBanner: false,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
} as const;
```

All ad components must check `ADS_CONFIG.enabled` before rendering. This gives a single toggle to disable everything.

---

### 3.5 — Ad Components Folder Structure

```
components/
└── ads/
    ├── index.ts               ← barrel export
    ├── NativeBannerAd.tsx     ← works on all devices ✅
    ├── HorizontalBannerAd.tsx ← md+ only
    ├── SkyscraperAd.tsx       ← xl+ only, sidebar
    ├── PopunderAd.tsx         ← desktop only, once/session
    └── SocialBarAd.tsx        ← desktop only
```

---

## 📄 TASK 4: CREATE THE DOCUMENTATION FILE

After ALL code changes are complete, create **`SEO_ADS_document.md`** in the root of the project.

---

### Section 1: Project Summary

- Description, tech stack, deployment URL, primary audience (mobile anime fans)

### Section 2: Mobile UX Changes

- Complete list of every mobile UX improvement made
- Before/after description for each change
- How to test mobile layout (responsive DevTools, exact breakpoints)
- Known remaining limitations

### Section 3: SEO Changes Made

| File             | What Changed        | SEO Impact                     |
| ---------------- | ------------------- | ------------------------------ |
| `app/layout.tsx` | Added full metadata | All pages get OG/Twitter cards |
| `app/sitemap.ts` | Created             | Google discovers all pages     |
| ...              | ...                 | ...                            |

### Section 4: Current SEO Status Table

| Page       | Title ✅ | Description ✅ | Canonical ✅ | OG ✅ | JSON-LD ✅    | Indexed |
| ---------- | -------- | -------------- | ------------ | ----- | ------------- | ------- |
| `/`        | ✅       | ✅             | ✅           | ✅    | WebSite + Org | ✅      |
| `/gallery` | ...      |                |              |       |               |         |

### Section 5: Ad Inventory

Complete table of all 5 ad types:

| Ad Type            | Script Location                         | Devices      | Pages Used      | Toggle to Disable                             |
| ------------------ | --------------------------------------- | ------------ | --------------- | --------------------------------------------- |
| Popunder           | `components/ads/PopunderAd.tsx`         | Desktop only | Global          | `ADS_CONFIG.popunder.enabled = false`         |
| Social Bar         | `components/ads/SocialBarAd.tsx`        | Desktop only | Global          | `ADS_CONFIG.socialBar.enabled = false`        |
| Skyscraper 160×600 | `components/ads/SkyscraperAd.tsx`       | xl+ only     | Gallery, Search | `ADS_CONFIG.skyscraper.enabled = false`       |
| Banner 468×60      | `components/ads/HorizontalBannerAd.tsx` | md+ only     | Gallery, Home   | `ADS_CONFIG.horizontalBanner.enabled = false` |
| Native Banner      | `components/ads/NativeBannerAd.tsx`     | All devices  | Most pages      | `ADS_CONFIG.nativeBanner.enabled = false`     |

### Section 6: Ad Placement Maps (ASCII Diagrams)

Provide visual ASCII diagrams for:

- Desktop Gallery Page
- Mobile Gallery Page
- Desktop Homepage
- Mobile Homepage

### Section 7: How to Manage Ads

Step-by-step for each scenario:

**Disable all ads:**

```typescript
// lib/ads.config.ts
enabled: false; // ← Change this one line
```

**Disable ads on mobile only:**

```typescript
// Each component uses window.innerWidth check
// Set desktopOnly: true on any ad type
```

**Change in-feed ad frequency:**

```typescript
// lib/ads.config.ts
nativeBanner: {
  inFeedEveryN: 20;
} // Change 12 to any number
```

**Replace a script URL:**

```
Search for the old URL in components/ads/[AdType].tsx
Replace the src string — it only exists in one place per ad type
```

**Add a new ad placement to a page:**

```typescript
// 1. Import the component
import { NativeBannerAd } from "@/components/ads";
// 2. Check PAGE_ADS config allows it for this route
// 3. Add <NativeBannerAd /> at desired location in JSX
```

**Remove an ad from a page:**

```typescript
// Simply delete the component from the page JSX
// Or toggle it off in PAGE_ADS config
```

### Section 8: How to Modify SEO

- Change site title/description: update `SEO_DEFAULTS` in `lib/constants.ts`
- Add SEO to new page: add `export const metadata` + canonical
- Add new category: `generateStaticParams` auto-picks it up from `SFW_CATEGORIES`
- Change domain: update `metadataBase` in `layout.tsx` + all canonical URLs + `SEO_DEFAULTS.url`

### Section 9: Revenue Optimization

**Expected CPM by ad type (estimate):**
| Ad Type | CPM Range | Notes |
|---------|-----------|-------|
| Popunder | $3–8 | High CPM, high annoyance |
| Native Banner | $2–6 | Best UX/revenue balance |
| Skyscraper | $1–4 | Consistent sidebar revenue |
| Social Bar | $1–3 | Passive |
| Banner 468×60 | $0.5–2 | Lower but reliable |

**A/B tests to run after 30 days:**

1. NativeBannerAd every 12 images vs every 16 images
2. Skyscraper on search page vs no sidebar
3. Popunder enabled vs disabled (check bounce rate difference)

### Section 10: Monitoring

**Adsterra Dashboard:**

- Check daily: impressions, clicks, CPM, revenue by ad type
- Investigate any drop > 20% in impressions (could be an ad error)

**Google Search Console:**

- Submit sitemap: `https://waifugallery.netlify.app/sitemap.xml`
- Check: Coverage report, Core Web Vitals, Mobile Usability

**Monthly Mobile UX Checklist:**

- [ ] Open site on real phone (not just DevTools)
- [ ] Test gallery scroll and image tapping
- [ ] Verify no ads cover content on mobile
- [ ] Check Lighthouse mobile score (target 85+)

### Section 11: Known Limitations & Future Work

- Any UX issues not fully solved
- Ads that need Adsterra dashboard configuration beyond just the script
- Future mobile improvements (swipe gestures, offline gallery, etc.)

---

## ⚠️ CRITICAL RULES FOR OPUS

1. **READ before you WRITE.** If unsure what a file does, read it.
2. **Mobile first.** Test every change at 390px width mentally.
3. **NEVER show the 160×600 or 468×60 banner on mobile** — they will break the layout.
4. **NEVER show the Popunder or Social Bar on mobile** — they will destroy UX.
5. **NativeBannerAd is the only ad safe for all screen sizes.**
6. **DO NOT break existing functionality** — gallery, favorites, search, dark mode, PWA must all work.
7. **DO NOT touch the visual design** — colors, typography, spacing — beyond ad containers.
8. **NEVER use raw `<img>` tag.** Always `<Image>` from `next/image`.
9. **All ad scripts must use Next.js `<Script>` component**, never raw `<script>` tags.
10. **Use `ADS_CONFIG` from `lib/ads.config.ts`** in every ad component — never hardcode decisions.
11. **NEVER add ads to `/nsfw` page.** Zero. None.
12. **NEVER index `/favorites` or `/nsfw`** in robots or metadata.
13. **`SEO_ADS_document.md` is written LAST** — after everything is working, reflecting actual changes.
14. **Always TypeScript type your props** — no `any`, no implicit types.
15. **Use existing constants** — `SFW_CATEGORIES`, `CATEGORY_INFO` from `lib/constants.ts` — never hardcode.

---

## 🏁 SUCCESS CRITERIA

You are done when **every box is checked:**

**Mobile UX:**

- [ ] Gallery grid is 2-col on mobile, 3-col on tablet, 4-col on desktop
- [ ] Image cards have consistent aspect ratio on all screen sizes
- [ ] Touch targets are minimum 44×44px
- [ ] No horizontal scroll on any page at 390px
- [ ] Category tab bar scrolls smoothly on mobile with hidden scrollbar
- [ ] Image modal is fullscreen on mobile with accessible close button
- [ ] Safe area insets handled for notched devices

**SEO:**

- [ ] Every public page has unique title, description, OG, Twitter metadata
- [ ] `/gallery/[category]` pages exist with dynamic metadata
- [ ] `sitemap.xml` accessible and complete
- [ ] `robots.txt` accessible with correct rules
- [ ] JSON-LD structured data on key pages
- [ ] Image alt texts are descriptive and present

**Ads:**

- [ ] `lib/ads.config.ts` exists with master kill switch
- [ ] All 5 ad components exist in `components/ads/`
- [ ] NativeBannerAd appears in gallery feed (every 12 images)
- [ ] Skyscraper appears in desktop sidebar on gallery/search pages
- [ ] HorizontalBannerAd appears on desktop above/below gallery
- [ ] PopunderAd fires once per session, desktop only
- [ ] SocialBarAd loads on desktop only
- [ ] ZERO ads on `/nsfw` page
- [ ] ZERO ad breakage on mobile layout
- [ ] All ads labeled "Advertisement" or "Sponsored"

**Documentation:**

- [ ] `SEO_ADS_document.md` exists in project root
- [ ] All 11 sections complete with accurate, specific details
- [ ] ASCII ad placement diagrams included
- [ ] All "how to modify" instructions tested mentally

**Build:**

- [ ] `npm run build` completes without TypeScript errors
- [ ] No console errors on any page in development

---

_Prompt designed for Claude Opus 4 in VS Code Agent Mode with full workspace access._
_Prioritizes: Mobile UX → User experience → SEO → Revenue_
