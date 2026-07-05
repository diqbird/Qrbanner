'use client';

import { BrandKitHub } from '@/components/dashboard/brand-kit-hub';
import { BrandingSettings } from '@/components/dashboard/branding-settings';
import { MediaLibraryCard } from '@/components/dashboard/media-library-card';
import { ReferralSettings } from '@/components/dashboard/referral-settings';
import { MarketplaceSellerPanel } from '@/components/dashboard/marketplace-seller-panel';
import { SettingsSection } from '@/components/dashboard/settings-section';
import { useLanguage } from '@/components/i18n/language-provider';

export function SettingsBrandTab() {
  const { t } = useLanguage();

  return (
    <>
      <SettingsSection title={t('settings.sectionBrandKit')} description={t('settings.sectionBrandKitDesc')} />
      <BrandKitHub />
      <BrandingSettings />
      <MediaLibraryCard />
      <SettingsSection title={t('settings.sectionGrowth')} description={t('settings.sectionGrowthDesc')} />
      <ReferralSettings />
      <MarketplaceSellerPanel />
    </>
  );
}
