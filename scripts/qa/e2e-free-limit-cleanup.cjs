/* Temp E2E helper: remove the isolated free-plan test user and all its data. */
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const email = 'e2e-free-limit@qrbanner-test.local';
  const u = await p.user.findUnique({ where: { email } });
  if (!u) {
    console.log('already clean');
    process.exit(0);
  }
  const qrs = await p.qRCode.deleteMany({ where: { userId: u.id } });
  await p.workspaceMember.deleteMany({ where: { userId: u.id } });
  await p.workspace.deleteMany({ where: { ownerId: u.id } });
  await p.user.delete({ where: { id: u.id } });
  console.log('cleaned user + ' + qrs.count + ' QRs');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
