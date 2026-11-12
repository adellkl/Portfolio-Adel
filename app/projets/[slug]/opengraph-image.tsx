import { ImageResponse } from 'next/og';
import { OG_SIZE, OgCard } from '@/components/og';
import { lc, PROJECTS } from '@/lib/projects';
import { getProjects } from '@/lib/data';

/* Image de partage de chaque étude de cas */
export const alt = 'Étude de cas — Adel Loukal';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const revalidate = 60;
export async function generateStaticParams() { return (await getProjects()).map(p => ({ slug: p.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProjects()).find(x => x.slug === slug) ?? PROJECTS[0];
  return new ImageResponse(
    <OgCard kicker={`${p.id} · ${p.category.toUpperCase()}`} title={`${p.title} —`} muted={lc(p.tagline)}
      tags={p.stack.map(([n]) => n)} foot={`Étude de cas · ${p.status} · ${p.year}`} />,
    size,
  );
}
