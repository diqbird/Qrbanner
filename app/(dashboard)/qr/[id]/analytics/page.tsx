import { QRAnalyticsView } from '@/components/qr/qr-analytics-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Analytics',
};

export default function QRAnalyticsPage({ params }: { params: { id: string } }) {
  return <QRAnalyticsView qrId={params?.id ?? ''} />;
}
