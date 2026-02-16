// ============================================
// Waifu Gallery - Constants
// ============================================

import { CategoryInfo, SfwCategory, NsfwCategory, Mood, NavItem } from '@/types';

// API Configuration
export const API_BASE_URL = 'https://api.waifu.pics';
export const API_TIMEOUT = 10000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const MAX_EXCLUDE_URLS = 30;
export const IMAGES_PER_REQUEST = 30;

// SFW Categories Array
export const SFW_CATEGORIES: SfwCategory[] = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug',
  'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush',
  'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap',
  'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'
];

// NSFW Categories Array
export const NSFW_CATEGORIES: NsfwCategory[] = [
  'waifu', 'neko', 'trap', 'blowjob'
];

// Category Metadata with Icons and Moods
export const CATEGORY_INFO: Record<string, CategoryInfo> = {
  // SFW Categories
  waifu: { id: 'waifu', name: 'Waifu', description: 'Beautiful anime girls', icon: '👧', mood: ['cute', 'happy'], isNsfw: false },
  neko: { id: 'neko', name: 'Neko', description: 'Cute cat girls', icon: '🐱', mood: ['cute', 'playful'], isNsfw: false },
  shinobu: { id: 'shinobu', name: 'Shinobu', description: 'Shinobu Kocho themed', icon: '🦋', mood: ['calm', 'cute'], isNsfw: false },
  megumin: { id: 'megumin', name: 'Megumin', description: 'Explosion enthusiast', icon: '💥', mood: ['excited', 'playful'], isNsfw: false },
  bully: { id: 'bully', name: 'Bully', description: 'Bullying reactions', icon: '😈', mood: ['playful', 'aggressive'], isNsfw: false },
  cuddle: { id: 'cuddle', name: 'Cuddle', description: 'Warm cuddles', icon: '🤗', mood: ['romantic', 'calm'], isNsfw: false },
  cry: { id: 'cry', name: 'Cry', description: 'Crying moments', icon: '😢', mood: ['sad'], isNsfw: false },
  hug: { id: 'hug', name: 'Hug', description: 'Heartwarming hugs', icon: '🫂', mood: ['happy', 'romantic'], isNsfw: false },
  awoo: { id: 'awoo', name: 'Awoo', description: 'Wolf howls', icon: '🐺', mood: ['playful', 'excited'], isNsfw: false },
  kiss: { id: 'kiss', name: 'Kiss', description: 'Sweet kisses', icon: '💋', mood: ['romantic'], isNsfw: false },
  lick: { id: 'lick', name: 'Lick', description: 'Licking reactions', icon: '👅', mood: ['playful'], isNsfw: false },
  pat: { id: 'pat', name: 'Pat', description: 'Head pats', icon: '✋', mood: ['cute', 'calm'], isNsfw: false },
  smug: { id: 'smug', name: 'Smug', description: 'Smug expressions', icon: '😏', mood: ['playful'], isNsfw: false },
  bonk: { id: 'bonk', name: 'Bonk', description: 'Bonk reactions', icon: '🔨', mood: ['playful', 'aggressive'], isNsfw: false },
  yeet: { id: 'yeet', name: 'Yeet', description: 'Yeet moments', icon: '🚀', mood: ['excited', 'playful'], isNsfw: false },
  blush: { id: 'blush', name: 'Blush', description: 'Blushing faces', icon: '😊', mood: ['cute', 'romantic'], isNsfw: false },
  smile: { id: 'smile', name: 'Smile', description: 'Beautiful smiles', icon: '😄', mood: ['happy', 'cute'], isNsfw: false },
  wave: { id: 'wave', name: 'Wave', description: 'Waving hello', icon: '👋', mood: ['happy', 'playful'], isNsfw: false },
  highfive: { id: 'highfive', name: 'High Five', description: 'High fives', icon: '🙌', mood: ['happy', 'excited'], isNsfw: false },
  handhold: { id: 'handhold', name: 'Handhold', description: 'Hand holding', icon: '🤝', mood: ['romantic', 'calm'], isNsfw: false },
  nom: { id: 'nom', name: 'Nom', description: 'Eating reactions', icon: '😋', mood: ['cute', 'happy'], isNsfw: false },
  bite: { id: 'bite', name: 'Bite', description: 'Biting reactions', icon: '😬', mood: ['playful'], isNsfw: false },
  glomp: { id: 'glomp', name: 'Glomp', description: 'Tackle hugs', icon: '💨', mood: ['excited', 'happy'], isNsfw: false },
  slap: { id: 'slap', name: 'Slap', description: 'Slapping reactions', icon: '👊', mood: ['aggressive', 'playful'], isNsfw: false },
  kill: { id: 'kill', name: 'Kill', description: 'Anime kill scenes', icon: '⚔️', mood: ['aggressive'], isNsfw: false },
  kick: { id: 'kick', name: 'Kick', description: 'Kicking reactions', icon: '🦵', mood: ['aggressive', 'playful'], isNsfw: false },
  happy: { id: 'happy', name: 'Happy', description: 'Happy moments', icon: '🎉', mood: ['happy', 'excited'], isNsfw: false },
  wink: { id: 'wink', name: 'Wink', description: 'Winking faces', icon: '😉', mood: ['playful', 'cute'], isNsfw: false },
  poke: { id: 'poke', name: 'Poke', description: 'Poking reactions', icon: '👆', mood: ['playful'], isNsfw: false },
  dance: { id: 'dance', name: 'Dance', description: 'Dancing moments', icon: '💃', mood: ['happy', 'excited'], isNsfw: false },
  cringe: { id: 'cringe', name: 'Cringe', description: 'Cringe moments', icon: '😬', mood: ['playful'], isNsfw: false },
};

// NSFW Category Info (separate for safety)
export const NSFW_CATEGORY_INFO: Record<string, CategoryInfo> = {
  waifu: { id: 'waifu', name: 'Waifu', description: 'NSFW anime girls', icon: '🔞', mood: ['romantic'], isNsfw: true },
  neko: { id: 'neko', name: 'Neko', description: 'NSFW cat girls', icon: '🔞', mood: ['playful'], isNsfw: true },
  trap: { id: 'trap', name: 'Trap', description: 'NSFW trap characters', icon: '🔞', mood: ['playful'], isNsfw: true },
  blowjob: { id: 'blowjob', name: 'Blowjob', description: 'NSFW explicit content', icon: '🔞', mood: ['romantic'], isNsfw: true },
};

// Mood to Categories Mapping
export const MOOD_CATEGORIES: Record<Mood, SfwCategory[]> = {
  happy: ['smile', 'happy', 'dance', 'wave', 'highfive', 'hug', 'glomp', 'nom'],
  sad: ['cry'],
  romantic: ['kiss', 'cuddle', 'handhold', 'blush', 'hug'],
  playful: ['smug', 'bonk', 'yeet', 'poke', 'bite', 'wink', 'bully', 'lick', 'awoo'],
  aggressive: ['slap', 'kill', 'kick', 'bonk', 'bully'],
  calm: ['pat', 'cuddle', 'handhold', 'shinobu'],
  excited: ['dance', 'yeet', 'awoo', 'megumin', 'happy', 'highfive', 'glomp'],
  cute: ['neko', 'waifu', 'pat', 'blush', 'smile', 'nom', 'wink'],
};

// Featured Categories for Home Page
export const FEATURED_CATEGORIES: SfwCategory[] = [
  'waifu', 'neko', 'hug', 'smile', 'pat', 'dance'
];

// Navigation Items
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/favorites', label: 'Favorites', icon: '❤️' },
  { href: '/nsfw', label: 'NSFW', icon: '🔞', isNsfw: true },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

// Theme Colors
export const THEME_COLORS = {
  primary: '#ec4899', // Pink
  secondary: '#8b5cf6', // Purple
  accent: '#06b6d4', // Cyan
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'waifu-gallery-theme',
  PREFERENCES: 'waifu-gallery-preferences',
  FAVORITES: 'waifu-gallery-favorites',
  NSFW_CONSENT: 'waifu-gallery-nsfw-consent',
  SEEN_IMAGES: 'waifu-gallery-seen-images',
  ANALYTICS: 'waifu-gallery-analytics',
  SEARCH_HISTORY: 'waifu-gallery-search-history',
};

// SEO Defaults
export const SEO_DEFAULTS = {
  title: 'Waifu Gallery - Anime Image Collection',
  description: 'Discover beautiful anime-style images with our AI-powered gallery. Browse waifus, nekos, and more with infinite scroll, semantic search, and personalized recommendations.',
  keywords: ['anime', 'waifu', 'neko', 'gallery', 'images', 'kawaii', 'cute', 'manga'],
  url: 'https://waifu-gallery.vercel.app',
  image: '/og-image.png',
};

// AI Feature Keywords for Semantic Search
export const SEARCH_KEYWORDS: Record<string, SfwCategory[]> = {
  'cat': ['neko'],
  'catgirl': ['neko'],
  'cat girl': ['neko'],
  'cute': ['neko', 'waifu', 'pat', 'smile', 'blush'],
  'love': ['kiss', 'hug', 'cuddle', 'handhold'],
  'happy': ['smile', 'happy', 'dance', 'wave'],
  'sad': ['cry'],
  'angry': ['slap', 'kick', 'kill'],
  'hug': ['hug', 'cuddle', 'glomp'],
  'kiss': ['kiss'],
  'pat': ['pat'],
  'dance': ['dance'],
  'smile': ['smile', 'happy', 'wink'],
  'blush': ['blush'],
  'cry': ['cry'],
  'wave': ['wave'],
  'wink': ['wink'],
  'poke': ['poke'],
  'bite': ['bite'],
  'lick': ['lick'],
  'slap': ['slap'],
  'kick': ['kick'],
  'bonk': ['bonk'],
  'yeet': ['yeet'],
  'smug': ['smug'],
  'cringe': ['cringe'],
  'explosion': ['megumin'],
  'butterfly': ['shinobu'],
  'demon slayer': ['shinobu'],
  'konosuba': ['megumin'],
  'wolf': ['awoo'],
  'howl': ['awoo'],
  'romantic': ['kiss', 'cuddle', 'handhold', 'blush'],
  'action': ['slap', 'kick', 'kill', 'bonk'],
  'reaction': ['smug', 'cringe', 'blush', 'wave', 'wink'],
  'affection': ['hug', 'pat', 'cuddle', 'kiss', 'handhold'],
};
