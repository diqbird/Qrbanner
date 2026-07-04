import { pageMetadata } from '@/lib/seo';
import { StatusPageContent } from '@/components/public/status-page-content';

export const metadata = pageMetadata({
  title: 'System Status',
  description: 'QRbanner platform status and service health.',
  path: '/status',
  noIndex: true,
});

export default function StatusPage() {
  return <StatusPageContent />;
}
