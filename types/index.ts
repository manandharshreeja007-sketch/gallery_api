// ============================================
// Waifu Gallery - Type Definitions
// ============================================

// API Types
export type ContentType = 'sfw' | 'nsfw';

// SFW Categories (31 total)
export type SfwCategory =
  | 'waifu'
  | 'neko'
  | 'shinobu'
  | 'megumin'
  | 'bully'
  | 'cuddle'
  | 'cry'
  | 'hug'
  | 'awoo'
  | 'kiss'
  | 'lick'
  | 'pat'
  | 'smug'
  | 'bonk'
  | 'yeet'
  | 'blush'
  | 'smile'
  | 'wave'
  | 'highfive'
  | 'handhold'
  | 'nom'
  | 'bite'
  | 'glomp'
  | 'slap'
  | 'kill'
  | 'kick'
  | 'happy'
  | 'wink'
  | 'poke'
  | 'dance'
  | 'cringe';

// NSFW Categories (4 total)
export type NsfwCategory = 'waifu' | 'neko' | 'trap' | 'blowjob';

// Union type for all categories
export type Category = SfwCategory | NsfwCategory;

// API Responses
export interface SingleImageResponse {
  url: string;
}

export interface MultipleImagesResponse {
  files: string[];
}

export interface FetchManyRequest {
  exclude?: string[];
}

// Image with metadata
export interface WaifuImage {
  id: string;
  url: string;
  category: Category;
  type: ContentType;
  caption?: string;
  tags?: string[];
  mood?: Mood;
  fetchedAt: number;
  viewCount?: number;
}

// Mood types for AI features
export type Mood = 
  | 'happy'
  | 'sad'
  | 'romantic'
  | 'playful'
  | 'aggressive'
  | 'calm'
  | 'excited'
  | 'cute';

// Category metadata
export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
  mood: Mood[];
  isNsfw: boolean;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  nsfwEnabled: boolean;
  nsfwConsent: boolean;
  consentTimestamp?: number;
  gridColumns: 2 | 3 | 4 | 5 | 6;
  autoplay: boolean;
  showCaptions: boolean;
}

// Favorites
export interface Favorite {
  image: WaifuImage;
  addedAt: number;
  notes?: string;
}

// Analytics
export interface AnalyticsData {
  categoryViews: Record<string, number>;
  searchHistory: SearchHistoryItem[];
  imageClicks: number;
  sessionStart: number;
  totalSessions: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
}

// API Error
export interface ApiError {
  status: number;
  message: string;
  retryAfter?: number;
}

// Cache entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Search result
export interface SearchResult {
  images: WaifuImage[];
  query: string;
  relevanceScores: number[];
}

// Modal state
export interface ModalState {
  isOpen: boolean;
  image: WaifuImage | null;
  index: number;
}

// Navigation
export interface NavItem {
  href: string;
  label: string;
  icon: string;
  isNsfw?: boolean;
}

// Toast notification
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Download queue item
export interface DownloadItem {
  id: string;
  image: WaifuImage;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
}

// Recommendation
export interface Recommendation {
  category: Category;
  score: number;
  reason: string;
}
