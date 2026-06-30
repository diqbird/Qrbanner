import { QREditView } from '@/components/qr/qr-edit-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit QR Code',
};

export default function QREditPage({ params }: { params: { id: string } }) {
  return <QREditView qrId={params?.id ?? ''} />;
}
