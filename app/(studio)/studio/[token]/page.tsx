import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { StudioTokenPage } from '@/components/studio/studio-token-page';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Premium QR Studio',
    description: 'Activate your purchase and create dynamic QR codes.',
    path: '/studio',
    noIndex: true,
  });
}

export default function StudioTokenRoutePage({ params }: { params: { token: string } }) {
  return <StudioTokenPage token={params.token} />;
}
