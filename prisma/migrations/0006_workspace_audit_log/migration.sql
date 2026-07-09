-- CreateTable
CREATE TABLE "WorkspaceAuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceAuditLog_workspaceId_createdAt_idx" ON "WorkspaceAuditLog"("workspaceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "WorkspaceAuditLog_action_idx" ON "WorkspaceAuditLog"("action");

-- CreateIndex
CREATE INDEX "WorkspaceAuditLog_actorUserId_idx" ON "WorkspaceAuditLog"("actorUserId");

-- AddForeignKey
ALTER TABLE "WorkspaceAuditLog" ADD CONSTRAINT "WorkspaceAuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
