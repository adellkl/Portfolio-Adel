import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/* /robots.txt — tout est indexable, sauf les fichiers internes de Next */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/_next/', '/api/', '/admin'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
