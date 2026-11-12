import type { Metadata } from 'next';
import { SITE_NAME } from './site';

/** Métadonnées d'une page : titre, description, URL canonique et aperçus de partage.
    (Les objets openGraph/twitter d'une page remplacent ceux du layout : on les redonne en entier.) */
export function pageMeta(title: string, description: string, path: string, type: 'website' | 'article' = 'website'): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { type, locale: 'fr_FR', siteName: SITE_NAME, url: path, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}
