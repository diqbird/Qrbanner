-- Etsy delivery approval queue for Premium Studio
ALTER TABLE "StudioEntitlement" ADD COLUMN "deliveryStatus" TEXT NOT NULL DEFAULT 'sent';
ALTER TABLE "StudioEntitlement" ADD COLUMN "sentAt" TIMESTAMP(3);
ALTER TABLE "StudioEntitlement" ADD COLUMN "approvedAt" TIMESTAMP(3);
CREATE INDEX "StudioEntitlement_deliveryStatus_idx" ON "StudioEntitlement"("deliveryStatus");
