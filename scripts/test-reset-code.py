#!/usr/bin/env python3
"""End-to-end test of the code-based password reset flow on the VPS.

Creates a throwaway user, seeds a known reset-code hash (mirroring
lib/password-reset.ts), then exercises the live reset-password endpoint for
the happy path and a wrong-code path, and finally deletes the temp user.
"""
import base64
import os
import sys

import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "")
REMOTE = "/var/www/qrbanner"

NODE = r"""
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

// load PORT from .env (default 3000)
let PORT = "3000";
try {
  const env = fs.readFileSync(".env", "utf8");
  const m = env.match(/^PORT=(.*)$/m);
  if (m) PORT = m[1].trim().replace(/^["']|["']$/g, "");
} catch (e) {}

const prisma = new PrismaClient();
const email = "tmp-reset-test@qrbanner.com";
const code = "246813";

function hashCode(email, code) {
  const e = email.toLowerCase().trim();
  const c = code.replace(/\D/g, "").trim();
  return crypto.createHash("sha256").update(e + ":" + c).digest("hex");
}

async function post(body) {
  const res = await fetch("http://127.0.0.1:" + PORT + "/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try { data = await res.json(); } catch (e) { data = {}; }
  return { status: res.status, data };
}

(async () => {
  const oldHash = await bcrypt.hash("OldPass123!", 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, password: oldHash, name: "Temp Reset", emailVerified: new Date() },
    update: { password: oldHash },
  });
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hashCode(email, code), passwordResetExpiry: expiry, sessionVersion: 0 },
  });

  const wrong = await post({ email, code: "000000", password: "NewPass456!" });
  console.log("WRONG_CODE:", wrong.status, JSON.stringify(wrong.data));

  const ok = await post({ email, code, password: "NewPass456!" });
  console.log("VALID_CODE:", ok.status, JSON.stringify(ok.data));

  const after = await prisma.user.findUnique({ where: { id: user.id } });
  const changed = await bcrypt.compare("NewPass456!", after.password);
  console.log("PASSWORD_CHANGED:", changed);
  console.log("TOKEN_CLEARED:", after.passwordResetToken === null);
  console.log("SESSION_VERSION:", after.sessionVersion);

  const reuse = await post({ email, code, password: "NewPass789!" });
  console.log("REUSE_CODE:", reuse.status, JSON.stringify(reuse.data));

  await prisma.user.delete({ where: { id: user.id } });
  console.log("CLEANUP_OK");
  process.exit(0);
})().catch((e) => { console.log("ERR", e.message); process.exit(1); });
"""

b64 = base64.b64encode(NODE.encode("utf-8")).decode("ascii")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
cmd = (
    f"cd {REMOTE} && echo {b64} | base64 -d > {REMOTE}/.reset-test.js && "
    f"node {REMOTE}/.reset-test.js; rm -f {REMOTE}/.reset-test.js"
)
_, stdout, stderr = c.exec_command(cmd, timeout=120)
print(stdout.read().decode("utf-8", "replace"))
err = stderr.read().decode("utf-8", "replace")
if err.strip():
    print("stderr:", err)
c.close()
