-- Webhook delivery payload + retry attempt tracking
ALTER TABLE "WebhookDelivery" ADD COLUMN "payload" JSONB;
ALTER TABLE "WebhookDelivery" ADD COLUMN "attempt" INTEGER NOT NULL DEFAULT 1;

-- Language-based scan redirect
ALTER TABLE "QRCode" ADD COLUMN "languageRedirectEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "QRCode" ADD COLUMN "languageRedirectData" JSONB;
