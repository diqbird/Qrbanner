/* Temp E2E helper: create/reset an isolated free-plan test user with an API key.
   Run on the VPS from /var/www/qrbanner. Prints { userId, key } as JSON. */
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const key = 'qb_live_' + crypto.randomBytes(24).toString('base64url');
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const email = 'e2e-free-limit@qrbanner-test.local';

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
      apiKeyHash: hash,
      apiKeyPrefix: key.slice(0, 16),
      apiKeyCreatedAt: new Date(),
    },
  });

  console.log(JSON.stringify({ userId: u.id, key }));
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
