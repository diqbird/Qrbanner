'use client';

import type { ComponentType } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { getCategoryFieldConfig } from '@/lib/qr-category-field-registry';
import type { CategoryFieldPrimitiveProps } from './category-field-types';
import {
  UrlLayout,
  UrlLabeledLayout,
  TextLayout,
  WhatsappLayout,
  TelegramLayout,
  DiscordLayout,
  SocialProfileLayout,
  YoutubeLayout,
  SpotifyLayout,
  ZoomLayout,
  GoogleMeetLayout,
  LocationLayout,
  CryptoLayout,
  VcardLayout,
  WifiLayout,
  EmailLayout,
  SmsLayout,
  PhoneLayout,
  EventLayout,
  GoogleReviewLayout,
  PaypalLayout,
  UpiLayout,
  SignalLayout,
  Gs1Layout,
} from './category-field-layouts';

const LAYOUT_COMPONENTS: Record<
  ReturnType<typeof getCategoryFieldConfig>['layout'],
  ComponentType<CategoryFieldPrimitiveProps>
> = {
  url: UrlLayout,
  url_labeled: UrlLabeledLayout,
  text: TextLayout,
  whatsapp: WhatsappLayout,
  telegram: TelegramLayout,
  discord: DiscordLayout,
  social_profile: SocialProfileLayout,
  youtube: YoutubeLayout,
  spotify: SpotifyLayout,
  zoom: ZoomLayout,
  google_meet: GoogleMeetLayout,
  location: LocationLayout,
  crypto: CryptoLayout,
  vcard: VcardLayout,
  wifi: WifiLayout,
  email: EmailLayout,
  sms: SmsLayout,
  phone: PhoneLayout,
  event: EventLayout,
  google_review: GoogleReviewLayout,
  paypal: PaypalLayout,
  upi: UpiLayout,
  signal: SignalLayout,
  gs1: Gs1Layout,
};

export function CategoryFields({
  category,
  data,
  onChange,
}: {
  category: string;
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}) {
  const { t } = useLanguage();
  const config = getCategoryFieldConfig(category);

  const updateField = (key: string, value: string) => {
    onChange({ ...(data ?? {}), [key]: value });
  };

  const Layout = LAYOUT_COMPONENTS[config.layout] ?? UrlLayout;

  return (
    <Layout
      category={category}
      config={config}
      data={data ?? {}}
      updateField={updateField}
      t={t}
    />
  );
}
