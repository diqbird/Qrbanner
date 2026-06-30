const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const patterns = [
  'login', 'signin', 'verify-account', 'wallet', 'bitcoin', 'paypal',
  'appleid', 'icloud', 'bank', 'password', 'gift', 'prize', 'winner', 'claim',
  'phishing', 'malware', '.ru/', 'bit.ly', 'tinyurl',
];

(async () => {
  const codes = await p.qRCode.findMany({
    select: {
      shortCode: true,
      name: true,
      targetUrl: true,
      isActive: true,
      totalScans: true,
      user: { select: { email: true } },
    },
    orderBy: { totalScans: 'desc' },
    take: 500,
  });

  const flagged = codes.filter((q) => {
    const u = (q.targetUrl || '').toLowerCase();
    return patterns.some((pat) => u.includes(pat));
  });

  console.log(
    JSON.stringify(
      {
        total: codes.length,
        flaggedCount: flagged.length,
        flagged: flagged.slice(0, 25).map((q) => ({
          scanUrl: `https://qrbanner.com/s/${q.shortCode}`,
          targetUrl: q.targetUrl,
          name: q.name,
          scans: q.totalScans,
          active: q.isActive,
          user: q.user?.email,
        })),
        topByScans: codes.slice(0, 10).map((q) => ({
          scanUrl: `https://qrbanner.com/s/${q.shortCode}`,
          targetUrl: (q.targetUrl || '').slice(0, 150),
          scans: q.totalScans,
        })),
      },
      null,
      2
    )
  );

  await p.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
