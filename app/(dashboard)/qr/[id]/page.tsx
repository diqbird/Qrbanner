import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const QREditView = dynamic(
  () => import('@/components/qr/qr-edit-view').then((m) => ({ default: m.QREditView })),
  {
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: 'Edit QR Code',
};

export default function QREditPage({ params }: { params: { id: string } }) {
  return <QREditView qrId={params?.id ?? ''} />;
}
