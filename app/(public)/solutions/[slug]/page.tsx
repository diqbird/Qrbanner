import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SOLUTION_PAGES, getSolutionBySlug } from '@/lib/solutions';
import { pageMetadata } from '@/lib/seo';
import { SolutionDetailShell } from '@/components/solutions/solution-detail-shell';
import { getServerLocale } from '@/lib/i18n/server';

export const revalidate = 3600;

export function generateStaticParams() {
  return SOLUTION_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) return {};
  const locale = await getServerLocale();
  return pageMetadata({
    locale,
    title: solution.title,
    description: solution.metaDescription,
    path: `/solutions/${solution.slug}`,
    keywords: solution.keywords,
  });
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) notFound();
  return <SolutionDetailShell solution={solution} />;
}
