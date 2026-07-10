-- Login audit trail for admin security monitoring
CREATE TABLE "LoginAuditLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "provider" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LoginAuditLog_createdAt_idx" ON "LoginAuditLog"("createdAt" DESC);
CREATE INDEX "LoginAuditLog_email_idx" ON "LoginAuditLog"("email");
CREATE INDEX "LoginAuditLog_outcome_idx" ON "LoginAuditLog"("outcome");
