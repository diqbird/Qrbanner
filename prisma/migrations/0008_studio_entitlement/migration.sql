-- CreateTable
CREATE TABLE "StudioEntitlement" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "maxQr" INTEGER NOT NULL DEFAULT 1,
    "qrRemaining" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'etsy',
    "externalOrderId" TEXT,
    "notes" TEXT,
    "userId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudioEntitlement_token_key" ON "StudioEntitlement"("token");

-- CreateIndex
CREATE INDEX "StudioEntitlement_buyerEmail_idx" ON "StudioEntitlement"("buyerEmail");

-- CreateIndex
CREATE INDEX "StudioEntitlement_userId_idx" ON "StudioEntitlement"("userId");

-- CreateIndex
CREATE INDEX "StudioEntitlement_status_idx" ON "StudioEntitlement"("status");

-- CreateIndex
CREATE INDEX "StudioEntitlement_externalOrderId_idx" ON "StudioEntitlement"("externalOrderId");

-- AddForeignKey
ALTER TABLE "StudioEntitlement" ADD CONSTRAINT "StudioEntitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
