// ============================================
// Ads Configuration - Single Source of Truth
// ============================================

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
    minBreakpoint: 'xl' as const, // 1280px
  },
  horizontalBanner: {
    enabled: true,
    minBreakpoint: 'md' as const, // 768px
  },
  nativeBanner: {
    enabled: true,
    showOnMobile: true,
    inFeedEveryN: 12, // Show in feed every N images
    minImagesBeforeFirstAd: 12,
  },
} as const;

// Page-level ad controls
export const PAGE_ADS: Record<string, {
  nativeBanner: boolean;
  horizontalBanner: boolean;
  skyscraper: boolean;
  inFeed: boolean;
}> = {
  '/': {
    nativeBanner: true,
    horizontalBanner: true,
    skyscraper: false,
    inFeed: false,
  },
  '/gallery': {
    nativeBanner: true,
    horizontalBanner: true,
    skyscraper: true,
    inFeed: true,
  },
  '/search': {
    nativeBanner: false,
    horizontalBanner: false,
    skyscraper: true,
    inFeed: false,
  },
  '/favorites': {
    nativeBanner: true,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
  '/about': {
    nativeBanner: true,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
  '/nsfw': {
    nativeBanner: false,
    horizontalBanner: false,
    skyscraper: false,
    inFeed: false,
  },
} as const;
