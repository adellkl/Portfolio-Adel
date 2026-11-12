import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/data';
import { SITE_URL, projectHref } from '@/lib/site';

/* /sitemap.xml — pages principales + une étude de cas par projet (date du build) */
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
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
    ...projects.map(p => page(projectHref(p.slug), .7, 'yearly')),
  ];
}
