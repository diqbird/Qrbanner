'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseWebhooks } from '@/lib/webhook-types';
import { useWebhookDeliveries } from '@/hooks/use-webhook-deliveries';
import { useWebhookMutations } from '@/hooks/use-webhook-mutations';

export function useWebhookSettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/webhooks',
    parse: parseWebhooks,
  });
  const { deliveries, fetchDeliveries } = useWebhookDeliveries();
  const mutations = useWebhookMutations({ t, reload, fetchDeliveries });

  const webhooks = data?.webhooks ?? [];
  const limit = data?.limit ?? 2;

  return {
    t,
    loading,
    webhooks,
    limit,
    deliveries,
    ...mutations,
  };
}

export type WebhookSettingsState = ReturnType<typeof useWebhookSettings>;
