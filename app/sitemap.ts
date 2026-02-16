import { MetadataRoute } from 'next'
import { SFW_CATEGORIES } from '@/lib/constants'

// Change this to your actual deployed domain
const BASE_URL = 'https://waifugallery.netlify.app/'

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static Pages
  const routes = [
    '',
    '/about',
    '/search',
    '/favorites',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dynamic Category Pages (SFW only for main indexing)
  const categoryRoutes = SFW_CATEGORIES.map((category) => ({
    url: `${BASE_URL}/gallery?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes]
}