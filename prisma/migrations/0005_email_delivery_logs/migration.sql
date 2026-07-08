CREATE TABLE "EmailDeliveryLog" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailDeliveryLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EmailDeliveryLog_createdAt_idx" ON "EmailDeliveryLog"("createdAt");
CREATE INDEX "EmailDeliveryLog_kind_createdAt_idx" ON "EmailDeliveryLog"("kind", "createdAt");
CREATE INDEX "EmailDeliveryLog_success_createdAt_idx" ON "EmailDeliveryLog"("success", "createdAt");
