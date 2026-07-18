/* Temp E2E helper: free-plan test user with password + QRs at plan limit,
   for visual dashboard verification. Prints { email, password } as JSON. */
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const email = 'e2e-free-limit@qrbanner-test.local';
  const password = 'E2eTest-' + crypto.randomBytes(6).toString('hex');

  const old = await p.user.findUnique({ where: { email } });
  if (old) {
    await p.qRCode.deleteMany({ where: { userId: old.id } });
    await p.workspaceMember.deleteMany({ where: { userId: old.id } });
    await p.workspace.deleteMany({ where: { ownerId: old.id } });
    await p.user.delete({ where: { id: old.id } });
  }

  const u = await p.user.create({
    data: {
      email,
      name: 'E2E Limit Test',
      emailVerified: new Date(),
      plan: 'free',
      password: await bcrypt.hash(password, 10),
    },
  });

  const limitRow = await p.user.findUnique({ where: { id: u.id }, select: { plan: true } });
  const limit = 5; // matches PLANS.free.maxQrCodes; visual test only
  for (let i = 1; i <= limit; i++) {
    await p.qRCode.create({
      data: {
        userId: u.id,
        name: 'E2E visual test ' + i,
        shortCode: 'e2e' + crypto.randomBytes(5).toString('hex'),
        category: 'url',
        targetUrl: 'https://qrbanner.com/?e2e=visual',
        qrData: { url: 'https://qrbanner.com/?e2e=visual' },
        style: {},
        isActive: true,
      },
    });
  }

  console.log(JSON.stringify({ email, password, plan: limitRow.plan }));
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
