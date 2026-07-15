import Link from 'next/link';
import {
  HUBSPOT_FIELD_MAP,
  scanWebhookSampleJson,
} from '@/lib/integration-presets';
import {
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_VERIFY_NODE_EXAMPLE,
} from '@/lib/webhook-test-payload';

type IntegrationWebhookRecipeProps = {
  sampleTitle: string;
  hmacTitle: string;
  docsLabel: string;
  hubspotMapTitle?: string;
  showHubspotMap?: boolean;
};

/** Shared sample payload + HMAC snippet for public integration docs. */
export function IntegrationWebhookRecipe({
  sampleTitle,
  hmacTitle,
  docsLabel,
  hubspotMapTitle,
  showHubspotMap = false,
}: IntegrationWebhookRecipeProps) {
  return (
    <div className="mt-10 space-y-6">
      <section className="surface-3d rounded-2xl border border-white/30 bg-card/80 p-6 backdrop-blur-md dark:border-white/10">
        <p className="font-medium">{sampleTitle}</p>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border/50 bg-muted/40 p-4 text-xs leading-relaxed">
          {scanWebhookSampleJson()}
        </pre>
        <p className="mt-3 text-xs text-muted-foreground">
          Header: <code className="font-mono">{WEBHOOK_SIGNATURE_HEADER}</code>
        </p>
      </section>

      {showHubspotMap && hubspotMapTitle ? (
        <section className="surface-3d rounded-2xl border border-white/30 bg-card/80 p-6 backdrop-blur-md dark:border-white/10">
          <p className="font-medium">{hubspotMapTitle}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Webhook field</th>
                  <th className="py-2 font-medium">HubSpot</th>
                </tr>
              </thead>
              <tbody>
                {HUBSPOT_FIELD_MAP.map((row) => (
                  <tr key={row.webhook} className="border-b border-border/30">
                    <td className="py-2 pr-4 font-mono text-xs">{row.webhook}</td>
                    <td className="py-2 text-muted-foreground">{row.hubspot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="surface-3d rounded-2xl border border-white/30 bg-card/80 p-6 backdrop-blur-md dark:border-white/10">
        <p className="font-medium">{hmacTitle}</p>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border/50 bg-muted/40 p-4 text-xs leading-relaxed">
          {WEBHOOK_VERIFY_NODE_EXAMPLE}
        </pre>
        <Link href="/developers#webhooks" className="mt-4 inline-block text-sm text-primary hover:underline">
          {docsLabel} →
        </Link>
      </section>
    </div>
  );
}
