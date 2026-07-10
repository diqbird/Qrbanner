#!/usr/bin/env python3
"""Create a one-off Premium Studio test link on production VPS."""
import base64
import json
import os
import sys

import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
KEY = os.path.expanduser(
    os.environ.get("DEPLOY_SSH_KEY_PATH", "~/.ssh/qrbanner_github_deploy")
)
EMAIL = os.environ.get("STUDIO_TEST_EMAIL", "dealsgoglobal@gmail.com")
MAX_QR = int(os.environ.get("STUDIO_TEST_MAX_QR", "5"))

REMOTE_SCRIPT = r"""
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const email = process.env.STUDIO_TEST_EMAIL;
const maxQr = Number(process.env.STUDIO_TEST_MAX_QR || '5');

(async () => {
  const prisma = new PrismaClient();
  try {
    const token = crypto.randomBytes(24).toString('base64url');
    const row = await prisma.studioEntitlement.create({
      data: {
        token,
        buyerEmail: email.trim().toLowerCase(),
        maxQr,
        qrRemaining: maxQr,
        source: 'etsy',
        status: 'pending',
        notes: 'Internal test link',
      },
    });
    console.log(JSON.stringify({
      url: 'https://qrbanner.com/studio/' + row.token,
      buyerEmail: row.buyerEmail,
      maxQr: row.maxQr,
      id: row.id,
    }));
  } finally {
    await prisma['$disconnect']();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
"""


def main() -> int:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, key_filename=KEY, timeout=30)

    encoded = base64.b64encode(REMOTE_SCRIPT.encode("utf-8")).decode("ascii")
    cmd = (
        f"cd /var/www/qrbanner && "
        f"STUDIO_TEST_EMAIL={json.dumps(EMAIL)} STUDIO_TEST_MAX_QR={MAX_QR} "
        f"node -e \"eval(Buffer.from('{encoded}','base64').toString('utf8'))\""
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=60)
    out = stdout.read().decode("utf-8", "replace").strip()
    err = stderr.read().decode("utf-8", "replace").strip()
    client.close()

    if err and not out:
        print(err, file=sys.stderr)
        return 1

    for line in out.splitlines():
        line = line.strip()
        if line.startswith("{"):
            print(line)
            return 0

    print(out or err, file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
