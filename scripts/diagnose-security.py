#!/usr/bin/env python3
"""Scan VPS DB for suspicious QR redirect URLs and check site files."""
import json
import paramiko

HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
REMOTE = "/var/www/qrbanner"

SUSPICIOUS_PATTERNS = [
    "login", "signin", "verify", "wallet", "crypto", "bitcoin",
    "paypal", "appleid", "icloud", "bank", "password", "account",
    "telegram", "whatsapp", "gift", "prize", "winner", "claim",
    ".ru/", ".cn/", "bit.ly", "tinyurl", "t.co",
]

SCRIPT = r"""
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const codes = await p.qRCode.findMany({
    select: {
      id: true, name: true, shortCode: true, targetUrl: true, category: true,
      isActive: true, totalScans: true, createdAt: true,
      user: { select: { email: true } },
    },
    orderBy: { totalScans: 'desc' },
    take: 500,
  });
  const patterns = %PATTERNS%;
  const flagged = codes.filter((q) => {
    const u = (q.targetUrl || '').toLowerCase();
    return patterns.some((pat) => u.includes(pat));
  });
  console.log(JSON.stringify({
    total: codes.length,
    flaggedCount: flagged.length,
    flagged: flagged.slice(0, 30).map((q) => ({
      shortCode: q.shortCode,
      name: q.name,
      targetUrl: q.targetUrl,
      scans: q.totalScans,
      active: q.isActive,
      user: q.user?.email,
      url: 'https://qrbanner.com/s/' + q.shortCode,
    })),
    recentActive: codes.filter((q) => q.isActive).slice(0, 15).map((q) => ({
      shortCode: q.shortCode,
      targetUrl: (q.targetUrl || '').slice(0, 120),
      scans: q.totalScans,
    })),
  }, null, 2));
  await p.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
""".replace("%PATTERNS%", json.dumps(SUSPICIOUS_PATTERNS))

def run(cmd, timeout=120):
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    _, stdout, stderr = c.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    c.close()
    return out, err

def main():
    # Check for unexpected PHP/shell files
    out, _ = run(
        f"find {REMOTE} -maxdepth 3 \\( -name '*.php' -o -name '*.sh' -o -name 'wp-*' \\) "
        f"-not -path '*/node_modules/*' 2>/dev/null | head -20"
    )
    print("=== Unexpected files ===")
    print(out or "(none)")

    out, err = run(
        f"cd {REMOTE} && node -e {json.dumps(SCRIPT)}",
        timeout=180,
    )
    print("=== QR scan DB ===")
    print(out or err)

if __name__ == "__main__":
    main()
