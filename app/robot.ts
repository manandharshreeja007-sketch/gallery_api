// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/nsfw/', '/favorites/'], // Optional: prevent indexing of private/adult areas
    },
    sitemap: 'https://waifugallery.netlify.app/sitemap.xml',
  }
}