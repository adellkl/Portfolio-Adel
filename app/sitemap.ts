import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/projects';
import { SITE_URL, projectHref } from '@/lib/site';

/* /sitemap.xml — pages principales + une étude de cas par projet (date du build) */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly') =>
    ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });
  return [
    page('/', 1, 'weekly'),
    page('/services', .9, 'monthly'),
    page('/apropos', .8, 'monthly'),
    page('/rendez-vous', .7, 'monthly'),
    page('/mentions-legales', .2, 'yearly'),
    page('/confidentialite', .2, 'yearly'),
    ...PROJECTS.map(p => page(projectHref(p.slug), .7, 'yearly')),
  ];
}
