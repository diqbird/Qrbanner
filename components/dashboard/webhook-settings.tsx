'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Webhook } from 'lucide-react';
import { useWebhookSettings } from '@/hooks/use-webhook-settings';
import { WebhookEndpointList, WebhookAddForm } from './webhook-endpoints-panel';
import { WebhookDeliveriesPanel } from './webhook-deliveries-panel';
import { WebhookSecretDialog } from './webhook-secret-dialog';

export function WebhookSettings() {
  const settings = useWebhookSettings();
  const { t, loading } = settings;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" /> {t('settings.webhooks.title')}
          </CardTitle>
          <CardDescription>{t('settings.webhooks.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <WebhookEndpointList settings={settings} />
              <WebhookAddForm settings={settings} />
            </>
          )}
          <WebhookDeliveriesPanel settings={settings} />
        </CardContent>
      </Card>
      <WebhookSecretDialog settings={settings} />
    </>
  );
}
