// ============================================
// Waifu Gallery - API Service Layer
// ============================================

import {
  ContentType,
  Category,
  SingleImageResponse,
  MultipleImagesResponse,
  WaifuImage,
  ApiError,
  CacheEntry,
} from '@/types';
import {
  API_BASE_URL,
  API_TIMEOUT,
  MAX_RETRIES,
  RETRY_DELAY,
  CACHE_TTL,
  MAX_EXCLUDE_URLS,
} from './constants';
import { createWaifuImage, sleep, getBackoffDelay } from './utils';

// ============================================
// Cache Implementation
// ============================================

class ApiCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number = 100;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = CACHE_TTL): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// ============================================
// Seen Images Tracker
// ============================================

class SeenImagesTracker {
  private seen: Map<string, Set<string>> = new Map();
  private maxPerCategory: number = 1000;

  add(category: string, url: string): void {
    if (!this.seen.has(category)) {
      this.seen.set(category, new Set());
    }
    
    const categorySet = this.seen.get(category)!;
    
    // Evict oldest if at capacity
    if (categorySet.size >= this.maxPerCategory) {
      const oldest = categorySet.values().next().value;
      if (oldest) categorySet.delete(oldest);
    }
    
    categorySet.add(url);
  }

  addMany(category: string, urls: string[]): void {
    urls.forEach(url => this.add(category, url));
  }

  getExcludeList(category: string): string[] {
    const categorySet = this.seen.get(category);
    if (!categorySet) return [];
    
    const urls = Array.from(categorySet);
    return urls.slice(-MAX_EXCLUDE_URLS);
  }

  has(category: string, url: string): boolean {
    return this.seen.get(category)?.has(url) ?? false;
  }

  clear(category?: string): void {
    if (category) {
      this.seen.delete(category);
    } else {
      this.seen.clear();
    }
  }

  getCount(category: string): number {
    return this.seen.get(category)?.size ?? 0;
  }
}

// ============================================
// Rate Limiter
// ============================================

class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(maxTokens: number = 10, refillRate: number = 1000) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<boolean> {
    this.refill();
    
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    
    // Wait for next token
    const waitTime = this.refillRate - (Date.now() - this.lastRefill);
    if (waitTime > 0) {
      await sleep(waitTime);
      this.refill();
      if (this.tokens > 0) {
        this.tokens--;
        return true;
      }
    }
    
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillRate);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }
}

// ============================================
// API Client
// ============================================

class WaifuApiClient {
  private cache: ApiCache;
  private seenTracker: SeenImagesTracker;
  private rateLimiter: RateLimiter;

  constructor() {
    this.cache = new ApiCache();
    this.seenTracker = new SeenImagesTracker();
    this.rateLimiter = new RateLimiter();
  }

  // Core fetch with retry logic
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries: number = MAX_RETRIES
  ): Promise<T> {
    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      // Wait for rate limiter
      await this.rateLimiter.acquire();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
          lastError = {
            status: 429,
            message: 'Rate limited. Please wait before making more requests.',
            retryAfter,
          };
          
          const delay = getBackoffDelay(attempt, retryAfter * 1000);
          console.warn(`Rate limited. Waiting ${delay}ms before retry...`);
          await sleep(delay);
          continue;
        }

        // Handle server errors
        if (response.status >= 500) {
          lastError = {
            status: response.status,
            message: 'Server error. The API is temporarily unavailable.',
          };
          
          const delay = getBackoffDelay(attempt, RETRY_DELAY);
          console.warn(`Server error. Waiting ${delay}ms before retry...`);
          await sleep(delay);
          continue;
        }

        // Handle client errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          } as ApiError;
        }

        return await response.json();
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          lastError = {
            status: 408,
            message: 'Request timed out. Please try again.',
          };
        } else if ((error as ApiError).status) {
          throw error;
        } else {
          lastError = {
            status: 0,
            message: 'Network error. Please check your connection.',
          };
        }

        if (attempt < retries - 1) {
          const delay = getBackoffDelay(attempt, RETRY_DELAY);
          await sleep(delay);
        }
      }
    }

    throw lastError || { status: 0, message: 'Unknown error occurred' };
  }

  // Get single random image
  async getSingleImage(
    type: ContentType,
    category: Category
  ): Promise<WaifuImage> {
    const url = `${API_BASE_URL}/${type}/${category}`;
    const response = await this.fetchWithRetry<SingleImageResponse>(url);
    
    const image = createWaifuImage(response.url, category, type);
    this.seenTracker.add(category, response.url);
    
    return image;
  }

  // Get multiple images (30 unique per request)
  async getMultipleImages(
    type: ContentType,
    category: Category,
    excludePreviouslySeen: boolean = true
  ): Promise<WaifuImage[]> {
    const exclude = excludePreviouslySeen 
      ? this.seenTracker.getExcludeList(category)
      : [];

    const url = `${API_BASE_URL}/many/${type}/${category}`;
    const response = await this.fetchWithRetry<MultipleImagesResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exclude }),
    });

    const images = response.files.map(fileUrl => 
      createWaifuImage(fileUrl, category, type)
    );

    // Track seen images
    this.seenTracker.addMany(category, response.files);

    return images;
  }

  // Get images from multiple categories
  async getImagesFromCategories(
    type: ContentType,
    categories: Category[],
    imagesPerCategory: number = 6
  ): Promise<WaifuImage[]> {
    const results = await Promise.all(
      categories.map(async (category) => {
        try {
          const images = await this.getMultipleImages(type, category);
          return images.slice(0, imagesPerCategory);
        } catch (error) {
          console.error(`Failed to fetch images for ${category}:`, error);
          return [];
        }
      })
    );

    return results.flat();
  }

  // Get random image from random category
  async getRandomImage(
    type: ContentType,
    categories: Category[]
  ): Promise<WaifuImage> {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return this.getSingleImage(type, randomCategory);
  }

  // Preload images for smoother UX
  async preloadCategory(
    type: ContentType,
    category: Category
  ): Promise<void> {
    const cacheKey = `preload:${type}:${category}`;
    
    if (this.cache.has(cacheKey)) {
      return;
    }

    try {
      const images = await this.getMultipleImages(type, category);
      this.cache.set(cacheKey, images, CACHE_TTL * 2);
    } catch (error) {
      console.error(`Failed to preload ${category}:`, error);
    }
  }

  // Get preloaded images
  getPreloadedImages(
    type: ContentType,
    category: Category
  ): WaifuImage[] | null {
    const cacheKey = `preload:${type}:${category}`;
    return this.cache.get<WaifuImage[]>(cacheKey);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Clear seen images for a category
  clearSeenImages(category?: Category): void {
    this.seenTracker.clear(category);
  }

  // Get statistics
  getStats(): {
    seenCounts: Record<string, number>;
    rateLimit: number;
  } {
    const seenCounts: Record<string, number> = {};
    // Get counts for common categories
    ['waifu', 'neko', 'hug', 'smile', 'pat'].forEach(cat => {
      seenCounts[cat] = this.seenTracker.getCount(cat);
    });

    return {
      seenCounts,
      rateLimit: this.rateLimiter.getAvailableTokens(),
    };
  }
}

// ============================================
// Singleton Instance
// ============================================

let apiClientInstance: WaifuApiClient | null = null;

export function getApiClient(): WaifuApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new WaifuApiClient();
  }
  return apiClientInstance;
}

// ============================================
// Convenience Functions
// ============================================

export async function fetchSingleImage(
  type: ContentType,
  category: Category
): Promise<WaifuImage> {
  return getApiClient().getSingleImage(type, category);
}

export async function fetchMultipleImages(
  type: ContentType,
  category: Category,
  excludePreviouslySeen: boolean = true
): Promise<WaifuImage[]> {
  return getApiClient().getMultipleImages(type, category, excludePreviouslySeen);
}

export async function fetchImagesFromCategories(
  type: ContentType,
  categories: Category[],
  imagesPerCategory: number = 6
): Promise<WaifuImage[]> {
  return getApiClient().getImagesFromCategories(type, categories, imagesPerCategory);
}

export async function fetchRandomImage(
  type: ContentType,
  categories: Category[]
): Promise<WaifuImage> {
  return getApiClient().getRandomImage(type, categories);
}

export { WaifuApiClient, ApiCache, SeenImagesTracker, RateLimiter };
