#!/usr/bin/env python3
import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password="112358Onrks..", timeout=30)

js = r"""
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const total = await p.user.count();
  const byPlan = await p.user.groupBy({ by: ['plan'], _count: { id: true } });
  const byRole = await p.user.groupBy({ by: ['role'], _count: { id: true } });
  const paid = await p.user.findMany({
    where: { plan: { in: ['pro', 'business'] } },
    select: { email: true, name: true, plan: true, createdAt: true, role: true },
    orderBy: { createdAt: 'desc' }
  });
  const recent = await p.user.findMany({
    select: { email: true, name: true, plan: true, createdAt: true, role: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  const qrTotal = await p.qRCode.count();
  const scans = await p.qRScan.count();
  console.log(JSON.stringify({ total, byPlan, byRole, paid, recent, qrTotal, scans }));
  await p.$disconnect();
})();
"""

sftp = c.open_sftp()
with sftp.open("/var/www/qrbanner/scripts/qrb-stats.js", "w") as f:
    f.write(js)
sftp.close()

i, o, e = c.exec_command("cd /var/www/qrbanner && node scripts/qrb-stats.js 2>&1", timeout=60)
out = o.read().decode("utf-8", errors="replace") + e.read().decode("utf-8", errors="replace")
open(r"C:\Users\ACRO Technology\qrbanner\user-stats.json", "w", encoding="utf-8").write(out)
c.close()
print("done")
