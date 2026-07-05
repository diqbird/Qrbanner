-- Drop legacy Stripe billing columns (Paddle-only billing).
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripeCustomerId";
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripeSubscriptionId";
ALTER TABLE "MarketplaceSeller" DROP COLUMN IF EXISTS "stripeConnectId";
ALTER TABLE "MarketplacePurchase" DROP COLUMN IF EXISTS "stripePaymentId";
