import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { StatusPageContent } from '@/components/public/status-page-content';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('status.pageTitle'),
    description: t('status.pageSubtitle'),
    path: '/status',
    noIndex: true,
  });
}

export default function StatusPage() {
  return <StatusPageContent />;
}
