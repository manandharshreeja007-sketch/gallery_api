// ============================================
// Waifu Gallery - Utility Functions
// ============================================

import { WaifuImage, Category, ContentType, Mood } from '@/types';
import { CATEGORY_INFO, NSFW_CATEGORY_INFO, MOOD_CATEGORIES, SFW_CATEGORIES } from './constants';

/**
 * Generate a unique ID for an image based on its URL
 * Uses a combination of filename and URL hash to ensure uniqueness
 */
export function generateImageId(url: string): string {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  const nameWithoutExt = filename.split('.')[0];
  
  // Create a simple hash from the full URL to ensure uniqueness
  // even if filenames are the same across different paths
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const urlHash = Math.abs(hash).toString(36);
  
  if (nameWithoutExt) {
    return `${nameWithoutExt}-${urlHash}`;
  }
  return crypto.randomUUID();
}

/**
 * Create a WaifuImage object from a URL
 */
export function createWaifuImage(
  url: string,
  category: Category,
  type: ContentType
): WaifuImage {
  return {
    id: generateImageId(url),
    url,
    category,
    type,
    fetchedAt: Date.now(),
  };
}

/**
 * Get category info by ID
 */
export function getCategoryInfo(category: Category, isNsfw: boolean = false) {
  if (isNsfw) {
    return NSFW_CATEGORY_INFO[category] || CATEGORY_INFO[category];
  }
  return CATEGORY_INFO[category];
}

/**
 * Get categories by mood
 */
export function getCategoriesByMood(mood: Mood): Category[] {
  return MOOD_CATEGORIES[mood] || [];
}

/**
 * Get random categories
 */
export function getRandomCategories(count: number, isNsfw: boolean = false): Category[] {
  const categories = isNsfw ? Object.keys(NSFW_CATEGORY_INFO) : SFW_CATEGORIES;
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count) as Category[];
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exponential backoff delay
 */
export function getBackoffDelay(attempt: number, baseDelay: number = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000);
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Get unique items from array
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if code is running on client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if code is running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  const match = url.match(/\.([^./?#]+)(?:[?#]|$)/);
  return match ? match[1].toLowerCase() : 'png';
}

/**
 * Generate download filename
 */
export function generateDownloadFilename(image: WaifuImage): string {
  const ext = getFileExtension(image.url);
  return `waifu-${image.category}-${image.id}.${ext}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient()) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Share content using Web Share API
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!isClient() || !navigator.share) return false;
  
  try {
    await navigator.share(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if Web Share API is supported
 */
export function canShare(): boolean {
  return isClient() && 'share' in navigator;
}

/**
 * Download image
 */
export async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Preload image
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(preloadImage));
}

/**
 * Get contrast color (black or white) for a given background
 */
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Parse URL parameters
 */
export function parseQueryParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Build URL with parameters
 */
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base, 'http://dummy');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.pathname + url.search;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate social share URLs
 */
export function getSocialShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };
}

/**
 * Local storage helpers with JSON parsing
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (!isClient()) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },
  
  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(key);
  },
  
  clear(): void {
    if (!isClient()) return;
    localStorage.clear();
  },
};

/**
 * Class name merger (similar to clsx/cn)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
