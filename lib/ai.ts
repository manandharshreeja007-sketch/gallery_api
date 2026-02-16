// ============================================
// Waifu Gallery - AI Service Layer
// ============================================

import { WaifuImage, Category, Mood, Recommendation } from '@/types';
import { 
  CATEGORY_INFO, 
  SEARCH_KEYWORDS, 
  MOOD_CATEGORIES,
  SFW_CATEGORIES 
} from './constants';
import { shuffleArray } from './utils';

// ============================================
// Image Caption Generator
// ============================================

/**
 * Generate a caption for an image based on its category and metadata
 * This uses a rule-based approach with some randomization for variety
 */
export function generateCaption(image: WaifuImage): string {
  const categoryInfo = CATEGORY_INFO[image.category];
  if (!categoryInfo) return 'A beautiful anime image';

  const templates = getCaptionTemplates(image.category);
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template;
}

function getCaptionTemplates(category: Category): string[] {
  const templates: Record<string, string[]> = {
    waifu: [
      'A stunning anime girl with captivating eyes',
      'Beautiful waifu ready to brighten your day',
      'Elegant anime character in a charming pose',
      'Gorgeous waifu with an enchanting smile',
      'A lovely anime girl with mesmerizing features',
    ],
    neko: [
      'Adorable catgirl with fluffy ears',
      'Cute neko showing off her playful side',
      'Kawaii cat girl with sparkling eyes',
      'A charming neko with a mischievous grin',
      'Sweet catgirl being absolutely precious',
    ],
    shinobu: [
      'The elegant butterfly hashira',
      'Shinobu with her signature gentle smile',
      'The graceful insect pillar',
      'Kocho Shinobu looking serene',
      'The poison specialist in all her glory',
    ],
    megumin: [
      'EXPLOSION! Megumin strikes again',
      'The one and only explosion mage',
      'Crimson Demon ready for battle',
      'Megumin looking confident as ever',
      'The greatest explosion magic user',
    ],
    hug: [
      'A warm and heartfelt embrace',
      'Sharing love through a tight hug',
      'The perfect comfort hug',
      'Wrapped in a cozy embrace',
      'A hug that speaks a thousand words',
    ],
    kiss: [
      'A sweet and tender kiss',
      'Sharing a romantic moment',
      'A loving peck filled with affection',
      'The perfect kiss',
      'A moment of pure romance',
    ],
    cuddle: [
      'Cozy cuddling time',
      'Snuggled up together',
      'The warmest cuddles',
      'Sharing warmth and affection',
      'A perfect cuddling moment',
    ],
    pat: [
      'Head pats for being a good girl',
      'Gentle head pats incoming',
      'The most satisfying head pat',
      'Rewarding with gentle pats',
      'Pats of appreciation',
    ],
    smile: [
      'A radiant smile that lights up the room',
      'The happiest smile you\'ll see today',
      'A smile that melts hearts',
      'Pure joy captured in a smile',
      'An infectious happy smile',
    ],
    happy: [
      'Overflowing with happiness',
      'Pure joy and excitement',
      'The happiest moment',
      'Bursting with positive energy',
      'Radiating happiness',
    ],
    cry: [
      'Tears of emotion',
      'A touching emotional moment',
      'When feelings overflow',
      'Moved to tears',
      'An emotional scene',
    ],
    blush: [
      'Blushing from embarrassment',
      'That adorable red face',
      'Shy and blushing',
      'Too cute when blushing',
      'A charming bashful moment',
    ],
    dance: [
      'Dancing with joy',
      'Showing off some moves',
      'Lost in the rhythm',
      'Dancing the day away',
      'An energetic dance performance',
    ],
    wave: [
      'A friendly wave hello',
      'Waving with enthusiasm',
      'A cheerful greeting',
      'Hello there!',
      'A warm welcome wave',
    ],
    wink: [
      'A playful wink',
      'Winking with confidence',
      'That charming wink',
      'A flirty little wink',
      'The cutest wink',
    ],
    smug: [
      'That smug expression',
      'Looking quite pleased with themselves',
      'The smuggest face',
      'Radiating confidence',
      'A self-satisfied smirk',
    ],
    bonk: [
      'BONK! Go to horny jail',
      'Justice has been served',
      'The bonk of correction',
      'A well-deserved bonk',
      'Bonk time!',
    ],
    slap: [
      'A dramatic slap',
      'The slap heard around the world',
      'When words aren\'t enough',
      'A powerful slap',
      'Slap!',
    ],
    poke: [
      'Poke poke poke',
      'A playful little poke',
      'Just poking around',
      'The gentlest poke',
      'Being a little pokey',
    ],
    bite: [
      'A playful little bite',
      'Nom nom nom',
      'Being a bit bitey',
      'A cute little nibble',
      'Bite!',
    ],
    lick: [
      'A playful lick',
      'Lick lick',
      'Being a bit mischievous',
      'A cheeky lick',
      'Licking moment',
    ],
    yeet: [
      'YEET!',
      'Maximum yeet power',
      'Yeeted into orbit',
      'The ultimate yeet',
      'Full send!',
    ],
    highfive: [
      'High five!',
      'A celebratory high five',
      'Victory high five',
      'The perfect high five',
      'Up high!',
    ],
    handhold: [
      'Holding hands tenderly',
      'The most intimate gesture',
      'Hand in hand',
      'A tender hand hold',
      'Connected through touch',
    ],
    nom: [
      'Nom nom nom',
      'Eating time!',
      'Enjoying a tasty treat',
      'Delicious!',
      'Food time is the best time',
    ],
    glomp: [
      'GLOMP ATTACK!',
      'Tackle hug incoming!',
      'An enthusiastic glomp',
      'Surprise hug attack',
      'Maximum glomp power',
    ],
    kick: [
      'A powerful kick',
      'Taking action',
      'Kick!',
      'A well-placed kick',
      'Striking with force',
    ],
    kill: [
      'An intense battle scene',
      'Action-packed moment',
      'Fierce determination',
      'A dramatic confrontation',
      'Battle mode activated',
    ],
    awoo: [
      'AWOO~!',
      'Howling at the moon',
      'Letting out an awoo',
      'The cutest awoo',
      'Awoo energy',
    ],
    bully: [
      'A bit of playful teasing',
      'Being a little bully',
      'Teasing time',
      'Playful bullying',
      'Having some fun',
    ],
    cringe: [
      'That cringe moment',
      'Maximum cringe',
      'When you see something cringe',
      'A cringe-worthy scene',
      'The cringe is real',
    ],
  };

  return templates[category] || [
    `A beautiful ${category} image`,
    `Anime ${category} moment`,
    `${category} vibes`,
  ];
}

// ============================================
// Semantic Search Engine
// ============================================

/**
 * Search for relevant categories based on natural language query
 */
export function semanticSearch(query: string): Category[] {
  const normalizedQuery = query.toLowerCase().trim();
  const matchedCategories = new Set<Category>();
  
  // Direct category name match
  SFW_CATEGORIES.forEach(cat => {
    if (normalizedQuery.includes(cat)) {
      matchedCategories.add(cat);
    }
  });

  // Keyword-based matching
  Object.entries(SEARCH_KEYWORDS).forEach(([keyword, categories]) => {
    if (normalizedQuery.includes(keyword)) {
      categories.forEach(cat => matchedCategories.add(cat));
    }
  });

  // Fuzzy matching for common misspellings and variations
  const fuzzyMatches: Record<string, Category[]> = {
    'cat': ['neko'],
    'kitten': ['neko'],
    'kitty': ['neko'],
    'girl': ['waifu', 'neko'],
    'anime girl': ['waifu'],
    'love': ['kiss', 'hug', 'cuddle', 'handhold'],
    'romantic': ['kiss', 'cuddle', 'handhold', 'blush'],
    'emotion': ['cry', 'happy', 'blush', 'smile'],
    'fight': ['slap', 'kick', 'kill'],
    'greet': ['wave', 'smile', 'highfive'],
    'affection': ['hug', 'pat', 'cuddle', 'kiss'],
    'eating': ['nom', 'bite'],
    'food': ['nom'],
    'attack': ['slap', 'kick', 'bonk', 'glomp'],
    'happy': ['smile', 'happy', 'dance', 'wave'],
    'cute': ['neko', 'waifu', 'pat', 'smile', 'blush'],
    'kawaii': ['neko', 'waifu', 'blush', 'smile'],
    'smiling': ['smile', 'happy'],
    'crying': ['cry'],
    'blushing': ['blush'],
    'dancing': ['dance'],
    'hugging': ['hug', 'cuddle', 'glomp'],
    'kissing': ['kiss'],
    'patting': ['pat'],
    'waving': ['wave'],
  };

  Object.entries(fuzzyMatches).forEach(([term, categories]) => {
    if (normalizedQuery.includes(term)) {
      categories.forEach(cat => matchedCategories.add(cat));
    }
  });

  // If no matches found, try to find partial matches
  if (matchedCategories.size === 0) {
    SFW_CATEGORIES.forEach(cat => {
      // Check if query words appear in category name
      const queryWords = normalizedQuery.split(/\s+/);
      queryWords.forEach(word => {
        if (word.length >= 3 && cat.includes(word)) {
          matchedCategories.add(cat);
        }
      });
    });
  }

  // If still no matches, return default popular categories
  if (matchedCategories.size === 0) {
    return ['waifu', 'neko', 'smile', 'happy'];
  }

  return Array.from(matchedCategories);
}

/**
 * Calculate relevance score for search results
 */
export function calculateRelevanceScore(
  query: string,
  category: Category
): number {
  const normalizedQuery = query.toLowerCase().trim();
  let score = 0;

  // Exact match gets highest score
  if (normalizedQuery === category) {
    score += 100;
  }

  // Query contains category name
  if (normalizedQuery.includes(category)) {
    score += 80;
  }

  // Category name contains query word
  if (category.includes(normalizedQuery)) {
    score += 60;
  }

  // Keyword match
  Object.entries(SEARCH_KEYWORDS).forEach(([keyword, categories]) => {
    if (normalizedQuery.includes(keyword) && categories.includes(category as never)) {
      score += 40;
    }
  });

  // Partial word match
  const queryWords = normalizedQuery.split(/\s+/);
  queryWords.forEach(word => {
    if (word.length >= 3) {
      if (category.startsWith(word)) score += 30;
      else if (category.includes(word)) score += 20;
    }
  });

  return score;
}

// ============================================
// Mood Filter
// ============================================

/**
 * Get categories that match a specific mood
 */
export function getCategoriesForMood(mood: Mood): Category[] {
  return MOOD_CATEGORIES[mood] || [];
}

/**
 * Detect mood from user input
 */
export function detectMood(input: string): Mood | null {
  const normalizedInput = input.toLowerCase();
  
  const moodKeywords: Record<Mood, string[]> = {
    happy: ['happy', 'joy', 'joyful', 'cheerful', 'excited', 'fun', 'bright'],
    sad: ['sad', 'crying', 'tears', 'emotional', 'upset', 'depressed'],
    romantic: ['romantic', 'love', 'loving', 'affection', 'intimate', 'sweet'],
    playful: ['playful', 'teasing', 'mischief', 'silly', 'goofy', 'funny'],
    aggressive: ['angry', 'aggressive', 'fight', 'action', 'battle', 'fierce'],
    calm: ['calm', 'peaceful', 'serene', 'relaxed', 'gentle', 'soothing'],
    excited: ['excited', 'energetic', 'hyper', 'enthusiastic', 'pumped'],
    cute: ['cute', 'adorable', 'kawaii', 'precious', 'sweet', 'lovely'],
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => normalizedInput.includes(keyword))) {
      return mood as Mood;
    }
  }

  return null;
}

/**
 * Get mood from category
 */
export function getMoodFromCategory(category: Category): Mood[] {
  const info = CATEGORY_INFO[category];
  return info?.mood || [];
}

// ============================================
// Recommendations Engine
// ============================================

/**
 * Generate recommendations based on user behavior
 */
export function generateRecommendations(
  viewHistory: Record<string, number>,
  favoriteCategories: string[] = []
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const seenCategories = new Set(Object.keys(viewHistory));
  const allCategories = SFW_CATEGORIES;

  // Find related categories based on mood
  const viewedMoods = new Set<Mood>();
  Object.keys(viewHistory).forEach(cat => {
    const moods = getMoodFromCategory(cat as Category);
    moods.forEach(mood => viewedMoods.add(mood));
  });

  // Recommend categories with similar moods that haven't been viewed much
  allCategories.forEach(category => {
    if (!seenCategories.has(category) || viewHistory[category] < 3) {
      const categoryMoods = getMoodFromCategory(category);
      const matchingMoods = categoryMoods.filter(mood => viewedMoods.has(mood));
      
      if (matchingMoods.length > 0) {
        recommendations.push({
          category,
          score: matchingMoods.length * 20 + (favoriteCategories.includes(category) ? 30 : 0),
          reason: `Based on your interest in ${matchingMoods.join(', ')} content`,
        });
      }
    }
  });

  // Add some variety with random categories
  const unexploredCategories = allCategories.filter(cat => !seenCategories.has(cat));
  if (unexploredCategories.length > 0) {
    const shuffled = shuffleArray(unexploredCategories);
    shuffled.slice(0, 3).forEach(category => {
      if (!recommendations.find(r => r.category === category)) {
        recommendations.push({
          category,
          score: 10,
          reason: 'Discover something new',
        });
      }
    });
  }

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

/**
 * Get trending categories (simulated based on predefined popularity)
 */
export function getTrendingCategories(): Category[] {
  // In a real app, this would be based on actual usage data
  const popularCategories: Category[] = [
    'waifu', 'neko', 'hug', 'smile', 'pat', 'dance', 'blush', 'happy'
  ];
  
  return shuffleArray(popularCategories).slice(0, 6);
}

// ============================================
// Content Analysis (Simulated AI)
// ============================================

/**
 * Analyze image content and generate tags
 * In a real app, this would use an AI model
 */
export function analyzeImageContent(image: WaifuImage): string[] {
  const baseTags: string[] = [image.category, image.type];
  const categoryInfo = CATEGORY_INFO[image.category];
  
  if (categoryInfo) {
    baseTags.push(...categoryInfo.mood);
    
    // Add contextual tags based on category
    const contextTags: Record<string, string[]> = {
      neko: ['catgirl', 'ears', 'cute'],
      waifu: ['anime', 'girl', 'beautiful'],
      hug: ['affection', 'warm', 'comfort'],
      kiss: ['romantic', 'love', 'intimate'],
      dance: ['movement', 'joy', 'energy'],
      smile: ['happy', 'bright', 'cheerful'],
      pat: ['gentle', 'head pat', 'comfort'],
      cry: ['tears', 'emotional', 'sad'],
      blush: ['shy', 'embarrassed', 'cute'],
    };
    
    if (contextTags[image.category]) {
      baseTags.push(...contextTags[image.category]);
    }
  }

  return [...new Set(baseTags)];
}

/**
 * Enhance image with AI-generated metadata
 */
export function enhanceImageWithAI(image: WaifuImage): WaifuImage {
  return {
    ...image,
    caption: generateCaption(image),
    tags: analyzeImageContent(image),
    mood: getMoodFromCategory(image.category)[0],
  };
}

/**
 * Batch enhance multiple images
 */
export function enhanceImagesWithAI(images: WaifuImage[]): WaifuImage[] {
  return images.map(enhanceImageWithAI);
}
