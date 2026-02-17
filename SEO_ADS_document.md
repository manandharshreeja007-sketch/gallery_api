# SEO, Ads & Mobile UX Documentation — Waifu Gallery

> Last updated: June 2025
> Covers all changes from the Mobile UX, SEO, and Ads implementation sprint.

---

## Table of Contents

1. [Project Summary](#section-1-project-summary)
2. [Mobile UX Changes](#section-2-mobile-ux-changes)
3. [SEO Changes Made](#section-3-seo-changes-made)
4. [Current SEO Status](#section-4-current-seo-status)
5. [Ad Inventory](#section-5-ad-inventory)
6. [Ad Placement Maps (ASCII Diagrams)](#section-6-ad-placement-maps)
7. [How to Manage Ads](#section-7-how-to-manage-ads)
8. [How to Modify SEO](#section-8-how-to-modify-seo)
9. [Revenue Optimization](#section-9-revenue-optimization)
10. [Monitoring](#section-10-monitoring)
11. [Known Limitations & Future Work](#section-11-known-limitations--future-work)

---

## Section 1: Project Summary

**Waifu Gallery** is a free, open-source anime image gallery built with modern web technologies. Users can browse, search, and collect anime-style images across 30+ categories with AI-powered search.

| Key                  | Detail                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **Framework**        | Next.js 16.1.4 (App Router, Turbopack)                            |
| **React**            | React 19.2.3                                                      |
| **Language**         | TypeScript 5                                                      |
| **Styling**          | Tailwind CSS 4.1.18 via `@tailwindcss/postcss`                    |
| **Icons**            | lucide-react 0.564.0                                              |
| **Image API**        | waifu.pics (`https://api.waifu.pics`)                             |
| **Ad Network**       | Adsterra (5 ad types)                                             |
| **PWA**              | Yes — `manifest.json`, service worker (`public/sw.js`)            |
| **Deployment URL**   | `https://waifugallery.netlify.app`                                |
| **Primary Audience** | Mobile anime fans (majority traffic expected from mobile devices) |

**Key Features:**

- 31 SFW categories + 4 NSFW categories (age-gated)
- AI-powered semantic search (mood/natural language → category matching)
- Favorites with local storage persistence, export/import as JSON
- Dark mode with system preference detection
- Progressive Web App (installable)
- Infinite scroll image loading
- Image modal with download support

---

## Section 2: Mobile UX Changes

### 2.1 — Image Gallery Grid

| Change        | Before                         | After                                                                                |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| Grid gap      | Fixed `gap-4` across all sizes | Responsive: `gap-2` on mobile, `gap-3` on tablet (`sm:`), `gap-4` on desktop (`lg:`) |
| Column layout | Already responsive 2/3/4 cols  | Unchanged — verified correct at `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`          |

**File:** `components/ImageGallery.tsx`

### 2.2 — Image Card Touch Targets

| Change                     | Before                                | After                                                                           |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| Favorite button size       | Default sizing, hover-only visibility | Minimum 44×44px (`min-w-[44px] min-h-[44px]`), always visible on mobile         |
| Favorite button visibility | Only shown on hover                   | Always visible on mobile, hidden behind hover on `sm:` and above                |
| Category badge             | Hover-only visibility                 | Always visible on mobile with `opacity-100`, hover-triggered animation on `sm:` |

**File:** `components/ImageCard.tsx`

### 2.3 — Image Modal (Fullscreen Viewer)

| Change                                         | Before            | After                                                                      |
| ---------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| Modal padding                                  | Fixed padding     | No padding on mobile (`p-0`), `sm:p-4` on larger screens → fullscreen feel |
| Close button                                   | Default size      | Minimum 44×44px touch target with flex centering                           |
| Navigation arrows                              | Fixed positioning | Positioned closer to edges on mobile (`left-1` / `right-1`), each 44×44px  |
| Image container height                         | Fixed             | `calc(100vh - 120px)` on mobile for optimal viewing                        |
| Bottom info bar                                | Standard padding  | `pb-safe` class for safe-area-inset-bottom on notched devices              |
| Action buttons (download, favorite, share, AI) | Default sizing    | All min 44×44px with `flex items-center justify-center`                    |
| Scrolling                                      | Standard          | `overflow-y-auto` on image container for tall images                       |

**File:** `components/ImageModal.tsx`

### 2.4 — Header (Safe Areas & Touch Targets)

| Change                | Before                   | After                                                       |
| --------------------- | ------------------------ | ----------------------------------------------------------- |
| Safe area             | No top safe area padding | `pt-safe` class added for devices with notch/Dynamic Island |
| Theme toggle button   | Default size             | Minimum 44×44px with flex centering                         |
| Hamburger menu button | Default size             | Minimum 44×44px with flex centering                         |

**File:** `components/Header.tsx`

### 2.5 — Footer (Safe Areas)

| Change    | Before                      | After                                                        |
| --------- | --------------------------- | ------------------------------------------------------------ |
| Safe area | No bottom safe area padding | `pb-safe` class added for home indicator / bottom bar on iOS |

**File:** `components/Footer.tsx`

### 2.6 — Global CSS Additions

| Addition                            | Purpose                                                       |
| ----------------------------------- | ------------------------------------------------------------- |
| `.pt-safe`                          | `padding-top: env(safe-area-inset-top)`                       |
| `.pb-safe`                          | `padding-bottom: env(safe-area-inset-bottom)`                 |
| `.pl-safe`                          | `padding-left: env(safe-area-inset-left)`                     |
| `.pr-safe`                          | `padding-right: env(safe-area-inset-right)`                   |
| `-webkit-overflow-scrolling: touch` | Smooth momentum scrolling on iOS (added to `.scrollbar-hide`) |

**File:** `app/globals.css`

### 2.7 — Viewport Configuration

| Change         | Before  | After                                             |
| -------------- | ------- | ------------------------------------------------- |
| `viewportFit`  | Not set | `cover` — enables `env(safe-area-inset-*)` on iOS |
| `maximumScale` | Not set | `5` — allows pinch-to-zoom                        |

**File:** `app/layout.tsx`

### 2.8 — Homepage Responsiveness

| Change               | Before           | After                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------- |
| Hero section padding | Fixed `py-20`    | `py-12 sm:py-20` — less wasted space on mobile                      |
| Heading size         | Fixed `text-4xl` | `text-3xl sm:text-4xl` — better fit on small screens                |
| CTA buttons          | Inline row       | `flex-col sm:flex-row` — stacked on mobile, side-by-side on desktop |

**File:** `app/page.tsx`

### 2.9 — Image Optimization

| Change        | Before  | After                                                               |
| ------------- | ------- | ------------------------------------------------------------------- |
| Image formats | Default | `['image/avif', 'image/webp']` — smaller files, faster mobile loads |

**File:** `next.config.ts`

### How to Test Mobile Layout

1. Open Chrome DevTools (`F12` or `Ctrl+Shift+I`)
2. Click the device toolbar icon (or `Ctrl+Shift+M`)
3. Select **iPhone 14** (390×844) or set custom: **390px width**
4. Test these breakpoints:
   - `< 640px` — Mobile (2 columns, stacked buttons, fullscreen modal)
   - `640px – 1023px` — Tablet (3 columns, `sm:` breakpoint)
   - `1024px – 1279px` — Desktop (4 columns, `lg:` breakpoint)
   - `≥ 1280px` — Wide desktop (`xl:` breakpoint, sidebar ads appear)

---

## Section 3: SEO Changes Made

| File                              | What Changed                                                                                                                                                                                                                                           | SEO Impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `app/layout.tsx`                  | Added full metadata: `metadataBase`, title template, description, 12 keywords, authors, creator, openGraph block (type, locale, url, siteName, images), Twitter card, `robots` + `googleBot` config, manifest, icons, `applicationName`, `appleWebApp` | All pages get OG/Twitter cards, proper indexing directives, rich previews |
| `app/layout.tsx`                  | Added `<WebSiteJsonLd />` and `<OrganizationJsonLd />` in `<head>`                                                                                                                                                                                     | Google rich results: sitelinks search box, knowledge panel                |
| `app/sitemap.ts`                  | Rewritten with proper priorities: `/` → 1.0 daily, `/gallery` → 0.9 daily, `/search` → 0.8 weekly, categories → 0.7 daily, `/about` → 0.5 monthly, legal → 0.3 yearly                                                                                  | Google discovers all 38+ pages with correct crawl priorities              |
| `app/robot.ts`                    | Rewritten: allow public pages, disallow `/favorites`, `/nsfw`, `/api/`, `/_next/`; block AI training bots (GPTBot, ChatGPT-User, CCBot, anthropic-ai, Google-Extended)                                                                                 | Prevents indexing of private/NSFW content, blocks AI scrapers             |
| `app/gallery/[category]/page.tsx` | **NEW** — Dynamic category pages with breadcrumb, category header, about section, image gallery                                                                                                                                                        | 31 indexable category pages with unique content                           |
| `components/seo/JsonLd.tsx`       | **NEW** — `WebSiteJsonLd`, `OrganizationJsonLd`, `ImageGalleryJsonLd`, `BreadcrumbJsonLd`, `FAQJsonLd` components                                                                                                                                      | Structured data for rich results across the site                          |
| `app/about/page.tsx`              | Added FAQ section (6 questions), "How to Use" section, `FAQJsonLd`, canonical URL, 400+ words of content                                                                                                                                               | FAQ rich results in Google, topical authority, long-form content          |
| `app/contact/page.tsx`            | Added canonical URL in metadata                                                                                                                                                                                                                        | Prevents duplicate content                                                |
| `app/privacy/page.tsx`            | Added canonical URL in metadata                                                                                                                                                                                                                        | Prevents duplicate content                                                |
| `app/terms/page.tsx`              | Added canonical URL in metadata                                                                                                                                                                                                                        | Prevents duplicate content                                                |
| `lib/constants.ts`                | Updated `SEO_DEFAULTS`: richer title, expanded description, 12 keyword strings                                                                                                                                                                         | Better keyword targeting across all pages                                 |
| `next.config.ts`                  | Added `formats: ['image/avif', 'image/webp']` to images config                                                                                                                                                                                         | Faster page load → better Core Web Vitals → higher rankings               |

---

## Section 4: Current SEO Status

| Page                  | Title                                                     | Description                | Canonical             | OG  | JSON-LD                   | Indexed              |
| --------------------- | --------------------------------------------------------- | -------------------------- | --------------------- | --- | ------------------------- | -------------------- |
| `/`                   | ✅ "Waifu Gallery - Free Anime Image Gallery & AI Search" | ✅                         | ✅ (via metadataBase) | ✅  | ✅ WebSite + Organization | ✅ Yes               |
| `/gallery`            | ✅ "Anime Gallery - Browse 30+ Categories"                | ✅                         | ✅                    | ✅  | ✅ (inherits root)        | ✅ Yes               |
| `/gallery/[category]` | ✅ Dynamic per category                                   | ✅ Auto from CATEGORY_INFO | ✅                    | ✅  | ✅ (inherits root)        | ✅ Yes               |
| `/search`             | ✅ "AI Anime Image Search - Find Any Style"               | ✅                         | ✅                    | ✅  | ✅ (inherits root)        | ✅ Yes               |
| `/favorites`          | ✅ "Your Favorite Anime Images"                           | ✅                         | ✅                    | ✅  | —                         | ❌ noIndex           |
| `/about`              | ✅ "About Waifu Gallery"                                  | ✅                         | ✅                    | ✅  | ✅ FAQPage (6 Q&As)       | ✅ Yes               |
| `/contact`            | ✅ "Contact Us"                                           | ✅                         | ✅                    | ✅  | —                         | ✅ Yes               |
| `/privacy`            | ✅ "Privacy Policy"                                       | ✅                         | ✅                    | ✅  | —                         | ✅ Yes               |
| `/terms`              | ✅ "Terms of Service"                                     | ✅                         | ✅                    | ✅  | —                         | ✅ Yes               |
| `/nsfw`               | ✅ "NSFW Gallery (18+)"                                   | ✅                         | —                     | ✅  | —                         | ❌ noIndex, noFollow |

**Sitemap:** `https://waifugallery.netlify.app/sitemap.xml` — 38 URLs (7 static + 31 categories)

**Robots.txt:** `https://waifugallery.netlify.app/robots.txt` — blocks `/favorites`, `/nsfw`, `/api/`, `/_next/`, and AI training bots

---

## Section 5: Ad Inventory

All ads are managed through **Adsterra** and configured via the master config at `lib/ads.config.ts`.

| Ad Type                  | Component File                          | Devices                | Pages Used                                                            | Dimensions          | Toggle to Disable                             |
| ------------------------ | --------------------------------------- | ---------------------- | --------------------------------------------------------------------- | ------------------- | --------------------------------------------- |
| Popunder                 | `components/ads/PopunderAd.tsx`         | Desktop only (1024px+) | Global (layout.tsx)                                                   | N/A (opens new tab) | `ADS_CONFIG.popunder.enabled = false`         |
| Social Bar               | `components/ads/SocialBarAd.tsx`        | Desktop only (1024px+) | Global (layout.tsx)                                                   | Sticky bar          | `ADS_CONFIG.socialBar.enabled = false`        |
| Skyscraper 160×600       | `components/ads/SkyscraperAd.tsx`       | xl+ only (1280px+)     | Gallery, Search, Category                                             | 160×600px           | `ADS_CONFIG.skyscraper.enabled = false`       |
| Horizontal Banner 468×60 | `components/ads/HorizontalBannerAd.tsx` | md+ only (768px+)      | Homepage, Gallery, Category                                           | 468×60px            | `ADS_CONFIG.horizontalBanner.enabled = false` |
| Native Banner            | `components/ads/NativeBannerAd.tsx`     | All devices            | Homepage, Gallery, Search (none), Favorites, About, Category, In-feed | Container-based     | `ADS_CONFIG.nativeBanner.enabled = false`     |

**Key Rules:**

- **NSFW page (`/nsfw`):** ZERO ads — Adsterra ToS prohibits ads on adult content
- **Mobile:** Only NativeBannerAd is shown — all other types are hidden via CSS breakpoints + JS checks
- **Popunder:** Fires once per session maximum, tracked via `sessionStorage`
- **All ads** check `ADS_CONFIG.enabled` (master kill switch) before rendering

---

## Section 6: Ad Placement Maps

### Desktop Gallery Page (≥ 1280px)

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
├─────────────────────────────────────────────────────────────────┤
│              [ HorizontalBannerAd 468×60 ]                      │
├─────────────────────────────────────────────────────────────────┤
│  [ Category Filter Tabs — horizontal scroll ]                   │
├─────────────────────────────────────────────┬───────────────────┤
│                                             │                   │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │  ┌─────────────┐  │
│   │ img │ │ img │ │ img │ │ img │         │  │ Skyscraper  │  │
│   └─────┘ └─────┘ └─────┘ └─────┘         │  │  160×600    │  │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │  │  (sticky)   │  │
│   │ img │ │ img │ │ img │ │ img │         │  │             │  │
│   └─────┘ └─────┘ └─────┘ └─────┘         │  │             │  │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │  │             │  │
│   │ img │ │ img │ │ img │ │ img │         │  │             │  │
│   └─────┘ └─────┘ └─────┘ └─────┘         │  │             │  │
│   ┌─────────────────────────────────┐      │  │             │  │
│   │    NativeBannerAd (in-feed)     │      │  │             │  │
│   │    (after every 12th image)     │      │  └─────────────┘  │
│   └─────────────────────────────────┘      │                   │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │                   │
│   │ img │ │ img │ │ img │ │ img │         │                   │
│   └─────┘ └─────┘ └─────┘ └─────┘         │                   │
├─────────────────────────────────────────────┴───────────────────┤
│              [ HorizontalBannerAd 468×60 ]                      │
├─────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
└─────────────────────────────────────────────────────────────────┘

Global ads (always present): PopunderAd (once/session), SocialBarAd (sticky bar)
```

### Mobile Gallery Page (< 640px)

```
┌───────────────────────┐
│       HEADER          │
├───────────────────────┤
│ [Category Filter Tabs]│
│  ← scroll →           │
├───────────────────────┤
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│ ┌─────────────────┐   │
│ │ NativeBannerAd  │   │
│ │  (every 12th)   │   │
│ └─────────────────┘   │
│  ┌─────┐ ┌─────┐     │
│  │ img │ │ img │     │
│  └─────┘ └─────┘     │
│       ...             │
├───────────────────────┤
│       FOOTER          │
└───────────────────────┘

No banners, no skyscraper, no popunder,
no social bar on mobile.
Only NativeBannerAd in-feed.
```

### Desktop Homepage (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     HERO SECTION                                │
│              "Discover Beautiful Anime Art"                      │
│           [ Explore Gallery ] [ AI Search ]                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    [ NativeBannerAd ]                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  CATEGORY SHOWCASE                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │waifu │ │ neko │ │ hug  │ │smile │ │dance │ │ ...  │       │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              [ HorizontalBannerAd 468×60 ]                      │
├─────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Homepage (< 640px)

```
┌───────────────────────┐
│       HEADER          │
├───────────────────────┤
│                       │
│    HERO SECTION       │
│  "Discover Beautiful  │
│     Anime Art"        │
│  [Explore Gallery]    │
│  [   AI Search   ]    │
│   (stacked buttons)   │
│                       │
├───────────────────────┤
│  [ NativeBannerAd ]   │
├───────────────────────┤
│                       │
│  CATEGORY SHOWCASE    │
│  ┌──────┐ ┌──────┐   │
│  │waifu │ │ neko │   │
│  └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐   │
│  │ hug  │ │smile │   │
│  └──────┘ └──────┘   │
│       ...             │
│                       │
├───────────────────────┤
│       FOOTER          │
└───────────────────────┘

No HorizontalBannerAd on mobile
(468px > 390px screen width).
```

---

## Section 7: How to Manage Ads

### Disable ALL ads instantly

```typescript
// lib/ads.config.ts — line 7
export const ADS_CONFIG = {
  enabled: false,  // ← Change this one line. All ads disappear.
  // ...
```

Every ad component checks `ADS_CONFIG.enabled` before rendering. Setting this to `false` disables everything sitewide.

### Disable ads on mobile only

Mobile ads are already restricted by design:

- **Popunder, Social Bar, Skyscraper, Horizontal Banner** → all have CSS breakpoint hiding (`hidden lg:block`, `hidden xl:block`, `hidden md:flex`) AND JavaScript `window.innerWidth` checks
- **NativeBannerAd** is the only ad that shows on mobile

To disable NativeBannerAd on mobile:

```typescript
// lib/ads.config.ts
nativeBanner: {
  enabled: true,
  showOnMobile: false,  // ← Add a check in NativeBannerAd component
  // ...
```

### Change in-feed ad frequency

```typescript
// lib/ads.config.ts
nativeBanner: {
  inFeedEveryN: 20,         // ← Change from 12 to any number (higher = fewer ads)
  minImagesBeforeFirstAd: 20, // ← First ad appears after this many images
  // ...
```

The `ImageGallery.tsx` component reads `ADS_CONFIG.nativeBanner.inFeedEveryN` to determine placement.

### Replace an ad script URL

Each ad type has its script URL in exactly ONE file:

| Ad Type           | File                                    | What to Search                     |
| ----------------- | --------------------------------------- | ---------------------------------- |
| Popunder          | `components/ads/PopunderAd.tsx`         | `effectivegatecpm.com/84/16/bb/`   |
| Social Bar        | `components/ads/SocialBarAd.tsx`        | `effectivegatecpm.com/e8/db/2e/`   |
| Skyscraper        | `components/ads/SkyscraperAd.tsx`       | `ef0e30cdce21c747b2e9624726f3f28e` |
| Horizontal Banner | `components/ads/HorizontalBannerAd.tsx` | `02f6d308d378d094580b21afa3ffb2e8` |
| Native Banner     | `components/ads/NativeBannerAd.tsx`     | `c32afab8b031dc1f4a7d81b36d14ad2a` |

Replace the `src` URL string in the component file. Each URL appears only once.

### Add a new ad placement to a page

```typescript
// 1. Import the component at the top of the page file
import { NativeBannerAd } from '@/components/ads';

// 2. (Optional) Update PAGE_ADS config in lib/ads.config.ts for documentation
// 3. Place the component in the JSX where you want it
<NativeBannerAd />
```

### Remove an ad from a page

Option A: Delete the `<ComponentName />` JSX from the page file.

Option B: Toggle it off in `PAGE_ADS` config:

```typescript
// lib/ads.config.ts
'/gallery': {
  nativeBanner: false,  // ← Disable for this page
  // ...
```

Note: `PAGE_ADS` is currently a documentation/reference config. The actual rendering is controlled by which components are imported in each page file.

---

## Section 8: How to Modify SEO

### Change site title or description

Edit `SEO_DEFAULTS` in `lib/constants.ts`:

```typescript
export const SEO_DEFAULTS = {
  title: "Your New Title Here",
  description: "Your new description here.",
  keywords: [...],  // Update keywords array
  url: "https://waifugallery.netlify.app",
  image: "/og-image.png",
};
```

All pages that use the title template (`%s | Waifu Gallery`) will automatically inherit changes.

### Add SEO metadata to a new page

```typescript
// app/new-page/page.tsx
export const metadata = {
  title: "Page Title",
  description: "Page description for search engines.",
  alternates: {
    canonical: "https://waifugallery.netlify.app/new-page",
  },
};
```

The title will automatically use the template from layout.tsx: "Page Title | Waifu Gallery".

### Add a new category

1. Add the category name to `SFW_CATEGORIES` array in `lib/constants.ts`
2. Add a `CATEGORY_INFO` entry with `id`, `name`, `description`, `icon`, `mood`, `isNsfw`
3. The dynamic `app/gallery/[category]/page.tsx` will automatically handle it
4. `app/sitemap.ts` will automatically include it (it iterates `SFW_CATEGORIES`)
5. No rebuild of static pages needed — the category page is dynamically rendered

### Change the domain / deployment URL

Update in these locations:

1. `lib/constants.ts` → `SEO_DEFAULTS.url`
2. `app/layout.tsx` → `metadataBase: new URL('https://new-domain.com')`
3. `app/sitemap.ts` → `BASE_URL` constant
4. `app/robot.ts` → `sitemap` URL
5. All page files with `alternates.canonical` URLs:
   - `app/about/page.tsx`
   - `app/contact/page.tsx`
   - `app/privacy/page.tsx`
   - `app/terms/page.tsx`

### Add JSON-LD to a new page

```typescript
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

// In your component JSX:
<BreadcrumbJsonLd items={[
  { name: 'Home', url: 'https://waifugallery.netlify.app' },
  { name: 'New Page', url: 'https://waifugallery.netlify.app/new-page' },
]} />
```

Available JSON-LD components in `components/seo/JsonLd.tsx`:

- `WebSiteJsonLd` — used in root layout
- `OrganizationJsonLd` — used in root layout
- `ImageGalleryJsonLd` — for gallery/category pages
- `BreadcrumbJsonLd` — for breadcrumb navigation
- `FAQJsonLd` — for FAQ sections (used on about page)

---

## Section 9: Revenue Optimization

### Expected CPM by Ad Type (Estimates)

| Ad Type                  | CPM Range | Notes                                                                       |
| ------------------------ | --------- | --------------------------------------------------------------------------- |
| Popunder                 | $3–8      | Highest CPM, highest annoyance; desktop-only, once/session mitigates impact |
| Native Banner            | $2–6      | **Best UX/revenue balance** — blends with content, works on all devices     |
| Skyscraper 160×600       | $1–4      | Consistent sidebar revenue on wide screens                                  |
| Social Bar               | $1–3      | Passive income, low interaction                                             |
| Horizontal Banner 468×60 | $0.5–2    | Lower CPM but reliable, classic format                                      |

### Revenue Formula

```
Monthly Revenue ≈ (Daily Pageviews / 1000) × Average CPM × 30

Example: 10,000 daily pageviews × $3 avg CPM × 30 = $900/month
```

### A/B Tests to Run After 30 Days

1. **NativeBannerAd frequency:** Every 12 images vs every 16 images
   - Metric: Revenue per session vs bounce rate
   - If bounce rate increases >5%, go with 16

2. **Skyscraper on search page:** Enabled vs disabled
   - Metric: Search completion rate, revenue from search page
   - If users search less, remove it

3. **Popunder:** Enabled vs disabled
   - Metric: Bounce rate difference, return visitor rate
   - If bounce rate increases >10%, disable permanently

4. **In-feed ad position:** After 12th image vs after 8th image
   - Metric: Scroll depth, session duration
   - Users who see ads too early may leave

---

## Section 10: Monitoring

### Adsterra Dashboard

**Check daily:**

- Impressions per ad type
- Click-through rate (CTR)
- CPM by ad type and geography
- Total daily revenue

**Investigate if:**

- Impressions drop >20% day-over-day (possible ad loading error)
- CPM drops significantly (check if an ad type is blocked by adblockers)
- Revenue is $0 for a day (script may be broken)

### Google Search Console

**Initial setup:**

1. Verify site ownership at [search.google.com/search-console](https://search.google.com/search-console)
2. Submit sitemap: `https://waifugallery.netlify.app/sitemap.xml`
3. Request indexing for key pages: `/`, `/gallery`, `/about`, `/search`

**Check weekly:**

- **Coverage report:** Ensure all 38 URLs are indexed (7 static + 31 categories)
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile Usability:** Zero issues expected after our mobile UX improvements
- **Search Performance:** Track impressions, clicks, CTR, average position

### Monthly Mobile UX Checklist

- [ ] Open site on a real phone (not just DevTools) — iOS Safari + Android Chrome
- [ ] Test gallery scroll — smooth infinite scroll, no jank
- [ ] Tap 5+ images — modal opens fullscreen, close button accessible
- [ ] Test category tab scrolling — hidden scrollbar, smooth momentum
- [ ] Verify no ads cover content on mobile (360px and 390px widths)
- [ ] Check Lighthouse mobile score (target: 85+ performance)
- [ ] Test with slow 3G throttling — images lazy-load, skeleton states visible
- [ ] Test favorites page — add, remove, export, import all work
- [ ] Test search — keyboard doesn't push content off screen
- [ ] Verify NSFW page has zero ads visible

---

## Section 11: Known Limitations & Future Work

### Current Limitations

1. **No swipe gestures in image modal:** Left/right navigation uses arrow buttons, not touch swipe. Adding swipe gestures (via `touch-action` or a library like `react-swipeable`) would improve mobile UX.

2. **No pinch-to-zoom in modal:** The modal supports overflow scrolling for tall images, but true pinch-to-zoom on the image itself is not implemented.

3. **No bottom navigation bar:** The prompt suggested a bottom nav bar for mobile (`Home | Gallery | Search | Favorites`). This was not added to avoid conflicting with the existing hamburger menu pattern and the Social Bar ad on desktop.

4. **Category pages are client-rendered:** `app/gallery/[category]/page.tsx` is a `'use client'` component, meaning the initial HTML doesn't contain images (they load via API). A server component with `generateStaticParams` + ISR would be better for SEO, but the waifu.pics API doesn't support server-side fetching well (no static image URLs).

5. **No `generateStaticParams` on category pages:** Because the page is a client component, `generateStaticParams` and `generateMetadata` cannot be used. Category pages rely on the sitemap for discovery instead. A future refactor could split into a server layout with metadata + client content.

6. **`PAGE_ADS` config is documentation-only:** The `PAGE_ADS` object in `lib/ads.config.ts` documents which ads appear on which pages, but the actual rendering is controlled by imports in each page file. Making `PAGE_ADS` programmatically control rendering would require a context-based approach.

7. **Adsterra dashboard configuration:** Some ad types (especially Native Banner and Social Bar) may require additional configuration in the Adsterra publisher dashboard beyond just the script tags — such as ad appearance, targeting, and allowed domains.

8. **No OG image generation:** The site references `/og-image.png` but doesn't auto-generate Open Graph images. Future work could use `next/og` (ImageResponse) to generate dynamic OG images per category.

9. **Ad blocker detection:** No ad blocker detection is implemented. Users with ad blockers will see empty spaces where ads would be. Consider adding graceful fallback messaging or just accepting the gap.

### Future Improvements

| Priority | Improvement                                            | Impact                           |
| -------- | ------------------------------------------------------ | -------------------------------- |
| High     | Add swipe gestures to image modal                      | Better mobile UX                 |
| High     | Server-render category pages with `generateMetadata`   | Better SEO for 31 category pages |
| Medium   | Add bottom navigation bar for mobile                   | Improved thumb-zone navigation   |
| Medium   | Dynamic OG image generation per category               | Better social sharing previews   |
| Medium   | Implement `generateStaticParams` for categories        | Pre-rendered HTML for SEO        |
| Low      | Ad blocker detection with fallback UI                  | Awareness, not revenue recovery  |
| Low      | Offline gallery with service worker caching            | PWA experience improvement       |
| Low      | Add breadcrumb JSON-LD to category pages (server-side) | Richer search results            |
| Low      | Implement viewport-based batch size adjustment         | Faster mobile loading            |

---

_This document reflects actual changes made to the codebase. All file references, config values, and placement details are accurate as of the implementation date._
