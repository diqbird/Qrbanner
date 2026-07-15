-- AlterTable
ALTER TABLE "MarketplacePurchase" ADD COLUMN "paddleTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MarketplacePurchase_paddleTransactionId_key" ON "MarketplacePurchase"("paddleTransactionId");
