import { Suspense } from 'react';
import { SettingsContent } from '@/components/dashboard/settings-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
