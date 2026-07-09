-- AlterTable Workspace: support / SLA / CSM fields
ALTER TABLE "Workspace" ADD COLUMN "supportTier" TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE "Workspace" ADD COLUMN "assignedCsmName" TEXT;
ALTER TABLE "Workspace" ADD COLUMN "assignedCsmEmail" TEXT;
ALTER TABLE "Workspace" ADD COLUMN "slaUptimePercent" DOUBLE PRECISION;
ALTER TABLE "Workspace" ADD COLUMN "slaNotes" TEXT;

CREATE INDEX "Workspace_supportTier_idx" ON "Workspace"("supportTier");

-- AlterTable ContactInquiry: enterprise interest flags
ALTER TABLE "ContactInquiry" ADD COLUMN "needsSla" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ContactInquiry" ADD COLUMN "needsCsm" BOOLEAN NOT NULL DEFAULT false;
