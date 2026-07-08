#!/usr/bin/env python3
"""Diagnose forgot-password email delivery on VPS."""
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
TEST_EMAIL = sys.argv[1] if len(sys.argv) > 1 else "onur@admin.com"

NODE = r"""
const fs = require("fs");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const testEmail = process.env.TEST_EMAIL;
const prisma = new PrismaClient();

function loadEnv() {
  const env = fs.readFileSync(".env", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}

loadEnv();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: testEmail.toLowerCase() } });
  console.log("USER_FOUND:", Boolean(user));
  if (user) {
    console.log("USER_ID:", user.id);
    console.log("HAS_PASSWORD:", Boolean(user.password));
    console.log("EMAIL_VERIFIED:", Boolean(user.emailVerified));
    console.log("ACCOUNTS:", (await prisma.account.count({ where: { userId: user.id } })));
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user_smtp = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);
  console.log("SMTP_HOST:", host);
  console.log("SMTP_PORT:", port, "secure=", secure);
  console.log("SMTP_USER:", user_smtp);
  console.log("SMTP_FROM:", process.env.SMTP_FROM);
  console.log("SMTP_PASS_SET:", Boolean(pass));

  if (!host || !user_smtp || !pass) {
    console.log("SMTP_NOT_CONFIGURED");
    process.exit(1);
  }

  const t = nodemailer.createTransport({ host, port, secure, auth: { user: user_smtp, pass } });
  await t.verify();
  console.log("SMTP_VERIFY_OK");

  const code = "123456";
  const info = await t.sendMail({
    from: "QRbanner <" + (process.env.SMTP_FROM || user_smtp) + ">",
    to: testEmail,
    subject: "QRbanner password reset diagnostic",
    text: "Diagnostic reset code: " + code,
    html: "<p>Diagnostic reset code: <b>" + code + "</b></p>",
  });
  console.log("SEND_OK", info.messageId, JSON.stringify(info.accepted), JSON.stringify(info.rejected));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.log("ERR", e.message);
  process.exit(1);
});
"""

b64 = base64.b64encode(NODE.encode("utf-8")).decode("ascii")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)

print(f"=== Diagnose forgot-password for {TEST_EMAIL} ===\n")

# Recent pm2 logs mentioning email/forgot
_, stdout, _ = c.exec_command(
    "pm2 logs qrbanner --lines 80 --nostream 2>&1 | grep -iE 'email|forgot|reset|smtp|535|error' | tail -20",
    timeout=30,
)
logs = stdout.read().decode("utf-8", "replace").strip()
print("--- recent email-related logs ---")
print(logs or "(none)")

cmd = (
    f"cd {REMOTE} && echo {b64} | base64 -d > {REMOTE}/.diag-forgot.js && "
    f"TEST_EMAIL='{TEST_EMAIL}' node {REMOTE}/.diag-forgot.js; rm -f {REMOTE}/.diag-forgot.js"
)
_, stdout, stderr = c.exec_command(cmd, timeout=90)
print("\n--- user + SMTP diagnostic send ---")
print(stdout.read().decode("utf-8", "replace"))
err = stderr.read().decode("utf-8", "replace")
if err.strip():
    print("stderr:", err)

c.close()
